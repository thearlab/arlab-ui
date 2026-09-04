'use client';

import type { HTMLAttributes, ReactNode } from 'react';

export interface IconTileProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** `accent` = gradient accent tile with a white glyph (default); `soft` = tinted; `plain` = neutral. */
  variant?: 'accent' | 'soft' | 'plain';
  size?: 'sm' | 'md' | 'lg';
}

/** A small rounded tile that frames an icon. The signature affordance in ARLAB's
 * navigation surfaces (NavCard, DashCard) — a gradient accent square with a white glyph. */
export function IconTile({ children, variant = 'accent', size = 'md', className = '', ...rest }: IconTileProps) {
  return (
    <span className={['arlab-icon-tile', variant, size, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}
