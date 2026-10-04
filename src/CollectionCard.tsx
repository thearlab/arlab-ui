'use client';

import type { ReactNode } from 'react';

export interface CollectionCardProps {
  title: string;
  count?: number;
  /** Facts as pills under the title (changed 2d ago, 4 clients). */
  pills?: ReactNode;
  /** The latest few things inside, each opening on its own. */
  items?: { id: string; label: string; onOpen: () => void }[];
  /** Small tags at the foot (the biggest groups). */
  tags?: { label: string; count?: number }[];
  more?: number;
  onOpen: () => void;
  dashed?: boolean;
}

/** A collection as a card: its name and size, a pill line of facts, the latest few items in one
 * inset block, and its biggest groups. The card opens the collection; each item opens itself. A
 * div (not a button) because a button cannot hold buttons; the title is the keyboard entry. */
export function CollectionCard({ title, count, pills, items, tags, more, onOpen, dashed }: CollectionCardProps) {
  return (
    <div className={`arlab-ccard${dashed ? ' dashed' : ''}`} onClick={onOpen}>
      <div className="arlab-ccard-head">
        <button type="button" className="arlab-ccard-name" onClick={(e) => { e.stopPropagation(); onOpen(); }}>{title}</button>
        {count !== undefined && <span className="arlab-ccard-n">{count}</span>}
      </div>
      {pills && <div className="arlab-ccard-pills">{pills}</div>}
      {items && items.length > 0 && (
        <ol className="arlab-ccard-items">
          {items.map((it) => <li key={it.id}><button type="button" title={it.label} onClick={(e) => { e.stopPropagation(); it.onOpen(); }}><span>{it.label}</span></button></li>)}
        </ol>
      )}
      {((tags && tags.length > 0) || more) ? (
        <div className="arlab-ccard-tags">
          {tags?.map((t) => <span key={t.label}>{t.label}{t.count !== undefined && <i>{t.count}</i>}</span>)}
          {more ? <span className="more">+{more}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

/** A grid of CollectionCards that fills the width. */
export function CardGrid({ children }: { children: ReactNode }) { return <div className="arlab-cardgrid">{children}</div>; }
