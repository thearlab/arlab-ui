'use client';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { search } from '../lib/search';
import { ChevronDownIcon, CloseIcon, SearchIcon } from '../core/icons';
import { useFieldProps } from './Field';
import { Popup, OptionRow, useScrollActive, stepEnabled, firstEnabled, lastEnabled, type ListOption } from './listbox';

export interface MultiSelectProps<V extends string = string> {
  options: ListOption<V>[];
  value?: V[];
  defaultValue?: V[];
  onChange?: (value: V[]) => void;
  /** Shown when nothing is chosen, as the "all" phrase ("Every department"). */
  placeholder?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  /** How many chips the trigger shows before "+N" (default 2). */
  maxChips?: number;
  searchAbove?: number;
  block?: boolean;
  /** Start open (previews and tests). */
  defaultOpen?: boolean;
  className?: string;
}

/** Choose several: chips in the trigger, a list of checkboxes, search when long, select all and clear.
 * Space or Enter ticks, the list stays open; Esc or Tab closes. */
export function MultiSelect<V extends string = string>(props: MultiSelectProps<V>) {
  const { options, value, defaultValue = [], onChange, placeholder = 'Choose', name, maxChips = 2, searchAbove = 8, block, className } = props;
  const f = useFieldProps(props, props.invalid);
  const [v, setV] = useControllable<V[]>(value, defaultValue, onChange);
  const [open, setOpen] = useState(!!props.defaultOpen);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(-1);
  const trigger = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const uid = useId();
  const listId = `${uid}-list`;
  const optId = (i: number) => `${uid}-o${i}`;
  const searchable = options.length > searchAbove;
  const shown = useMemo(() => (q ? search(options, q, (o) => o.label) : options), [options, q]);
  useScrollActive(list, active >= 0 ? optId(active) : undefined);
  useEffect(() => { if (open && !searchable) list.current?.focus({ preventScroll: true }); }, [open, searchable]);

  const toggle = (o: ListOption<V>) => { if (o.disabled) return; setV(v.includes(o.value) ? v.filter((x) => x !== o.value) : [...v, o.value]); };
  const close = (focus = true) => { setOpen(false); setQ(''); if (focus) btn.current?.focus(); };
  const enabled = options.filter((o) => !o.disabled).map((o) => o.value);
  const chosen = options.filter((o) => v.includes(o.value));
  const summary = chosen.length ? chosen.map((o) => o.label).join(', ') : placeholder;

  const onListKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); setActive((a) => stepEnabled(shown, a, 1)); }
    else if (k === 'ArrowUp') { e.preventDefault(); setActive((a) => stepEnabled(shown, a, -1)); }
    else if (k === 'Home' && !q) { e.preventDefault(); setActive(firstEnabled(shown)); }
    else if (k === 'End' && !q) { e.preventDefault(); setActive(lastEnabled(shown)); }
    else if (k === 'Enter' || (k === ' ' && (!searchable || (e.target as HTMLElement).tagName !== 'INPUT'))) { e.preventDefault(); const o = shown[active]; if (o) toggle(o); }
    else if ((k === 'a' || k === 'A') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setV(enabled); }
    else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    else if (k === 'Tab') close(false);
  };

  return (
    <div className={cx('ar-select', 'ar-multi', block && 'ar-select--block', className)}>
      <div ref={trigger} className={cx('ar-select-trigger', 'ar-multi-trigger', f.invalid && 'is-invalid', f.disabled && 'is-disabled')}>
        <button
          ref={btn}
          type="button"
          id={f.id}
          className="ar-multi-btn"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-label={`${props['aria-label'] ? props['aria-label'] + ': ' : ''}${summary}`}
          aria-describedby={f['aria-describedby']}
          aria-invalid={f['aria-invalid']}
          disabled={f.disabled}
          onClick={() => (open ? close() : (setOpen(true), setActive(firstEnabled(options))))}
          onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); setActive(firstEnabled(options)); } }}
        >
          {!chosen.length && <span className="ar-select-value is-placeholder">{placeholder}</span>}
        </button>
        {!!chosen.length && (
          <span className="ar-multi-chips">
            {chosen.slice(0, maxChips).map((o) => (
              <span key={o.value} className="ar-chip-token">
                <span className="ar-truncate">{o.label}</span>
                {!f.disabled && <button type="button" className="ar-chip-x" aria-label={`Remove ${o.label}`} onClick={() => setV(v.filter((x) => x !== o.value))}><CloseIcon size={12} /></button>}
              </span>
            ))}
            {chosen.length > maxChips && <span className="ar-chip-more">+{chosen.length - maxChips}</span>}
          </span>
        )}
        <ChevronDownIcon size={16} className="ar-select-chev" aria-hidden="true" />
      </div>
      {name && v.map((x) => <input key={x} type="hidden" name={name} value={x} />)}
      <Popup open={open} anchor={trigger} onDismiss={() => close(false)}>
        <div className="ar-listpanel" onKeyDown={onListKey}>
          {searchable && (
            <div className="ar-listsearch">
              <SearchIcon size={16} aria-hidden="true" />
              <input autoFocus className="ar-listsearch-input" role="combobox" aria-expanded="true" aria-controls={listId} aria-autocomplete="list"
                aria-activedescendant={active >= 0 && shown[active] ? optId(active) : undefined} aria-label="Search" placeholder="Search"
                value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} />
            </div>
          )}
          <div className="ar-listtools">
            <span className="ar-listtools-count" aria-live="polite">{v.length} of {options.length} chosen</span>
            <button type="button" className="ar-linkbtn" onClick={() => setV(enabled)} disabled={v.length === enabled.length}>Select all</button>
            <button type="button" className="ar-linkbtn" onClick={() => setV([])} disabled={!v.length}>Clear</button>
          </div>
          <ul ref={list} id={listId} role="listbox" aria-multiselectable="true" tabIndex={searchable ? -1 : 0}
            aria-label={props['aria-label'] ?? 'Options'} aria-activedescendant={!searchable && active >= 0 ? optId(active) : undefined} className="ar-listbox ar-scroll">
            {shown.map((o, i) => <OptionRow key={o.value} id={optId(i)} multi option={o} selected={v.includes(o.value)} active={i === active} onPick={() => { setActive(i); toggle(o); }} onHover={() => setActive(i)} />)}
            {!shown.length && <li className="ar-listempty" role="presentation">Nothing matches "{q}".</li>}
          </ul>
        </div>
      </Popup>
    </div>
  );
}
