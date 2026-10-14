'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { layoutDay, minutes } from '../lib/calendar-layout';
import { addDays, addMonths, dayLabel, fromISO, sameMonth, toISO, today as todayISO, weekDays, type ISODate } from '../lib/dates';
import { CalendarHeader, MonthGrid, monthTitle, type CalendarTone } from './MonthGrid';

export interface CalendarEvent {
  id: string;
  title: string;
  /** The day it starts. */
  date: ISODate;
  /** Last day of a multi-day all-day event. */
  endDate?: ISODate;
  /** 'HH:MM'. Without it the event is all day. */
  start?: string;
  /** 'HH:MM'. Defaults to an hour after `start`. */
  end?: string;
  tone?: CalendarTone;
}

const onDay = (e: CalendarEvent, d: ISODate) => d >= e.date && d <= (e.endDate ?? e.date);
const sortEvents = (a: CalendarEvent, b: CalendarEvent) => (a.start ?? '') < (b.start ?? '') ? -1 : (a.start ?? '') > (b.start ?? '') ? 1 : a.title.localeCompare(b.title);
const when = (e: CalendarEvent) => (e.start ? `${e.start}${e.end ? ` to ${e.end}` : ''}` : 'all day');
const plural = (n: number) => `${n} ${n === 1 ? 'event' : 'events'}`;

// ---------------------------------------------------------------------------------------------
export interface CalendarMonthProps {
  events?: CalendarEvent[];
  /** Any day in the month shown. Controlled with `onMonthChange`. */
  month?: ISODate;
  defaultMonth?: ISODate;
  onMonthChange?: (month: ISODate) => void;
  /** The chosen day. Enter, Space or a click on a day picks it. */
  value?: ISODate | null;
  defaultValue?: ISODate | null;
  onChange?: (day: ISODate) => void;
  onEventClick?: (event: CalendarEvent) => void;
  /** Events shown per day before "+N more" (default 3). */
  maxPerDay?: number;
  /** 1 = Monday (default), 0 = Sunday. */
  weekStart?: number;
  today?: ISODate;
  /** Names the grid ("Team calendar"). */
  label?: string;
  className?: string;
}

/** A month of events. Pick a day with the keyboard (the grid) and show its events next to it; on a
 * phone the cells show dots instead of titles. */
