'use client';
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { search } from '../lib/search';
import { ChevronDownIcon } from '../core/icons';
import { Spinner } from '../core/Spinner';
import { useFieldProps } from './Field';
import { Popup, OptionRow, useScrollActive, stepEnabled, firstEnabled, lastEnabled, type ListOption } from './listbox';

export interface ComboboxProps {
  options: ListOption[];
  /** The chosen value (an option's value, or typed text when allowCustom). */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fires as people type: fetch options here for an async list (set filter={false}). */
  onInputChange?: (text: string) => void;
  /** Accept what was typed even when it is not an option. */
  allowCustom?: boolean;
  /** Turn typed text into a value (or null to refuse it). Used with allowCustom. */
  normalize?: (text: string) => string | null;
  /** Filter options by the typed text (default). Off when the caller filters (async). */
  filter?: boolean;
  /** Options are on their way (async). */
  loading?: boolean;
  placeholder?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  /** A leading icon in the box. */
  icon?: ReactNode;
  className?: string;
}

/** Type or pick: a text field joined to a list of suggestions (APG combobox with list autocomplete). */
export function Combobox(props: ComboboxProps) {
  const { options, value, defaultValue = '', onChange, onInputChange, allowCustom, normalize, filter = true, loading, placeholder, name, icon, className } = props;
  const f = useFieldProps(props, props.invalid);
  const [v, setV] = useControllable(value, defaultValue, onChange);
  const labelOf = (val: string) => options.find((o) => o.value === val)?.label ?? val;
  const [text, setText] = useState(() => labelOf(v));
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const uid = useId();
  const listId = `${uid}-list`;
  const optId = (i: number) => `${uid}-o${i}`;
  useEffect(() => { if (!typing) setText(labelOf(v)); }, [v, options]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = useMemo(() => (filter && typing && text ? search(options, text, (o) => o.label) : options), [options, text, typing, filter]);
  useScrollActive(list, active >= 0 ? optId(active) : undefined);

  const commit = (val: string) => { setV(val); setText(labelOf(val)); setTyping(false); setOpen(false); };
  const settle = () => {
    // Leaving the field: keep a typed custom value, or go back to the chosen one.
    if (typing) {
      const exact = options.find((o) => o.label.toLowerCase() === text.trim().toLowerCase());
      if (exact) commit(exact.value);
      else if (allowCustom && text.trim()) { const n = normalize ? normalize(text) : text.trim(); if (n !== null) commit(n); else { setText(labelOf(v)); setTyping(false); } }
      else if (!text.trim() && allowCustom) commit('');
      else { setText(labelOf(v)); setTyping(false); }
    }
    setOpen(false);
  };

  return (
    <div ref={box} className={cx('ar-input', 'ar-combobox', f.invalid && 'is-invalid', f.disabled && 'is-disabled', className)}>
      {icon && <span className="ar-input-affix" aria-hidden="true">{icon}</span>}
      <input
        ref={input}
        id={f.id}
        className="ar-input-el"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 && shown[active] ? optId(active) : undefined}
        aria-label={props['aria-label']}
        aria-describedby={f['aria-describedby']}
        aria-invalid={f['aria-invalid']}
        aria-busy={loading || undefined}
        required={f.required}
        disabled={f.disabled}
        placeholder={placeholder}
        autoComplete="off"
        value={text}
        onChange={(e) => { setText(e.target.value); setTyping(true); setOpen(true); setActive(e.target.value ? 0 : -1); onInputChange?.(e.target.value); }}
        onClick={() => setOpen(true)}
        onBlur={(e) => { if (!e.relatedTarget || !box.current?.contains(e.relatedTarget as Node)) settle(); }}
        onKeyDown={(e) => {
          const k = e.key;
          if (k === 'ArrowDown') { e.preventDefault(); if (!open) { setOpen(true); setActive(Math.max(0, shown.findIndex((o) => o.value === v))); } else setActive((a) => (a < 0 ? firstEnabled(shown) : stepEnabled(shown, a, 1))); }
          else if (k === 'ArrowUp') { e.preventDefault(); if (!open) { setOpen(true); setActive(lastEnabled(shown)); } else setActive((a) => stepEnabled(shown, a, -1)); }
          else if (k === 'Enter') { if (open && active >= 0 && shown[active]) { e.preventDefault(); if (!shown[active].disabled) commit(shown[active].value); } else if (typing) { e.preventDefault(); settle(); } }
          else if (k === 'Escape') { if (open) { e.preventDefault(); e.stopPropagation(); setOpen(false); } else if (text) { e.preventDefault(); e.stopPropagation(); setText(''); setTyping(true); } }
          else if (k === 'Tab') settle();
        }}
      />
      {loading ? <span className="ar-input-affix"><Spinner size={14} /></span> : (
        <button type="button" className="ar-combobox-btn" tabIndex={-1} aria-label="Show suggestions" disabled={f.disabled}
          onMouseDown={(e) => e.preventDefault()} onClick={() => { setOpen((o) => !o); input.current?.focus(); }}>
          <ChevronDownIcon size={16} />
        </button>
      )}
      {name && <input type="hidden" name={name} value={v} />}
      <Popup open={open} anchor={box} onDismiss={settle}>
        <ul ref={list} id={listId} role="listbox" aria-label={props['aria-label'] ?? 'Suggestions'} className="ar-listbox ar-scroll">
          {shown.map((o, i) => <OptionRow key={o.value} id={optId(i)} option={o} selected={o.value === v} active={i === active} onPick={() => commit(o.value)} onHover={() => setActive(i)} />)}
          {!shown.length && (
            <li className="ar-listempty" role="presentation">
              {loading ? 'Searching' : allowCustom && text.trim() ? `Press Enter to use "${text.trim()}".` : 'Nothing matches.'}
            </li>
          )}
        </ul>
      </Popup>
    </div>
  );
}
