'use client';
import { useId, type ReactNode } from 'react';
import { CheckIcon } from '../core/icons';
import { cx } from '../lib/cx';
import { addDays, dayLabel, today as todayISO, type ISODate } from '../lib/dates';
import type { CalendarTone } from './MonthGrid';

export interface TimelineItem {
  id: string;
  title: ReactNode;
  /** A line under the title. */
  detail?: ReactNode;
  /** '14:11', or any short time text. */
  time?: string;
  /** Groups the timeline by day when items carry one. */
  date?: ISODate;
  /** The dot's colour: risk and failure tones only where they mean something. */
  tone?: CalendarTone;
  /** For a progress timeline: done, now (the current step) or next. */
  state?: 'done' | 'now' | 'next';
  /** Who did it, or a pill, after the title. */
  meta?: ReactNode;
  /** Buttons at the end of the row. */
  actions?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  /** Names the list ("Project history"). */
  label: string;
  /** Group by day with a sticky day heading. Default: when items have dates. */
  groupByDay?: boolean;
  today?: ISODate;
  /** Shown when there is nothing. */
  empty?: ReactNode;
  className?: string;
}

const STATE_TEXT = { done: 'Done', now: 'Now', next: 'Next' } as const;

/** What happened, in order: grouped by day (Today, Yesterday, Mon 6 Oct) with the day sticky as you
 * scroll, or a progress timeline of done, now and next steps. */
export function Timeline({ items, label, groupByDay, today = todayISO(), empty = 'Nothing yet.', className }: TimelineProps) {
  const uid = useId();
  if (!items.length) return <p className={cx('ar-timeline-empty', className)}>{empty}</p>;
  const group = groupByDay ?? items.some((i) => i.date);
  const nameOf = (d: ISODate) => (d === today ? 'Today' : d === addDays(today, -1) ? 'Yesterday' : d === addDays(today, 1) ? 'Tomorrow' : dayLabel(d));
  const row = (it: TimelineItem) => (
    <li key={it.id} className="ar-timeline-item" data-state={it.state} data-tone={it.tone ?? (it.state === 'now' ? 'accent' : 'neutral')} aria-current={it.state === 'now' ? 'step' : undefined}>
      <span className="ar-timeline-dot" aria-hidden="true">{it.state === 'done' && <CheckIcon size={11} strokeWidth={3} />}</span>
      <div className="ar-timeline-body">
        <div className="ar-timeline-line">
          {it.time && <time className="ar-timeline-time">{it.time}</time>}
          <span className="ar-timeline-title">{it.title}</span>
          {it.state && <span className="ar-visually-hidden">, {STATE_TEXT[it.state]}</span>}
          {it.meta && <span className="ar-timeline-meta">{it.meta}</span>}
        </div>
        {it.detail && <div className="ar-timeline-detail">{it.detail}</div>}
      </div>
      {it.actions && <div className="ar-timeline-actions">{it.actions}</div>}
    </li>
  );
  if (!group) return <ol className={cx('ar-timeline', className)} aria-label={label}>{items.map(row)}</ol>;
  const days: [string, TimelineItem[]][] = [];
  for (const it of items) {
    const k = it.date ?? '';
    const last = days[days.length - 1];
    if (last && last[0] === k) last[1].push(it); else days.push([k, [it]]);
  }
  return (
    <div className={cx('ar-timeline-days', className)} role="group" aria-label={label}>
      {days.map(([d, list]) => (
        <section key={d || 'undated'} aria-labelledby={`${uid}-${d}`} className="ar-timeline-day">
          <h3 id={`${uid}-${d}`} className="ar-timeline-dayname">{d ? nameOf(d) : 'No date'}</h3>
          <ol className="ar-timeline">{list.map(row)}</ol>
        </section>
      ))}
    </div>
  );
}
