'use client';
import { useId, useState, type ReactNode, type RefObject, type HTMLAttributes } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { Portal } from '../core/Primitives';
import { IconButton } from '../core/IconButton';
import { Button } from '../core/Button';
import { CloseIcon } from '../core/icons';
import { useModal } from './useModal';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Called when the person closes it (Esc, scrim, close button). */
  onClose?: () => void;
  /** Names the dialog. Specific: "Remove this member?" */
  title: ReactNode;
  /** One or two sentences under the title (aria-describedby). */
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons, right aligned. Use DialogFooter or pass the buttons. */
  footer?: ReactNode;
  /** sm 420, md 520 (default), lg 760, xl 880 (the detail popup). */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** A soft hero band above the title, for the detail popup (verdict first). */
  hero?: ReactNode;
  /** Esc and a scrim click close it (default). Off while work is in flight. */
  dismissible?: boolean;
  /** Show the close button in the corner (default true). */
  closeButton?: boolean;
  initialFocus?: RefObject<HTMLElement | null>;
  role?: 'dialog' | 'alertdialog';
  className?: string;
}

/** A centred modal for confirmations and short focused tasks. Long forms belong in a Sheet. */
export function Dialog({ open, defaultOpen = false, onOpenChange, onClose, title, description, children, footer, size = 'md', hero, dismissible = true, closeButton = true, initialFocus, role = 'dialog', className }: DialogProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const close = () => { setOpen(false); onClose?.(); };
  const { ref, mounted, state } = useModal(isOpen, close, { dismissible, initialFocus });
  const id = useId();
  if (!mounted) return null;
  return (
    <Portal>
      <div className="ar-scrim" data-state={state} onClick={(e) => { if (dismissible && e.target === e.currentTarget) close(); }}>
        <div ref={ref} role={role} aria-modal="true" aria-labelledby={`${id}t`} aria-describedby={description ? `${id}d` : undefined}
          tabIndex={-1} className={cx('ar-dialog', `ar-dialog--${size}`, className)} data-state={state}>
          <div className="ar-dialog-inner ar-scroll">
          {hero && <div className="ar-dialog-hero">{hero}</div>}
          <div className="ar-dialog-head">
            <h2 id={`${id}t`} className="ar-dialog-title">{title}</h2>
            {closeButton && dismissible && <IconButton label="Close" size="sm" onClick={close} className="ar-dialog-close"><CloseIcon /></IconButton>}
          </div>
          {description && <div id={`${id}d`} className="ar-dialog-desc">{description}</div>}
          {children && <div className="ar-dialog-body">{children}</div>}
          </div>
          {footer && <div className="ar-dialog-foot">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}

/** A right-aligned row of dialog buttons: the safe choice first, the action last. */
export function DialogFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('ar-dialog-actions', className)} {...rest} />;
}

export interface ConfirmDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  /** What will happen, as a question: "Revoke the Labby key?" */
  title: ReactNode;
  /** To what, how much it was used, and whether it can be undone. */
  children?: ReactNode;
  /** The action named in full: "Revoke the key". */
  confirmLabel: string;
  cancelLabel?: string;
  /** danger (red) for destructive, accent (calm) for a save. */
  tone?: 'danger' | 'accent';
  /** Runs on confirm. A promise keeps the dialog open, both buttons disabled and "Working" showing;
   * it closes on success and shows the error on failure. */
  onConfirm: () => void | Promise<unknown>;
}

/** Asks before a destructive or outward change (HIG alerts, admin page rule 7). */
export function ConfirmDialog({ open, defaultOpen = false, onOpenChange, onClose, title, children, confirmLabel, cancelLabel = 'Keep it', tone = 'danger', onConfirm }: ConfirmDialogProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const close = () => { if (busy) return; setErr(''); setOpen(false); onClose?.(); };
  const confirm = async () => {
    setErr('');
    const r = onConfirm();
    if (!r || typeof (r as Promise<unknown>).then !== 'function') { setOpen(false); return; }
    setBusy(true);
    try { await r; setBusy(false); setOpen(false); }
    catch (e) { setBusy(false); setErr(e instanceof Error ? e.message : String(e)); }
  };
  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) close(); }} role="alertdialog" size="sm" title={title} dismissible={!busy} closeButton={false}
      description={children}
      footer={<DialogFooter>
        <Button onClick={close} disabled={busy} data-autofocus>{cancelLabel}</Button>
        <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={confirm} disabled={busy}>{busy ? 'Working' : confirmLabel}</Button>
      </DialogFooter>}>
      {err ? <p role="alert" className="ar-dialog-error">This did not work: {err}</p> : null}
    </Dialog>
  );
}