export function CalendarMonth({ events = [], month, defaultMonth, onMonthChange, value, defaultValue = null, onChange, onEventClick, maxPerDay = 3, weekStart = 1, today = todayISO(), label = 'Calendar', className }: CalendarMonthProps) {
  const [sel, setSel] = useControllable<ISODate | null>(value, defaultValue, onChange as (d: ISODate | null) => void);
  const [m, setM] = useControllable<ISODate>(month, defaultMonth ?? sel ?? today, onMonthChange);
  const [active, setActive] = useState<ISODate>(sel && sameMonth(sel, m) ? sel : sameMonth(today, m) ? today : m.slice(0, 7) + '-01');
  const byDay = (d: ISODate) => events.filter((e) => onDay(e, d)).sort(sortEvents);
  const jump = (to: ISODate) => { setM(to); setActive(to.slice(0, 7) === today.slice(0, 7) ? today : to.slice(0, 7) + '-01'); };
  return (
    <div className={cx('ar-cal', 'ar-cal-month', className)}>
      <CalendarHeader title={monthTitle(m)} prevLabel="Previous month" nextLabel="Next month"
        onPrev={() => jump(addMonths(m, -1))} onNext={() => jump(addMonths(m, 1))} onToday={() => { setM(today); setActive(today); }} />
      <MonthGrid month={m} onMonthChange={setM} active={active} onActiveChange={setActive} selected={sel} onPick={(d) => setSel(d)} weekStart={weekStart} today={today} label={label}
        describeDay={(d) => { const n = byDay(d).length; return n ? plural(n) : undefined; }}
        renderDay={(d) => {
          const list = byDay(d); if (!list.length) return null;
          const more = list.length - maxPerDay;
          return (
            <div className="ar-cal-events">
              {list.slice(0, maxPerDay).map((e) => (
                <button key={e.id} type="button" tabIndex={-1} className="ar-cal-chip" data-tone={e.tone ?? 'accent'} title={`${e.title}, ${when(e)}`}
                  onClick={() => (onEventClick ? onEventClick(e) : setSel(d))}>
                  {e.start && <span className="ar-cal-chip-time">{e.start}</span>}<span className="ar-cal-chip-title">{e.title}</span>
                </button>
              ))}
              {more > 0 && <button type="button" tabIndex={-1} className="ar-cal-more" onClick={() => { setActive(d); setSel(d); }}>+{more} more</button>}
              <span className="ar-cal-dots" aria-hidden="true">{list.slice(0, 3).map((e) => <i key={e.id} data-tone={e.tone ?? 'accent'} />)}</span>
            </div>
          );
        }} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
export interface MiniCalendarProps {
  value?: ISODate | null;
  defaultValue?: ISODate | null;
  onChange?: (day: ISODate) => void;
  month?: ISODate;
  defaultMonth?: ISODate;
  onMonthChange?: (month: ISODate) => void;
  /** Days that get a dot (days with something on them). */
  marked?: ISODate[];
  min?: ISODate;
  max?: ISODate;
  weekStart?: number;
  today?: ISODate;
  label?: string;
  className?: string;
}

/** A compact month for side panels and pickers: pick a day, see which days have something on them. */
export function MiniCalendar({ value, defaultValue = null, onChange, month, defaultMonth, onMonthChange, marked = [], min, max, weekStart = 1, today = todayISO(), label = 'Choose a day', className }: MiniCalendarProps) {
  const [sel, setSel] = useControllable<ISODate | null>(value, defaultValue, onChange as (d: ISODate | null) => void);
  const [m, setM] = useControllable<ISODate>(month, defaultMonth ?? sel ?? today, onMonthChange);
  const [active, setActive] = useState<ISODate>(sel ?? (sameMonth(today, m) ? today : m.slice(0, 7) + '-01'));
  const marks = useMemo(() => new Set(marked), [marked]);
  const jump = (to: ISODate) => { setM(to); setActive(to.slice(0, 7) + '-01'); };
  return (
    <div className={cx('ar-cal', 'ar-cal-mini', className)}>
      <CalendarHeader compact headingLevel={3} title={monthTitle(m)} prevLabel="Previous month" nextLabel="Next month" onPrev={() => jump(addMonths(m, -1))} onNext={() => jump(addMonths(m, 1))} />
      <MonthGrid compact month={m} onMonthChange={setM} active={active} onActiveChange={setActive} selected={sel} onPick={(d) => setSel(d)} min={min} max={max} weekStart={weekStart} today={today} label={label}
        describeDay={(d) => (marks.has(d) ? 'has events' : undefined)}
        renderDay={(d) => (marks.has(d) ? <i className="ar-cal-mark" aria-hidden="true" /> : null)} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
export interface CalendarWeekProps {
  events?: CalendarEvent[];
  /** Any day in the week shown. */
  week?: ISODate;
  defaultWeek?: ISODate;
  onWeekChange?: (week: ISODate) => void;
  onEventClick?: (event: CalendarEvent) => void;
  weekStart?: number;
  /** First and last hour drawn (default 0 to 24). */
  startHour?: number;
  endHour?: number;
  /** Scrolled into view on open (default 8, the working day). */
  scrollToHour?: number;
  /** Pixel height of an hour (default 44). */
  hourHeight?: number;
  /** Height of the scrolling hour grid (default 560). */
  height?: number;
  /** Where the now line is drawn (default: the current time). */
  now?: Date;
  label?: string;
  className?: string;
}

/** A week: all-day events on top, timed events placed by start and end in an hour grid, overlapping
 * ones side by side, a line at now. On a phone it becomes a list of days. */
export function CalendarWeek({ events = [], week, defaultWeek, onWeekChange, onEventClick, weekStart = 1, startHour = 0, endHour = 24, scrollToHour = 8, hourHeight = 44, height = 560, now, label = 'Week', className }: CalendarWeekProps) {
  const [w, setW] = useControllable<ISODate>(week, defaultWeek ?? todayISO(), onWeekChange);
  const days = weekDays(w, weekStart);
  const body = useRef<HTMLDivElement>(null);
  const [clock, setClock] = useState<Date | null>(now ?? null);
  useEffect(() => { if (now) { setClock(now); return; } setClock(new Date()); const t = setInterval(() => setClock(new Date()), 60_000); return () => clearInterval(t); }, [now]);
  useEffect(() => { if (body.current) body.current.scrollTop = Math.max(0, (scrollToHour - startHour) * hourHeight - 12); }, [scrollToHour, startHour, hourHeight]);

  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const allDay = (d: ISODate) => events.filter((e) => !e.start && onDay(e, d));
  const timed = (d: ISODate) => events.filter((e) => e.start && e.date === d).map((e) => ({ ...e, end: e.end ?? addHour(e.start!) }));
  const nowDay = clock ? toISO(clock) : null;
  const nowMin = clock ? clock.getHours() * 60 + clock.getMinutes() : 0;
  const px = (min: number) => ((min - startHour * 60) / 60) * hourHeight;
  const first = fromISO(days[0])!, last = fromISO(days[6])!;
  const title = `${first.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} to ${last.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`.replace(/Sept/g, 'Sep');
  const tone = (e: CalendarEvent) => e.tone ?? 'accent';

  return (
    <div className={cx('ar-cal', 'ar-cal-week', className)} style={{ ['--ar-hour' as string]: `${hourHeight}px` }}>
      <CalendarHeader title={title} prevLabel="Previous week" nextLabel="Next week"
        onPrev={() => setW(addDays(w, -7))} onNext={() => setW(addDays(w, 7))} onToday={() => setW(todayISO())} />

      <div className="ar-cal-wframe">
      <div ref={body} className="ar-cal-wbody ar-scroll" style={{ maxHeight: height }} tabIndex={0} role="region" aria-label={`${label}, ${title}`}>
        <div className="ar-cal-wtop">
          <span className="ar-cal-gutter" aria-hidden="true" />
          {days.map((d) => (
            <div key={d} className={cx('ar-cal-wday', d === nowDay && 'is-today')}>
              <span className="ar-cal-wname">{fromISO(d)!.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
              <span className="ar-cal-wnum" aria-current={d === nowDay ? 'date' : undefined}>{Number(d.slice(8))}</span>
              <div className="ar-cal-allday">
                {allDay(d).map((e) => <button key={e.id} type="button" className="ar-cal-chip" data-tone={tone(e)} aria-label={`${e.title}, ${dayLabel(d)}, all day`} onClick={() => onEventClick?.(e)}><span className="ar-cal-chip-title">{e.title}</span></button>)}
              </div>
            </div>
          ))}
        </div>
        <div className="ar-cal-wgrid" style={{ height: hours.length * hourHeight }}>
          <div className="ar-cal-gutter" aria-hidden="true">{hours.map((h) => <span key={h} style={{ top: (h - startHour) * hourHeight }}>{h ? `${String(h).padStart(2, '0')}:00` : ''}</span>)}</div>
          {days.map((d) => {
            const list = timed(d), laid = layoutDay(list.map((e) => ({ id: e.id, start: e.start!, end: e.end! })));
            return (
              <div key={d} className="ar-cal-wcol" role="group" aria-label={`${dayLabel(d)}, ${plural(list.length)}`}>
                {laid.map((l) => {
                  const e = list.find((x) => x.id === l.id)!;
                  const top = Math.max(0, px(l.top)), bottom = Math.min(hours.length * hourHeight, px(l.top + l.height));
                  if (bottom <= 0 || top >= hours.length * hourHeight) return null;
                  return (
                    <button key={e.id} type="button" className="ar-cal-wevent" data-tone={tone(e)} data-short={bottom - top < 40 || undefined} onClick={() => onEventClick?.(e)}
                      style={{ top, height: Math.max(18, bottom - top - 2), insetInlineStart: `calc(${(l.lane / l.lanes) * 100}% + 2px)`, width: `calc(${100 / l.lanes}% - 4px)` }}>
                      <span className="ar-cal-wevent-title">{e.title}</span><span className="ar-cal-wevent-time">{bottom - top < 40 ? e.start : `${e.start} to ${e.end}`}</span>
                    </button>
                  );
                })}
                {d === nowDay && nowMin >= startHour * 60 && nowMin <= endHour * 60 && <span className="ar-cal-now" style={{ top: px(nowMin) }} aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </div>
      </div>

      <ol className="ar-cal-wlist" aria-label={`${label}, ${title}`}>
        {days.map((d) => {
          const list = events.filter((e) => onDay(e, d)).sort(sortEvents);
          return (
            <li key={d} className={cx('ar-cal-wlist-day', d === nowDay && 'is-today')}>
              <h3>{dayLabel(d)}{d === nowDay && <span className="ar-cal-today-pill">Today</span>}</h3>
              {list.length ? (
                <ul role="list">{list.map((e) => (
                  <li key={e.id}><button type="button" className="ar-cal-witem" data-tone={tone(e)} onClick={() => onEventClick?.(e)}>
                    <span className="ar-cal-witem-time">{e.start ? `${e.start} to ${e.end ?? addHour(e.start)}` : 'All day'}</span><span>{e.title}</span>
                  </button></li>
                ))}</ul>
              ) : <p className="ar-cal-none">Nothing on</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function addHour(t: string) { const m = Math.min(minutes(t) + 60, 24 * 60 - 1); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; }
