'use client';

import { useEffect, type ReactNode } from 'react';
import { Icon } from './icons';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** Small label above the title ("Edit project"). */
  kicker?: string;
  title: ReactNode;
  children: ReactNode;
  /** The buttons at the foot: Cancel, Save. */
  footer?: ReactNode;
  width?: number;
}

/** A panel that slides in from the right over a scrim, for editing one thing without leaving the
 * page. Escape and the scrim close it. Use it instead of a centred modal for any form longer than
 * a confirmation. */
export function Sheet({ open, onClose, kicker, title, children, footer, width = 520 }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="arlab-sheet-wrap" role="dialog" aria-modal="true">
      <button type="button" className="arlab-sheet-scrim" aria-label="Close" onClick={onClose} />
      <aside className="arlab-sheet" style={{ width: `min(${width}px, 100vw)` }}>
        <div className="arlab-sheet-h">
          <div>{kicker && <span className="k">{kicker}</span>}<h2>{title}</h2></div>
          <button type="button" className="arlab-icon-btn" onClick={onClose} aria-label="Close" data-tip="Close  Esc"><Icon name="X" size={16} /></button>
        </div>
        <div className="arlab-sheet-body">{children}</div>
        {footer && <div className="arlab-sheet-f">{footer}</div>}
      </aside>
    </div>
  );
}

/** A labelled group of fields inside a Sheet or a form card. */
export function SheetSection({ title, children }: { title?: string; children: ReactNode }) {
  return <section className="arlab-sheet-sec">{title && <h3>{title}</h3>}{children}</section>;
}
