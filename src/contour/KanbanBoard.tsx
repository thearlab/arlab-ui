import { useEffect, useLayoutEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { GripVertical, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button, Panel, Skeleton, StateView, TabStrip } from './library.js';
import { IconButton, Dropdown } from './ui.js';
import { ScrollArea } from './scroll-area.js';

export type KanbanTone = 'quiet' | 'ok' | 'warn' | 'bad' | 'info';
export interface KanbanColumn {
  id:string; title:string; count?:number; tone?:KanbanTone;
  /** CSS phase color, preferably a semantic token such as var(--chart-2). */
  color?:string; description?:string; collapsed?:boolean; emptyLabel?:string; limit?:number;
}
export interface KanbanCard { id:string; columnId:string }
export interface KanbanBoardProps<T extends KanbanCard> {
  columns:KanbanColumn[]; cards:T[]; renderCard:(card:T)=>ReactNode;
  onCardOpen?:(card:T)=>void;
  /** Controlled intent. Final zero-based insertion index EXCLUDES the moved card. Host persists/reorders. */
  onMove?:(cardId:string,toColumnId:string,index:number)=>void;
  /** Collapse is controlled by columns[].collapsed; omit to hide collapse controls. */
  onColumnToggle?:(columnId:string,collapsed:boolean)=>void;
  getCardLabel?:(card:T)=>string;
  loading?:boolean; error?:ReactNode; columnWidth?:number; density?:'regular'|'compact';
  /** Preferred board height, capped to its visible scroll-container space. Default: up to 640px. */
  height?:CSSProperties['height'];
  /** Fill a bounded flex/grid parent. Still capped to the visible viewport/container. */
  fill?:boolean;
}
interface Drag {id:string;from:string;original:number;to:string;index:number;mode:'pointer'|'keyboard';pointerId?:number;x?:number;y?:number}
/** Column cards follow host array order. Used by all movement paths, including the menu. */
export function kanbanDestination<T extends KanbanCard>(cards:T[],cardId:string,columnId:string,index:number) {
  const count=cards.filter(card=>card.columnId===columnId&&card.id!==cardId).length;
  return {columnId,index:Math.min(count,Math.max(0,Math.floor(Number.isFinite(index)?index:0))),count:count+1};
}
/** Controlled reusable board. Only presentation state (phone tab, disclosure, drag preview) is local.
 * Arbitrary card content is never wrapped in a button. Open/drag/menu controls are sibling actions.
 */
export function KanbanBoard<T extends KanbanCard>({columns=[],cards=[],renderCard=(card:T)=>card.id,onCardOpen,onMove,onColumnToggle,getCardLabel,loading=false,error,columnWidth=280,density='regular',height,fill=false}:KanbanBoardProps<T>) {
  const board=useRef<HTMLDivElement>(null),dragRef=useRef<Drag|null>(null);
  const [availableHeight,setAvailableHeight]=useState<number|null>(null);
  useLayoutEffect(()=>{
    const node=board.current;if(!node)return;
    let frame:number|null=null;
    let waitingForVisibleSpace=false;
    const measure=()=>{
      frame=null;
      const top=node.getBoundingClientRect().top;
      let bottom=(window.visualViewport?window.visualViewport.offsetTop+window.visualViewport.height:window.innerHeight)-12;
      for(let parent=node.parentElement;parent;parent=parent.parentElement){
        if(/auto|scroll|hidden|clip/.test(getComputedStyle(parent).overflowY)){
          const bounds=parent.getBoundingClientRect();
          if(bounds.height>0)bottom=Math.min(bottom,bounds.top+parent.clientTop+parent.clientHeight);
        }
      }
      const remaining=Math.floor(bottom-Math.max(0,top));
      // Keep an offscreen board in document flow until there is usable room.
      // Resizing on every outer scroll would shrink a board at the end of a page,
      // clamp the page scroll position, and repeatedly shrink it again.
      if(remaining<=0){waitingForVisibleSpace=true;return;}
      if(waitingForVisibleSpace&&remaining<Math.min(280,bottom))return;
      waitingForVisibleSpace=false;
      setAvailableHeight(old=>old===remaining?old:remaining);
    };
    const schedule=(event?:Event)=>{if(event?.type==='scroll'&&(!waitingForVisibleSpace||(event.target instanceof Node&&node.contains(event.target))))return;if(frame===null)frame=requestAnimationFrame(measure);};
    measure();
    const observer=new ResizeObserver(()=>schedule());
    for(let parent=node.parentElement;parent;parent=parent.parentElement)observer.observe(parent);
    window.addEventListener('resize',schedule);window.addEventListener('scroll',schedule,true);
    window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);
    return()=>{observer.disconnect();window.removeEventListener('resize',schedule);window.removeEventListener('scroll',schedule,true);window.visualViewport?.removeEventListener('resize',schedule);window.visualViewport?.removeEventListener('scroll',schedule);if(frame!==null)cancelAnimationFrame(frame);};
  },[]);
  useEffect(()=>{
    const viewport=board.current?.querySelector<HTMLElement>('.ct-kanban-horizontal > .scroll-viewport');if(!viewport)return;
    const wheel=(event:WheelEvent)=>{
      // Browsers that already translate Shift-wheel into deltaX keep their native behavior.
      if(!event.shiftKey||event.ctrlKey||event.deltaX!==0||event.deltaY===0)return;
      const scale=event.deltaMode===1?16:event.deltaMode===2?viewport.clientWidth:1;
      const next=Math.max(0,Math.min(viewport.scrollWidth-viewport.clientWidth,viewport.scrollLeft+event.deltaY*scale));
      if(next===viewport.scrollLeft)return;
      event.preventDefault();viewport.scrollLeft=next;
    };
    viewport.addEventListener('wheel',wheel,{passive:false,capture:true});
    return()=>viewport.removeEventListener('wheel',wheel,true);
  },[columns.length,!!error]);
  const [drag,setDrag]=useState<Drag|null>(null),[message,setMessage]=useState(''),[activeId,setActiveId]=useState(columns[0]?.id||'');
  const [limits,setLimits]=useState<Record<string,number>>({}),[settled,setSettled]=useState<string|null>(null);
  const point=useRef<{x:number;y:number}|null>(null),raf=useRef<number|null>(null),settleTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const capture=useRef<HTMLButtonElement|null>(null),swipe=useRef<{x:number;y:number}|null>(null);
  const props=useRef({columns,cards,onMove,onCardOpen,getCardLabel,loading,error});props.current={columns,cards,onMove,onCardOpen,getCardLabel,loading,error};
  const instructionsId=useId();
  const active=columns.some(column=>column.id===activeId)?activeId:columns[0]?.id;
  const activeRef=useRef(active);activeRef.current=active;const edgeSince=useRef<{direction:number;at:number}|null>(null);
  const label=(card:T)=>getCardLabel?.(card)||card.id;
  const columnCards=(id:string)=>cards.filter(card=>card.columnId===id);
  const setMovement=(next:Drag|null)=>{dragRef.current=next;setDrag(next);};
  const release=()=>{
    if(raf.current!==null)cancelAnimationFrame(raf.current);raf.current=null;point.current=null;
    const node=capture.current,id=dragRef.current?.pointerId;capture.current=null;
    if(node&&id!==undefined&&node.hasPointerCapture(id))node.releasePointerCapture(id);
  };
  const cancel=()=>{release();setMovement(null);setMessage('Move cancelled.');};
  const focusCard=(id:string)=>{
    const row=Array.from(board.current?.querySelectorAll<HTMLElement>('[data-kanban-card]')||[]).find(node=>node.dataset.kanbanCard===id);
    row?.querySelector<HTMLElement>('[data-card-primary]')?.focus();
  };
  const commit=(move:Drag)=>{
    const current=props.current;release();setMovement(null);
    const card=current.cards.find(item=>item.id===move.id),column=current.columns.find(item=>item.id===move.to);
    if(!card||!column||!current.onMove||current.loading||current.error)return;
    const destination=kanbanDestination(current.cards,move.id,move.to,move.index);
    if(card.columnId===move.to&&current.cards.filter(item=>item.columnId===card.columnId).findIndex(item=>item.id===card.id)===destination.index){setMessage('Card position unchanged.');focusCard(move.id);return;}
    try {
      current.onMove(move.id,destination.columnId,destination.index);
      setActiveId(column.id);setSettled(move.id);
      setMessage(`${current.getCardLabel?.(card)||card.id} moved to ${column.title}, position ${destination.index+1} of ${destination.count}.`);
      if(settleTimer.current)clearTimeout(settleTimer.current);
      settleTimer.current=setTimeout(()=>setSettled(null),220);
    } catch(reason) {setMessage(reason instanceof Error?reason.message:'The card could not be moved.');}
  };
  useEffect(()=>{if(settled)focusCard(settled);},[cards,settled,active]);
  useEffect(()=>{
    if(dragRef.current&&(!onMove||loading||error||!cards.some(card=>card.id===dragRef.current?.id)||!columns.some(column=>column.id===dragRef.current?.to)))cancel();
  },[cards,columns,onMove,loading,error]);
  useEffect(()=>()=>{release();if(settleTimer.current)clearTimeout(settleTimer.current);},[]);

  const start=(card:T,mode:Drag['mode'],event?:PointerEvent<HTMLButtonElement>)=>{
    if(!onMove||loading||error)return;
    const index=columnCards(card.columnId).findIndex(item=>item.id===card.id);
    const next:Drag={id:card.id,from:card.columnId,original:index,to:card.columnId,index,mode,pointerId:event?.pointerId,x:event?.clientX,y:event?.clientY};
    setMovement(next);setMessage(`Picked up ${label(card)}. Use arrow keys to choose a position, Space to drop, Escape to cancel.`);
    if(event){capture.current=event.currentTarget;event.currentTarget.setPointerCapture(event.pointerId);point.current={x:event.clientX,y:event.clientY};}
  };
  const tick=()=>{
    raf.current=null;const current=dragRef.current,p=point.current,root=board.current;if(!current||current.mode!=='pointer'||!p||!root)return;
    const horizontal=root.querySelector<HTMLElement>('.ct-kanban-horizontal > .scroll-viewport');
    if(horizontal){const r=horizontal.getBoundingClientRect();if(p.x<r.left+32)horizontal.scrollLeft-=10;else if(p.x>r.right-32)horizontal.scrollLeft+=10;}
    if(horizontal&&window.matchMedia('(max-width:640px)').matches){
      const r=horizontal.getBoundingClientRect(),direction=p.x<r.left+28?-1:p.x>r.right-28?1:0;
      if(!direction)edgeSince.current=null;
      else if(edgeSince.current?.direction!==direction)edgeSince.current={direction,at:performance.now()};
      else if(performance.now()-edgeSince.current.at>550){const currentColumns=props.current.columns,at=currentColumns.findIndex(column=>column.id===activeRef.current);const next=currentColumns[at+direction];if(next)setActiveId(next.id);edgeSince.current={direction,at:performance.now()};}
    }
    const regions=Array.from(root.querySelectorAll<HTMLElement>('[data-kanban-column]'));
    const target=regions.find(node=>{const r=node.getBoundingClientRect();return r.width>0&&p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom;});
    let next={...current,x:p.x,y:p.y};
    if(target){
      const columnId=target.dataset.kanbanColumn!;
      const vertical=target.querySelector<HTMLElement>('.ct-kanban-column-scroll > .scroll-viewport');
      if(vertical){const r=vertical.getBoundingClientRect();if(p.y<r.top+40)vertical.scrollTop-=9;else if(p.y>r.bottom-40)vertical.scrollTop+=9;}
      const targets=Array.from(target.querySelectorAll<HTMLElement>('[data-kanban-card]')).filter(node=>node.dataset.kanbanCard!==current.id);
      const found=targets.findIndex(node=>{const r=node.getBoundingClientRect();return p.y<r.top+r.height/2;});
      const index=target.dataset.collapsed?props.current.cards.filter(card=>card.columnId===columnId&&card.id!==current.id).length:found<0?targets.length:found;
      next={...next,to:columnId,index};
    }
    if(next.x!==current.x||next.y!==current.y||next.to!==current.to||next.index!==current.index)setMovement(next);
    raf.current=requestAnimationFrame(tick);
  };
  const pointerMove=(event:PointerEvent<HTMLButtonElement>)=>{if(dragRef.current?.pointerId!==event.pointerId)return;point.current={x:event.clientX,y:event.clientY};if(raf.current===null)raf.current=requestAnimationFrame(tick);};
  const keyboard=(event:KeyboardEvent<HTMLElement>,card:T)=>{
    const movement=dragRef.current;
    if(movement?.id===card.id){
      if(event.key==='Escape'){event.preventDefault();cancel();return;}
      if(event.key===' '||event.key==='Enter'){event.preventDefault();commit(movement);return;}
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
        event.preventDefault();let to=movement.to,index=movement.index;
        if(event.key==='ArrowLeft'||event.key==='ArrowRight'){const at=columns.findIndex(column=>column.id===to);to=columns[Math.max(0,Math.min(columns.length-1,at+(event.key==='ArrowRight'?1:-1)))]?.id||to;}
        else index=event.key==='Home'?0:event.key==='End'?cards.length:index+(event.key==='ArrowDown'?1:-1);
        const target=kanbanDestination(cards,card.id,to,index);setMovement({...movement,to,index:target.index});
        setMessage(`${label(card)}: ${columns.find(column=>column.id===to)?.title}, position ${target.index+1} of ${target.count}.`);
      }return;
    }
    if(event.key===' '&&onMove){event.preventDefault();start(card,'keyboard');return;}
    if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const siblings=columnCards(card.columnId),index=siblings.findIndex(item=>item.id===card.id);
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      const at=columns.findIndex(column=>column.id===card.columnId),target=columns[Math.max(0,Math.min(columns.length-1,at+(event.key==='ArrowRight'?1:-1)))];
      if(target){setActiveId(target.id);setLimits(old=>({...old,[target.id]:Math.max(old[target.id]??target.limit??0,index+1)}));const next=columnCards(target.id)[Math.min(index,columnCards(target.id).length-1)];if(next)requestAnimationFrame(()=>focusCard(next.id));else Array.from(board.current?.querySelectorAll<HTMLElement>('[data-kanban-column]')||[]).find(node=>node.dataset.kanbanColumn===target.id)?.focus();}
    }else {const next=siblings[event.key==='Home'?0:event.key==='End'?siblings.length-1:Math.max(0,Math.min(siblings.length-1,index+(event.key==='ArrowDown'?1:-1)))];if(next){setLimits(old=>({...old,[card.columnId]:Math.max(old[card.columnId]??0,siblings.findIndex(item=>item.id===next.id)+1)}));requestAnimationFrame(()=>focusCard(next.id));}}
  };
  const tabLabels=columns.map(column=>`${column.title} (${column.count??columnCards(column.id).length})`);
  const tabOptions=tabLabels.map((text,index)=>tabLabels.indexOf(text)!==tabLabels.lastIndexOf(text)?`${text} · ${index+1}`:text);
  const width=Number.isFinite(columnWidth)?Math.max(220,columnWidth):280;
  const boardStyle={'--ct-kanban-column-width':`${width}px`,height:height??(fill?'100%':Math.min(640,availableHeight??640)),maxHeight:availableHeight??undefined} as CSSProperties;
  const marker=(columnId:string,index:number)=>drag?.to===columnId&&drag.index===index?<li className="ct-kanban-insertion" aria-hidden="true" key={`insert-${index}`}/>:null;
  return <div ref={board} className="ct-kanban-board" data-fill={fill||undefined} data-density={density} style={boardStyle} aria-busy={loading}
    onKeyDown={event=>{if(event.key==='Escape'&&dragRef.current){event.preventDefault();cancel();}}}
    onPointerDown={event=>{if(event.pointerType==='touch'&&!(event.target as HTMLElement).closest('button,a,input,select,textarea,[role="button"]'))swipe.current={x:event.clientX,y:event.clientY};}}
    onPointerUp={event=>{const origin=swipe.current;swipe.current=null;if(!origin||dragRef.current)return;const dx=event.clientX-origin.x,dy=event.clientY-origin.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){const index=columns.findIndex(column=>column.id===active);setActiveId(columns[Math.max(0,Math.min(columns.length-1,index+(dx<0?1:-1)))]?.id||active||'');}}} onPointerCancel={()=>{swipe.current=null;}}>
    <p id={instructionsId} className="sr-only">{onMove?'Space picks up a card. Arrow keys choose its destination. Space drops it; Escape cancels. Use Move to for a menu alternative.':'Use arrow keys to navigate cards and columns.'}</p>
    <div className="ct-kanban-phone-tabs"><ScrollArea hideScrollbar axis="horizontal" label="Board columns"><TabStrip label="Board columns" options={tabOptions} value={tabOptions[columns.findIndex(column=>column.id===active)]} onChange={(name:string)=>setActiveId(columns[tabOptions.indexOf(name)]?.id||'')}/></ScrollArea></div>
    {error?<StateView state="error" title="Board could not be loaded" description={error}/>:!columns.length?<StateView title="No board columns" description="Add columns to organize these records."/>:
    <ScrollArea hideScrollbar axis="horizontal" label="Kanban board columns" className="ct-kanban-horizontal"><div className="ct-kanban-columns">
      {columns.map(column=>{
        const all=columnCards(column.id),limit=Math.max(1,column.limit??all.length),shown=all.slice(0,limits[column.id]??limit),count=column.count??all.length;
        return <section key={column.id} className="ct-kanban-column" data-kanban-column={column.id} data-collapsed={column.collapsed||undefined} data-active={column.id===active||undefined} data-tone={column.tone||'quiet'} role="region" aria-label={`${column.title}, ${count} projects`} tabIndex={-1} style={column.color?{'--ct-kanban-phase':column.color} as CSSProperties:undefined}>
          <header className="ct-kanban-column-header"><div className="ct-kanban-column-title"><h3 title={column.title}>{column.title}</h3><span className="ct-kanban-count">{count.toLocaleString()}</span></div>{onColumnToggle&&<IconButton label={`${column.collapsed?'Expand':'Collapse'} ${column.title}`} onClick={()=>onColumnToggle(column.id,!column.collapsed)}>{column.collapsed?<PanelLeftOpen size={14}/>:<PanelLeftClose size={14}/>}</IconButton>}{!column.collapsed&&column.description&&<p>{column.description}</p>}</header>
          {!column.collapsed&&<ScrollArea hideScrollbar label={`${column.title} cards`} className="ct-kanban-column-scroll"><ul className="ct-kanban-card-list">
            {loading?[0,1,2].map(index=><li key={index}><Panel title={undefined} description={undefined} action={undefined}><Skeleton rows={2}/></Panel></li>):shown.length?shown.map(card=>{
              const destinationIndex=shown.filter(item=>item.id!==drag?.id).findIndex(item=>item.id===card.id);
              return <li key={card.id} className="ct-kanban-card-slot">{card.id!==drag?.id&&marker(column.id,destinationIndex)&&<div className="ct-kanban-insertion" aria-hidden="true"/>}<article data-kanban-card={card.id} data-lifted={drag?.id===card.id||undefined} data-settled={settled===card.id||undefined} className="ct-kanban-card"><Panel title={undefined} description={undefined} action={undefined}>
                <div className="ct-kanban-card-actions">{onCardOpen?<Button data-card-primary aria-label={`Open ${label(card)}`} aria-describedby={instructionsId} onClick={()=>onCardOpen(card)} onKeyDown={(event:KeyboardEvent<HTMLElement>)=>keyboard(event,card)}>Open</Button>:<span data-card-primary tabIndex={0} role="group" aria-label={label(card)} aria-describedby={instructionsId} onKeyDown={(event:KeyboardEvent<HTMLElement>)=>keyboard(event,card)}>{label(card)}</span>}
                {onMove&&<IconButton label={`Move ${label(card)}`} className="ct-kanban-drag-handle" aria-describedby={instructionsId} aria-pressed={drag?.id===card.id} onKeyDown={(event:KeyboardEvent<HTMLElement>)=>keyboard(event,card)} onPointerDown={(event:PointerEvent<HTMLButtonElement>)=>{if(event.button!==0)return;event.preventDefault();event.currentTarget.focus();start(card,'pointer',event);}} onPointerMove={pointerMove} onPointerUp={(event:PointerEvent<HTMLButtonElement>)=>{if(dragRef.current?.pointerId===event.pointerId){point.current={x:event.clientX,y:event.clientY};tick();if(dragRef.current)commit(dragRef.current);}}} onPointerCancel={()=>cancel()}><GripVertical size={14}/></IconButton>}</div>
                <div className="ct-kanban-card-content" onClick={event=>{const interactive=(event.target as HTMLElement).closest('button,a,input,select,textarea,summary,label,[role],[tabindex],[contenteditable="true"]');if(onCardOpen&&(!interactive||!event.currentTarget.contains(interactive)))onCardOpen(card);}}>{renderCard(card)}</div>
                {onMove&&<Dropdown children={undefined} defaultValue={undefined} searchable={false} name={undefined} aria-invalid={undefined} aria-describedby={undefined} aria-label={`Move ${label(card)} to column`} placeholder="Move to…" value="" options={columns.map(target=>({value:target.id,label:target.title}))} onChange={(event:{target:{value:string}})=>{const to=event.target.value;commit({id:card.id,from:card.columnId,original:all.findIndex(item=>item.id===card.id),to,index:cards.filter(item=>item.columnId===to&&item.id!==card.id).length,mode:'keyboard'});}}/>}
              </Panel></article></li>;
            }):<li className="ct-kanban-empty">{column.emptyLabel||'No projects in this phase'}</li>}
            {!loading&&marker(column.id,shown.filter(card=>card.id!==drag?.id).length)}
          </ul>{!loading&&all.length>shown.length&&<div className="ct-kanban-show-more"><Button onClick={()=>setLimits(old=>({...old,[column.id]:Math.min(all.length,shown.length+Math.max(1,column.limit??20))}))}>Show {Math.min(all.length-shown.length,Math.max(1,column.limit??20))} more</Button></div>}</ScrollArea>}
        </section>;
      })}
    </div></ScrollArea>}
    {drag?.mode==='pointer'&&<div className="ct-kanban-drag-preview" aria-hidden="true" style={{left:(drag.x??0)+12,top:(drag.y??0)+12,width:Math.min(width,240)}}><Panel title={undefined} description={undefined} action={undefined}>{cards.find(card=>card.id===drag.id)?label(cards.find(card=>card.id===drag.id)!):drag.id}</Panel></div>}
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{message}</span>
  </div>;
}
