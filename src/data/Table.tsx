'use client';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode, type ThHTMLAttributes } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { sortBy, windowRange, selectionState, type SortDir } from '../lib/chart';
import { plural } from '../lib/format';
import { Button } from '../core/Button';
import { SortIcon, ArrowUpIcon, ArrowDownIcon } from '../core/icons';
import { Skeleton, EmptyState } from './Bits';

// ---- Table: the styled primitive ----
export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Names the table and its scroll region. */
  label: string;
  /** Height of the scroll box; the header sticks inside it. Default: no limit (page scrolls, header sticks to the page). */
  maxHeight?: number | string;
  /** Rows sit tight (32px) instead of comfortable. */
  dense?: boolean;
  wrapClassName?: string;
}
/** A table in its own scroll box: sticky header, edge gutters, hover. Wide tables scroll sideways inside. */
export function Table({ label, maxHeight, dense, className, wrapClassName, children, ...rest }: TableProps) {
  return (
    <div className={cx('ar-table-box', wrapClassName)}>
      <div className="ar-table-wrap ar-scroll ar-scroll-x" data-scroll-x="" role="region" aria-label={label} tabIndex={0} style={maxHeight ? { maxHeight } : undefined}>
        <table className={cx('ar-table', dense && 'ar-table--dense', className)} aria-label={label} {...rest}>{children}</table>
      </div>
    </div>
  );
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** The row opens something: click, or Enter when focused. */
  onOpen?: () => void;
  selected?: boolean;
}
export function TableRow({ onOpen, selected, className, onKeyDown, onClick, ...rest }: TableRowProps) {
  return (
    <tr className={cx(onOpen && 'ar-tr--open', selected && 'ar-tr--selected', className)} tabIndex={onOpen ? 0 : undefined} aria-selected={selected}
      onClick={(e) => { onClick?.(e); if (onOpen && !(e.target as HTMLElement).closest('button, a, input, label, [data-stop]')) onOpen(); }}
      onKeyDown={(e) => { onKeyDown?.(e); if (onOpen && e.key === 'Enter' && e.target === e.currentTarget) { e.preventDefault(); onOpen(); } }} {...rest} />
  );
}

export interface SortHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'onClick' | 'align' | 'dir'> {
  /** This column's sort: ascending, descending or not sorted. */
  dir: SortDir | null;
  onSort: () => void;
  align?: 'start' | 'end';
  /** Rendered after the sort button (a resize handle). */
  after?: ReactNode;
}
/** A sortable column head: a button in the th, aria-sort on the th. */
export function SortHead({ dir, onSort, align, after, className, children, ...rest }: SortHeadProps) {
  return (
    <th aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'} className={cx(align === 'end' && 'ar-th--end', className)} {...rest}>
      <button type="button" className="ar-sorthead" onClick={onSort}>
        <span>{children}</span>
        <span className={cx('ar-sorthead-icon', dir && 'is-on')} aria-hidden="true">{dir === 'asc' ? <ArrowUpIcon size={13} /> : dir === 'desc' ? <ArrowDownIcon size={13} /> : <SortIcon size={13} />}</span>
      </button>
      {after}
    </th>
  );
}

// ---- DataTable: columns config, sort, select, actions, virtual, resize, states ----
export interface DataColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Makes the column sortable by this value. */
  sortValue?: (row: T) => unknown;
  align?: 'start' | 'end';
  /** Starting width in px (resizable tables); otherwise the browser decides. */
  width?: number;
  /** Hide below this width of the window: 'phone' (640) or 'tablet' (820). */
  hideBelow?: 'phone' | 'tablet';
  /** The row header (usually the name column): th scope=row. */
  rowHeader?: boolean;
}

export interface DataTableSort { key: string; dir: SortDir }

export interface DataTableProps<T> {
  rows: T[];
  columns: DataColumn<T>[];
  rowKey: (row: T) => string;
  label: string;
  /** Words for a row in labels ("Select scout-rate"). */
  rowLabel?: (row: T) => string;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (s: DataTableSort | null) => void;
  /** The rows are already sorted by the server: do not sort them here. */
  manualSort?: boolean;
  selectable?: boolean;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  /** Actions shown next to the count when rows are ticked. */
  selectionActions?: (keys: string[]) => ReactNode;
  /** Last cell of each row: an icon button or a menu. */
  rowActions?: (row: T) => ReactNode;
  onRowOpen?: (row: T) => void;
  /** The chosen row (an open sheet). */
  activeKey?: string | null;
  loading?: boolean;
  /** Fetching the next batch: skeleton rows at the end. */
  loadingMore?: boolean;
  onEndReached?: () => void;
  error?: ReactNode;
  onRetry?: () => void;
  empty?: ReactNode;
  /** Render only the rows in view (long lists). Needs `rowHeight` and a `maxHeight`. Auto above 200 rows. */
  virtual?: boolean;
  rowHeight?: number;
  maxHeight?: number;
  resizable?: boolean;
  dense?: boolean;
}

