'use client';

import type { HTMLAttributes, ReactNode } from 'react';

export function KanbanBoard({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-kanban', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface KanbanColumnProps {
  title: ReactNode;
  count?: number;
  children: ReactNode;
  className?: string;
}

/** A fixed-width vertical stack under a typographic header — the status-board
 * shape (triage queues, pipeline stages, any "N items grouped by state" view)
 * generalized out of the email classifier so any future ARLab tool can reuse
 * it instead of re-deriving the same column layout. */
export function KanbanColumn({ title, count, children, className = '' }: KanbanColumnProps) {
  return (
    <div className={['arlab-kanban-col', className].filter(Boolean).join(' ')}>
      <div className="arlab-kanban-col-header">
        <h2 className="arlab-kanban-col-title">{title}</h2>
        {count !== undefined ? <span className="arlab-kanban-col-count">{count}</span> : null}
      </div>
      <div className="arlab-kanban-col-body">{children}</div>
    </div>
  );
}
