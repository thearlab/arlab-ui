'use client';

import { useMemo, useState } from 'react';
import { Input } from './Field';

export interface PickerOption {
  id: string;
  label: string;
  meta?: string;
  disabled?: boolean;
}

export interface ComboboxPickerProps {
  options: PickerOption[];
  onSelect: (option: PickerOption) => void;
  placeholder?: string;
  emptyLabel?: string;
  autoFocus?: boolean;
}

/** Search input + filtered, keyboard-navigable list. This is the pattern
 * behind arlab-studio's doc-reference picker, hardened with arrow-key nav
 * (it previously had none). Render it inline (as that picker does) or
 * inside a Popover/Dialog for an overlay combobox — same component either way. */
export function ComboboxPicker({ options, onSelect, placeholder = 'Search…', emptyLabel = 'No matches.', autoFocus }: ComboboxPickerProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.meta?.toLowerCase().includes(q));
  }, [options, query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[active];
      if (opt && !opt.disabled) onSelect(opt);
    }
  }

  return (
    <div className="arlab-picker">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      <div className="arlab-picker-list" role="listbox">
        {filtered.length === 0 ? (
          <div className="arlab-picker-empty">{emptyLabel}</div>
        ) : (
          filtered.map((opt, i) => (
            <button
              key={opt.id}
              type="button"
              role="option"
              aria-selected={i === active}
              disabled={opt.disabled}
              className={['arlab-picker-item', i === active ? 'active' : ''].filter(Boolean).join(' ')}
              onMouseEnter={() => setActive(i)}
              onClick={() => onSelect(opt)}
            >
              <span>{opt.label}</span>
              {opt.meta ? <span className="arlab-picker-item-meta">{opt.meta}</span> : null}
            </button>
          ))
        )}
      </div>
    </div>
  );
}