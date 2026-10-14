'use client';
import { forwardRef, useEffect, useId, useState, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { hueIndex, initials, number, relativeTime } from '../lib/format';
import { CloseIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon } from '../core/icons';

export type Tone = 'neutral' | 'accent' | 'ok' | 'warn' | 'bad' | 'info';

// ---- Badge: a count ----
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count: number;
  /** red: something needs you (tabs, nav). neutral: a plain count. */
  tone?: 'alert' | 'neutral' | 'accent';
  max?: number;
  /** Read by screen readers instead of the bare number ("3 need you"). */
  label?: string;
}
/** A small count. Shows nothing for zero: a red badge only when something needs a look. */
export function Badge({ count, tone = 'neutral', max = 99, label, className, ...rest }: BadgeProps) {
  if (!count) return null;
  const text = count > max ? `${max}+` : number(count);
  return (
    <span className={cx('ar-badge', `ar-badge--${tone}`, className)} {...rest}>
      <span aria-hidden={label ? true : undefined}>{text}</span>
      {label && <span className="ar-visually-hidden">{label}</span>}
    </span>
  );
}

// ---- Pill: one fact or a status ----
export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** A dot before the text (status). */
  dot?: boolean;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}
/** One fact per pill: a status (ok, warn, bad, info), a kind, a count. Soft tints, never solid ink. */
export function Pill({ tone = 'neutral', dot, icon, size = 'md', className, children, ...rest }: PillProps) {
  return (
    <span className={cx('ar-pill', `ar-pill--${tone}`, size === 'sm' && 'ar-pill--sm', className)} {...rest}>
      {dot && <span className="ar-pill-dot" aria-hidden="true" />}
      {icon && <span className="ar-pill-icon" aria-hidden="true">{icon}</span>}
      <span className="ar-pill-text">{children}</span>
    </span>
  );
}

// ---- Chip: a filter that toggles, maybe removable ----
export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** On or off (aria-pressed). Leave undefined for a plain removable token. */
  selected?: boolean;
  onSelectedChange?: (on: boolean) => void;
  count?: number;
  /** Shows a remove button named "Remove <label>". */
  onRemove?: () => void;
  /** The text used to name the remove button. Defaults to children when it is a string. */
  removeLabel?: string;
  icon?: ReactNode;
}
/** A filter chip ("Not used 156"). Toggle with Space or Enter; the remove button is separate. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip({ selected, onSelectedChange, count, onRemove, removeLabel, icon, className, children, onClick, type = 'button', ...rest }, ref) {
  const name = removeLabel ?? (typeof children === 'string' ? children : 'this filter');
  return (
    <span className={cx('ar-chip', selected && 'ar-chip--on', onRemove && 'ar-chip--removable', className)}>
      <button ref={ref} type={type} className="ar-chip-main" aria-pressed={selected}
        onClick={(e) => { onClick?.(e); if (selected !== undefined) onSelectedChange?.(!selected); }} {...rest}>
        {icon && <span className="ar-chip-icon" aria-hidden="true">{icon}</span>}
        <span className="ar-chip-label">{children}</span>
        {count !== undefined && <span className="ar-chip-count">{number(count)}</span>}
      </button>
      {onRemove && <button type="button" className="ar-chip-x" aria-label={`Remove ${name}`} onClick={onRemove}><CloseIcon size={14} /></button>}
    </span>
  );
});

// ---- StatusDot ----
export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  tone: Tone;
  /** The words. Required unless the row already says it (then pass `label` for screen readers only). */
  children?: ReactNode;
  label?: string;
  pulse?: boolean;
}
/** A coloured dot with words: never colour alone. */
export function StatusDot({ tone, children, label, pulse, className, ...rest }: StatusDotProps) {
  return (
    <span className={cx('ar-status', `ar-status--${tone}`, className)} {...rest}>
      <span className={cx('ar-status-dot', pulse && 'ar-status-dot--pulse')} aria-hidden="true" />
      {children ?? (label && <span className="ar-visually-hidden">{label}</span>)}
    </span>
  );
}

