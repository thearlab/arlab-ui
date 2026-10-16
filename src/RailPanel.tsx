'use client';

import type { ReactNode } from 'react';
import { Icon } from './icons';

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
        <button type="button" className="arlab-icon-btn" onClick={onClose} aria-label="Close" data-tip="Close"><Icon name="X" size={16} /></button>
      </div>
      <div className="arlab-railpanel-body">{children}</div>
      {footer && <div className="arlab-railpanel-f">{footer}</div>}
    </aside>
  );
}
