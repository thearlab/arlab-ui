'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface DashCardProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Top-right metadata (usually a monospace count). */
  meta?: ReactNode;
  tag?: ReactNode;
}

/** The compact sibling of NavCard, for dashboard columns (see Panel): a stacked card with
 * the icon tile and meta on top, then the title and description. Renders as an anchor. */
export function DashCard({ icon, title, description, meta, tag, className = '', ...rest }: DashCardProps) {
  return (
    <a className={['arlab-dashcard', className].filter(Boolean).join(' ')} {...rest}>
      <span className="arlab-dashcard-top">
        {icon && <span className="arlab-dashcard-ic">{icon}</span>}
        {meta && <span className="arlab-dashcard-meta">{meta}</span>}
      </span>
      <span className="arlab-dashcard-title">{title}{tag && <span className="arlab-dashcard-tag">{tag}</span>}</span>
      {description && <span className="arlab-dashcard-desc">{description}</span>}
    </a>
  );
}
