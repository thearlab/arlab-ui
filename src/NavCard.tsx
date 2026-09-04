'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface NavCardProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned metadata, usually a monospace count (e.g. "21 docs"). */
  meta?: ReactNode;
  /** A small tag beside the title (e.g. "docs", "github"). */
  tag?: ReactNode;
  /** Shows an outward arrow instead of the forward chevron (for links that leave the app). */
  external?: boolean;
}

const Forward = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const Out = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M8 5h11v11M19 5L7 17" /></svg>
);

/** A wide, clickable "intent" card: an icon tile, a title (+ optional tag), a description,
 * a right-aligned meta/count, and an arrow that advances on hover. Renders as an anchor. */
export function NavCard({ icon, title, description, meta, tag, external, className = '', ...rest }: NavCardProps) {
  return (
    <a className={['arlab-navcard', className].filter(Boolean).join(' ')} {...rest}>
      {icon && <span className="arlab-navcard-ic">{icon}</span>}
      <span className="arlab-navcard-main">
        <span className="arlab-navcard-title">{title}{tag && <span className="arlab-navcard-tag">{tag}</span>}</span>
        {description && <span className="arlab-navcard-desc">{description}</span>}
      </span>
      <span className="arlab-navcard-right">
        {meta && <span className="arlab-navcard-meta">{meta}</span>}
        <span className="arlab-navcard-arw">{external ? <Out /> : <Forward />}</span>
      </span>
    </a>
  );
}
