'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SearchIcon } from './icons';

export interface CommandItem {
  id: string;
  title: string;
  summary?: string;
  typeLabel?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  emptyLabel?: string;
  /** Custom ranking/filter. Defaults to a simple title+summary substring match. */
  filter?: (query: string, items: CommandItem[]) => CommandItem[];
}

const defaultFilter: NonNullable<CommandPaletteProps['filter']> = (query, items) => {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => i.title.toLowerCase().includes(q) || i.summary?.toLowerCase().includes(q));
};

/** A Cmd/Ctrl+K searchable modal — wire your own keyboard-shortcut
 * listener to flip `open` (kept out of this component so it doesn't fight
 * a host app's existing shortcut handling); this owns the search,
 * ranking, keyboard nav, and result list only. */
export function CommandPalette({ open, onClose, items, placeholder = 'Search…', emptyLabel = 'No matches.', filter = defaultFilter }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => filter(query, items).slice(0, 24), [filter, query, items]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[active];
      if (item) {
        item.onSelect();
        onClose();
      }
    }
  }

  if (!open) return null;

  return createPortal(
    <div
      className="arlab-cmdk-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="arlab-cmdk arlab-accent-edge" onKeyDown={onKeyDown}>
        <div className="arlab-cmdk-input-row">
          <SearchIcon size={16} />
          <input ref={inputRef} className="arlab-cmdk-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} />
          <span className="arlab-cmdk-kbd">ESC</span>
        </div>
        <div className="arlab-cmdk-list" ref={listRef} role="listbox">
          {results.length === 0 ? (
            <div className="arlab-cmdk-empty">{emptyLabel}</div>
          ) : (
            results.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={i === active}
                data-active={i === active}
                className={['arlab-cmdk-row', i === active ? 'active' : ''].filter(Boolean).join(' ')}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  item.onSelect();
                  onClose();
                }}
              >
                {item.typeLabel ? <span className="arlab-cmdk-row-type">{item.typeLabel}</span> : null}
                <span className="arlab-cmdk-row-main">
                  <span className="arlab-cmdk-row-title">{item.title}</span>
                  {item.summary ? <span className="arlab-cmdk-row-summary">{item.summary}</span> : null}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}