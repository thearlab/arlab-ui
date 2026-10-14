'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '../core/Button';
import { IconButton } from '../core/IconButton';
import { ChevronLeftIcon, ChevronRightIcon } from '../core/icons';
import { cx } from '../lib/cx';
import { addDays, addMonths, dayLabel, monthGrid, monthName, sameMonth, startOfWeek, today as todayISO, weekdayNames, type ISODate } from '../lib/dates';

export type CalendarTone = 'neutral' | 'accent' | 'ok' | 'warn' | 'bad' | 'info';

/** The header every calendar shares: the period's name (announced when it changes), previous,
 * next and Today. */
export function CalendarHeader({ title, onPrev, onNext, onToday, prevLabel, nextLabel, compact, headingLevel = 2 }: {
  title: string; onPrev: () => void; onNext: () => void; onToday?: () => void; prevLabel: string; nextLabel: string; compact?: boolean; headingLevel?: 2 | 3 | 4;
}) {
  const H = `h${headingLevel}` as 'h2';
  return (
    <div className={cx('ar-cal-head', compact && 'is-compact')}>
      <H className="ar-cal-title" aria-live="polite">{title}</H>
      <div className="ar-cal-nav">
        {onToday && !compact && <Button size="sm" onClick={onToday}>Today</Button>}
        <IconButton size="sm" label={prevLabel} onClick={onPrev}><ChevronLeftIcon className="ar-cal-flip" /></IconButton>
        <IconButton size="sm" label={nextLabel} onClick={onNext}><ChevronRightIcon className="ar-cal-flip" /></IconButton>
      </div>
    </div>
  );
}

export interface MonthGridProps {
  /** Any day in the month shown. */
  month: ISODate;
  onMonthChange: (m: ISODate) => void;
  /** The day that holds keyboard focus (roving). */
  active: ISODate;
  onActiveChange: (d: ISODate) => void;
  selected?: ISODate | null;
  onPick: (d: ISODate) => void;
  weekStart?: number;
  min?: ISODate;
  max?: ISODate;
  today?: ISODate;
  compact?: boolean;
  /** Extra words for a day's accessible name ("2 events"). */
  describeDay?: (d: ISODate) => string | undefined;
  /** What goes in a cell under the day number. */
  renderDay?: (d: ISODate) => ReactNode;
  label: string;
}

/** A 6 x 7 month as an ARIA grid: one day takes focus at a time; arrows move by day and week,
 * Home and End to the week's ends, Page Up and Page Down by month, Enter or Space picks. */
export function MonthGrid({ month, onMonthChange, active, onActiveChange, selected, onPick, weekStart = 1, min, max, today = todayISO(), compact, describeDay, renderDay, label }: MonthGridProps) {
  const grid = monthGrid(month, weekStart);
  const names = weekdayNames(weekStart, 'short');
  const long = weekdayNames(weekStart, 'long');
  const ref = useRef<HTMLTableElement>(null);
  const viaKey = useRef(false);
  const out = (d: ISODate) => (min && d < min) || (max && d > max);

  useEffect(() => {
    if (!viaKey.current) return;
    viaKey.current = false;
    ref.current?.querySelector<HTMLElement>(`[data-day="${active}"]`)?.focus();
  }, [active, month]);

  const go = (d: ISODate) => {
    if (min && d < min) d = min;
    if (max && d > max) d = max;
    viaKey.current = true;
    onActiveChange(d);
    if (!sameMonth(d, month)) onMonthChange(d);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const h = rtl ? -1 : 1;
    const k = e.key;
    let d: ISODate | null = null;
    if (k === 'ArrowRight') d = addDays(active, h);
    else if (k === 'ArrowLeft') d = addDays(active, -h);
    else if (k === 'ArrowDown') d = addDays(active, 7);
    else if (k === 'ArrowUp') d = addDays(active, -7);
    else if (k === 'Home') d = startOfWeek(active, weekStart);
    else if (k === 'End') d = addDays(startOfWeek(active, weekStart), 6);
    else if (k === 'PageUp') d = addMonths(active, e.shiftKey ? -12 : -1);
    else if (k === 'PageDown') d = addMonths(active, e.shiftKey ? 12 : 1);
    if (!d) return;
    e.preventDefault(); go(d);
  };

  return (
    <table ref={ref} role="grid" aria-label={label} className={cx('ar-cal-grid', compact && 'is-compact')} onKeyDown={onKey}>
      <thead><tr>{names.map((n, i) => <th key={n} scope="col" abbr={long[i]}>{compact ? n.slice(0, 2) : n}</th>)}</tr></thead>
      <tbody>
        {grid.map((row) => (
          <tr key={row[0]}>
            {row.map((d) => {
              const inMonth = sameMonth(d, month), isSel = selected === d, isToday = d === today, disabled = !!out(d);
              const extra = describeDay?.(d);
              return (
                <td key={d} aria-selected={isSel} className={cx('ar-cal-cell', !inMonth && 'is-outside', isSel && 'is-selected', isToday && 'is-today')}>
                  <button type="button" data-day={d} tabIndex={d === active ? 0 : -1} disabled={disabled}
                    aria-current={isToday ? 'date' : undefined}
                    aria-label={`${dayLabel(d)}${isToday ? ', today' : ''}${extra ? `, ${extra}` : ''}`}
                    className="ar-cal-day" onClick={() => { onActiveChange(d); if (!inMonth) onMonthChange(d); onPick(d); }}>
                    {Number(d.slice(8))}
                  </button>
                  {renderDay?.(d)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const monthTitle = (m: ISODate) => monthName(m);
