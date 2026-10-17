import { version, useId, useRef, useState, type ReactNode, type KeyboardEvent, type CSSProperties } from 'react';
import { Check, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Status, Modal, Button } from './ui.js';
import { Icon } from './icons.js';
import { ScrollArea } from './scroll-area.js';

const decorativeInert = { inert: Number(version.split('.')[0]) >= 19 ? true : '' };

export type StatTone = 'quiet' | 'ok' | 'warn' | 'bad' | 'info';
type MarkProps = { mark?: ReactNode; tone?: StatTone; dept?: string; avatar?: { name: string; src?: string } };
/** Named icons use the shared registry. Custom marks are decorative, never interactive. */
function ListMark({mark,tone='quiet',dept,avatar}:MarkProps) {
  if(mark==='dot'||mark==='dept')return <i className="ct-list-dot" data-tone={tone} data-dept={mark==='dept'?dept:undefined}/>;
  if(mark==='avatar')return avatar?.src?<img src={avatar.src} alt=""/>:<span className="ct-list-avatar">{avatar?.name.split(/\s+/).slice(0,2).map(x=>x[0]).join('')}</span>;
  return typeof mark==='string'?<Icon name={mark} size={16}/>:mark;
}
function LoadingRows({label}:{label:string}) {return <div className="ct-list-loading" role="status" aria-label={label}>{[0,1,2].map(i=><span key={i} className="ct-list-skeleton"/>)}</div>;}
export interface FacetItem extends Omit<MarkProps,'mark'> { mark?:string; id: string; label: string; count?: number; disabled?: boolean }
export interface FacetGroup { id:string; label:string; items:FacetItem[]; limit?:number }
interface FacetCommon { density?:'regular'|'compact'; responsive?:boolean; loading?:boolean; emptyLabel?:string; label?:string; height?:CSSProperties['height']; maxHeight?:CSSProperties['maxHeight'] }
export interface FlatFacetListProps extends FacetCommon {
  groups?:never; items:FacetItem[]; value?:string; onChange?:(id:string)=>void;
  mode?:'single'|'multiple'; values?:string[]; onValuesChange?:(ids:string[])=>void;
  showAllCount?:number; compact?:boolean; emptyMessage?:string;
}
export interface GroupedFacetListProps extends FacetCommon {
  groups:FacetGroup[]; value:Record<string,string|string[]>; onChange:(groupId:string,value:string|string[])=>void;
  multiple?:boolean|string[]; allLabel?:string;
}
export type FacetListProps = FlatFacetListProps | GroupedFacetListProps;
function FacetRows({group,value,multiple,onChange,allLabel,allCount,compact,loading,emptyLabel,heading}:{group:FacetGroup;value:string|string[];multiple:boolean;onChange?: (value:string|string[])=>void;allLabel?:string;allCount?:number;compact:boolean;loading:boolean;emptyLabel:string;heading:boolean}) {
  const id=useId();const [expanded,setExpanded]=useState(false);
  const values=Array.isArray(value)?value:value?[value]:[];
  const selected=(key:string)=>key===''?values.length===0:values.includes(key);
  const select=(key:string)=>onChange?.(multiple?(key===''?[]:values.includes(key)?values.filter(x=>x!==key):[...values,key]):key);
  const limit=group.limit!==undefined&&Number.isFinite(group.limit)?Math.max(1,Math.floor(group.limit)):group.items.length;
  const visible=expanded?group.items:group.items.slice(0,limit);
  const options=allLabel===undefined?visible:[{id:'',label:allLabel,count:allCount},...visible.filter(x=>x.id!=='')];
  const enabled=options.filter(x=>!x.disabled&&onChange);
  const first=enabled.find(x=>selected(x.id))?.id??enabled[0]?.id;
  const move=(event:KeyboardEvent<HTMLDivElement>)=>{
    if(!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    const buttons=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button[aria-checked]:not(:disabled)'));if(!buttons.length)return;
    event.preventDefault();const at=buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(at+(['ArrowDown','ArrowRight'].includes(event.key)?1:buttons.length-1))%buttons.length;
    buttons[next].focus();if(!multiple)buttons[next].click();
  };
  return <section className="ct-facet-group">{heading&&<h3 id={id}>{group.label}</h3>}<div className="ct-facet-list" data-compact={compact||undefined} role={multiple?'group':'radiogroup'} aria-labelledby={heading?id:undefined} aria-label={heading?undefined:group.label} aria-busy={loading} onKeyDown={move}>
    {loading?<LoadingRows label="Loading filters"/>:(group.items.length||allCount!==undefined)?options.map(item=><button key={item.id} type="button" role={multiple?'checkbox':'radio'} aria-label={item.count===undefined?item.label:`${item.label}, ${item.count.toLocaleString()}`} aria-checked={selected(item.id)} tabIndex={multiple||item.id===first?0:-1} disabled={item.disabled||!onChange} onClick={()=>select(item.id)} title={item.label}>
      {multiple&&<Check size={12} aria-hidden="true" style={{visibility:selected(item.id)?'visible':'hidden'}}/>}{item.mark&&<span className="ct-facet-mark" aria-hidden="true" {...decorativeInert}><ListMark {...item}/></span>}<span className="ct-facet-label">{item.label}</span>{item.count!==undefined&&<span className="ct-facet-count">{item.count.toLocaleString()}</span>}
    </button>):<p>{emptyLabel}</p>}
  </div>{!loading&&!expanded&&group.items.length>limit&&<Button className="ct-list-more" onClick={()=>setExpanded(true)}>Show all ({group.items.length.toLocaleString()})</Button>}</section>;
}
/** Flat API remains source-compatible; grouped selection is controlled per group. */
export function FacetList(props:FacetListProps) {
  const [open,setOpen]=useState(false);const {responsive=true,loading=false,label='Filter options',height,maxHeight}=props;
  const grouped=props.groups!==undefined;
  const content=(phone=false)=> <ScrollArea label={label} height={phone?undefined:height} maxHeight={phone?'70dvh':maxHeight??'100%'}><div className="ct-facet-groups">{grouped?props.groups.map(group=><FacetRows key={group.id} group={group} value={props.value[group.id]??''} multiple={props.multiple===true||Array.isArray(props.multiple)&&props.multiple.includes(group.id)} onChange={value=>props.onChange(group.id,value)} allLabel={props.allLabel} compact={props.density==='compact'} loading={loading} emptyLabel={props.emptyLabel??'No filter options.'} heading/>):<FacetRows group={{id:'options',label,items:props.items}} value={props.mode==='multiple'?props.values??[]:props.value??''} multiple={props.mode==='multiple'} onChange={props.mode==='multiple'?(props.onValuesChange?v=>props.onValuesChange?.(Array.isArray(v)?v:[]):undefined):(props.onChange?v=>props.onChange?.(String(v)):undefined)} allLabel={props.showAllCount===undefined?undefined:'Show all'} allCount={props.showAllCount} compact={props.compact||props.density==='compact'||false} loading={loading} emptyLabel={props.emptyLabel??props.emptyMessage??'No filter options.'} heading={false}/>}</div></ScrollArea>;
  return <div className="ct-facet" data-responsive={responsive||undefined}><div className="ct-facet-desktop">{content()}</div>{responsive&&<><div className="ct-facet-phone"><Button aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}>Filters</Button></div><Modal open={open} onClose={()=>setOpen(false)} title={label} sheet>{content(true)}<Button onClick={()=>setOpen(false)}>Done</Button></Modal></>}</div>;
}
export interface RankListItem extends MarkProps { id:string; name:string; meta?:string; value:number; valueLabel?:string; secondary?:string; display?:string; subValue?:string; status?:{tone:StatTone;label:string} }
export type RankItem=RankListItem;
export interface RankListProps {
  items:RankListItem[]; label?:string; max?:number; value?:string; selected?:string; onSelect?:(id:string)=>void;
  height?:CSSProperties['height']; maxHeight?:CSSProperties['maxHeight']; loading?:boolean; emptyMessage?:string; emptyLabel?:string;
  format?:(value:number)=>string; limit?:number; showMoreLabel?:string; density?:'regular'|'compact'; header?:ReactNode; barTone?:'chart'|'accent'|'quiet';
}
export function RankList({items,label='Ranking',max,value,selected=value,onSelect,height,maxHeight=400,loading=false,emptyMessage='No results yet.',emptyLabel=emptyMessage,format,limit,showMoreLabel,density='regular',header,barTone='chart'}:RankListProps) {
  const [focusId,setFocusId]=useState<string>();const [expanded,setExpanded]=useState(false);const list=useRef<HTMLOListElement>(null);
  const count=limit!==undefined&&Number.isFinite(limit)?Math.max(1,Math.floor(limit)):items.length;const visible=expanded?items:items.slice(0,count);
  const largest=items.reduce((n,item)=>Number.isFinite(item.value)?Math.max(n,item.value):n,0);const scale=max!==undefined&&Number.isFinite(max)&&max>0?max:largest;
  const active=visible.some(x=>x.id===focusId)?focusId:visible.some(x=>x.id===selected)?selected:visible[0]?.id;
  const move=(event:KeyboardEvent<HTMLOListElement>)=>{if(!onSelect||!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;const buttons=Array.from(list.current?.querySelectorAll<HTMLButtonElement>('button.ct-rank-row')||[]);if(!buttons.length)return;event.preventDefault();const at=buttons.indexOf(document.activeElement as HTMLButtonElement);const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(at+(event.key==='ArrowDown'?1:buttons.length-1))%buttons.length;setFocusId(visible[next].id);buttons[next].focus();};
  return <ScrollArea label={label} height={height} maxHeight={maxHeight} className="ct-ranked-list"><div role="group" aria-label={label} aria-busy={loading} data-density={density} data-bar-tone={barTone}>{header&&<div className="ct-ranked-header">{header}</div>}{loading?<LoadingRows label="Loading results"/>:items.length?<><ol ref={list} role={onSelect?'listbox':undefined} aria-label={onSelect?label:undefined} onKeyDown={move}>{visible.map((item,index)=>{const numeric=Number.isFinite(item.value)?Math.max(0,item.value):0;const amount=item.display??item.valueLabel??(format?format(item.value):numeric.toLocaleString());const secondary=item.subValue??item.secondary;const accessible=[item.name,item.meta,amount,secondary,item.status?.label,`rank ${index+1} of ${items.length}`].filter(Boolean).join(', ');
    const content=<><span className="ct-ranked-copy"><strong title={item.name}>{item.name}</strong>{item.meta&&<span title={item.meta}>{item.meta}</span>}</span><span className="ct-ranked-value">{amount}{secondary&&<small>{secondary}</small>}{item.status&&<Status tone={item.status.tone}>{item.status.label}</Status>}</span><span className="ct-ranked-track" aria-hidden="true"><span style={{width:`${scale>0?Math.min(100,numeric/scale*100):0}%`}}/></span></>;
    return <li key={item.id} role={onSelect?'none':undefined}>{item.mark&&<span className="ct-rank-mark" aria-hidden="true" {...decorativeInert}><ListMark {...item}/></span>}{onSelect?<button type="button" role="option" className="ct-rank-row" data-mark={!!item.mark||undefined} aria-label={accessible} aria-selected={selected===item.id} tabIndex={active===item.id?0:-1} onFocus={()=>setFocusId(item.id)} onClick={()=>onSelect(item.id)}>{content}</button>:<div role="group" className="ct-rank-row" data-mark={!!item.mark||undefined} aria-label={accessible}>{content}</div>}</li>;})}</ol>{!expanded&&visible.length<items.length&&<Button className="ct-list-more" onClick={()=>setExpanded(true)}>{showMoreLabel??`Show ${(items.length-visible.length).toLocaleString()} more`}</Button>}</>:<p>{emptyLabel}</p>}</div></ScrollArea>;
}
export interface StatNoteProps {
 label:string; value:string|number; note?:string|{tone:StatTone;label:string;variant?:'pill'|'dot'}; caption?:ReactNode; tone?:StatTone; presentation?:'pill'|'dot'; format?:(value:number)=>string; size?:'regular'|'large';
 trend?:{label:string;tone?:'good'|'bad'|'neutral';direction?:'up'|'down'|'flat';good?:'up'|'down'};
 view?:{label:string;href:string;onClick?:never}|{label:string;onClick:()=>void;href?:never};
 href?:string;onClick?:()=>void;actionLabel?:string;loading?:boolean;
}
export function StatNote({label,value,note,caption,tone='quiet',presentation='pill',trend,view,loading=false,format,size='regular',href,onClick,actionLabel}:StatNoteProps) {
 const id=useId();const noteText=typeof note==='object'?note.label:note;const noteTone=typeof note==='object'?note.tone:tone;const noteVariant=typeof note==='object'?note.variant??'pill':presentation;
 const trendTone=trend?.tone??(!trend?.good||!trend.direction||trend.direction==='flat'?'neutral':trend.direction===trend.good?'good':'bad');
 const summary=[label,loading?'Loading':typeof value==='number'?(format?format(value):value.toLocaleString()):value,!loading&&noteText?`${noteTone}: ${noteText}`:undefined,!loading&&typeof caption==='string'?caption:undefined,actionLabel].filter(Boolean).join(', ');
 const interactive=href!==undefined||onClick!==undefined;const Tag=href!==undefined?'a':onClick?'button':'section';const Label=interactive?'span':'h3';
 return <Tag className="ct-status-stat" data-size={size} aria-labelledby={interactive?undefined:id} aria-label={interactive?summary:undefined} aria-busy={loading} href={href} type={onClick&&!href?'button':undefined} onClick={onClick}>
 <Label id={id} className="ct-status-stat-label">{label}</Label><div className="ct-status-stat-main"><strong className="ct-status-stat-value">{loading?<span className="ct-list-skeleton" role="status" aria-label={`Loading ${label}`}/>:typeof value==='number'?(format?format(value):value.toLocaleString()):value}</strong>{!loading&&noteText&&(noteVariant==='pill'?<Status tone={noteTone}>{noteText}</Status>:<span className="ct-status-stat-status" data-tone={noteTone}><i aria-hidden="true"/>{noteText}</span>)}</div>
 <div className="ct-status-stat-caption">{loading?<span className="ct-list-skeleton"/>:caption}</div><div className="ct-status-stat-footer">{!loading&&trend&&<span className="ct-stat-trend" data-tone={trendTone}>{trend.direction&&(trend.direction==='up'?<ArrowUpRight size={13} aria-hidden="true"/>:trend.direction==='down'?<ArrowDownRight size={13} aria-hidden="true"/>:<Minus size={13} aria-hidden="true"/>)}{trend.label}</span>}{!loading&&(interactive?<span className="lib-text-link">{actionLabel??view?.label}</span>:view&&(view.href!==undefined?<a className="lib-text-link" href={view.href}>{view.label}</a>:<Button onClick={view.onClick}>{view.label}</Button>))}</div></Tag>;
}
export interface StatNoteRowProps { children:ReactNode; mobileLayout?:'stack'|'compact' }
/** Compact is an opt-in two-column phone layout; notes and captions retain aligned tracks. */
export function StatNoteRow({children,mobileLayout='stack'}:StatNoteRowProps) {return <div className="ct-stat-note-row" data-mobile-layout={mobileLayout}>{children}</div>;}
