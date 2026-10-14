'use client';
import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';

type Heading = 'h2' | 'h3' | 'h4';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onClick'> {
  /** The card's name. When the card opens something, this is the button or link. */
  title?: ReactNode;
  titleAs?: Heading;
  /** Top-right slot: a "more" menu button. Stays clickable above the card's own click. */
  menu?: ReactNode;
  /** Up to two lines of context under the title (clamped). */
  context?: ReactNode;
  /** The people row: avatars or names. */
  people?: ReactNode;
  /** After a hairline: tags on the left, counts or a date on the right. */
  foot?: ReactNode;
  footEnd?: ReactNode;
  /** Whole card opens this (a real <button> on the title, stretched over the card). */
  onOpen?: () => void;
  /** Whole card links here (a real <a> on the title, stretched over the card). */
  href?: string;
  /** The chosen card (Inspector, board selection). */
  selected?: boolean;
  /** Inner padding: md 16 (default), sm 12, none. */
  padding?: 'md' | 'sm' | 'none';
  as?: 'div' | 'article' | 'li' | 'section';
  children?: ReactNode;
}

/** The one card anatomy: title (+ menu), two lines of context, people, a hairline, tags and counts.
 * Interactive cards put a real button or link on the title and stretch it over the card, so nothing
 * interactive is nested inside another interactive element. */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { title, titleAs: H = 'h3', menu, context, people, foot, footEnd, onOpen, href, selected, padding = 'md', as: As = 'div', className, children, ...rest }, ref,
) {
  const interactive = !!(onOpen || href);
  const t = title == null ? null
    : href ? <a className="ar-card-hit" href={href} aria-current={selected ? 'true' : undefined}>{title}</a>
    : onOpen ? <button type="button" className="ar-card-hit" onClick={onOpen} aria-current={selected ? 'true' : undefined}>{title}</button>
    : title;
  return (
    <As ref={ref as any} className={cx('ar-card', interactive && 'ar-card--interactive', selected && 'ar-card--selected', padding !== 'md' && `ar-card--pad-${padding}`, className)} {...rest}>
      {(title != null || menu) && (
        <div className="ar-card-head">
          {title != null && <H className="ar-card-title">{t}</H>}
          {menu && <div className="ar-card-menu">{menu}</div>}
        </div>
      )}
      {context && <div className="ar-card-context">{context}</div>}
      {children}
      {people && <div className="ar-card-people">{people}</div>}
      {(foot || footEnd) && <div className="ar-card-foot"><div className="ar-card-tags">{foot}</div>{footEnd && <div className="ar-card-counts">{footEnd}</div>}</div>}
    </As>
  );
});

export function CardHeader({ title, sub, actions, as: H = 'h3', className, ...rest }: Omit<HTMLAttributes<HTMLDivElement>, 'title'> & { title: ReactNode; sub?: ReactNode; actions?: ReactNode; as?: Heading }) {
  return (
    <div className={cx('ar-card-header', className)} {...rest}>
      <div className="ar-card-header-text"><H className="ar-card-title">{title}</H>{sub && <p className="ar-card-sub">{sub}</p>}</div>
      {actions && <div className="ar-card-actions">{actions}</div>}
    </div>
  );
}
export const CardBody = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => <div className={cx('ar-card-body', className)} {...rest} />;
export const CardFooter = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => <div className={cx('ar-card-footer', className)} {...rest} />;

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The section's name (a heading, labels the region). */
  title?: ReactNode;
  /** A muted note next to the title ("from ClickUp", "30 days counted"). */
  sub?: ReactNode;
  /** Right of the title: a button, a segmented control, a pill. */
  actions?: ReactNode;
  titleAs?: Heading;
  /** Content runs edge to edge (a table, a list with its own gutters). */
  flush?: boolean;
  children?: ReactNode;
}
/** A titled section of a page, on a card. */
export function Panel({ title, sub, actions, titleAs: H = 'h2', flush, className, children, ...rest }: PanelProps) {
  const id = useId();
  return (
    <section className={cx('ar-panel', flush && 'ar-panel--flush', className)} aria-labelledby={title != null ? id : undefined} {...rest}>
      {(title != null || actions) && (
        <div className="ar-panel-head">
          {title != null && <H id={id} className="ar-panel-title">{title}{sub && <small>{sub}</small>}</H>}
          {actions && <div className="ar-panel-actions">{actions}</div>}
        </div>
      )}
      <div className="ar-panel-body">{children}</div>
    </section>
  );
}
