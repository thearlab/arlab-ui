'use client';

import type { HTMLAttributes, ReactNode } from 'react';

export interface ReadPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  sub?: ReactNode;
  /** The 380px rail at the right; omit for one column. */
  rail?: ReactNode;
  /** Cap the main column at a 46rem reading measure (prose). */
  narrow?: boolean;
}

/** The reading layout: a main column (title, sub, content) and an optional rail. Used by Build,
 * a document body, and the small tools' pages. Scrolls as a page. */
export function ReadPage({ title, sub, rail, narrow = false, className = '', children, ...rest }: ReadPageProps) {
  return (
    <div className={['arlab-read', rail ? 'with-rail' : '', narrow ? 'narrow' : '', className].filter(Boolean).join(' ')} {...rest}>
      <div className="arlab-read-main">
        {title ? <h1 className="arlab-read-title">{title}</h1> : null}
        {sub ? <p className="arlab-read-sub">{sub}</p> : null}
        {children}
      </div>
      {rail ? <div className="arlab-read-rail">{rail}</div> : null}
    </div>
  );
}

export interface GateProps {
  /** The brand lockup (an ArlabMark). */
  brand?: ReactNode;
  title?: ReactNode;
  /** One sentence. */
  text?: ReactNode;
  /** The one action (a primary Button). */
  action?: ReactNode;
  /** The fine line under it. */
  fine?: ReactNode;
}

/** The screen before the shell: with only `brand` and `text` it is the splash; with a title and an
 * action it is the sign-in card. */
export function Gate({ brand, title, text, action, fine }: GateProps) {
  if (!title && !action) {
    return (
      <div className="arlab-splash">
        {brand}
        {text ? <span className="arlab-splash-text">{text}</span> : null}
      </div>
    );
  }
  return (
    <div className="arlab-gate">
      <div className="arlab-gate-card">
        {brand}
        {title ? <h1 className="arlab-gate-title">{title}</h1> : null}
        {text ? <p className="arlab-gate-text">{text}</p> : null}
        {action}
        {fine ? <p className="arlab-gate-fine">{fine}</p> : null}
      </div>
    </div>
  );
}
