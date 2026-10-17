import {useReorderMotion} from "./useReorderMotion.js";
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {ArrowDown,ArrowUp,GripVertical} from 'lucide-react';
import {Dropdown} from './ui.js';
import type {ReorderItem} from './EditorComponents.js';
export interface ReorderGroup {id: string; label: string; items: ReorderItem[]; description?: ReactNode}
export interface GroupedReorderListProps {label: string; groups: ReorderGroup[]; onGroupsChange: (groups: ReorderGroup[]) => void; disabled?: boolean}
/** Destination index is the index in the destination list after the moving item has been removed. */
export function moveGroupedItem(groups: ReorderGroup[], itemId: string, destinationId: string, index: number): ReorderGroup[] {
  const source=groups.find(group=>group.items.some(item=>item.id===itemId));
  const target=groups.find(group=>group.id===destinationId);
  if(!source || !target || !Number.isFinite(index)) return groups;
  const item=source.items.find(item=>item.id===itemId)!;
  const remaining=target.items.filter(existing=>existing.id!==itemId);
  const nextIndex=Math.max(0,Math.min(remaining.length,Math.floor(index)));
  if(source===target && source.items.indexOf(item)===nextIndex)return groups;
  return groups.map(group=>{
    if(group.id!==source.id && group.id!==target.id)return group;
    const items=group.items.filter(existing=>existing.id!==itemId);
    if(group.id===target.id)items.splice(nextIndex,0,item);
    return {...group,items};
  });
}
export function GroupedReorderList({label,groups,onGroupsChange,disabled}: GroupedReorderListProps) {
  const root=useRef<HTMLDivElement>(null);
  const captureLayout=useReorderMotion(root,JSON.stringify(groups.map(group=>[group.id,...group.items.map(item=>item.id)])));
  const [drag,setDrag]=useState<{id:string;x:number;y:number;startX:number;startY:number;groupId:string;index:number}|null>(null);
  const [announcement,setAnnouncement]=useState('');
  const focusItem=useRef<string | null>(null);
  useEffect(()=>{
    if(!focusItem.current)return;
    const row=Array.from(root.current?.querySelectorAll<HTMLElement>('li[data-item-id]')??[]).find(row=>row.dataset.itemId===focusItem.current);
    row?.querySelector<HTMLButtonElement>('.ct-drag-handle')?.focus({preventScroll:true});
    focusItem.current=null;
  },[groups]);
  useEffect(()=>{if(disabled)setDrag(null);},[disabled]);
  const move=(id:string,groupId:string,index:number)=>{
    if(disabled)return;
    const next=moveGroupedItem(groups,id,groupId,index);
    if(next===groups)return;
    focusItem.current=id;
    captureLayout();
    onGroupsChange(next);
    const group=next.find(group=>group.id===groupId)!;
    const item=group.items.find(item=>item.id===id)!;
    setAnnouncement(`${item.label} moved to ${group.label}, position ${group.items.indexOf(item)+1} of ${group.items.length}.`);
  };
  return <div className="ct-reorder ct-reorder-grouped" ref={root} role="group" aria-label={label}>
    {groups.map(group=><section className="ct-reorder-group" data-reorder-group={group.id} key={group.id} aria-label={group.label}>
      <header><strong>{group.label}</strong>{group.description && <span>{group.description}</span>}</header>
      <ol aria-label={`${group.label} items`} data-dragging={drag?true:undefined}>
        {group.items.map((item,index)=><li key={item.id} data-item-id={item.id} data-dragged={drag?.id===item.id||undefined}
          data-insertion={drag?.groupId===group.id && drag.id!==item.id && group.items.filter(entry=>entry.id!==drag.id).findIndex(entry=>entry.id===item.id)===drag.index?'before':undefined}
          style={drag?.id===item.id?{transform:`translate(${drag.x-drag.startX}px, ${drag.y-drag.startY}px) scale(1.015)`}:undefined}>
          <button type="button" className="ct-control-action ct-drag-handle" disabled={disabled} aria-label={`Drag ${item.label}. Move buttons and group selection are available for keyboard use.`}
            onPointerDown={event=>{if(event.button!==0)return;event.preventDefault();event.currentTarget.focus({preventScroll:true});event.currentTarget.setPointerCapture(event.pointerId);setDrag({id:item.id,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,groupId:group.id,index});setAnnouncement(`Picked up ${item.label}. Drag to another group or position.`);}}
            onPointerMove={event=>{
              if(!drag||drag.id!==item.id)return;
              let destination=drag.groupId,insert=drag.index;
              const sections=Array.from(root.current?.querySelectorAll<HTMLElement>('[data-reorder-group]')??[]);
              for(const section of sections){
                const bounds=section.getBoundingClientRect();
                if(event.clientY<bounds.top||event.clientY>bounds.bottom||event.clientX<bounds.left||event.clientX>bounds.right)continue;
                destination=section.dataset.reorderGroup!;
                const rows=Array.from(section.querySelectorAll<HTMLElement>('li[data-item-id]')).filter(row=>row.dataset.itemId!==item.id);
                insert=rows.findIndex(row=>{const rect=row.getBoundingClientRect();return event.clientY<rect.top+rect.height/2;});
                if(insert<0)insert=rows.length;
                break;
              }
              setDrag({...drag,x:event.clientX,y:event.clientY,groupId:destination,index:insert});
            }}
            onPointerUp={event=>{if(!drag)return;move(drag.id,drag.groupId,drag.index);setDrag(null);if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}
            onPointerCancel={()=>setDrag(null)} onLostPointerCapture={()=>setDrag(null)} onKeyDown={event=>{if(event.key==='Escape'){setDrag(null);setAnnouncement('Reordering cancelled.');}}}><GripVertical size={14}/></button>
          <span className="ct-reorder-position" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
          <div>{item.content??item.label}</div>
          <div className="ct-reorder-group-actions">
            <Dropdown aria-label={`Move ${item.label} to group`} value={group.id} disabled={disabled} options={groups.map(group=>({value:group.id,label:group.label}))} onChange={event=>{const target=groups.find(group=>group.id===event.target.value);if(target && target.id!==group.id)move(item.id,target.id,target.items.length);}}/>
            <button className="ct-control-action" type="button" disabled={disabled||index===0} aria-label={`Move ${item.label} up`} onClick={()=>move(item.id,group.id,index-1)}><ArrowUp size={13}/></button>
            <button className="ct-control-action" type="button" disabled={disabled||index===group.items.length-1} aria-label={`Move ${item.label} down`} onClick={()=>move(item.id,group.id,index+1)}><ArrowDown size={13}/></button>
          </div>
        </li>)}
      </ol>
      {!group.items.length&&<p className="ct-reorder-empty">Drop an item here.</p>}
      {drag?.groupId===group.id && drag.index===group.items.filter(item=>item.id!==drag.id).length && <div className="ct-reorder-group-end" aria-hidden="true"/>}
    </section>)}
    {!groups.length&&<p>No groups to arrange.</p>}
    <span className="ct-sr-only" role="status">{announcement}</span>
  </div>;
}
