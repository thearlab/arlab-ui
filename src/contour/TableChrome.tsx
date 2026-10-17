import type { ReactNode } from 'react';
import { Pill } from './library.js';

/** Shared header anatomy for paginated and progressively loaded tables. */
export function TableHeader({title,header,headingId,count,loading,search,actions}:{title:string;header?:ReactNode;headingId?:string;count:number;loading?:boolean;search?:ReactNode;actions?:ReactNode}) {
 return <header className="ct-table-header">
  <div className="ct-table-heading"><div id={headingId}>{header || <h3>{title}</h3>}</div><Pill tone="quiet" dot={false}><span aria-label={loading?'Loading records':count<0?'Record total unknown':`${count.toLocaleString()} ${count===1?'record':'records'}`}>{loading?'…':count<0?'?':count.toLocaleString()}</span></Pill></div>
  {(search||actions)&&<div className="ct-table-controls">{search&&<div className="ct-table-search">{search}</div>}{actions&&<div className="ct-table-header-actions">{actions}</div>}</div>}
 </header>;
}
