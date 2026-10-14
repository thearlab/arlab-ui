// Calendar maths for date pickers, month and week views, timelines and grids by day. Dates are
// local calendar days as 'YYYY-MM-DD' strings (no time zone surprises). Pure, unit tested.

export type ISODate = string;

export const pad = (n: number) => String(n).padStart(2, '0');
export const toISO = (d: Date): ISODate => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** 'YYYY-MM-DD' to a local Date at midnight, or null when not a real date. */
export function fromISO(s: string | null | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s ?? '');
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getMonth() === +m[2] - 1 && d.getDate() === +m[3] ? d : null;
}
export const today = (): ISODate => toISO(new Date());
export function addDays(s: ISODate, n: number): ISODate { const d = fromISO(s)!; d.setDate(d.getDate() + n); return toISO(d); }
export function addMonths(s: ISODate, n: number): ISODate {
  const d = fromISO(s)!; const day = d.getDate();
  d.setDate(1); d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last)); return toISO(d);
}
export const sameMonth = (a: ISODate, b: ISODate) => a.slice(0, 7) === b.slice(0, 7);
export const compare = (a: ISODate, b: ISODate) => (a < b ? -1 : a > b ? 1 : 0);
export const daysBetween = (a: ISODate, b: ISODate) => Math.round((fromISO(b)!.getTime() - fromISO(a)!.getTime()) / 86_400_000);

/** The first day of the week containing `s`. weekStart: 1 = Monday (ARLAB default), 0 = Sunday. */
export function startOfWeek(s: ISODate, weekStart = 1): ISODate {
  const d = fromISO(s)!; const diff = (d.getDay() - weekStart + 7) % 7; return addDays(s, -diff);
}
/** The 7 days of the week containing `s`. */
export const weekDays = (s: ISODate, weekStart = 1): ISODate[] => Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(s, weekStart), i));

/** A month as 6 rows of 7 days (always 42 cells, so the grid never jumps height). */
export function monthGrid(s: ISODate, weekStart = 1): ISODate[][] {
  const first = s.slice(0, 7) + '-01';
  const start = startOfWeek(first, weekStart);
  return Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => addDays(start, r * 7 + c)));
}

/** Short weekday names in order: Mon .. Sun. */
export function weekdayNames(weekStart = 1, style: 'short' | 'narrow' | 'long' = 'short', locale = 'en-GB'): string[] {
  return Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + ((weekStart - 1 + i + 7) % 7)).toLocaleDateString(locale, { weekday: style }));
}
export const monthName = (s: ISODate, locale = 'en-GB') => fromISO(s)!.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
/** "Tue 14 Oct" */
export const dayLabel = (s: ISODate, locale = 'en-GB') => fromISO(s)!.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '').replace('Sept', 'Sep');
/** The last n days, oldest first, ending today (grid by day columns). */
export const lastDays = (n: number, end: ISODate = today()): ISODate[] => Array.from({ length: n }, (_, i) => addDays(end, i - n + 1));

/** Parse what a person typed: '14/10/2026', '14 Oct 2026', '2026-10-14'. Day first (en-GB). */
export function parseDate(text: string): ISODate | null {
  const t = text.trim();
  if (fromISO(t)) return t;
  let m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/.exec(t);
  if (m) { const y = m[3].length === 2 ? 2000 + +m[3] : +m[3]; const iso = `${y}-${pad(+m[2])}-${pad(+m[1])}`; return fromISO(iso) ? iso : null; }
  m = /^(\d{1,2})\s+([a-z]{3,})\.?\s+(\d{4})$/i.exec(t);
  if (m) {
    const mi = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(m[2].slice(0, 3).toLowerCase());
    if (mi < 0) return null; const iso = `${m[3]}-${pad(mi + 1)}-${pad(+m[1])}`; return fromISO(iso) ? iso : null;
  }
  return null;
}

/** 'HH:MM' 24 h, or null. Accepts '9', '9:5', '0930', '9.30', '9:30 pm'. */
export function parseTime(text: string): string | null {
  const m = /^(\d{1,2})(?:[:.h]?(\d{2}))?\s*(am|pm)?$/i.exec(text.trim().replace(/\s+/g, ' '));
  if (!m) return null;
  let h = +m[1]; const min = m[2] ? +m[2] : 0; const ap = m[3]?.toLowerCase();
  if (ap) { if (h < 1 || h > 12) return null; h = (h % 12) + (ap === 'pm' ? 12 : 0); }
  if (h > 23 || min > 59) return null;
  return `${pad(h)}:${pad(min)}`;
}
