'use client';

import type { HTMLAttributes, ReactNode } from 'react';

export function ArlabList({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['arlab-list', className].filter(Boolean).join(' ')} {...rest} />;
}

export interface RowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  /** Adds hover/focus affordance for a row that's itself clickable (e.g. wrapped in a button or link). */
  interactive?: boolean;
}

/** A divided list row. Use in place of a one-off bordered card for anything
 * that is a list item, not an independent object (see arlab-ui README).
 * The title truncates instead of wrapping under a trailing control; the
 * trailing slot never shrinks. */
export function Row({ title, meta, trailing, interactive = false, className = '', ...rest }: RowProps) {
  const cls = ['arlab-row', interactive ? 'interactive' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      <div className="arlab-row-main">
        <div className="arlab-row-title">{title}</div>
        {meta ? <div className="arlab-row-meta">{meta}</div> : null}
      </div>
      {trailing ? <div className="arlab-row-trailing">{trailing}</div> : null}
    </div>
  );
}