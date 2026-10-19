import React from 'react';
import { X } from 'lucide-react';

/** @param {{children?:React.ReactNode,onRemove?:React.MouseEventHandler<HTMLButtonElement>,onClick?:React.MouseEventHandler<HTMLButtonElement>,disabled?:boolean}} props */
export function Chip({children,onRemove,onClick,disabled=false}) {
  if(onClick)return <button type="button" className="ct-chip-reset" onClick={onClick} disabled={disabled}>{children}</button>;
  return <span className="removable-tag">
    <span className="ct-chip-label" title={typeof children === 'string' ? children : undefined}>{children}</span>
    {onRemove && <button type="button" className="ct-chip-remove" aria-label={`Remove ${children}`} onClick={onRemove}><X size={12} aria-hidden="true" /></button>}
  </span>;
}
