import type { MouseEvent, KeyboardEvent } from 'react';
export interface TableRowActivation<Row> {
  onRowClick?: (row:Row,event:MouseEvent<HTMLTableRowElement>|KeyboardEvent<HTMLTableRowElement>)=>void;
  rowLabel?: (row:Row)=>string;
  /** Stable key of the record open beside the table. */
  selectedRowKey?: string | number;
}
/** Shared activation for paginated and virtualized rows. Preserve native nested-control behavior. */
export function tableRowProps<Row>(row:Row,{onRowClick,rowLabel,selectedRowKey}:TableRowActivation<Row>,rowIdentity?:unknown) {
  return {
    'aria-selected':selectedRowKey===undefined?undefined:String(selectedRowKey)===String(rowIdentity),
    tabIndex:onRowClick?0:undefined,
    'aria-label':rowLabel?.(row),
    'data-interactive':!!onRowClick||undefined,
    onClick:onRowClick?(event:MouseEvent<HTMLTableRowElement>)=>{
      const control=(event.target as Element).closest('a,button,input,select,textarea,label,summary,[role="button"],[role="link"],[role="checkbox"],[role="switch"],[role="combobox"],[contenteditable]:not([contenteditable="false"]),[tabindex]');
      if(event.defaultPrevented||control&&control!==event.currentTarget)return;
      onRowClick(row,event);
    }:undefined,
    onKeyDown:onRowClick?(event:KeyboardEvent<HTMLTableRowElement>)=>{
      if(event.target!==event.currentTarget||event.defaultPrevented||!['Enter',' '].includes(event.key))return;
      event.preventDefault();onRowClick(row,event);
    }:undefined,
  };
}
