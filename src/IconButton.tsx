'use client';

import type { ButtonHTMLAttributes } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'md' | 'sm';
  /** Required: an icon-only button must still say what it does. */
  'aria-label': string;
  /** A short tooltip shown on hover (defaults to nothing; the aria-label is still read). */
  tip?: string;
}

export function IconButton({ size = 'md', className = '', tip, ...rest }: IconButtonProps) {
  const cls = ['arlab-icon-btn', size === 'sm' ? 'sm' : '', className].filter(Boolean).join(' ');
  return <button type="button" className={cls} data-tip={tip} {...rest} />;
}