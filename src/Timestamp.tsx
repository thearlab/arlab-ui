const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

const rtf = typeof Intl !== 'undefined' ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }) : null;

/** Replaces the 6+ ad hoc `toLocaleString()` call sites found in
 * arlab-studio with one formatter. "Just now" below a minute, otherwise a
 * relative string ("3 days ago") up to a year, then the absolute date. */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const seconds = (Date.now() - d.getTime()) / 1000;
  if (seconds < 60) return 'Just now';
  for (const [unit, secondsInUnit] of UNITS) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return rtf ? rtf.format(-value, unit) : d.toLocaleDateString();
  }
  return d.toLocaleDateString();
}

export interface TimestampProps {
  date: Date | string | number;
  relative?: boolean;
}

/** Pair with Tooltip to show the exact timestamp on hover over a relative one. */
export function Timestamp({ date, relative = true }: TimestampProps) {
  const d = new Date(date);
  return (
    <time className="arlab-timestamp" dateTime={d.toISOString()} title={d.toLocaleString()}>
      {relative ? formatRelativeTime(d) : d.toLocaleDateString()}
    </time>
  );
}
