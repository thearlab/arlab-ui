import React from 'react';
import {ChevronUp, ChevronDown} from 'lucide-react';
/** Internal sorting affordance shared by every table header.
 * @param {{label: React.ReactNode, accessibleLabel?: string, direction?: 'none'|'ascending'|'descending', onSort?: React.MouseEventHandler<HTMLButtonElement>, disabled?: boolean, showIndicators?: boolean}} props
 */
export function SortControl({label,accessibleLabel,direction='none',onSort,disabled=false,showIndicators=true}) {
 const name=accessibleLabel??(typeof label==='string'?label:undefined);
 return <button type="button" className="ct-table-sort" disabled={disabled} aria-label={name?`Sort ${name} ${direction==='ascending'?'descending':'ascending'}`:undefined} onClick={onSort}>
  <span>{label}</span>{showIndicators&&<span className="ct-sort-arrows" aria-hidden="true"><ChevronUp size={12} data-active={direction==='ascending'||undefined}/><ChevronDown size={12} data-active={direction==='descending'||undefined}/></span>}
 </button>;
}
