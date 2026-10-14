'use client';
import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { CheckIcon } from '../core/icons';

export interface MediaItem {
  id: string;
  /** Image or poster URL. */
  src: string;
  /** What the picture shows (also the accessible name). */
  alt: string;
  kind?: 'image' | 'video';
  /** A caption under the tile (file name, where it is used). */
  caption?: ReactNode;
  disabled?: boolean;
}

export interface MediaGalleryProps {
  items: MediaItem[];
  /** Chosen ids. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (ids: string[]) => void;
  /** One (default) or many. */
  multiple?: boolean;
  /** Accessible name: "Pick a cover picture". */
  label: string;
  /** Tiles per row at full width (default 4). Fewer on narrow screens. */
  cols?: 3 | 4 | 5 | 6;
  /** Shown when there are no items. */
  empty?: ReactNode;
  className?: string;
}

/** A grid of pictures and videos to pick from (a listbox): arrows move in two dimensions, Space or
 * Enter picks, Home and End jump. */
export function MediaGallery({ items, value, defaultValue = [], onChange, multiple = false, label, cols = 4, empty, className }: MediaGalleryProps) {
  const [v, setV] = useControllable<string[]>(value, defaultValue, onChange);
  const grid = useRef<HTMLUListElement>(null);
  const toggle = (id: string) => setV(multiple ? (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]) : v[0] === id ? [] : [id]);
  const tabStop = Math.max(0, items.findIndex((x) => v.includes(x.id)));
  if (!items.length) return <p className="ar-gallery-empty">{empty ?? 'Nothing here yet.'}</p>;

  const onKey = (e: KeyboardEvent<HTMLLIElement>, i: number) => {
    const tiles = Array.from(grid.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    // Columns as laid out right now (the grid answers to its width).
    const top = tiles[0]?.offsetTop ?? 0; const perRow = Math.max(1, tiles.filter((t) => t.offsetTop === top).length);
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const map: Record<string, number> = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, ArrowDown: perRow, ArrowUp: -perRow };
    let to = -1;
    if (map[e.key] !== undefined) to = Math.min(tiles.length - 1, Math.max(0, i + map[e.key]));
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = tiles.length - 1;
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!items[i].disabled) toggle(items[i].id); return; }
    if (to >= 0) { e.preventDefault(); tiles[to]?.focus(); }
  };

  return (
    <ul ref={grid} role="listbox" aria-label={label} aria-multiselectable={multiple || undefined} className={cx('ar-gallery', className)} data-cols={cols}>
      {items.map((m, i) => {
        const on = v.includes(m.id);
        return (
          <li key={m.id} role="option" aria-selected={on} aria-disabled={m.disabled || undefined}
            tabIndex={i === tabStop ? 0 : -1} className={cx('ar-gallery-tile', on && 'is-selected', m.disabled && 'is-disabled')}
            onClick={() => !m.disabled && toggle(m.id)} onKeyDown={(e) => onKey(e, i)}>
            <span className="ar-gallery-media">
              <img src={m.src} alt={m.alt} loading="lazy" />
              {m.kind === 'video' && <span className="ar-gallery-kind">Video</span>}
              <span className="ar-gallery-check" aria-hidden="true">{on && <CheckIcon size={14} />}</span>
            </span>
            {m.caption && <span className="ar-gallery-cap ar-truncate">{m.caption}</span>}
          </li>
        );
      })}
    </ul>
  );
}
