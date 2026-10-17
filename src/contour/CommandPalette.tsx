import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Modal } from './ui.js';
import { SearchField, Kbd, Pill } from './library.js';
import { ScrollArea } from './scroll-area.js';
export interface CommandItem {id:string;title:string;summary?:string;typeLabel?:string;group?:string;onSelect:()=>void;}
export interface CommandPaletteProps {
 open:boolean;onClose:()=>void;items:CommandItem[];title?:string;placeholder?:string;emptyLabel?:string;
 filter?:(query:string,items:CommandItem[])=>CommandItem[];
}
const defaultFilter=(query:string,items:CommandItem[])=>{const terms=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);return items.filter(item=>terms.every(term=>`${item.title} ${item.summary||''} ${item.typeLabel||''} ${item.group||''}`.toLocaleLowerCase().includes(term)));};
/** Native modal, shared SearchField and bounded results. The host owns shortcuts and routing. */
export function CommandPalette({open,onClose,items,title='Search workspace',placeholder='Find a page or action',emptyLabel='No results found.',filter=defaultFilter}:CommandPaletteProps) {
 const [query,setQuery]=useState(''),[active,setActive]=useState(0);
 const input=useRef<HTMLInputElement>(null),list=useRef<HTMLDivElement>(null);
 const id=useId();
 const matches=useMemo(()=>{
  const filtered=filter(query,items);if(!filtered.some(item=>item.group))return filtered;
  const groups=new Map<string,CommandItem[]>();filtered.forEach(item=>{const key=item.group||'';const group=groups.get(key)||[];group.push(item);groups.set(key,group);});return [...groups.values()].flat();
 },[query,items,filter]);
 const results=matches.slice(0,24);
 const resultGroups=[...results.reduce((groups,item,at)=>{const name=item.group||'';const group=groups.get(name)||[];group.push({item,at});groups.set(name,group);return groups;},new Map<string,{item:CommandItem;at:number}[]>()).entries()];
 const index=Math.min(active,Math.max(0,results.length-1));
 useEffect(()=>{if(!open)return;const previous=document.activeElement as HTMLElement|null;setQuery('');setActive(0);const frame=requestAnimationFrame(()=>input.current?.focus());return()=>{cancelAnimationFrame(frame);if(previous?.isConnected)previous.focus();};},[open]);
 useEffect(()=>{if(open)list.current?.querySelector<HTMLElement>('[data-active]')?.scrollIntoView({block:'nearest'});},[index,query,open]);
 const choose=(item:CommandItem)=>{onClose();item.onSelect();};
 const move=(event:KeyboardEvent<HTMLInputElement>)=>{
  if(event.nativeEvent.isComposing)return;
  if(event.key==='Enter'){event.preventDefault();if(results[index])choose(results[index]);return;}
  if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key)||!results.length)return;
  // Preserve ordinary text editing Home/End unless Alt is held.
  if((event.key==='Home'||event.key==='End')&&!event.altKey)return;
  event.preventDefault();setActive(event.key==='Home'?0:event.key==='End'?results.length-1:(index+(event.key==='ArrowUp'?-1:1)+results.length)%results.length);
 };
 return <Modal open={open} onClose={onClose} title={title} className="ct-command-palette" width={640}
  footer={<div className="ct-command-footer"><span role="status">{matches.length?`${matches.length.toLocaleString()} ${matches.length===1?'result':'results'}${matches.length>24?' · First 24 shown':''}`:'Try another name or keyword'}</span><span><Kbd>↑</Kbd><Kbd>↓</Kbd> Navigate <Kbd>Enter</Kbd> Open <Kbd>Esc</Kbd> Close</span></div>}>
  <div className="ct-command-search"><SearchField inputRef={input} label={placeholder} placeholder={placeholder} value={query} onChange={(event:{target:{value:string}})=>{setQuery(event.target.value);setActive(0);}} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-results`} aria-activedescendant={results[index]?`${id}-result-${index}`:undefined} onKeyDown={move}/></div>
  <ScrollArea label="Search results" className="ct-command-scroll"><div ref={list} id={`${id}-results`} role="listbox" aria-label="Search results">
   {resultGroups.map(([group,entries],groupIndex)=><div key={group} role={group?'group':undefined} aria-labelledby={group?`${id}-group-${groupIndex}`:undefined}>{group&&<h3 id={`${id}-group-${groupIndex}`} className="ct-command-group-title">{group}</h3>}{entries.map(({item,at})=><button type="button" role="option" tabIndex={-1} key={item.id} id={`${id}-result-${at}`} aria-selected={at===index} data-active={at===index||undefined} className="ct-command-result" onMouseEnter={()=>setActive(at)} onClick={()=>choose(item)}>
    <span className="ct-command-identity"><strong>{item.title}</strong>{item.summary&&<small>{item.summary}</small>}</span>{item.typeLabel&&<Pill tone="quiet" dot={false}>{item.typeLabel}</Pill>}<ArrowUpRight size={13} aria-hidden="true"/>
   </button>)}</div>)}
   {!results.length&&<p className="ct-command-empty" role="status">{emptyLabel}</p>}
  </div></ScrollArea>
 </Modal>;
}
