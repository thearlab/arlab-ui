import { useCollectionColumns } from './CollectionViewContext.js';
import { tableRowProps, type TableRowActivation } from './table-row.js';
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { SharedTableHead, sortTableRows, type FilterColumn, type TableSort } from './DataFilters.js';
import { ScrollArea } from './scroll-area.js';
import { type TableChromeOptions, TableHeader } from './TableChrome.js';
import { Button } from './library.js';
import { Loader } from './loading.js';
import { infiniteTableEntries } from './table-groups.js';

export interface InfiniteTableBaseProps<Row extends Record<string, unknown>> extends TableRowActivation<Row>, TableChromeOptions {
  columns: FilterColumn<Row>[];
  rows: Row[];
  rowKey: keyof Row | ((row: Row) => string | number);
  title?: string;
  header?: ReactNode;
  /** Hide duplicated chrome when a containing page owns the title and controls. */
  showHeader?: boolean;
  headerActions?: ReactNode;
  /** Compact controls displayed only inside a condensed collection pane. */
  condensedHeaderActions?: ReactNode;
  condensedFooterActions?: ReactNode;
  /** Search belongs to the fixed table header, beside its single count pill. */
  search?: ReactNode;
  /** Persistent creation or collection actions outside the row scroll surface. */
  footerActions?: ReactNode;
  /** Fill a bounded parent instead of using the default 480px viewport. */
  fill?: boolean;
  variant?: 'contained' | 'flush';
  sortIndicators?:'all'|'active'|'none';
  /** Fixed geometry is required. Cells default to two lines; columns may set lineClamp.
   * Custom cells must fit within rowHeight - 16 pixels. Minimum 44. */
  rowHeight?: number;
  /** Insert headings for contiguous groups. Records retain local sort or server order.
   * Group headings share rowHeight, so virtualization remains bounded and predictable. */
  groupBy?: keyof Row | ((row: Row) => string | number | null | undefined);
  renderGroup?: (group: { label: string; count: number }) => ReactNode;
  overscan?: number;
  chunkSize?: number;
  /** Bounded scroll surface; use an explicit height or a height constrained by the parent. */
  height?: CSSProperties['height'];
  loading?: boolean;
  emptyMessage?: string;
  /** Change when host filters/query change. Remote append must retain the same key. */
  filterKey?: string | number;
}
export interface LocalInfiniteTableProps<Row extends Record<string, unknown>> extends InfiniteTableBaseProps<Row> {
  mode?: 'local';
  initialSort?: TableSort | null;
  sort?: never;
  onSortChange?: never;
  onLoadMore?: never;
  hasMore?: never;
  loadingMore?: never;
  error?: never;
  totalCount?: never;
}
export interface RemoteInfiniteTableProps<Row extends Record<string, unknown>> extends InfiniteTableBaseProps<Row> {
  mode: 'remote';
  initialSort?: never;
  sort: TableSort | null;
  onSortChange: (sort: TableSort) => void;
  hasMore: boolean;
  /** Resolve after host rows have been appended; reject on failure. Never mutate a newer query on resolution. */
  onLoadMore: (signal: AbortSignal) => Promise<void>;
  loadingMore: boolean;
  error?: string;
  /** Optional total after filtering, excluding the header. Unknown totals use aria-rowcount=-1. */
  totalCount?: number;
}
export type InfiniteTableProps<Row extends Record<string, unknown>> = LocalInfiniteTableProps<Row> | RemoteInfiniteTableProps<Row>;

function positiveInteger(value: number | undefined, fallback: number, minimum: number) {
  return value === undefined || !Number.isFinite(value) ? fallback : Math.max(minimum, Math.floor(value));
}
/** Pure window math, also used to verify the DOM bound without constructing thousands of rows. */
export function infiniteTableWindow(count: number, scrollTop: number, viewportHeight: number, rowHeight: number, overscan: number, headerHeight: number) {
  const start = Math.min(count, Math.max(0, Math.floor(Math.max(0, scrollTop - headerHeight) / rowHeight) - overscan));
  const end = Math.min(count, Math.max(start, Math.ceil(Math.max(0, scrollTop + viewportHeight - headerHeight) / rowHeight) + overscan));
  return { start, end };
}
/** Fixed-height virtual rows with incremental local disclosure or caller-owned remote pagination.
 * Filtering belongs to the host. Local mode sorts the entire filtered array before windowing.
 * Remote mode never reorders received rows and never infers server completeness from a page size.
 */
