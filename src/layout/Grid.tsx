'use client';
import { createElement, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

/* Page layout primitives: the required way to lay out a page. No ad-hoc `display: grid`, no
 * flex-wrap card piles, no auto-fill grids (they leave random gaps and uneven rows). Every page is a
 * PageGrid of Cols with deliberate spans, card sets are a CardGrid, vertical rhythm is a Stack, a
 * row of controls is an Inline. They answer to their OWN width (container queries), so they behave
 * the same in a full page, a pane, a sheet or a dialog. */

export type Span = 12 | 9 | 8 | 6 | 4 | 3;

export interface PageGridProps extends HTMLAttributes<HTMLDivElement> {}
/** 12 columns with the standard gutter; cards in a row share height. 6 columns under 900px of its
 * own width, 1 under 560px. Children are `Col`s whose spans add up to 12 per row. */
export function PageGrid({ className, children, ...rest }: PageGridProps) {
  return <div className={cx('ar-pgrid', className)} {...rest}><div className="ar-pgrid-in">{children}</div></div>;
}

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  /** Out of 12: 12, 8 + 4, 9 + 3, 6 + 6, 4 x 3, 3 x 4. Under 900px 12/9/8/4 go full and 6/3 halve;
   * under 560px everything is full width. */
  span?: Span;
}
/** One cell of a PageGrid. Its first child stretches to the row's height; more children stack. */
export function Col({ span = 12, className, ...rest }: ColProps) {
  return <div className={cx('ar-col', `ar-col--${span}`, className)} {...rest} />;
}

export interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Cards per row at full width (default 3). Under 900px: 2. Under 560px: 1. */
  cols?: 2 | 3 | 4;
  /** The last row never leaves a hole: its cards stretch (default). `keep` keeps the column width. */
  last?: 'stretch' | 'keep';
  /** Render as a list (ul) so screen readers count the cards; children must then be `li`s. */
  as?: 'div' | 'ul';
}
/** Equal-height cards in even rows; a row is as tall as its own tallest card. */
export function CardGrid({ cols = 3, last = 'stretch', as = 'div', className, children, ...rest }: CardGridProps) {
  return (
    <div className={cx('ar-cgrid', className)} data-cols={cols} data-last={last} {...rest}>
      {createElement(as, { className: 'ar-cgrid-in', role: as === 'ul' ? 'list' : undefined }, children)}
    </div>
  );
}

export type Gap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** xs 4, sm 12 (inside a card), md 24 (between sections, default), lg 36, xl 48. */
  gap?: Gap;
  as?: 'div' | 'section' | 'ul' | 'ol' | 'form' | 'main' | 'article';
  align?: 'stretch' | 'start' | 'center' | 'end';
}
/** Vertical rhythm. Children never collapse margins or set their own spacing. */
export function Stack({ gap = 'md', as = 'div', align, className, ...rest }: StackProps) {
  return createElement(as, { className: cx('ar-stack', `ar-gap-${gap}`, className), 'data-align': align, ...rest });
}

export interface InlineProps extends HTMLAttributes<HTMLElement> {
  /** Default sm (8px). */
  gap?: Gap;
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Wrap to the next line when out of room (default true). For controls and tags, never cards. */
  wrap?: boolean;
  as?: 'div' | 'span' | 'ul' | 'nav' | 'footer' | 'header';
}
/** A row of controls, tags or facts. */
export function Inline({ gap = 'sm', align = 'center', justify = 'start', wrap = true, as = 'div', className, ...rest }: InlineProps) {
  return createElement(as, { className: cx('ar-inline', `ar-gap-${gap}`, className), 'data-align': align, 'data-justify': justify, 'data-nowrap': wrap ? undefined : '', ...rest });
}