const BELOW = { phone: 640, tablet: 820 };

export function DataTable<T>(p: DataTableProps<T>) {
  const { rows, columns, rowKey, label, rowLabel, manualSort, selectable, rowActions, onRowOpen, activeKey, loading, loadingMore, onEndReached, error, onRetry, empty, resizable, dense } = p;
  const rowHeight = p.rowHeight ?? (dense ? 36 : 48);
  const maxHeight = p.maxHeight ?? (p.virtual || rows.length > 200 ? 560 : undefined);
  const virtual = (p.virtual ?? rows.length > 200) && !!maxHeight;
  const [sort, setSort] = useControllable<DataTableSort | null>(p.sort, p.defaultSort ?? null, p.onSortChange);
  const [selected, setSelected] = useControllable<string[]>(p.selected, p.defaultSelected ?? [], p.onSelectedChange);
  const [widths, setWidths] = useState<Record<string, number>>(() => Object.fromEntries(columns.filter((c) => c.width).map((c) => [c.key, c.width!])));
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1280 : window.innerWidth));
  useEffect(() => { const on = () => setVw(window.innerWidth); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  const cols = columns.filter((c) => !c.hideBelow || vw >= BELOW[c.hideBelow]);

  const sorted = useMemo(() => {
    if (!sort || manualSort) return rows;
    const c = columns.find((x) => x.key === sort.key);
    return c?.sortValue ? sortBy(rows, c.sortValue, sort.dir) : rows;
  }, [rows, sort, manualSort, columns]);

  const wrap = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ top: 0, h: maxHeight ?? 560 });
  const win = virtual ? windowRange(scroll.top, scroll.h, rowHeight, sorted.length) : { start: 0, end: sorted.length, before: 0, after: 0 };
  const visible = sorted.slice(win.start, win.end);
  const focusKey = useRef<string | null>(null);
  useEffect(() => {
    // A focused row scrolled out of the window is unmounted: keep the keyboard in the table.
    if (virtual && focusKey.current && !visible.some((r) => rowKey(r) === focusKey.current) && document.activeElement === document.body) wrap.current?.focus({ preventScroll: true });
  });

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!onEndReached || !sentinel.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) onEndReached(); }, { root: maxHeight ? wrap.current : null, rootMargin: '200px' });
    io.observe(sentinel.current); return () => io.disconnect();
  }, [onEndReached, maxHeight, sorted.length]);

  const allKeys = sorted.map(rowKey);
  const head = selectionState(selected.filter((k) => allKeys.includes(k)).length, allKeys.length);
  const headBox = useRef<HTMLInputElement>(null);
  useEffect(() => { if (headBox.current) headBox.current.indeterminate = head === 'mixed'; }, [head]);
  const toggle = (k: string) => setSelected(selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k]);
  const span = cols.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);
  const nextSort = (key: string) => setSort(sort?.key !== key ? { key, dir: 'asc' } : sort.dir === 'asc' ? { key, dir: 'desc' } : null);

  const onRowsKey = (e: KeyboardEvent<HTMLTableSectionElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const tr = (e.target as HTMLElement).closest('tr'); if (!tr || e.target !== tr) return;
    const i = Number(tr.dataset.index) + (e.key === 'ArrowDown' ? 1 : -1);
    if (i < 0 || i >= sorted.length) return;
    e.preventDefault();
    const go = () => wrap.current?.querySelector<HTMLElement>(`tr[data-index="${i}"]`)?.focus();
    const el = wrap.current?.querySelector<HTMLElement>(`tr[data-index="${i}"]`);
    if (el) { el.focus(); el.scrollIntoView({ block: 'nearest' }); }
    else if (wrap.current) { wrap.current.scrollTop = Math.max(0, i * rowHeight - scroll.h / 2); requestAnimationFrame(go); }
  };

  const resizeKey = (key: string, e: KeyboardEvent) => {
    const w = widths[key] ?? 160;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setWidths({ ...widths, [key]: Math.max(64, w + (e.key === 'ArrowRight' ? 16 : -16)) }); }
  };
  const startDrag = (key: string, e: RPointerEvent) => {
    const th = (e.currentTarget as HTMLElement).closest('th')!; const x0 = e.clientX, w0 = th.getBoundingClientRect().width;
    const rtl = getComputedStyle(th).direction === 'rtl';
    const move = (ev: PointerEvent) => setWidths((ws) => ({ ...ws, [key]: Math.max(64, Math.round(w0 + (ev.clientX - x0) * (rtl ? -1 : 1))) }));
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };

  const skeletonRows = (n: number, keyBase: string) => Array.from({ length: n }, (_, i) => (
    <tr key={keyBase + i} aria-hidden="true" className="ar-tr-skel">{Array.from({ length: span }, (_, j) => <td key={j}><Skeleton width={j === 0 ? '70%' : '50%'} height={12} /></td>)}</tr>
  ));

  return (
    <div className="ar-dt">
      {selectable && selected.length > 0 && (
        <div className="ar-dt-bar">
          <span role="status">{plural(selected.length, 'row')} selected</span>
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
          {p.selectionActions && <span className="ar-dt-bar-actions">{p.selectionActions(selected)}</span>}
        </div>
      )}
      <div className="ar-table-box">
      <div ref={wrap} className="ar-table-wrap ar-scroll ar-scroll-x" data-scroll-x="" role="region" aria-label={label} tabIndex={0} style={maxHeight ? { maxHeight } : undefined}
        onScroll={virtual ? (e) => setScroll({ top: e.currentTarget.scrollTop, h: e.currentTarget.clientHeight }) : undefined}>
        <table className={cx('ar-table', dense && 'ar-table--dense', resizable && 'ar-table--fixed')} aria-label={label} aria-busy={loading || undefined}
          aria-rowcount={virtual ? sorted.length + 1 : undefined} style={{ '--ar-row-h': `${rowHeight}px` } as CSSProperties}>
          {resizable && <colgroup>{selectable && <col style={{ width: 44 }} />}{cols.map((c) => <col key={c.key} style={{ width: widths[c.key] ?? c.width ?? 160 }} />)}{rowActions && <col style={{ width: 64 }} />}</colgroup>}
          <thead>
            <tr aria-rowindex={virtual ? 1 : undefined}>
              {selectable && <th className="ar-td-check"><input ref={headBox} type="checkbox" className="ar-check" aria-label={head === true ? 'Clear the selection' : 'Select every row'} checked={head === true} disabled={!sorted.length}
                onChange={() => setSelected(head === true ? [] : allKeys)} /></th>}
              {cols.map((c) => {
                const dir = sort?.key === c.key ? sort.dir : null;
                const handle = resizable && <span className="ar-th-resize" role="separator" aria-orientation="vertical" aria-label={`Resize ${typeof c.header === 'string' ? c.header : c.key}`} aria-valuenow={widths[c.key] ?? c.width ?? 160} aria-valuemin={64} aria-valuemax={800} tabIndex={0} onKeyDown={(e) => resizeKey(c.key, e)} onPointerDown={(e) => startDrag(c.key, e)} />;
                return c.sortValue
                  ? <SortHead key={c.key} dir={dir} align={c.align} onSort={() => nextSort(c.key)} scope="col" after={handle}>{c.header}</SortHead>
                  : <th key={c.key} scope="col" className={cx(c.align === 'end' && 'ar-th--end')}>{c.header}{handle}</th>;
              })}
              {rowActions && <th scope="col" className="ar-td-actions"><span className="ar-visually-hidden">Actions</span></th>}
            </tr>
          </thead>
          <tbody onKeyDown={onRowsKey}>
            {error ? (
              <tr><td colSpan={span}><div className="ar-dt-error" role="alert"><span>This could not load: {error}</span>{onRetry && <Button size="sm" onClick={onRetry}>Try again</Button>}</div></td></tr>
            ) : loading ? skeletonRows(5, 'l') : !sorted.length ? (
              <tr><td colSpan={span}>{empty && typeof empty !== 'string' ? empty : <EmptyState size="compact">{empty ?? 'Nothing here yet.'}</EmptyState>}</td></tr>
            ) : (
              <>
                {win.before > 0 && <tr aria-hidden="true" className="ar-tr-spacer"><td colSpan={span} style={{ height: win.before }} /></tr>}
                {visible.map((r, i) => {
                  const k = rowKey(r), idx = win.start + i, name = rowLabel?.(r) ?? `row ${idx + 1}`;
                  return (
                    <TableRow key={k} data-index={idx} aria-rowindex={virtual ? idx + 2 : undefined} selected={selectable ? selected.includes(k) : activeKey === k ? true : undefined}
                      className={cx(activeKey === k && 'ar-tr--active')} onOpen={onRowOpen ? () => onRowOpen(r) : undefined}
                      onFocus={() => { focusKey.current = k; }} style={virtual ? { height: rowHeight } : undefined}>
                      {selectable && <td className="ar-td-check"><input type="checkbox" className="ar-check" aria-label={`Select ${name}`} checked={selected.includes(k)} onChange={() => toggle(k)} /></td>}
                      {cols.map((c) => c.rowHeader
                        ? <th key={c.key} scope="row" className={cx(c.align === 'end' && 'ar-td--end')}>{c.cell(r)}</th>
                        : <td key={c.key} className={cx(c.align === 'end' && 'ar-td--end')}>{c.cell(r)}</td>)}
                      {rowActions && <td className="ar-td-actions" data-stop="">{rowActions(r)}</td>}
                    </TableRow>
                  );
                })}
                {win.after > 0 && <tr aria-hidden="true" className="ar-tr-spacer"><td colSpan={span} style={{ height: win.after }} /></tr>}
                {loadingMore && skeletonRows(3, 'm')}
              </>
            )}
          </tbody>
        </table>
        {onEndReached && <div ref={sentinel} className="ar-dt-sentinel" aria-hidden="true" />}
      </div>
      </div>
    </div>
  );
}
