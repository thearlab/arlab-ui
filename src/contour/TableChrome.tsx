import type { CSSProperties, ReactNode } from 'react';
import { Pill } from './library.js';

/** Shared chrome options for paginated, progressive and record collection tables. */
export interface TableChromeOptions {
 /** Noun after the formatted count, for example "projects" or "shown". */
 countLabel?: string;
 /** Custom visible and accessible count, taking precedence over countLabel. */
 formatCount?: (count: number) => string;
 /** Preferred minimum search width; capped by available space on small screens. */
 searchWidth?: CSSProperties['width'];
}
/** Shared header anatomy for paginated and progressively loaded tables. */
export function TableHeader({title,header,headingId,count,loading,search,actions,condensedActions,countLabel,formatCount,searchWidth=220}:{title:string;header?:ReactNode;headingId?:string;count:number;loading?:boolean;search?:ReactNode;actions?:ReactNode;condensedActions?:ReactNode}&TableChromeOptions) {
 const customCount=count>=0?(formatCount?.(count)??(countLabel?`${count.toLocaleString()} ${countLabel}`:undefined)):undefined;
 const countText=loading?'…':count<0?'?':customCount??count.toLocaleString();
 const countName=loading?'Loading records':count<0?'Record total unknown':customCount??`${count.toLocaleString()} ${count===1?'record':'records'}`;
 return <header className="ct-table-header" style={{'--ct-table-search-width':typeof searchWidth==='number'?`${searchWidth}px`:searchWidth} as CSSProperties}>
  <div className="ct-table-heading"><div id={headingId}><div className="ct-table-expanded-heading">{header || <h3>{title}</h3>}</div><h3 className="ct-table-condensed-heading">{title}</h3></div><Pill tone="quiet" dot={false}><span className="ct-table-count" aria-label={countName}>{countText}</span></Pill></div>
  {(search||actions)&&<div className="ct-table-controls">{search&&<div className="ct-table-search">{search}</div>}{actions&&<div className="ct-table-header-actions">{actions}</div>}</div>}
  {condensedActions&&<div className="ct-table-condensed-header-actions">{condensedActions}</div>}
 </header>;
}
