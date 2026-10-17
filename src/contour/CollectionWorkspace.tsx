import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type MouseEvent, type KeyboardEvent } from 'react';
import { ScrollArea } from './scroll-area.js';
import { Status, Button, Modal } from './ui.js';
import type { CollectionRecord } from './RecordLayouts.js';

export interface CollectionWorkspaceProps {
  /** The full browse destination, including its heading, filters and results. */
  collection: ReactNode;
  /** A compact record list. Prefer RecordNavigator for record-based collections. */
  navigator?: ReactNode;
  /** Condense retains the same collection instance as the selected-record list. */
  collectionMode?: 'navigator' | 'condense';
  /** Persistent desktop filter rail; a native modal sheet on phone. */
  sidebar?: (state: {mobile: boolean; close: () => void}) => ReactNode;
  sidebarLabel?: string;
  /** Omit detail to show the full collection. Supply it when a record is selected. */
  detail?: ReactNode;
  layout?: 'split' | 'focus' | 'stacked';
  navigatorLabel?: string;
  detailLabel?: string;
  navigatorWidth?: CSSProperties['width'];
}
/** Application-owned selection; library-owned responsive list/detail geometry and scroll boundaries. */
export function CollectionWorkspace({collection,navigator,detail,layout='split',collectionMode='navigator',sidebar,sidebarLabel='Filters',navigatorLabel='Records',detailLabel='Selected record',navigatorWidth=280}:CollectionWorkspaceProps) {
  const selected=detail!==undefined && detail!==null && detail!==false;
  const condensed=collectionMode==='condense';
  const [filtersOpen,setFiltersOpen]=useState(false);
  const closeFilters=()=>setFiltersOpen(false);
  useEffect(()=>{
    const media=window.matchMedia('(min-width: 761px)');
    const close=()=>{if(media.matches)setFiltersOpen(false);};
    media.addEventListener('change',close);return()=>media.removeEventListener('change',close);
  },[]);
  return <section className="ct-collection-workspace" data-selected={selected||undefined} data-layout={layout} data-collection-mode={collectionMode} style={{'--ct-navigator-width':typeof navigatorWidth==='number'?`${navigatorWidth}px`:navigatorWidth} as CSSProperties}>
    <div className="ct-workspace-main">
      {sidebar&&<div className="ct-workspace-toolbar"><Button aria-haspopup="dialog" aria-expanded={filtersOpen} onClick={()=>setFiltersOpen(true)}>{sidebarLabel}</Button></div>}
      <div className="ct-workspace-stage">
        <div className="ct-workspace-collection" role={selected&&condensed?'region':undefined} data-condensed={selected&&condensed||undefined} aria-label={selected&&condensed?navigatorLabel:undefined} hidden={selected&&(!condensed||layout==='focus')}>{collection}</div>
        {selected&&(condensed?<div className="ct-workspace-detail" role="region" aria-label={detailLabel}>{detail}</div>:<div className="ct-workspace-panes">
          <aside className="ct-workspace-navigator" aria-label={navigatorLabel} hidden={layout==='focus'}>{navigator}</aside>
          <div className="ct-workspace-detail" role="region" aria-label={detailLabel}>{detail}</div>
        </div>)}
      </div>
    </div>
    {sidebar&&<div className="ct-workspace-sidebar">{sidebar({mobile:false,close:closeFilters})}</div>}
    {sidebar&&<Modal open={filtersOpen} onClose={closeFilters} title={sidebarLabel} sheet className="ct-collection-filter-sheet"><div className="ct-collection-filter-content">{sidebar({mobile:true,close:closeFilters})}</div></Modal>}
  </section>;
}

