'use client';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import type { Placement } from '../lib/place';
import { Spinner } from './Spinner';
import { Tooltip } from './Tooltip';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Required: what the button does ("Close", "Edit brief"). Its accessible name and its tooltip. */
  label: string;
  /** The icon (decorative). */
  children: ReactNode;
  variant?: 'ghost' | 'secondary' | 'soft' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** A toggle: true or false sets aria-pressed. */
  pressed?: boolean;
  /** Show the label as a tooltip (default) or not. */
  tip?: boolean;
  tipPlacement?: Placement;
  loading?: boolean;
  /** A small red dot ("something new"). Say what is new in `label` too. */
  dot?: boolean;
}

/** A square icon-only button with a name and a tooltip. Back, close, edit, more, previous, next. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, children, variant = 'ghost', size = 'md', pressed, tip = true, tipPlacement, loading, dot, className, type = 'button', onClick, ...rest }, ref,
) {
  const btn = (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={pressed}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cx('ar-iconbtn', `ar-iconbtn--${variant}`, size !== 'md' && `ar-iconbtn--${size}`, className)}
      onClick={(e) => { if (loading) return; onClick?.(e); }}
      {...rest}
    >
      {loading ? <Spinner size={size === 'sm' ? 14 : 16} /> : <span className="ar-iconbtn-icon" aria-hidden="true">{children}</span>}
      {dot && <span className="ar-iconbtn-dot" aria-hidden="true" />}
    </button>
  );
  return tip ? <Tooltip label={label} describe={false} placement={tipPlacement} disabled={rest.disabled}>{btn}</Tooltip> : btn;
});
