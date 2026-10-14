'use client';
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface Common {
  /** primary: the one main action of a view. secondary: bordered. ghost: quiet. soft: accent tint. danger: destructive. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon (decorative; the label names the button). */
  icon?: ReactNode;
  /** Trailing icon, e.g. a chevron. */
  iconEnd?: ReactNode;
  /** Full width. */
  block?: boolean;
}

export interface ButtonProps extends Common, ButtonHTMLAttributes<HTMLButtonElement> {
  /** Working: shows a spinner, keeps focus, ignores clicks and says so to screen readers. */
  loading?: boolean;
  /** The label while loading ("Saving"). Defaults to the children. */
  loadingLabel?: ReactNode;
}

/** The class names of a button, for anything that must look like one (a router link). */
export function buttonClass({ variant = 'secondary', size = 'md', block }: Common = {}, extra?: string) {
  return cx('ar-btn', `ar-btn--${variant}`, size !== 'md' && `ar-btn--${size}`, block && 'ar-btn--block', extra);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', icon, iconEnd, block, loading = false, loadingLabel, className, children, type = 'button', disabled, onClick, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass({ variant, size, block }, className)}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      onClick={(e) => { if (loading) { e.preventDefault(); return; } onClick?.(e); }}
      {...rest}
    >
      {loading ? <Spinner size={size === 'sm' ? 14 : 16} /> : icon && <span className="ar-btn-icon" aria-hidden="true">{icon}</span>}
      {(loading && loadingLabel) || children ? <span className="ar-btn-label">{loading && loadingLabel ? loadingLabel : children}</span> : null}
      {!loading && iconEnd && <span className="ar-btn-icon" aria-hidden="true">{iconEnd}</span>}
    </button>
  );
});

export interface ButtonLinkProps extends Common, AnchorHTMLAttributes<HTMLAnchorElement> {}
/** A link that looks like a button (navigation, not an action). */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink({ variant, size, icon, iconEnd, block, className, children, ...rest }, ref) {
  return (
    <a ref={ref} className={buttonClass({ variant, size, block }, className)} {...rest}>
      {icon && <span className="ar-btn-icon" aria-hidden="true">{icon}</span>}
      <span className="ar-btn-label">{children}</span>
      {iconEnd && <span className="ar-btn-icon" aria-hidden="true">{iconEnd}</span>}
    </a>
  );
});
