'use client';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  /** One line: what this page is for, or what needs you today. */
  description?: ReactNode;
  /** A logo tile or icon (a 44px rounded tile on the hero). */
  icon?: ReactNode;
  /** Up to four key facts, label then value ("Live date", "20 Oct"). Numbers use tabular figures. */
  facts?: Array<[ReactNode, ReactNode]>;
  /** The one primary action of the page (and at most one secondary). */
  actions?: ReactNode;
  /** Above the title (a kicker: "Project", "Client"). */
  eyebrow?: ReactNode;
  /** hero: the soft gradient header (a home or an overview). compact: about 96px, for working and
   * detail pages. plain: no surface at all, for dense pages under a PageBar. */
  variant?: 'hero' | 'compact' | 'plain';
  /** Heading level of the title (default 1). */
  level?: 1 | 2;
}

/** Every page's identity: a soft gradient hero with an icon, the name, one line and key facts. */
export function PageHeader({ title, description, icon, facts, actions, eyebrow, variant = 'hero', level = 1, className, children, ...rest }: PageHeaderProps) {
  const H = level === 1 ? 'h1' : 'h2';
  return (
    <header className={cx('ar-pagehead', `ar-pagehead--${variant}`, className)} {...rest}>
      <div className="ar-pagehead-main">
        {eyebrow && <p className="ar-pagehead-eyebrow">{eyebrow}</p>}
        <H className="ar-pagehead-title">{icon && <span className="ar-pagehead-icon" aria-hidden="true">{icon}</span>}<span>{title}</span></H>
        {description && <p className="ar-pagehead-desc">{description}</p>}
        {children}
      </div>
      {(facts?.length || actions) && (
        <div className="ar-pagehead-side">
          {!!facts?.length && <dl className="ar-pagehead-facts">{facts.map(([k, v], i) => <div key={i}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
          {actions && <div className="ar-pagehead-actions">{actions}</div>}
        </div>
      )}
    </header>
  );
}

export interface PageBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** A count or status next to the title (a Pill). */
  meta?: ReactNode;
  /** The tabs, beside the title (Tabs variant="pill" or a SegmentedControl). */
  tabs?: ReactNode;
  /** Search and the primary action, on the right. */
  actions?: ReactNode;
  /** Stays in view while the page scrolls (default true). */
  pinned?: boolean;
}

/** The working-page bar from the admin pattern: title, tabs beside it, actions; pinned while the body
 * scrolls. On phones the tabs move under the title and scroll sideways. */
export function PageBar({ title, meta, tabs, actions, pinned = true, className, ...rest }: PageBarProps) {
  return (
    <div className={cx('ar-pagebar', pinned && 'is-pinned', className)} {...rest}>
      <div className="ar-pagebar-title"><h1>{title}</h1>{meta}</div>
      {tabs && <div className="ar-pagebar-tabs">{tabs}</div>}
      {actions && <div className="ar-pagebar-actions">{actions}</div>}
    </div>
  );
}

export interface SectionHeadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** Facts as pills, or a count. */
  meta?: ReactNode;
  /** One action on the right (a small button, a segmented control). */
  action?: ReactNode;
  level?: 2 | 3;
}
/** A section title inside a page: "Needs someone today", then its facts and one action. */
export function SectionHead({ title, meta, action, level = 2, className, ...rest }: SectionHeadProps) {
  const H = level === 2 ? 'h2' : 'h3';
  return (
    <div className={cx('ar-sectionhead', className)} {...rest}>
      <H>{title}</H>{meta && <div className="ar-sectionhead-meta">{meta}</div>}<span className="ar-grow" />{action}
    </div>
  );
}
