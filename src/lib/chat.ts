// How a chat thread is grouped: a day separator when the day changes, and consecutive messages from
// one author within five minutes share one header. Pure, unit tested.

export interface ChatMessageLike { id: string; author?: string; from: 'me' | 'them'; time?: string | number | Date }
export interface ChatRow<T> { message: T; day: string | null; first: boolean; last: boolean }

const dayKey = (t: Date) => `${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;

export function dayTitle(time: string | number | Date, now: Date = new Date()): string {
  const d = new Date(time);
  if (dayKey(d) === dayKey(now)) return 'Today';
  const y = new Date(now); y.setDate(y.getDate() - 1);
  if (dayKey(d) === dayKey(y)) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', ...(d.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}) }).replace(',', '').replace('Sept', 'Sep');
}

export function groupMessages<T extends ChatMessageLike>(list: readonly T[], now: Date = new Date(), gapMs = 5 * 60_000): ChatRow<T>[] {
  const who = (m: T) => `${m.from}:${m.author ?? ''}`;
  return list.map((m, i) => {
    const prev = list[i - 1], next = list[i + 1];
    const t = m.time !== undefined ? new Date(m.time) : null;
    const pt = prev?.time !== undefined ? new Date(prev.time) : null;
    const nt = next?.time !== undefined ? new Date(next.time) : null;
    const newDay = !!t && (!pt || dayKey(pt) !== dayKey(t));
    const nextNewDay = !!nt && (!t || dayKey(t) !== dayKey(nt));
    const near = (a: Date | null, b: Date | null) => !a || !b || Math.abs(b.getTime() - a.getTime()) <= gapMs;
    const first = !prev || newDay || who(prev) !== who(m) || !near(pt, t);
    const last = !next || nextNewDay || who(next) !== who(m) || !near(t, nt);
    return { message: m, day: newDay && t ? dayTitle(t, now) : null, first, last };
  });
}
