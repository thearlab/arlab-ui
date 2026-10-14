'use client';

import type { HTMLAttributes } from 'react';

/* Page layout primitives (1.8.0). The required way to lay out a page in an ARLAB internal tool:
 * no ad-hoc `display: grid`, no flex-wrap card piles. Every page is a PageGrid of Cols with
 * deliberate spans, card collections are a CardGrid, vertical rhythm is a Stack. Gutters and rhythm
 * come from tokens (--gutter, --rhythm*), so every tool spaces the same way. */

export type Span = 12 | 9 | 8 | 6 | 4 | 3;

export interface PageGridProps extends HTMLAttributes<HTMLDivElement> {}

/** A 12-column grid with the standard gutter. Cards in a row share height and edges. It answers to
 * its own width (container query): 6 columns under 900px, 1 under 560px. Children are `Col`s. */
export function PageGrid({ className = '', children, ...rest }: PageGridProps) {
  return (
    <div className={['arlab-pgrid', className].filter(Boolean).join(' ')} {...rest}>
      <div className="arlab-pgrid-in">{children}</div>
    </div>
  );
}

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns out of 12: full (12), two thirds and one third (8 + 4), three quarters (9 + 3),
   * halves (6), thirds (4), quarters (3). Spans in one row should add up to 12.
   * Under 900px: 12, 9 and 8 go full, 6 and 3 become halves, 4 goes full. Under 560px all full. */
  span?: Span;
}

/** One cell of a PageGrid. Its single child (a Panel, a card) stretches to the row's height. */
export function Col({ span = 12, className = '', ...rest }: ColProps) {
  return <div className={['arlab-col', `s${span}`, className].filter(Boolean).join(' ')} {...rest} />;
}

export interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Cards per row at full width (default 3). Under 900px 4 and 3 become 2; under 560px 1. */
  cols?: 2 | 3 | 4;
  /** The last row never leaves a hole: its cards stretch to fill it (default). `keep` leaves them. */
  last?: 'stretch' | 'keep';
}

/** Equal-height cards in even rows. No masonry, no orphan: a last row of 1 spans the full width,
 * of 2 takes halves, of 3 (in 4 columns) takes thirds. */
export function CardGrid({ cols = 3, last = 'stretch', className = '', children, ...rest }: CardGridProps) {
  return (
    <div className={['arlab-cgrid', className].filter(Boolean).join(' ')} data-cols={cols} data-last={last} {...rest}>
      <div className="arlab-cgrid-in">{children}</div>
    </div>
  );
}
