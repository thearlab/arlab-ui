import {useEffect,useId,useRef,useState,type ReactNode,type HTMLAttributes} from 'react';
import {ScrollArea} from './scroll-area.js';
import {Modal,Button} from './ui.js';
import {FileUp,ChevronDown} from 'lucide-react';

/** A bounded destination with one content scroll area and persistent header/actions. */
export function PageFrame({children,header,tabs,footer,label='Page content',padding='default',scrollable=true}:{children:ReactNode;header?:ReactNode;tabs?:ReactNode;footer?:ReactNode;label?:string;padding?:'default'|'none';scrollable?:boolean}) {
 const contentClassName=`ct-page-frame-content ct-page-padding-${padding}`;
 return <section className="ct-page-frame" data-scrollable={scrollable} data-has-tabs={!!tabs||undefined}>{header&&<header className="ct-page-frame-header">{header}</header>}{tabs&&<div className="ct-page-frame-tabs">{tabs}</div>}{scrollable?<ScrollArea label={label} className="ct-page-frame-scroll" contentClassName={contentClassName}>{children}</ScrollArea>:<div className={`ct-page-frame-fill ${contentClassName}`} role="region" aria-label={label}>{children}</div>}{footer&&<footer className="ct-page-frame-footer">{footer}</footer>}</section>;
}
/** Document and outline share a scroll boundary; narrow panes stack naturally. */
export function ReadingLayout({children,outline}:{children:ReactNode;outline?:ReactNode}) {return <div className="ct-reading-layout"><div className="ct-reading-main">{children}</div>{outline&&<aside className="ct-reading-outline">{outline}</aside>}</div>;}
/** Typography for application-sanitised rich content. Parsing and trust decisions stay with the caller. */
export function DocumentContent({html,label='Document',...props}:Omit<HTMLAttributes<HTMLElement>,'children'|'dangerouslySetInnerHTML'> & {html:string;label?:string}) {
 const root=useRef<HTMLElement>(null);
 const [image,setImage]=useState<{src:string;alt:string}|null>(null);
 useEffect(()=>{const images=root.current?.querySelectorAll('img');images?.forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label',`Enlarge ${img.alt||'image'}`);});},[html]);
 const open=(target:EventTarget|null)=>{if(target instanceof HTMLImageElement)setImage({src:target.src,alt:target.alt});};
 return <><article {...props} ref={root} className={`ct-document-content ${props.className||''}`} aria-label={label} onClick={event=>{props.onClick?.(event);if(!event.defaultPrevented&&!(event.target as Element).closest('a'))open(event.target);}} onKeyDown={event=>{props.onKeyDown?.(event);if(!event.defaultPrevented&&['Enter',' '].includes(event.key)&&event.target instanceof HTMLImageElement){event.preventDefault();open(event.target);}}} dangerouslySetInnerHTML={{__html:html}}/><Modal open={!!image} onClose={()=>setImage(null)} title={image?.alt||'Image preview'} width="min(1200px,96vw)" className="ct-document-image-dialog">{image&&<img src={image.src} alt={image.alt}/>}</Modal></>;
}
export interface DocumentHeading {id:string;text:string;depth:number}
export function DocumentOutline({headings,label='On this page'}:{headings:DocumentHeading[];label?:string}) {
 const root=useRef<HTMLElement>(null),id=useId();const [active,setActive]=useState(''),[expanded,setExpanded]=useState(true);
 useEffect(()=>{const container=root.current?.closest('.ct-reading-layout');if(!container)return;let width=-1;const measure=()=>{const next=container.getBoundingClientRect().width;if(next!==width){width=next;setExpanded(next>=780);}};measure();const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(measure);observer?.observe(container);return()=>observer?.disconnect();},[headings.length>=2]);
 useEffect(()=>{if(!headings.length||typeof IntersectionObserver==='undefined')return;const container=root.current?.closest('.scroll-viewport')||null;const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id);},{root:container,rootMargin:'-8px 0px -65% 0px'});for(const heading of headings){const node=document.getElementById(heading.id);if(node)observer.observe(node);}return()=>observer.disconnect();},[headings]);
 if(headings.length<2)return null;
 return <nav ref={root} className="ct-document-outline" aria-labelledby={id}><details open={expanded} onToggle={event=>setExpanded(event.currentTarget.open)}><summary id={id}>{label}<ChevronDown size={14}/></summary><div>{headings.map(heading=><a key={heading.id} href={`#${heading.id}`} data-depth={heading.depth} aria-current={active===heading.id?'location':undefined} onClick={event=>{const node=document.getElementById(heading.id);if(!node)return;event.preventDefault();node.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});setActive(heading.id);}}>{heading.text}</a>)}</div></details></nav>;
}
/** Flexible rows and prose insets use the same shared spacing scale as forms and panels. */
export function Inline({children,justify='start',...props}:HTMLAttributes<HTMLDivElement>&{justify?:'start'|'between'|'end'}){return <div {...props} className={`ct-inline ${props.className||''}`} data-justify={justify}>{children}</div>;}
export function ContentInset({children,...props}:HTMLAttributes<HTMLDivElement>){return <div {...props} className={`ct-content-inset ${props.className||''}`}>{children}</div>;}
/** Semantic table primitive for domain-owned row structures. Prefer InfiniteTable for large flat datasets. */
export function Table({children,label='Records',...props}:HTMLAttributes<HTMLTableElement>&{label?:string}){return <div className="ct-data-table ct-table-surface" data-variant="flush"><table {...props} aria-label={props['aria-label']||label}>{children}</table></div>;}

/** File selection/drop behaviour without imposing a single-file document format on consuming tools. */
export function FileDropzone({onFiles,accept,multiple=true,disabled=false,title='Drop documents here',description='Choose files or drop them here to review before uploading.'}:{onFiles:(files:File[])=>void|Promise<void>;accept?:string;multiple?:boolean;disabled?:boolean;title?:string;description?:string}){
 const input=useRef<HTMLInputElement>(null);const [dragging,setDragging]=useState(false);
 const receive=(files:FileList|File[])=>{setDragging(false);if(!disabled&&files.length)void onFiles(Array.from(files).slice(0,multiple?undefined:1));};
 return <section className={`file-card ${dragging?'dragging':''} ${disabled?'disabled':''}`} aria-label={title} onDragOver={event=>{event.preventDefault();if(!disabled)setDragging(true);}} onDragLeave={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setDragging(false);}} onDrop={event=>{event.preventDefault();receive(event.dataTransfer.files);}}><input ref={input} type="file" hidden accept={accept} multiple={multiple} disabled={disabled} onChange={event=>{if(event.target.files)receive(event.target.files);event.target.value='';}}/><div className="file-card-head"><span className="file-card-icon"><FileUp size={18}/></span><div><h4>{title}</h4><p>{description}</p></div></div><div className="ct-content-inset"><Button disabled={disabled} onClick={()=>input.current?.click()}>Choose files</Button></div></section>;
}
/** Shared drop feedback for application-owned organising flows. */
export function DropRegion({active=false,dragging=false,children,...props}:HTMLAttributes<HTMLDivElement>&{active?:boolean;dragging?:boolean}){return <div {...props} className={`ct-drop-region ${props.className||''}`} data-active={active||undefined} data-dragging={dragging||undefined}>{children}</div>;}
