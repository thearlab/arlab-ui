'use client';

import { useEffect, useState } from 'react';

export interface TocEntry {
  id: string;
  label: string;
  depth?: 2 | 3;
}

export interface UseScrollspyOptions {
  /** Element id to observe within (its own scroll container), or omit to observe the viewport. */
  rootId?: string;
  rootMargin?: string;
}

/** Tracks which heading is "active" as the user scrolls, same trick
 * arlab-docs' Toc used: a heading counts as active once it crosses about
 * 30% down from the top of the scroller. */
export function useScrollspy(ids: string[], { rootId, rootMargin = '0px 0px -70% 0px' }: UseScrollspyOptions = {}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root = rootId ? document.getElementById(rootId) : null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { root, rootMargin },
    );
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(','), rootId, rootMargin]);

  return activeId;
}

export interface TocProps {
  items: TocEntry[];
  activeId: string | null;
}

export function Toc({ items, activeId }: TocProps) {
  if (items.length < 2) return null;
  return (
    <nav className="arlab-toc">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={['arlab-toc-link', item.depth === 3 ? 'depth-3' : '', item.id === activeId ? 'active' : ''].filter(Boolean).join(' ')}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}