export interface RecordNavigatorProps {
  title: string;
  records: CollectionRecord[];
  selectedId?: string;
  onOpen: (id:string)=>void;
  search?: ReactNode;
  actions?: ReactNode;
  filters?: ReactNode;
  notice?: ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  density?: 'comfortable'|'compact';
}
/** Compact real links preserve modified-click navigation; arrow keys move focus without selecting. */
export function RecordNavigator({title,records,selectedId,onOpen,search,actions,filters,notice,loading=false,emptyMessage='No records match these filters.',density='comfortable'}:RecordNavigatorProps) {
  const list=useRef<HTMLUListElement>(null);
  const root=useRef<HTMLDivElement>(null);
  const selectedPresent=records.some(record=>record.id===selectedId);
  useEffect(()=>{
    const reveal=()=>{if(root.current?.getBoundingClientRect().width)list.current?.querySelector<HTMLAnchorElement>('[aria-current="page"]')?.scrollIntoView({block:'nearest'});};
    reveal();const observer=new ResizeObserver(reveal);if(root.current)observer.observe(root.current);return()=>observer.disconnect();
  },[selectedId,selectedPresent]);
  const open=(event:MouseEvent<HTMLAnchorElement>,record:CollectionRecord)=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();onOpen(record.id);
  };
  const move=(event:KeyboardEvent<HTMLAnchorElement>,index:number)=>{
    const next=event.key==='ArrowDown'?Math.min(index+1,records.length-1):event.key==='ArrowUp'?Math.max(index-1,0):event.key==='Home'?0:event.key==='End'?records.length-1:-1;
    if(next<0)return;event.preventDefault();list.current?.querySelectorAll<HTMLAnchorElement>('a')[next]?.focus();
  };
  return <div ref={root} className="ct-record-navigator" data-density={density}>
    <header className="ct-navigator-header"><div><h2>{title}</h2><span role="status">{loading?'Loading…':records.length}</span></div>{actions}</header>
    {(search||filters)&&<div className="ct-navigator-tools">{search&&<div>{search}</div>}{filters}</div>}
    {notice&&<div className="ct-navigator-notice">{notice}</div>}
    <ScrollArea label={`${title} list`} className="ct-navigator-scroll">
      {loading?<div className="ct-navigator-empty" role="status">Loading records…</div>:records.length?<ul ref={list}>
        {records.map((record,index)=><li key={record.id}><a href={record.href} aria-current={record.id===selectedId?'page':undefined} onClick={event=>open(event,record)} onKeyDown={event=>move(event,index)}>
          <strong title={record.title}>{record.title}</strong>
          {record.description&&<span className="ct-navigator-description" title={record.description}>{record.description}</span>}
          <span className="ct-navigator-meta"><span>{record.category}</span><Status tone={record.tone||'quiet'}>{record.status}</Status></span>
        </a></li>)}
      </ul>:<p className="ct-navigator-empty">{emptyMessage}</p>}
    </ScrollArea>
  </div>;
}

export interface RecordSectionProps {
  title: ReactNode;
  description?: ReactNode;
  summary?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'plain'|'divided';
}
/** A reading or editing section without an extra card surface. Use within DetailSections and Stack. */
export function RecordSection({title,description,summary,actions,children,footer,variant='plain'}:RecordSectionProps) {
  const headingId=useId();
  return <section className="ct-record-section" data-variant={variant} aria-labelledby={headingId}>
    <header><div><h2 id={headingId}>{title}</h2>{description&&<p>{description}</p>}</div>{actions&&<div className="ct-record-section-actions">{actions}</div>}</header>
    {summary&&<div className="ct-record-section-summary">{summary}</div>}
    <div className="ct-record-section-body">{children}</div>
    {footer&&<footer>{footer}</footer>}
  </section>;
}

export interface ActionGroupProps {children:ReactNode;label?:string;align?:'start'|'end';equalWidth?:boolean}
/** A compact wrapping group of related controls. Supply a label for an announced group. */
export function ActionGroup({children,label,align='start',equalWidth=false}:ActionGroupProps) {
 return <div className="ct-action-group" role={label?'group':undefined} aria-label={label} data-align={align} data-equal-width={equalWidth||undefined}>{children}</div>;
}
