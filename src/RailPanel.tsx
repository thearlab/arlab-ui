'use client';

import type { ReactNode } from 'react';

export interface RailPanelProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  /** Pinned at the bottom: a composer, a form's actions. */
  footer?: ReactNode;
}

/** A full-height panel on the right of the app, for a companion task (asking the assistant, a
 * chat, a log). Pass it as SidebarShell's `aside`: the shell then folds the left rail to make room,
 * and expanding the left rail closes this one. Not a floating popup. */
export function RailPanel({ title, subtitle, onClose, children, footer }: RailPanelProps) {
  return (
    <aside className="arlab-railpanel" aria-label={title}>
      <div className="arlab-railpanel-h">
        <div><b>{title}</b>{subtitle && <small>{subtitle}</small>}</div>
        <button type="button" className="arlab-icon-btn" onClick={onClose} aria-label="Close" data-tip="Close"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
      </div>
      <div className="arlab-railpanel-body">{children}</div>
      {footer && <div className="arlab-railpanel-f">{footer}</div>}
    </aside>
  );
}
