import {type ReactNode,type CSSProperties} from 'react';
import {ScrollArea} from './scroll-area.js';
import {Meter,Timestamp} from './library.js';
import {Status} from './ui.js';
/** The workspace composition approved in the Full workspace showcase. */
export function WorkspaceContent({children,footer,label='Workspace content'}:{children:ReactNode;footer?:ReactNode;label?:string}){
 return <div className="ct-workspace-content"><ScrollArea label={label} className="ct-workspace-content-scroll"><div className="ct-workspace-page">{children}</div></ScrollArea>{footer}</div>;
}
/** A route-level scroll contract for SidebarShell. Each page can choose document scrolling or a bounded child scroller. */
export function ShellPage({children,scroll='page',label='Page content'}:{children:ReactNode;scroll?:'page'|'child';label?:string}){
 return <section className="ct-shell-page" data-scroll={scroll} aria-label={label}>{children}</section>;
}
export function WorkspaceGrid({children,layout='equal',supportingWidth}:{children:ReactNode;layout?:'equal'|'sidebar';supportingWidth?:CSSProperties['width']}){return <div className="ct-workspace-grid" data-layout={layout} style={supportingWidth!==undefined?{'--ct-workspace-supporting-width':typeof supportingWidth==='number'?`${supportingWidth}px`:supportingWidth} as CSSProperties:undefined}>{children}</div>;}
export function WorkspaceIntro({title,description,actions}:{title:ReactNode;description?:ReactNode;actions?:ReactNode}){return <header className="ct-workspace-intro"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{actions}</header>;}
/** Shared name/metadata cell for custom table content; row activation belongs to the table. */
export function RecordCell({title,description,leading}:{title:ReactNode;description?:ReactNode;leading?:ReactNode}){return <div className="ct-record-cell">{leading}<span><strong>{title}</strong>{description&&<small>{description}</small>}</span></div>;}
/** Right-aligned figure with a discreet neutral share bar. */
export function UsageValue({value,max,display}:{value:number;max:number;display?:ReactNode}){const ratio=Number.isFinite(max)&&max>0&&Number.isFinite(value)?Math.min(100,Math.max(0,value/max*100)):0;return <span className="ct-usage-value"><span>{display??value}</span><span className="ct-usage-track" aria-hidden="true"><span style={{width:`${ratio}%`}}/></span></span>;}
export function DateStatus({date,status,tone='quiet'}:{date:string|Date;status:ReactNode;tone?:'quiet'|'ok'|'warn'|'bad'|'info'|'planning'}){return <span className="ct-date-status"><Timestamp date={date} format="date"/><Status tone={tone}>{status}</Status></span>;}
export function ProgressSummary({label,value}:{label:string;value:number}){return <div className="ct-progress-summary"><span>{label}</span><Meter value={value} label={label}/></div>;}
