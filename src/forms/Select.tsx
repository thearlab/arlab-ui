'use client';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { typeahead } from '../lib/keys';
import { search } from '../lib/search';
import { ChevronDownIcon, SearchIcon } from '../core/icons';
import { useFieldProps } from './Field';
import { Popup, OptionRow, useScrollActive, stepEnabled, firstEnabled, lastEnabled, type ListOption } from './listbox';

export type SelectOption<V extends string = string> = ListOption<V>;

export interface SelectProps<V extends string = string> {
  /** The first option is the "all" state, written as a phrase ("Every kind"), never blank. */
  options: SelectOption<V>[];
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
  /** Accessible name when the Select is not inside a Field (filters bar). */
  'aria-label'?: string;
  /** Shown when nothing matches the value. */
  placeholder?: string;
  /** Submitted with a form as a hidden input. */
  name?: string;
  id?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  size?: 'sm' | 'md';
  /** Full width of its container. */
  block?: boolean;
  /** A search box appears inside when there are more options than this (default 8). */
  searchAbove?: number;
  searchPlaceholder?: string;
  /** Show the "Label: value" form in the trigger (filter bars). */
  prefixLabel?: string;
  /** Start open (previews and tests). */
  defaultOpen?: boolean;
  className?: string;
  'aria-describedby'?: string;
}

/** The shared dropdown: a button that opens a list with a checkmark column, counts on the right and
 * a search box when the list is long. Keyboard: arrows, Home, End, type-ahead, Enter picks, Esc and
 * Tab close and give focus back. Opens up or down, whichever has more room. */
