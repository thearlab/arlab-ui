'use client';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** A count/badge on the right of the header. */
  count?: ReactNode;
  /** The accent dot before the title (default on). */
  dot?: boolean;
  /** `true` caps the body at a default height and scrolls; a number sets that max height (px). */
  scroll?: boolean | number;
  children: ReactNode;
}

/** A titled dashboard section: a header (accent dot + title + optional count) over a body
 * that can scroll independently. Lay several side by side for a column dashboard. */
export function Panel({ title, count, dot = true, scroll = false, className = '', children, ...rest }: PanelProps) {
  const bodyStyle: CSSProperties | undefined = typeof scroll === 'number' ? { maxHeight: scroll } : undefined;
  return (
    <div className={['arlab-panel', className].filter(Boolean).join(' ')} {...rest}>
      <div className="arlab-panel-head">
        {dot && <span className="arlab-panel-dot" />}
        <span className="arlab-panel-title">{title}</span>
        {count != null && <span className="arlab-panel-count">{count}</span>}
      </div>
      <div className={['arlab-panel-body', scroll ? 'scroll' : ''].filter(Boolean).join(' ')} style={bodyStyle}>
        {children}
      </div>
    </div>
  );
}
