'use client';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { useDismiss, useFocusTrap, useScrollLock } from '../hooks';
import { Kbd, Portal } from '../core/Primitives';
import { SearchIcon } from '../core/icons';
import { Spinner } from '../core/Spinner';
import { matchShortcut } from '../lib/keys';
import { search } from '../lib/search';

export interface CommandItem {
  id: string;
  label: string;
  /** The group heading ("Pages", "Projects", "Actions"). */
  group?: string;
  /** A quiet second line or the type on the right ("Project", "Engineering"). */
  hint?: string;
  icon?: ReactNode;
  /** More words that should find it. */
  keywords?: string[];
  /** A shortcut shown on the right ('mod+n'). Display only. */
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  /** Ids shown first under "Recent" while nothing is typed. */
  recent?: string[];
  /** Names the scope: "Search pages, projects and people". */
  placeholder?: string;
  /** Results are still coming (async search through onQueryChange). */
  loading?: boolean;
  /** For async search: the query as typed. Filter `items` yourself, or let the menu rank them. */
  onQueryChange?: (q: string) => void;
  /** Set false when `items` are already filtered for the query (server search). */
  filter?: boolean;
  emptyLabel?: ReactNode;
  /** The dialog's accessible name. */
  label?: string;
}

/** The ⌘K menu: one place to jump anywhere or run an action. A modal dialog with a combobox and a
 * grouped listbox; arrows move, Enter runs, Esc closes and gives focus back. */
export function CommandMenu({ open, onOpenChange, items, recent = [], placeholder = 'Search pages and actions', loading, onQueryChange, filter = true, emptyLabel, label = 'Command menu' }: CommandMenuProps) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  useDismiss(open, close, [box]);
  useFocusTrap(box, open, input);
  useScrollLock(open);
  useEffect(() => { if (open) { setQ(''); setActive(0); } }, [open]);

  const groups = useMemo(() => {
    const out: Array<{ name: string; items: CommandItem[] }> = [];
    const add = (name: string, x: CommandItem) => { let g = out.find((o) => o.name === name); if (!g) out.push(g = { name, items: [] }); g.items.push(x); };
    if (!q.trim() && recent.length) {
      recent.map((r) => items.find((x) => x.id === r)).forEach((x) => x && add('Recent', x));
    }
    const found = filter ? search(items, q, (x) => [x.label, x.hint, x.group, ...(x.keywords ?? [])].filter(Boolean).join(' ')) : items;
    // With a query, rank across groups but keep each group together in the order its best hit came.
    found.forEach((x) => { if (!(!q.trim() && recent.includes(x.id))) add(x.group ?? 'Results', x); });
    return out;
  }, [items, q, recent, filter]);
  const flat = groups.flatMap((g) => g.items);
  const cur = Math.min(active, Math.max(0, flat.length - 1));
  const optId = (i: number) => `${id}-opt-${i}`;

  useEffect(() => { list.current?.querySelector(`[id="${optId(cur)}"]`)?.scrollIntoView?.({ block: 'nearest' }); }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = (x?: CommandItem) => { if (!x) return; close(); x.onSelect(); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((cur + 1) % Math.max(1, flat.length)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((cur - 1 + flat.length) % Math.max(1, flat.length)); }
    else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); setActive(0); }
    else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); setActive(flat.length - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); run(flat[cur]); }
  };

  if (!open) return null;
  let n = -1;
  return (
    <Portal>
      <div className="ar-cmdk-scrim">
        <div ref={box} role="dialog" aria-modal="true" aria-label={label} className="ar-cmdk">
          <div className="ar-cmdk-field">
            <SearchIcon size={18} aria-hidden="true" />
            <input ref={input} role="combobox" aria-expanded="true" aria-controls={`${id}-list`} aria-autocomplete="list"
              aria-activedescendant={flat.length ? optId(cur) : undefined} aria-label={placeholder} placeholder={placeholder}
              value={q} onChange={(e) => { setQ(e.target.value); setActive(0); onQueryChange?.(e.target.value); }} onKeyDown={onKey}
              autoComplete="off" spellCheck={false} />
            {loading && <Spinner size={16} label="Searching" />}
            <Kbd>Esc</Kbd>
          </div>
          <div ref={list} id={`${id}-list`} role="listbox" aria-label="Results" className="ar-cmdk-list">
            {groups.map((g) => (
              <div key={g.name} role="group" aria-labelledby={`${id}-g-${g.name}`} className="ar-cmdk-group">
                <div id={`${id}-g-${g.name}`} className="ar-cmdk-ghead" role="presentation">{g.name}</div>
                {g.items.map((x) => {
                  const i = ++n;
                  return (
                    <div key={g.name + x.id} id={optId(i)} role="option" aria-selected={i === cur} className="ar-cmdk-opt"
                      onPointerMove={() => i !== cur && setActive(i)} onClick={() => run(x)}>
                      {x.icon && <span className="ar-cmdk-icon" aria-hidden="true">{x.icon}</span>}
                      <span className="ar-cmdk-label">{x.label}</span>
                      {x.hint && <span className="ar-cmdk-hint">{x.hint}</span>}
                      {x.shortcut && <Kbd keys={x.shortcut} />}
                    </div>
                  );
                })}
              </div>
            ))}
            {!flat.length && !loading && <p className="ar-cmdk-empty" role="status">{emptyLabel ?? (q ? <>Nothing matches “{q}”. Try fewer words.</> : 'Nothing to show yet.')}</p>}
            {!flat.length && loading && <p className="ar-cmdk-empty" role="status">Searching</p>}
          </div>
          <div className="ar-cmdk-foot" aria-hidden="true">
            <span><Kbd>↑</Kbd><Kbd>↓</Kbd> move</span><span><Kbd>↵</Kbd> open</span><span><Kbd>Esc</Kbd> close</span>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/** Opens the command menu on ⌘K (Ctrl+K elsewhere). Never takes ⌘F, W, T, N, L. */
export function useCommandMenu(shortcut = 'mod+k') {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if (matchShortcut(e, shortcut)) { e.preventDefault(); setOpen((o) => !o); } };
    document.addEventListener('keydown', on);
    return () => document.removeEventListener('keydown', on);
  }, [shortcut]);
  return { open, setOpen, toggle: () => setOpen((o) => !o) };
}
