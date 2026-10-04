'use client';

import type { ReactNode, TableHTMLAttributes, ThHTMLAttributes } from 'react';

/** A data table with a fixed header (stays put while its scroll container scrolls), generous rows,
 * uppercase quiet heads, and a page gutter in the first and last cells so it can run edge to edge. */
export function Table({ className = '', ...rest }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={['arlab-table', className].filter(Boolean).join(' ')} {...rest} />;
}

/** A sortable column head: click to sort, the chevron says which way. */
export function SortHead({ label, active, dir = 'desc', onSort, ...rest }: { label: ReactNode; active?: boolean; dir?: 'asc' | 'desc'; onSort: () => void } & ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : undefined} {...rest}>
      <button type="button" className={active ? 'on' : ''} onClick={onSort}>{label}<svg viewBox="0 0 24 24" aria-hidden="true" className={active && dir === 'asc' ? 'up' : ''}><path d="M7 10l5 5 5-5" /></svg></button>
    </th>
  );
}
