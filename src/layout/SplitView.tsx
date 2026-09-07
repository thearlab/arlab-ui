'use client';

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { Skeleton } from '../Skeleton';

/** The master-detail workspace: a list pane beside a detail pane, filling the shell's content area. */
export function SplitView({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-split', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface ListPaneProps extends HTMLAttributes<HTMLDivElement> {
  /** Search, segmented control, chips: whatever filters the list. */
  tools?: ReactNode;
}

/** The left pane: a tools row on top, then the scrolling list (width --list-w). */
export function ListPane({ tools, className = '', children, ...rest }: ListPaneProps) {
  return (
    <div className={['arlab-pane', 'list', className].filter(Boolean).join(' ')} {...rest}>
      {tools ? <div className="arlab-pane-tools">{tools}</div> : null}
      <div className="arlab-pane-scroll">{children}</div>
    </div>
  );
}

/** The right pane: the selected object, usually a DetailHeader then a DetailBody. */
export function DetailPane({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-pane', 'detail', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface ListGroupProps {
  label: ReactNode;
  /** A CSS color value for the identity dot (a token like `var(--info)`); omit for no dot. */
  dot?: string;
}

/** A quiet uppercase group label inside a list pane, with an optional identity dot. */
export function ListGroup({ label, dot }: ListGroupProps) {
  return (
    <div className="arlab-list-group">
      {dot ? <span className="arlab-dot" style={{ background: dot }} aria-hidden="true" /> : null}
      {label}
    </div>
  );
}

export interface ListItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  selected?: boolean;
  /** Identity dot color (a token). Omit for the neutral dot. */
  dot?: string;
  title: ReactNode;
  sub?: ReactNode;
  trailing?: ReactNode;
}

/** One selectable item: dot, title, sub line, trailing slot. A button, so keyboard and focus come free.
 * The selected item raises and carries the accent edge. */
export function ListItem({ selected = false, dot, title, sub, trailing, className = '', ...rest }: ListItemProps) {
  return (
    <button type="button" className={['arlab-item', selected ? 'on' : '', className].filter(Boolean).join(' ')} aria-current={selected ? 'true' : undefined} {...rest}>
      <span className="arlab-item-dot" style={dot ? { background: dot } : undefined} aria-hidden="true" />
      <span className="arlab-item-title">{title}</span>
      <span className="arlab-item-trailing">{trailing}</span>
      {sub ? <span className="arlab-item-sub">{sub}</span> : null}
    </button>
  );
}

/** Placeholder rows mirroring ListItem while a list loads. */
export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="arlab-item-skeleton">
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={11} />
        </div>
      ))}
    </>
  );
}

/** One quiet sentence for an empty list pane. */
export function ListEmpty({ children }: { children: ReactNode }) {
  return <div className="arlab-list-empty">{children}</div>;
}
