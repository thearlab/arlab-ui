'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDownIcon } from './icons';

export interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

/** Replaces raw <details>/<summary> (arlab-studio's "Advanced: raw JSON"
 * reveal) with a styled, animated disclosure — a CSS grid-rows trick, so
 * the open/close animates without measuring content height in JS. */
export function Collapsible({ trigger, children, defaultOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button type="button" className="arlab-collapsible-trigger" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="arlab-disclosure-chev" aria-hidden="true"><ChevronDownIcon size={12} /></span>
        {trigger}
      </button>
      <div className={['arlab-collapsible-body', open ? 'open' : ''].filter(Boolean).join(' ')}>
        <div>
          <div className="arlab-collapsible-body-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}