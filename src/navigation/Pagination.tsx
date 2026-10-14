'use client';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from '../core/Button';
import { IconButton } from '../core/IconButton';
import { ChevronLeftIcon, ChevronRightIcon } from '../core/icons';
import { Spinner } from '../core/Spinner';
import { cx } from '../lib/cx';
import { number } from '../lib/format';
import { pageRange, pageSlots } from '../lib/pagination';

export interface PaginationProps {
  /** 1-based. */
  page: number;
  /** How many items in all. */
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  /** Offer a page-size choice with these sizes. */
  pageSizes?: number[];
  onPageSizeChange?: (size: number) => void;
  /** The thing counted, plural ("projects"). */
  noun?: string;
  className?: string;
}

/** Previous, numbered pages and next, with "Showing 21 to 40 of 312". On phones only previous,
 * "Page 2 of 16" and next. Prefer LoadMore for long lists people scroll through. */
export function Pagination({ page, total, pageSize, onPageChange, pageSizes, onPageSizeChange, noun = 'items', className }: PaginationProps) {
  const count = Math.max(1, Math.ceil(total / pageSize));
  const [from, to] = pageRange(page, pageSize, total);
  const sizeId = useId();
  return (
    <div className={cx('ar-pager', className)}>
      <p className="ar-pager-sum" aria-live="polite">{total ? <>Showing {number(from)} to {number(to)} of {number(total)} {noun}</> : <>No {noun}</>}</p>
      {pageSizes && onPageSizeChange && (
        <label className="ar-pager-size" htmlFor={sizeId}>
          <span>Per page</span>
          <select id={sizeId} value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            {pageSizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      )}
      <nav aria-label="Pagination" className="ar-pager-nav">
        <IconButton label="Previous page" variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeftIcon className="ar-flip-rtl" /></IconButton>
        <ol className="ar-pager-pages">
          {pageSlots(page, count).map((s, i) => (
            <li key={i}>
              {s === 'gap' ? <span className="ar-pager-gap" aria-hidden="true">…</span>
                : <button type="button" className="ar-pager-page" aria-current={s === page ? 'page' : undefined} aria-label={`Page ${s}`} onClick={() => onPageChange(s)}>{s}</button>}
            </li>
          ))}
        </ol>
        <span className="ar-pager-compact">Page {page} of {count}</span>
        <IconButton label="Next page" variant="secondary" size="sm" disabled={page >= count} onClick={() => onPageChange(page + 1)}><ChevronRightIcon className="ar-flip-rtl" /></IconButton>
      </nav>
    </div>
  );
}

export interface LoadMoreProps {
  /** Loads the next batch. Called when the sentinel scrolls into view, or on the button. */
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
  /** "300 events loaded, back to Mon 6 Oct". */
  status?: ReactNode;
  /** Shown when everything is loaded ("That is everything the engine keeps"). */
  endLabel?: ReactNode;
  /** Load by itself when it scrolls into view (default true). The button stays as a fallback. */
  auto?: boolean;
}

/** The end of a long list: loads the next batch as it scrolls into view, says how far back it goes,
 * and says when there is nothing more. No pages to click. */
export function LoadMore({ onLoadMore, hasMore, loading, status, endLabel = 'That is everything.', auto = true }: LoadMoreProps) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onLoadMore); cb.current = onLoadMore;
  useEffect(() => {
    if (!auto || !hasMore || loading || !ref.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) cb.current(); }, { rootMargin: '200px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [auto, hasMore, loading]);
  return (
    <div ref={ref} className="ar-loadmore" aria-live="polite" aria-busy={loading || undefined}>
      {status && <span className="ar-loadmore-status">{status}</span>}
      {loading ? <span className="ar-loadmore-busy"><Spinner size={14} /> Loading more</span>
        : hasMore ? <Button size="sm" variant="ghost" onClick={onLoadMore}>Load more</Button>
        : <span className="ar-loadmore-end">{endLabel}</span>}
    </div>
  );
}