export function InfiniteTable<Row extends Record<string, unknown>>(props: InfiniteTableProps<Row>) {
  const { columns, rows, rowKey, title = 'Records', header, headerActions, search, footerActions, fill = false, height = 480, variant = 'contained', loading = false, emptyMessage = 'No results match these filters.', filterKey } = props;
  const rowHeight = positiveInteger(props.rowHeight, 64, 44);
  const overscan = positiveInteger(props.overscan, 6, 0);
  const chunkSize = positiveInteger(props.chunkSize, 50, 1);
  const remote = props.mode === 'remote';
  const [localSort, setLocalSort] = useState<TableSort | null>(props.mode === 'remote' ? null : props.initialSort ?? null);
  const sort = props.mode === 'remote' ? props.sort : localSort;
  const sortIdentity = `${sort?.key ?? ''}:${sort?.direction ?? ''}`;
  const [loaded, setLoaded] = useState(chunkSize);
  const [position, setPosition] = useState({ top: 0, height: typeof height === 'number' ? height : 480, header: 44 });
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement | null>(null);
  const live = useRef(false);
  const generation = useRef(0);
  const flight = useRef<AbortController | null>(null);
  const attemptedLength = useRef<number | null>(null);
  const frame = useRef<number | null>(null);
  const latest = useRef(props); latest.current = props;
  const failureRef = useRef(failure); failureRef.current = failure;
  const headingId = useId();
  const revealIndex=useRef<number|null>(null);

  const visibleColumns = useCollectionColumns(columns);
  const ordered = useMemo(() => remote ? rows : sortTableRows(rows, columns, sort), [rows, columns, remote, sort?.key, sort?.direction]);
  const count = remote ? ordered.length : Math.min(loaded, ordered.length);
  const allEntries = useMemo(() => infiniteTableEntries(ordered, props.groupBy), [ordered, props.groupBy]);
  const entries = useMemo(() => remote ? allEntries : infiniteTableEntries(ordered.slice(0, count), props.groupBy), [remote, allEntries, ordered, count, props.groupBy]);
  const error = failure || (props.mode === 'remote' ? props.error : '') || '';
  const loadingMore = pending || (props.mode === 'remote' && props.loadingMore);
  const more = props.mode === 'remote' ? props.hasMore : count < ordered.length;

  // Each query owns its request generation. Abort is cooperative; stale completions cannot alter this component.
  useEffect(() => {
    live.current = true;
    generation.current += 1;
    attemptedLength.current = null;
    failureRef.current = '';
    setFailure(''); setPending(false);
    return () => {
      live.current = false; generation.current += 1;
      flight.current?.abort(); flight.current = null;
    };
  }, [remote, filterKey, sortIdentity]);

  const requestMore = useCallback((retry = false) => {
    const current = latest.current;
    if (!live.current || current.mode !== 'remote' || !current.hasMore || current.loading || current.loadingMore || flight.current) return;
    if (!retry && (failureRef.current || current.error || attemptedLength.current === current.rows.length)) return;
    const controller = new AbortController();
    flight.current = controller;
    attemptedLength.current = current.rows.length;
    const requestGeneration = generation.current;
    failureRef.current = ''; setFailure(''); setPending(true);
    Promise.resolve().then(() => {
      if (controller.signal.aborted) return;
      return current.onLoadMore(controller.signal);
    }).catch(reason => {
      if (!live.current || controller.signal.aborted || generation.current !== requestGeneration) return;
      const message = reason instanceof Error ? reason.message : 'Could not load more records.';
      failureRef.current = message; setFailure(message);
    }).finally(() => {
      if (!live.current || generation.current !== requestGeneration || flight.current !== controller) return;
      flight.current = null; setPending(false);
    });
  }, []);

  const readPosition = useCallback(() => {
    if (!live.current || !viewport.current) return;
    const node = viewport.current;
    const head = root.current?.querySelector('thead');
    if(revealIndex.current!==null&&node.clientHeight>0){
      node.scrollTop=Math.max(0,(head?.getBoundingClientRect().height??44)+revealIndex.current*rowHeight-(node.clientHeight-rowHeight)/2);
      revealIndex.current=null;
    }
    const next = { top: node.scrollTop, height: node.clientHeight, header: head?.getBoundingClientRect().height ?? 44 };
    setPosition(old => old.top === next.top && old.height === next.height && old.header === next.header ? old : next);
  }, [rowHeight]);
  const scheduleRead = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => { frame.current = null; readPosition(); });
  }, [readPosition]);
  useEffect(() => {
    const node = root.current?.querySelector<HTMLDivElement>('.ct-infinite-scroll > .scroll-viewport');
    if (!node) return;
    viewport.current = node;
    node.addEventListener('scroll', scheduleRead, { passive: true });
    const observer = new ResizeObserver(scheduleRead);
    observer.observe(node);
    const head = root.current?.querySelector('thead'); if (head) observer.observe(head);
    scheduleRead();
    return () => {
      observer.disconnect(); node.removeEventListener('scroll', scheduleRead);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null; viewport.current = null;
    };
  }, [scheduleRead]);

  // An explicit filterKey owns query resets, so unrelated host renders and mounted detail views retain scroll.
  // Without a key, local row identity remains the backwards-compatible collection boundary.
  const localRows = remote || filterKey !== undefined ? null : rows;
  useLayoutEffect(() => {
    setLoaded(chunkSize);
    const node = root.current?.querySelector<HTMLDivElement>('.ct-infinite-scroll > .scroll-viewport');
    if (node) node.scrollTop = 0;
    setPosition(old => ({ ...old, top: 0 }));
  }, [localRows, remote, filterKey, sortIdentity, chunkSize, rowHeight]);

  // Scroll frames reuse the indexes. Do not scan the complete collection on every frame.
  const selectedIndex=useMemo(()=>props.selectedRowKey===undefined?-1:ordered.findIndex(row=>String(typeof rowKey==='function'?rowKey(row):row[rowKey])===String(props.selectedRowKey)),[props.selectedRowKey,ordered,rowKey]);
  const selectedEntryIndex=useMemo(()=>selectedIndex<0?-1:allEntries.findIndex(entry=>entry.kind==='row'&&entry.rowIndex===selectedIndex),[selectedIndex,allEntries]);
  useLayoutEffect(()=>{
    revealIndex.current=selectedEntryIndex<0?null:selectedEntryIndex;
    if(selectedIndex<0)return;
    if(!remote)setLoaded(old=>Math.max(old,Math.ceil((selectedIndex+1)/chunkSize)*chunkSize));
    scheduleRead();
  },[props.selectedRowKey,selectedIndex,selectedEntryIndex,remote,chunkSize,rowHeight,scheduleRead]);

  useEffect(() => {
    if (loading || error || loadingMore || !more) return;
    const distance = position.header + entries.length * rowHeight - (position.top + position.height);
    if (distance > Math.max(200, overscan * rowHeight)) return;
    if (remote) requestMore(); else setLoaded(old => Math.min(ordered.length, old + chunkSize));
  }, [loading, error, loadingMore, more, position, count, entries.length, rowHeight, overscan, remote, requestMore, ordered.length, chunkSize]);

  const changeSort = (key: string) => {
    const next: TableSort = { key, direction: sort?.key === key && sort.direction === 'ascending' ? 'descending' : 'ascending' };
    if (props.mode === 'remote') props.onSortChange(next); else setLocalSort(next);
  };
  const range = infiniteTableWindow(entries.length, position.top, position.height, rowHeight, overscan, position.header);
  const visibleEntries = entries.slice(range.start, range.end);
  const total = props.mode === 'remote' ? props.totalCount ?? (props.hasMore ? -1 : rows.length) : rows.length;
  const accessibleTotal = props.groupBy === undefined ? (total < 0 ? -1 : total + 1) : remote && more ? -1 : allEntries.length + 1;
  const colspan = Math.max(1, visibleColumns.length);
  const style = { '--ct-infinite-row-height': `${rowHeight}px`, '--ct-infinite-cell-height': `${rowHeight - 16}px` } as CSSProperties;
  return <div ref={root} className="ct-data-table ct-infinite-table" data-variant={variant} data-fill={fill||undefined} style={style} aria-busy={loading || loadingMore}>
    {props.showHeader !== false && <TableHeader showCount={props.showCount} countLabel={props.countLabel} formatCount={props.formatCount} searchWidth={props.searchWidth} title={title} header={header} headingId={headingId} count={total} loading={loading} search={search} actions={headerActions} condensedActions={props.condensedHeaderActions}/>}
    {!loading&&props.selectedRowKey!==undefined&&selectedIndex<0&&<div className="ct-table-selection-notice" role="status">{remote?'The open record is not among loaded results.':'The open record is outside these results.'}</div>}
    <ScrollArea label={`${title} rows`} height={fill?undefined:height} axis="both" className="ct-infinite-scroll">
      <table aria-label={title} aria-rowcount={accessibleTotal} aria-colcount={visibleColumns.length}>
        <SharedTableHead columns={visibleColumns} sort={sort} onSort={changeSort} sortingDisabled={loading} sortIndicators={props.sortIndicators}/>
        <tbody>
          {!loading && count > 0 && range.start > 0 && <tr aria-hidden="true" className="ct-infinite-spacer"><td colSpan={colspan} style={{ height: range.start * rowHeight }}/></tr>}
          {!loading && visibleEntries.map((entry, offset) => {
            const index = range.start + offset;
            if (entry.kind === 'group') return <tr key={`group:${entry.firstRowIndex}:${entry.group}`} aria-rowindex={index + 2} className="ct-infinite-group"><th scope="rowgroup" colSpan={colspan}>{props.renderGroup ? props.renderGroup({label: entry.group, count: entry.count}) : entry.group}</th></tr>;
            const row = entry.row;
            return <tr {...tableRowProps(row,props,typeof rowKey==='function'?rowKey(row):row[rowKey])} key={`row:${typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey])}`} aria-rowindex={index + 2} className="ct-infinite-row">
              {visibleColumns.map(column => <td key={column.key} data-phone-hidden={column.hideOnPhone || undefined} style={{ textAlign: column.align || 'left' }}><div className="ct-infinite-cell" data-line-clamp={column.lineClamp === false ? 'none' : undefined} style={column.lineClamp === false ? undefined : { WebkitLineClamp: positiveInteger(column.lineClamp, 2, 1) }}>{column.render ? column.render(row) : column.value ? column.value(row) : String(row[column.key] ?? '')}</div></td>)}
            </tr>;
          })}
          {!loading && entries.length > range.end && <tr aria-hidden="true" className="ct-infinite-spacer"><td colSpan={colspan} style={{ height: (entries.length - range.end) * rowHeight }}/></tr>}
          {(loading || count === 0) && <tr><td colSpan={colspan}><div className="ct-table-empty" role="status" aria-label={loading ? 'Loading records' : undefined}>{loading ? <Loader size={24} decorative /> : error ? 'Records could not be loaded.' : emptyMessage}</div></td></tr>}
        </tbody>
      </table>
    </ScrollArea>
    <footer data-error={!!error||undefined} data-condensed-actions={!!props.condensedFooterActions||undefined}>
      <span className={`${error?'ct-table-error':'ct-table-progress'} ${!error&&!loading&&!loadingMore?'sr-only':''}`} role={error ? 'alert' : 'status'}>{error || (loadingMore ? 'Loading more records…' : loading ? 'Loading records…' : more ? 'More records load as you scroll' : 'All results loaded')}</span>
      {remote && more && !loadingMore && !loading && (error || attemptedLength.current===rows.length) && <Button className="ct-table-retry" onClick={() => requestMore(true)}>{error ? 'Retry loading' : 'Load more'}</Button>}
      {footerActions&&<div className="ct-table-footer-actions">{footerActions}</div>}
      {props.condensedFooterActions&&<div className="ct-table-condensed-footer-actions">{props.condensedFooterActions}</div>}
    </footer>
  </div>;
}
