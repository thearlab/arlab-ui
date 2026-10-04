'use client';

import type { ReactNode } from 'react';

export interface PageBarProps {
  title: ReactNode;
  /** A coloured lettered tile before the title, for a collection with an identity (a department).
   * Leave it off for ordinary pages: a tile on every page is decoration, not identity. */
  tile?: { letter: string; color: string };
  /** Pills right after the title: the count, the state. */
  pills?: ReactNode;
  /** Segmented tabs, sitting with the title. */
  tabs?: ReactNode;
  /** Search, pinned right. */
  search?: ReactNode;
  /** Buttons at the far right. */
  actions?: ReactNode;
  className?: string;
}

/** The fixed bar at the top of a page: title, its numbers, its tabs, its search and its actions on
 * one line, staying put while the page scrolls under it. One per page. */
export function PageBar({ title, tile, pills, tabs, search, actions, className = '' }: PageBarProps) {
  return (
    <div className={['arlab-pagebar', className].filter(Boolean).join(' ')}>
      {tile && <span className="arlab-pagebar-tile" style={{ background: tile.color }} aria-hidden="true">{tile.letter}</span>}
      <h1>{title}</h1>
      {pills}
      {tabs}
      {(search || actions) && <div className="arlab-pagebar-end">{search}{actions}</div>}
    </div>
  );
}

/** A section heading inside a page: the name, then its facts as pills. */
export function SectionHead({ title, pills, action }: { title: ReactNode; pills?: ReactNode; action?: ReactNode }) {
  return <div className="arlab-sectionhead"><h2>{title}</h2>{pills}{action && <span className="arlab-sectionhead-end">{action}</span>}</div>;
}
