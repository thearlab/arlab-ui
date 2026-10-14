'use client';
import { useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { linear, niceTicks, smoothPath } from '../lib/chart';

export interface ChartPoint {
  label: string;
  /** null = not loaded yet or missing (drawn short and grey, said in the table). */
  value: number | null;
}

interface ChartBase {
  /** What the chart shows ("Spend by day"). Its accessible name. */
  title: string;
  /** One line with the main message ("Spend peaked on 11 Oct at $8.67"). Shown under the chart when `showSummary`. */
  summary?: string;
  showSummary?: boolean;
  data: ChartPoint[];
  format?: (v: number) => string;
  height?: number;
  className?: string;
}

function useWidth<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    setW(el.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setW(el.clientWidth)); ro.observe(el); return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/** The same numbers as a table, for screen readers. */
function DataTableHidden({ title, data, format }: { title: string; data: ChartPoint[]; format: (v: number) => string }) {
  return (
    <table className="ar-visually-hidden">
      <caption>{title}</caption>
      <thead><tr><th scope="col">When</th><th scope="col">Value</th></tr></thead>
      <tbody>{data.map((d, i) => <tr key={i}><th scope="row">{d.label}</th><td>{d.value === null ? 'Not loaded' : format(d.value)}</td></tr>)}</tbody>
    </table>
  );
}

/** Which x labels to print so they never collide: all when few, else first, middle, last. */
const tickIdx = (n: number, w: number) => (n <= Math.max(2, Math.floor(w / 56)) ? Array.from({ length: n }, (_, i) => i) : [0, Math.floor((n - 1) / 2), n - 1]);

export interface BarChartProps extends ChartBase {
  /** The bar to draw in full accent (today); the rest are softer. */
  highlight?: number;
  /** Failures in the error colour. */
  tone?: 'accent' | 'bad';
}

/** Bars by day. Value labels above the bars when there are 10 or fewer. */
export function BarChart({ title, summary, showSummary = false, data, format = (v) => String(v), height = 160, highlight, tone = 'accent', className }: BarChartProps) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const max = Math.max(0, ...data.map((d) => d.value ?? 0));
  const ticks = niceTicks(max, 3), top = ticks[ticks.length - 1] || 1;
  const pad = { t: data.length <= 10 ? 18 : 6, b: 22 };
  const y = linear(0, top, height - pad.b, pad.t);
  const n = data.length, slot = n ? w / n : 0, bw = Math.max(2, Math.min(36, slot * 0.62));
  return (
    <figure className={cx('ar-chart', className)}>
      <div ref={ref} className="ar-chart-box" style={{ height: n ? height : 0 }} hidden={!n}>
        {w > 0 && (
          <svg width={w} height={height} aria-hidden="true">
            {ticks.slice(1).map((t) => <line key={t} className="ar-chart-grid" x1={0} x2={w} y1={y(t)} y2={y(t)} />)}
            <line className="ar-chart-axis" x1={0} x2={w} y1={height - pad.b} y2={height - pad.b} />
            {data.map((d, i) => {
              const x = i * slot + (slot - bw) / 2;
              if (d.value === null) return <rect key={i} className="ar-chart-missing" x={x} y={height - pad.b - 6} width={bw} height={6} rx={2} />;
              const h = Math.max(d.value > 0 ? 2 : 0, height - pad.b - y(d.value));
              return (
                <g key={i}>
                  <rect className={cx('ar-chart-bar', `ar-chart-bar--${tone}`, highlight !== undefined && highlight !== i && 'is-soft')} x={x} y={height - pad.b - h} width={bw} height={h} rx={Math.min(4, bw / 3)} />
                  {n <= 10 && d.value > 0 && <text className="ar-chart-val" x={x + bw / 2} y={height - pad.b - h - 5} textAnchor="middle">{format(d.value)}</text>}
                </g>
              );
            })}
            {tickIdx(n, w).map((i) => <text key={i} className="ar-chart-x" x={i * slot + slot / 2} y={height - 6} textAnchor={n > 2 && i === 0 ? 'start' : n > 2 && i === n - 1 ? 'end' : 'middle'} dx={n > 2 && i === 0 ? -(slot / 2 - 2) : n > 2 && i === n - 1 ? slot / 2 - 2 : 0}>{data[i].label}</text>)}
          </svg>
        )}
      </div>
      {summary && <figcaption className={cx('ar-chart-summary', !showSummary && 'ar-visually-hidden')}>{summary}</figcaption>}
      <DataTableHidden title={title} data={data} format={format} />
    </figure>
  );
}

export interface LineChartProps extends ChartBase {
  /** The "Now" marker at this index. */
  now?: number;
  /** Shown in the tooltip after the value ("h"). */
  unit?: string;
}

