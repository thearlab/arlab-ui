'use client';

import type { ReactElement } from 'react';

export interface TooltipProps {
  label: string;
  children: ReactElement;
}

/** CSS-only — no JS positioning library, shown on hover or focus so it
 * works for keyboard users too. Missing from both apps that were audited;
 * a real gap for anything icon-only (IconButton needs one almost always). */
export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="arlab-tooltip-wrap">
      {children}
      <span className="arlab-tooltip-bubble" role="tooltip">
        {label}
      </span>
    </span>
  );
}