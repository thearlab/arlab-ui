'use client';
import { useState, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  /** For an in-app router: called on a plain click (modified clicks keep the browser's behaviour). */
  onNavigate?: () => void;
}

export interface BreadcrumbsProps {
  /** From the top down; the last item is the current page. */
  items: BreadcrumbItem[];
  /** More than this many items collapses the middle into "…" (default 4). */
  max?: number;
  className?: string;
}

/** Where you are: nav > ol, the current page marked aria-current="page". */
export function Breadcrumbs({ items, max = 4, className }: BreadcrumbsProps) {
  const [open, setOpen] = useState(false);
  const collapse = !open && items.length > max;
  const shown: Array<BreadcrumbItem | 'more'> = collapse ? [items[0], 'more', ...items.slice(-2)] : items;
  const go = (it: BreadcrumbItem) => (e: MouseEvent) => {
    if (!it.onNavigate || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault(); it.onNavigate();
  };
  return (
    <nav aria-label="Breadcrumb" className={cx('ar-crumbs', className)}>
      <ol>
        {shown.map((it, i) => {
          const last = i === shown.length - 1;
          return (
            <li key={i}>
              {it === 'more'
                ? <button type="button" className="ar-crumb-more" aria-label={`Show ${items.length - 3} more levels`} onClick={() => setOpen(true)}>…</button>
                : last ? <span aria-current="page" className="ar-crumb-current">{it.label}</span>
                : it.href || it.onNavigate ? <a href={it.href ?? '#'} onClick={go(it)}>{it.label}</a>
                : <span>{it.label}</span>}
              {!last && <span className="ar-crumb-sep" aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