// ---- Avatar ----
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** A name or an email: initials and the colour come from it, and it is the accessible name. */
  name: string;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | number;
  /** Hide from screen readers when the name is written next to it. */
  decorative?: boolean;
  /** Square-ish (an app or a client) instead of round (a person). */
  shape?: 'round' | 'square';
}
const SIZES = { xs: 18, sm: 24, md: 32, lg: 44 };
/** A face: the photo, or initials on the person's colour. */
export function Avatar({ name, src, size = 'md', decorative, shape = 'round', className, style, ...rest }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  const px = typeof size === 'number' ? size : SIZES[size];
  const st: CSSProperties = { ...style, width: px, height: px, background: `color-mix(in srgb, var(--hue-${hueIndex(name)}) 76%, #000)` };
  const scale = px < 22 ? 'xs' : px < 30 ? 'sm' : px < 40 ? 'md' : 'lg';
  return (
    <span className={cx('ar-avatar', `ar-avatar--${scale}`, shape === 'square' && 'ar-avatar--square', className)} style={st}
      role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : name} aria-hidden={decorative || undefined} title={decorative ? undefined : name} {...rest}>
      {src && !broken ? <img src={src} alt="" onError={() => setBroken(true)} /> : <span aria-hidden="true">{scale === 'xs' ? initials(name).slice(0, 1) : initials(name)}</span>}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLUListElement> {
  names: string[];
  max?: number;
  size?: AvatarProps['size'];
  /** Names the group for screen readers ("Team"). */
  label?: string;
}
/** Overlapping faces with a "+N" for the rest; the full list is read out. */
export function AvatarGroup({ names, max = 4, size = 'sm', label = 'People', className, ...rest }: AvatarGroupProps) {
  const shown = names.slice(0, names.length > max ? max - 1 : max), more = names.length - shown.length;
  const px = typeof size === 'number' ? size : SIZES[size];
  return (
    <ul className={cx('ar-avatars', className)} aria-label={`${label}: ${names.join(', ')}`} {...rest}>
      {shown.map((n) => <li key={n}><Avatar name={n} size={size} decorative /></li>)}
      {more > 0 && <li><span className={`ar-avatar ar-avatar--more ar-avatar--${px < 22 ? 'xs' : px < 30 ? 'sm' : px < 40 ? 'md' : 'lg'}`} aria-hidden="true" style={{ width: px, height: px }}>+{more}</span></li>}
    </ul>
  );
}

// ---- Progress ----
export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0..max. Leave undefined for indeterminate (work of unknown length). */
  value?: number;
  max?: number;
  /** Visible label above the bar; also the accessible name. */
  label: ReactNode;
  /** Text on the right: "3 of 8", "43%". Default: the percentage. */
  valueText?: string;
  tone?: 'accent' | 'ok' | 'warn' | 'bad';
  hideLabel?: boolean;
  size?: 'sm' | 'md';
}
export function Progress({ value, max = 100, label, valueText, tone = 'accent', hideLabel, size = 'md', className, ...rest }: ProgressProps) {
  const pct = value === undefined ? undefined : Math.max(0, Math.min(100, (value / max) * 100));
  const text = valueText ?? (pct === undefined ? undefined : `${Math.round(pct)}%`);
  const id = useId();
  return (
    <div className={cx('ar-progress', size === 'sm' && 'ar-progress--sm', className)} {...rest}>
      <div className={cx('ar-progress-head', hideLabel && 'ar-visually-hidden')}><span id={id}>{label}</span>{text && <span className="ar-progress-value">{text}</span>}</div>
      <div className={cx('ar-progress-track', `ar-progress--${tone}`)} role="progressbar" aria-labelledby={id}
        aria-valuemin={pct === undefined ? undefined : 0} aria-valuemax={pct === undefined ? undefined : max} aria-valuenow={value} aria-valuetext={text}>
        <i className={pct === undefined ? 'ar-progress-indeterminate' : undefined} style={pct === undefined ? undefined : { width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ---- Meter ----
export interface MeterProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  min?: number;
  max: number;
  /** The good range [low, high]: inside is ok, outside is warn; 0 (empty) is bad when `emptyIsBad`. */
  good?: [number, number];
  /** A higher value is worse (a budget): warn from `warnAt`, bad from `badAt`. */
  warnAt?: number;
  badAt?: number;
  emptyIsBad?: boolean;
  label: ReactNode;
  /** What the value means in words ("62 characters. Good length."). Shown and read out. */
  valueText: string;
  hideLabel?: boolean;
}
export function meterTone(p: Pick<MeterProps, 'value' | 'good' | 'warnAt' | 'badAt' | 'emptyIsBad'>): 'ok' | 'warn' | 'bad' {
  const { value: v, good, warnAt, badAt, emptyIsBad } = p;
  if (emptyIsBad && !v) return 'bad';
  if (badAt !== undefined && v >= badAt) return 'bad';
  if (warnAt !== undefined && v >= warnAt) return 'warn';
  if (good && (v < good[0] || v > good[1])) return 'warn';
  return 'ok';
}
/** A value against limits (a monthly cap, a title length). role=meter, with markers at the limits. */
export function Meter({ value, min = 0, max, good, warnAt, badAt, emptyIsBad, label, valueText, hideLabel, className, ...rest }: MeterProps) {
  const tone = meterTone({ value, good, warnAt, badAt, emptyIsBad });
  const at = (v: number) => `${Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100))}%`;
  const marks = [...(good ?? []), ...(warnAt !== undefined ? [warnAt] : []), ...(badAt !== undefined ? [badAt] : [])];
  const id = useId();
  return (
    <div className={cx('ar-meter', className)} {...rest}>
      <span id={id} className={cx('ar-meter-label', hideLabel && 'ar-visually-hidden')}>{label}</span>
      <div className="ar-meter-track" role="meter" aria-labelledby={id} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={valueText}>
        <i className={`ar-meter-fill ar-meter--${tone}`} style={{ width: at(value) }} />
        {marks.map((m, i) => <b key={i} className="ar-meter-mark" style={{ insetInlineStart: at(m) }} />)}
      </div>
      <span className={`ar-meter-text ar-meter-text--${tone}`} aria-hidden="true">{valueText}</span>
    </div>
  );
}

// ---- Facts: key-value ----
export interface FactsProps extends HTMLAttributes<HTMLDListElement> {
  items: Array<[ReactNode, ReactNode] | { label: ReactNode; value: ReactNode }>;
  columns?: 1 | 2;
  /** Label above value (compact) or beside it (default). */
  layout?: 'beside' | 'stacked';
}
/** Kind, Can reach, Made by: a description list. */
export function Facts({ items, columns = 1, layout = 'beside', className, ...rest }: FactsProps) {
  return (
    <dl className={cx('ar-facts', columns === 2 && 'ar-facts--2', layout === 'stacked' && 'ar-facts--stacked', className)} {...rest}>
      {items.map((it, i) => {
        const [k, v] = Array.isArray(it) ? it : [it.label, it.value];
        return <div key={i} className="ar-fact"><dt>{k}</dt><dd>{v ?? <span className="ar-muted">Not set</span>}</dd></div>;
      })}
    </dl>
  );
}

// ---- Timestamp ----
export interface TimestampProps extends HTMLAttributes<HTMLTimeElement> {
  date: Date | string | number;
  /** relative ("12 min ago", refreshes every minute) or a date ("14 Oct 2026, 09:02"). */
  format?: 'relative' | 'date' | 'datetime';
}
export function Timestamp({ date, format = 'relative', className, ...rest }: TimestampProps) {
  const d = new Date(date);
  const [, tick] = useState(0);
  useEffect(() => {
    if (format !== 'relative') return;
    const t = window.setInterval(() => tick((n) => n + 1), 60_000);
    return () => window.clearInterval(t);
  }, [format]);
  if (Number.isNaN(d.getTime())) return <span className="ar-muted">Not recorded</span>;
  const full = d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('Sept', 'Sep');
  const text = format === 'relative' ? relativeTime(d) : format === 'date' ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace('Sept', 'Sep') : full;
  return <time className={cx('ar-time', className)} dateTime={d.toISOString()} title={full} {...rest}>{text}</time>;
}

// ---- EmptyState ----
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional short heading ("No members yet"). */
  title?: ReactNode;
  /** One quiet sentence: what is not there, why, and what to do next. */
  children: ReactNode;
  action?: ReactNode;
  /** compact: a line inside a panel. */
  size?: 'md' | 'compact';
}
/** What is not here and what to do next. No illustration. */
export function EmptyState({ title, children, action, size = 'md', className, ...rest }: EmptyStateProps) {
  return (
    <div className={cx('ar-empty', size === 'compact' && 'ar-empty--compact', className)} {...rest}>
      {title && <p className="ar-empty-title">{title}</p>}
      <p className="ar-empty-text">{children}</p>
      {action && <div className="ar-empty-action">{action}</div>}
    </div>
  );
}

// ---- Skeletons ----
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  circle?: boolean;
}
/** A placeholder with the shape of what is coming. Decorative: announce loading elsewhere (aria-busy). */
export function Skeleton({ width = '100%', height = 14, radius, circle, className, style, ...rest }: SkeletonProps) {
  return <span aria-hidden="true" className={cx('ar-skel', className)} style={{ width, height, borderRadius: circle ? '50%' : radius, ...style }} {...rest} />;
}
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return <span className={cx('ar-skel-text', className)} aria-hidden="true">{Array.from({ length: lines }, (_, i) => <Skeleton key={i} width={i === lines - 1 && lines > 1 ? '62%' : '100%'} />)}</span>;
}
/** Rows of a list while it loads: an avatar or dot, a name and a meta line. Announces itself once. */
export function ListSkeleton({ rows = 4, avatar = true, label = 'Loading' }: { rows?: number; avatar?: boolean; label?: string }) {
  return (
    <div className="ar-list-skel" role="status" aria-label={label}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="ar-list-skel-row" aria-hidden="true">
          {avatar && <Skeleton width={30} height={30} circle />}
          <span className="ar-list-skel-text"><Skeleton width={`${60 - (i % 3) * 12}%`} height={12} /><Skeleton width={`${34 + (i % 2) * 10}%`} height={10} /></span>
          <Skeleton width={44} height={12} />
        </div>
      ))}
    </div>
  );
}

