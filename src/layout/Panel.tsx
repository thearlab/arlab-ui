'use client';

import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The quiet uppercase heading. Omit for a bare panel. */
  title?: ReactNode;
  /** Right side of the heading: a count, a small button. */
  trailing?: ReactNode;
  /** The moment a person must act: accent border and heading. */
  gate?: boolean;
  /** No shadow (inside another surface). */
  quiet?: boolean;
  /** Dashboard grid span (4, 5, 7, 8 or 12 of 12). */
  span?: 4 | 5 | 7 | 8 | 12;
}

/** A group with a quiet uppercase heading. The unit of composition inside a detail body or a
 * dashboard; a Card is for a liftable object, a Panel groups content. */
export function Panel({ title, trailing, gate = false, quiet = false, span, className = '', children, ...rest }: PanelProps) {
  const cls = ['arlab-panel', gate ? 'gate' : '', quiet ? 'quiet' : '', span ? `span-${span}` : '', className].filter(Boolean).join(' ');
  return (
    <section className={cls} {...rest}>
      {title !== undefined ? (
        <h3 className="arlab-panel-title">
          <span>{title}</span>
          {trailing !== undefined ? <span className="arlab-panel-trailing">{trailing}</span> : null}
        </h3>
      ) : null}
      {children}
    </section>
  );
}

/** Padded content inside a Panel (rows and facts bring their own padding; prose and forms use this). */
export function PanelBody({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-panel-body', className].filter(Boolean).join(' ')} {...rest} />;
}

/** Divided rows inside a panel. */
export function Rows({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-rows', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface RowItemProps {
  children: ReactNode;
  /** Trailing content: badges, a value, a small button. */
  right?: ReactNode;
  onClick?: () => void;
}

/** One row: main content truncates, the right slot never shrinks. Clickable when onClick is given. */
export function RowItem({ children, right, onClick }: RowItemProps) {
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } };
  return (
    <div className={['arlab-row-item', onClick ? 'link' : ''].filter(Boolean).join(' ')} onClick={onClick} onKeyDown={onClick ? onKey : undefined} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <span className="arlab-row-item-main">{children}</span>
      {right !== undefined ? <span className="arlab-row-item-right">{right}</span> : null}
    </div>
  );
}

export interface FactsProps {
  items: { k: ReactNode; v: ReactNode }[];
}

/** Label / value pairs in a two-column grid. */
export function Facts({ items }: FactsProps) {
  return (
    <dl className="arlab-facts">
      {items.map((f, i) => (
        <div key={i} className="arlab-facts-row">
          <dt>{f.k}</dt>
          <dd>{f.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A sentence for an empty panel, and at most one action after it. */
export function EmptyNote({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="arlab-empty">
      <p>{children}</p>
      {action}
    </div>
  );
}

export type TimelineState = 'ok' | 'now' | 'waiting' | 'failed';
export interface TimelineItem {
  label: ReactNode;
  meta?: ReactNode;
  state: TimelineState;
}

/** A run's steps: a dot per state (done, running, waiting, failed), label, mono meta (duration). */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="arlab-timeline">
      {items.map((it, i) => (
        <div key={i} className="arlab-tl">
          <span className={['arlab-tl-dot', it.state].join(' ')} aria-hidden="true" />
          <span className="arlab-tl-label">{it.label}</span>
          <span className="arlab-tl-meta">{it.meta}</span>
        </div>
      ))}
    </div>
  );
}

export type StepMarker = 'gate' | 'ask' | 'repeat';
export interface StepListItem {
  name: ReactNode;
  sub?: ReactNode;
  trailing?: ReactNode;
  /** Numbered by default; gate (✓), ask (?) and repeat (↻) markers take the accent. */
  marker?: StepMarker;
  onClick?: () => void;
}

const MARK: Record<StepMarker, string> = { gate: '✓', ask: '?', repeat: '↻' };

/** The steps of a workflow or a master agent as rows: numbered agent steps, marked pauses. */
export function StepList({ items }: { items: StepListItem[] }) {
  let n = 0;
  return (
    <div className="arlab-steplist">
      {items.map((s, i) => {
        const marked = !!s.marker;
        if (!marked) n += 1;
        const onKey = (e: KeyboardEvent<HTMLDivElement>) => { if (s.onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); s.onClick(); } };
        return (
          <div key={i} className={['arlab-steprow', s.onClick ? 'link' : ''].filter(Boolean).join(' ')} onClick={s.onClick} onKeyDown={s.onClick ? onKey : undefined} role={s.onClick ? 'button' : undefined} tabIndex={s.onClick ? 0 : undefined}>
            <span className={['arlab-steprow-n', marked ? 'marked' : ''].filter(Boolean).join(' ')}>{marked ? MARK[s.marker!] : n}</span>
            <span className="arlab-steprow-text">
              <span className="arlab-steprow-name">{s.name}</span>
              {s.sub ? <span className="arlab-steprow-sub">{s.sub}</span> : null}
            </span>
            {s.trailing !== undefined ? <span className="arlab-steprow-trailing">{s.trailing}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