/** A smooth line with a faint fill and one Now marker. Hover or focus (then arrows) to read points. */
export function LineChart({ title, summary, showSummary = false, data, format = (v) => String(v), height = 160, now, className }: LineChartProps) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const gid = useId().replace(/:/g, '');
  const vals = data.map((d) => d.value ?? 0);
  const ticks = niceTicks(Math.max(0, ...vals), 2), top = ticks[ticks.length - 1] || 1;
  const pad = { l: 34, r: 10, t: 16, b: 22 };
  const x = linear(0, Math.max(1, data.length - 1), pad.l, Math.max(pad.l + 1, w - pad.r));
  const y = linear(0, top, height - pad.b, pad.t);
  const pts = data.map((d, i) => [x(i), y(d.value ?? 0)] as [number, number]);
  const line = smoothPath(pts);
  const area = pts.length ? `${line} L${pts[pts.length - 1][0]},${height - pad.b} L${pts[0][0]},${height - pad.b} Z` : '';
  const onKey = (e: KeyboardEvent) => {
    if (!data.length) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const d = e.key === 'ArrowRight' ? (rtl ? -1 : 1) : e.key === 'ArrowLeft' ? (rtl ? 1 : -1) : 0;
    if (e.key === 'Home') { e.preventDefault(); setActive(0); return; }
    if (e.key === 'End') { e.preventDefault(); setActive(data.length - 1); return; }
    if (!d) return; e.preventDefault();
    setActive((a) => Math.max(0, Math.min(data.length - 1, (a ?? (d > 0 ? -1 : data.length)) + d)));
  };
  const a = active !== null ? data[active] : null;
  return (
    <figure className={cx('ar-chart', className)}>
      <div ref={ref} className="ar-chart-box ar-chart-box--focus" style={{ height }} tabIndex={0} role="group" aria-label={`${title}. Use the arrow keys to read each point.`}
        onKeyDown={onKey} onBlur={() => setActive(null)} onPointerLeave={() => setActive(null)}
        onPointerMove={(e) => { if (!w || !data.length) return; const r = e.currentTarget.getBoundingClientRect(); const i = Math.round(((e.clientX - r.left - pad.l) / Math.max(1, w - pad.l - pad.r)) * (data.length - 1)); setActive(Math.max(0, Math.min(data.length - 1, i))); }}>
        {w > 0 && (
          <svg width={w} height={height} aria-hidden="true">
            <defs><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".22" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
            {ticks.map((t) => <text key={t} className="ar-chart-y" x={pad.l - 6} y={y(t) + 3} textAnchor="end">{format(t)}</text>)}
            {area && <path d={area} fill={`url(#${gid})`} />}
            {line && <path d={line} className="ar-chart-line" />}
            {now !== undefined && pts[now] && <circle className="ar-chart-now" cx={pts[now][0]} cy={pts[now][1]} r={4.5} />}
            {active !== null && pts[active] && <><line className="ar-chart-cursor" x1={pts[active][0]} x2={pts[active][0]} y1={pad.t} y2={height - pad.b} /><circle className="ar-chart-point" cx={pts[active][0]} cy={pts[active][1]} r={4} /></>}
            {tickIdx(data.length, w - pad.l).map((i) => <text key={i} className="ar-chart-x" x={pts[i][0]} y={height - 6} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}>{data[i].label}</text>)}
          </svg>
        )}
        {a && active !== null && pts[active] && (
          <div className="ar-chart-tip" style={{ insetInlineStart: Math.min(Math.max(0, pts[active][0] - 50), Math.max(0, w - 110)), top: Math.max(0, pts[active][1] - 44) }} aria-hidden="true">
            <b>{a.value === null ? 'Not loaded' : format(a.value)}</b><span>{a.label}</span>
          </div>
        )}
      </div>
      <span className="ar-visually-hidden" aria-live="polite">{a ? `${a.label}: ${a.value === null ? 'not loaded' : format(a.value)}${now === active ? ', now' : ''}` : ''}</span>
      {summary && <figcaption className={cx('ar-chart-summary', !showSummary && 'ar-visually-hidden')}>{summary}</figcaption>}
      <DataTableHidden title={title} data={data} format={format} />
    </figure>
  );
}

export interface SparklineProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  values: Array<number | null>;
  /** Required summary, read instead of the drawing ("30 days, 241 runs, peak 34 on 12 Oct"). */
  label: string;
  variant?: 'bars' | 'line';
  width?: number;
  height?: number;
}
/** A tiny trend inside a row. Bars by default (one per day). */
export function Sparkline({ values, label, variant = 'bars', width = 72, height = 22, className, ...rest }: SparklineProps) {
  const max = Math.max(0, ...values.map((v) => v ?? 0)) || 1;
  const n = values.length, slot = n ? width / n : 0;
  return (
    <span className={cx('ar-spark', className)} role="img" aria-label={label} {...rest}>
      <svg width={width} height={height} aria-hidden="true">
        {variant === 'bars'
          ? values.map((v, i) => { const h = v ? Math.max(1.5, (v / max) * (height - 2)) : 1; return <rect key={i} className={v ? 'ar-spark-bar' : 'ar-spark-empty'} x={i * slot + slot * 0.15} y={height - h} width={Math.max(1, slot * 0.7)} height={h} rx={0.8} />; })
          : <path className="ar-spark-line" d={smoothPath(values.map((v, i) => [n > 1 ? (i / (n - 1)) * (width - 2) + 1 : width / 2, height - 1 - ((v ?? 0) / max) * (height - 3)]))} />}
      </svg>
    </span>
  );
}

export interface LegendProps extends HTMLAttributes<HTMLUListElement> {
  items: Array<{ label: ReactNode; tone?: 'accent' | 'bad' | 'ok' | 'warn' | 'info' | 'muted'; value?: ReactNode }>;
}
/** Series names with their swatch. Use only when a chart has more than one series. */
export function Legend({ items, className, ...rest }: LegendProps) {
  return (
    <ul className={cx('ar-legend', className)} {...rest}>
      {items.map((it, i) => <li key={i}><span className={`ar-legend-sw ar-legend-sw--${it.tone ?? 'accent'}`} aria-hidden="true" />{it.label}{it.value !== undefined && <b>{it.value}</b>}</li>)}
    </ul>
  );
}