// ---- StatTile ----
export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** A change, in words and an arrow: { text: '12% on last week', direction: 'up', good: true }. */
  delta?: { text: string; direction: 'up' | 'down' | 'flat'; good?: boolean };
  /** A line of fine print under the number. */
  hint?: ReactNode;
  loading?: boolean;
  /** Turns the number red or amber when it needs a look ("3 failed"). */
  tone?: 'neutral' | 'warn' | 'bad';
}
/** A big tabular number with a small muted label. */
export function StatTile({ label, value, delta, hint, loading, tone = 'neutral', className, ...rest }: StatTileProps) {
  const dTone = !delta || delta.direction === 'flat' || delta.good === undefined ? 'neutral' : delta.good ? 'ok' : 'bad';
  return (
    <div className={cx('ar-stat', tone !== 'neutral' && `ar-stat--${tone}`, className)} aria-busy={loading || undefined} {...rest}>
      {loading ? <Skeleton width={96} height={28} /> : <b className="ar-stat-value">{value}</b>}
      <span className="ar-stat-label">{label}</span>
      {delta && !loading && (
        <span className={`ar-stat-delta ar-stat-delta--${dTone}`}>
          {delta.direction === 'up' ? <ArrowUpIcon size={13} /> : delta.direction === 'down' ? <ArrowDownIcon size={13} /> : <MinusIcon size={13} />}
          <span><span className="ar-visually-hidden">{delta.direction === 'up' ? 'Up' : delta.direction === 'down' ? 'Down' : 'No change'}: </span>{delta.text}</span>
        </span>
      )}
      {hint && <span className="ar-stat-hint">{hint}</span>}
    </div>
  );
}