export function Select<V extends string = string>(props: SelectProps<V>) {
  const { options, value, defaultValue, onChange, placeholder = 'Choose', name, size = 'md', block, searchAbove = 8, searchPlaceholder = 'Search', prefixLabel, className } = props;
  const f = useFieldProps(props, props.invalid);
  const [v, setV] = useControllable<V | undefined>(value, defaultValue ?? options[0]?.value, onChange as (v: V | undefined) => void);
  const [open, setOpen] = useState(!!props.defaultOpen);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(() => (props.defaultOpen ? Math.max(0, options.findIndex((o) => o.value === (value ?? defaultValue ?? options[0]?.value))) : -1));
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: '', at: 0 });
  const uid = useId();
  const listId = `${uid}-list`;
  const searchable = options.length > searchAbove;
  const shown = useMemo(() => (searchable && q ? search(options, q, (o) => o.label) : options), [options, q, searchable]);
  const current = options.find((o) => o.value === v);
  const optId = (i: number) => `${uid}-o${i}`;
  useScrollActive(list, active >= 0 ? optId(active) : undefined);
  useEffect(() => { if (open && !searchable) list.current?.focus({ preventScroll: true }); }, [open, searchable]);

  const openList = (at?: number) => {
    if (f.disabled) return;
    setQ(''); setOpen(true);
    const sel = options.findIndex((o) => o.value === v);
    setActive(at ?? (sel >= 0 ? sel : firstEnabled(options)));
  };
  const close = (focus = true) => { setOpen(false); setQ(''); if (focus) trigger.current?.focus(); };
  const pick = (o: SelectOption<V>) => { if (o.disabled) return; setV(o.value); close(); };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList(e.key === 'ArrowUp' ? lastEnabled(options) : undefined); }
    else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      if (searchable) { openList(); setQ(e.key); setActive(0); }
      else { const i = typeahead(options.map((o) => o.label), e.key, options.findIndex((o) => o.value === v)); openList(i >= 0 ? i : undefined); }
    }
  };
  const onListKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); setActive((a) => stepEnabled(shown, a, 1)); }
    else if (k === 'ArrowUp') { e.preventDefault(); setActive((a) => stepEnabled(shown, a, -1)); }
    else if (k === 'Home' && !(searchable && q)) { e.preventDefault(); setActive(firstEnabled(shown)); }
    else if (k === 'End' && !(searchable && q)) { e.preventDefault(); setActive(lastEnabled(shown)); }
    else if (k === 'PageDown' || k === 'PageUp') { e.preventDefault(); setActive((a) => { let i = a; for (let n = 0; n < 8; n++) i = stepEnabled(shown, i, k === 'PageDown' ? 1 : -1); return i; }); }
    else if (k === 'Enter' || (k === ' ' && !searchable)) { e.preventDefault(); const o = shown[active]; if (o) pick(o); }
    else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    else if (k === 'Tab') { close(false); }
    else if (!searchable && k.length === 1 && !e.metaKey && !e.ctrlKey) {
      const now = Date.now(); const t = now - typed.current.at < 600 ? typed.current.text + k : k; typed.current = { text: t, at: now };
      const i = typeahead(shown.map((o) => o.label), t, active); if (i >= 0) setActive(i);
    }
  };

  const label = current ? current.label : placeholder;
  return (
    <div className={cx('ar-select', block && 'ar-select--block', className)}>
      <button
        ref={trigger}
        type="button"
        id={f.id}
        className={cx('ar-select-trigger', `ar-select-trigger--${size}`, f.invalid && 'is-invalid', !current && 'is-placeholder')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={[props['aria-label'] ? `${uid}-name` : f.labelId, `${uid}-value`, current?.count !== undefined ? `${uid}-count` : ''].filter(Boolean).join(' ') || undefined}
        aria-describedby={f['aria-describedby']}
        aria-invalid={f['aria-invalid']}
        disabled={f.disabled}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onTriggerKey}
      >
        {props['aria-label'] && <span id={`${uid}-name`} hidden>{props['aria-label']}</span>}
        <span className="ar-select-value" id={`${uid}-value`}>{prefixLabel && <span className="ar-select-prefix">{prefixLabel}: </span>}{label}</span>
        {current?.count !== undefined && ' '}
        {current?.count !== undefined && <span className="ar-select-count" id={`${uid}-count`}>{current.count.toLocaleString('en-US')}</span>}
        <ChevronDownIcon size={16} className="ar-select-chev" />
      </button>
      {name && <input type="hidden" name={name} value={v ?? ''} />}
      <Popup open={open} anchor={trigger} onDismiss={() => close(false)}>
        <div className="ar-listpanel" onKeyDown={onListKey}>
          {searchable && (
            <div className="ar-listsearch">
              <SearchIcon size={16} aria-hidden="true" />
              <input
                autoFocus
                className="ar-listsearch-input"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={active >= 0 && shown[active] ? optId(active) : undefined}
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                value={q}
                onChange={(e) => { setQ(e.target.value); setActive(e.target.value ? 0 : firstEnabled(options)); }}
              />
            </div>
          )}
          <ul
            ref={list}
            id={listId}
            role="listbox"
            tabIndex={searchable ? -1 : 0}
            aria-label={props['aria-label'] ?? (prefixLabel || 'Options')}
            aria-labelledby={!props['aria-label'] && f.labelId ? f.labelId : undefined}
            aria-activedescendant={!searchable && active >= 0 ? optId(active) : undefined}
            className="ar-listbox ar-scroll"
          >
            {shown.map((o, i) => (
              <OptionRow key={o.value} id={optId(i)} option={o} selected={o.value === v} active={i === active} onPick={() => pick(o)} onHover={() => setActive(i)} />
            ))}
            {!shown.length && <li className="ar-listempty" role="presentation">Nothing matches "{q}".</li>}
          </ul>
        </div>
      </Popup>
    </div>
  );
}

/** Make "every" options from facets: [{ value: '', label: 'Every kind', count: total }, ...]. */
export function withAllOption<V extends string>(label: string, options: SelectOption<V>[]): SelectOption<V | ''>[] {
  const total = options.reduce((n, o) => n + (o.count ?? 0), 0);
  return [{ value: '', label, count: options.some((o) => o.count !== undefined) ? total : undefined }, ...options];
}
