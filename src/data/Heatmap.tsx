'use client';
import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { shade } from '../lib/chart';
import { Skeleton } from './Bits';

export interface HeatmapRow {
  key: string;
  label: string;
  /** One value per column. undefined = still loading (skeleton), null or 0 = nothing that day. */
  values: Array<number | null | undefined>;
}
export interface HeatmapColumn { key: string; label: string }

export interface HeatmapProps {
  /** Names the grid ("Agent spend by day"). */
  label: string;
  /** The first column's heading ("Agent"). */
  rowHeader: string;
  columns: HeatmapColumn[];
  rows: HeatmapRow[];
  format?: (v: number) => string;
  /** A totals row ("All") and a Total column. */
  totals?: boolean;
  /** Opens the side sheet for that item on that day. */
  onCellClick?: (row: HeatmapRow, column: HeatmapColumn, value: number) => void;
  maxHeight?: number;
}

/** The admin "Grid by day": rows by days, shaded by amount on a square-root scale, sticky name column
 * and header, totals, skeleton cells for days still loading. Arrow keys move between cells. */
export function Heatmap({ label, rowHeader, columns, rows, format = (v) => String(v), totals = true, onCellClick, maxHeight = 520 }: HeatmapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const max = Math.max(0, ...rows.flatMap((r) => r.values.map((v) => v ?? 0)));
  const colTotal = columns.map((_, c) => rows.reduce((a, r) => a + (r.values[c] ?? 0), 0));
  const rowTotal = (r: HeatmapRow) => r.values.reduce<number>((a, v) => a + (v ?? 0), 0);
  const grand = colTotal.reduce((a, v) => a + v, 0);
  const loadingCol = (c: number) => rows.some((r) => r.values[c] === undefined);
  const nRows = rows.length + (totals ? 1 : 0), nCols = columns.length + (totals ? 1 : 0);

  const onKey = (e: KeyboardEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-r]'); if (!el) return;
    let r = +el.dataset.r!, c = +el.dataset.c!;
    const rtl = getComputedStyle(el).direction === 'rtl';
    if (e.key === 'ArrowDown') r++; else if (e.key === 'ArrowUp') r--;
    else if (e.key === 'ArrowRight') c += rtl ? -1 : 1; else if (e.key === 'ArrowLeft') c += rtl ? 1 : -1;
    else if (e.key === 'Home') c = -1; else if (e.key === 'End') c = nCols - 1; else return;
    r = Math.max(0, Math.min(nRows - 1, r)); c = Math.max(-1, Math.min(nCols - 1, c));
    const t = ref.current?.querySelector<HTMLElement>(`[data-r="${r}"][data-c="${c}"]`);
    if (t) { e.preventDefault(); ref.current!.querySelectorAll<HTMLElement>('[data-r]').forEach((x) => { x.tabIndex = -1; }); t.tabIndex = 0; t.focus(); t.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }); }
  };

  const cell = (r: number, c: number, row: HeatmapRow | null, v: number | null | undefined, text: string, isTotal = false): ReactNode => {
    const first = r === 0 && c === 0;
    const common = { 'data-r': r, 'data-c': c, tabIndex: first ? 0 : -1 } as const;
    if (v === undefined) return <span {...common} className="ar-hm-cell" aria-label={`${text}, still loading`}><Skeleton width="70%" height={10} /></span>;
    const s = shade(v, max), st = { '--ar-hm': `${Math.round(8 + s * 54)}%` } as CSSProperties;
    const shown = v ? format(v) : '';
    if (v && row && onCellClick && !isTotal) {
      const col = columns[c];
      return <button type="button" {...common} className="ar-hm-cell ar-hm-fill" style={st} aria-label={`${text}, ${shown}`} onClick={() => onCellClick(row, col, v)}>{shown}</button>;
    }
    return <span {...common} className={cx('ar-hm-cell', v ? 'ar-hm-fill' : 'ar-hm-empty', isTotal && 'ar-hm-total')} style={v && !isTotal ? st : undefined} aria-label={`${text}, ${v ? shown : 'nothing'}`}>{shown}</span>;
  };

  return (
    <div className="ar-hm-box">
    <div ref={ref} className="ar-hm ar-scroll ar-scroll-x" data-scroll-x="" role="region" aria-label={label} style={{ maxHeight }} onKeyDown={onKey}>
      <table className="ar-hm-table" role="grid" aria-label={label} aria-rowcount={nRows + 1}>
        <thead>
          <tr>
            <th scope="col" className="ar-hm-name">{rowHeader}</th>
            {columns.map((c, i) => <th key={c.key} scope="col" className={cx(loadingCol(i) && 'is-loading')}>{c.label}</th>)}
            {totals && <th scope="col" className="ar-hm-tot">Total</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={row.key}>
              <th scope="row" className="ar-hm-name"><span {...{ 'data-r': r, 'data-c': -1 }} tabIndex={-1} className="ar-hm-rowname" title={row.label}>{row.label}</span></th>
              {columns.map((col, c) => <td key={col.key}>{cell(r, c, row, row.values[c], `${row.label}, ${col.label}`)}</td>)}
              {totals && <td className="ar-hm-tot">{cell(r, columns.length, row, rowTotal(row), `${row.label}, total`, true)}</td>}
            </tr>
          ))}
        </tbody>
        {totals && (
          <tfoot>
            <tr>
              <th scope="row" className="ar-hm-name"><span data-r={rows.length} data-c={-1} tabIndex={-1} className="ar-hm-rowname">All</span></th>
              {columns.map((col, c) => <td key={col.key}>{cell(rows.length, c, null, loadingCol(c) ? undefined : colTotal[c], `All, ${col.label}`, true)}</td>)}
              <td className="ar-hm-tot">{cell(rows.length, columns.length, null, grand, 'All, total', true)}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
    </div>
  );
}
