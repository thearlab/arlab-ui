'use client';

import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { ChevronDownIcon } from './icons';

/** Fills whatever height its parent gives it (a flex-1/min-h-0 ancestor) so
 * columns can each scroll independently instead of growing the whole page —
 * the point of a status board with more than a handful of items per column. */
export function KanbanBoard({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-kanban', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface KanbanColumnProps {
  title: ReactNode;
  count?: number;
  children: ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
}

/** A fixed-width column, full board height, with its own independent
 * vertical scroll — the status-board shape (triage queues, pipeline stages,
 * any "N items grouped by state" view) generalized so any future ARLab tool
 * can reuse it. The header toggles the whole column collapsed (just the
 * header remains) so a busy column doesn't have to dominate the view. */
export function KanbanColumn({ title, count, children, className = '', defaultCollapsed = false }: KanbanColumnProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className={['arlab-kanban-col', collapsed ? 'collapsed' : '', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="arlab-kanban-col-header"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
      >
        <span className="arlab-kanban-col-title-group">
          <ChevronDownIcon size={14} className="arlab-kanban-col-chevron" />
          <h2 className="arlab-kanban-col-title">{title}</h2>
        </span>
        {count !== undefined ? <span className="arlab-kanban-col-count">{count}</span> : null}
      </button>
      {!collapsed ? <div className="arlab-kanban-col-body">{children}</div> : null}
    </div>
  );
}
