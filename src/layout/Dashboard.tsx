'use client';

import type { HTMLAttributes, ReactNode } from 'react';

export interface DashboardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The greeting and its sub line. */
  title?: ReactNode;
  sub?: ReactNode;
  /** Buttons at the right of the greeting. */
  actions?: ReactNode;
}

/** A composed home: a greeting row, then a 12-column grid of Panels sized by importance
 * (`<Panel span={7}>`). Collapses to one column under 1100px. */
export function Dashboard({ title, sub, actions, className = '', children, ...rest }: DashboardProps) {
  return (
    <div className={['arlab-dash', className].filter(Boolean).join(' ')} {...rest}>
      {title || actions ? (
        <div className="arlab-dash-hello">
          <div>
            {title ? <h1 className="arlab-dash-title">{title}</h1> : null}
            {sub ? <div className="arlab-dash-sub">{sub}</div> : null}
          </div>
          {actions ? <div className="arlab-dash-actions">{actions}</div> : null}
        </div>
      ) : null}
      <div className="arlab-dash-grid">{children}</div>
    </div>
  );
}

export interface AttentionItemProps {
  /** A small icon (the tile takes the warn tint by default, accent with `tone="accent"`). */
  icon?: ReactNode;
  tone?: 'warn' | 'accent';
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
}

/** One thing that needs a person: icon tile, title, one line under it, one action at the right. */
export function AttentionItem({ icon, tone = 'warn', title, sub, action }: AttentionItemProps) {
  return (
    <div className="arlab-att">
      {icon ? <span className={['arlab-att-icon', tone].join(' ')} aria-hidden="true">{icon}</span> : null}
      <div className="arlab-att-text">
        <b>{title}</b>
        {sub ? <span className="arlab-att-sub">{sub}</span> : null}
      </div>
      {action ? <span className="arlab-att-action">{action}</span> : null}
    </div>
  );
}

/** One line of activity: a mono time, then the sentence. */
export function ActivityItem({ time, children }: { time: ReactNode; children: ReactNode }) {
  return (
    <div className="arlab-act">
      <time className="arlab-act-time">{time}</time>
      <span className="arlab-act-text">{children}</span>
    </div>
  );
}
