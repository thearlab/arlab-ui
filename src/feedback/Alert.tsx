'use client';
import type { HTMLAttributes, ReactNode } from 'react';
import { IconButton } from '../core/IconButton';
import { AlertTriangleIcon, CheckCircleIcon, CloseIcon, InfoCircleIcon, XCircleIcon } from '../core/icons';
import { cx } from '../lib/cx';

export type AlertTone = 'info' | 'ok' | 'warn' | 'bad';
const ICON: Record<AlertTone, ReactNode> = { info: <InfoCircleIcon />, ok: <CheckCircleIcon />, warn: <AlertTriangleIcon />, bad: <XCircleIcon /> };

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  /** Says what happened, specifically ("2 days could not load"). */
  title?: ReactNode;
  /** Buttons: what to do next ("Try again"). */
  actions?: ReactNode;
  /** Shows a close button. */
  onDismiss?: () => void;
  /** Interrupts a screen reader (role=alert). Default: only for `bad`. Others are role=status. */
  urgent?: boolean;
  /** page: a full-width band at the top of a page. inline (default): inside the content. */
  variant?: 'inline' | 'page';
  /** Replace the tone icon, or `false` for none. */
  icon?: ReactNode | false;
}

/** A banner that stays until the cause is fixed or it is dismissed. Never colour alone: an icon and a
 * title carry the tone too. */
export function Alert({ tone = 'info', title, actions, onDismiss, urgent, variant = 'inline', icon, className, children, ...rest }: AlertProps) {
  const role = (urgent ?? tone === 'bad') ? 'alert' : 'status';
  return (
    <div role={role} className={cx('ar-alert', `ar-alert--${tone}`, variant === 'page' && 'ar-alert--page', className)} {...rest}>
      {icon !== false && <span className="ar-alert-icon" aria-hidden="true">{icon ?? ICON[tone]}</span>}
      <div className="ar-alert-body">
        {title && <p className="ar-alert-title">{title}</p>}
        {children && <div className="ar-alert-text">{children}</div>}
        {actions && <div className="ar-alert-actions">{actions}</div>}
      </div>
      {onDismiss && <IconButton className="ar-alert-close" size="sm" label="Dismiss" onClick={onDismiss}><CloseIcon /></IconButton>}
    </div>
  );
}
