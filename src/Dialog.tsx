'use client';

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

/** A backdrop-blurred, centered dialog. Closes on Escape or a backdrop
 * click, and returns focus to whatever triggered it. Ships as a portal to
 * `document.body` so it's never clipped by an ancestor's overflow. */
export function Dialog({ open, onClose, title, description, children, footer }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    dialogRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="arlab-dialog-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="arlab-dialog arlab-accent-edge"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'arlab-dialog-title' : undefined}
        tabIndex={-1}
        ref={dialogRef}
      >
        {title ? (
          <h2 className="arlab-dialog-title" id="arlab-dialog-title">
            {title}
          </h2>
        ) : null}
        {description ? <p className="arlab-dialog-description">{description}</p> : null}
        {children}
        {footer ? <div className="arlab-dialog-footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

export function DialogFooter({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-dialog-footer', className].filter(Boolean).join(' ')} {...rest} />;
}