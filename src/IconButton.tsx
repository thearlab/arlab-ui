import type { ButtonHTMLAttributes } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'md' | 'sm';
  /** Required: an icon-only button must still say what it does. */
  'aria-label': string;
}

export function IconButton({ size = 'md', className = '', ...rest }: IconButtonProps) {
  const cls = ['arlab-icon-btn', size === 'sm' ? 'sm' : '', className].filter(Boolean).join(' ');
  return <button type="button" className={cls} {...rest} />;
}
