'use client';

import type { ButtonHTMLAttributes } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'md' | 'sm';
  /** `ghost` drops the border and fill, for a dense row or toolbar. */
  variant?: 'default' | 'ghost';
  /** Required: an icon-only button must still say what it does. */
  'aria-label': string;
  /** A short tooltip shown on hover (defaults to nothing; the aria-label is still read). */
  tip?: string;
}

export function IconButton({ size = 'md', variant = 'default', className = '', tip, ...rest }: IconButtonProps) {
  const cls = ['arlab-icon-btn', size === 'sm' ? 'sm' : '', variant === 'ghost' ? 'ghost' : '', className].filter(Boolean).join(' ');
  // Every icon button names itself: the tooltip defaults to the aria-label.
  return <button type="button" className={cls} data-tip={tip ?? rest['aria-label']} {...rest} />;
}