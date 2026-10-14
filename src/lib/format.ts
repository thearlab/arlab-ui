// Plain-words formatting used across components. Sentence case, no em dashes, units always shown.

const MIN = 60_000, HOUR = 60 * MIN, DAY = 24 * HOUR;

/** "just now", "12 min ago", "3 h ago", "yesterday", "4 days ago", then a date. Future: "in 3 h". */
export function relativeTime(date: Date | string | number, now: Date | number = Date.now()): string {
  const t = new Date(date).getTime(), n = new Date(now).getTime();
  if (Number.isNaN(t)) return '';
  const d = n - t, a = Math.abs(d), fut = d < 0;
  const say = (s: string) => (fut ? `in ${s}` : `${s} ago`);
  if (a < MIN) return fut ? 'in a moment' : 'just now';
  if (a < HOUR) return say(`${Math.round(a / MIN)} min`);
  if (a < DAY) return say(`${Math.round(a / HOUR)} h`);
  const days = Math.round(a / DAY);
  if (days === 1) return fut ? 'tomorrow' : 'yesterday';
  if (days < 7) return say(`${days} days`);
  if (days < 30) { const w = Math.round(days / 7); return say(w === 1 ? 'a week' : `${w} weeks`); }
  return shortDate(t, n);
}

/** "14 Oct", or "14 Oct 2025" when not this year. */
export function shortDate(date: Date | string | number, now: Date | number = Date.now()): string {
  const d = new Date(date), n = new Date(now);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(d.getFullYear() !== n.getFullYear() ? { year: 'numeric' } : {}) }).replace('Sept', 'Sep');
}

/** 1394 -> "1,394". */
export const number = (n: number, digits = 0) => n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });

/** 12.5 -> "$12.50", 0.004 -> "<$0.01", 0 -> "$0.00". */
export function money(n: number, currency = 'USD'): string {
  if (n > 0 && n < 0.01) return '<$0.01';
  return n.toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** 1 -> "1 run", 3 -> "3 runs". */
export const plural = (n: number, one: string, many = one + 's') => `${number(n)} ${n === 1 ? one : many}`;

/** 1536 -> "1.5 KB". */
export function bytes(n: number): string {
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0; while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${i ? n.toFixed(n < 10 ? 1 : 0) : n} ${u[i]}`;
}

/** 130 -> "2 h 10 m". */
export function duration(minutes: number): string {
  const h = Math.floor(minutes / 60), m = Math.round(minutes % 60);
  return h ? `${h} h${m ? ` ${m} m` : ''}` : `${m} m`;
}

/** Initials from a name or an email: "Nadia Fares" -> "NF", "laure@x.com" -> "L". */
export function initials(name: string): string {
  const base = name.includes('@') ? name.split('@')[0] : name;
  return base.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || '?';
}

/** A stable category hue index (1 to 8) for a name, for avatars and swatches. */
export function hueIndex(s: string): number {
  let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (h % 8) + 1;
}
