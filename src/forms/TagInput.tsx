'use client';
import { useId, useMemo, useRef, useState } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { search } from '../lib/search';
import { CloseIcon } from '../core/icons';
import { useFieldProps } from './Field';
import { Popup, OptionRow, type ListOption } from './listbox';

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  /** Suggestions shown as people type (recipients, clients, tags). */
  suggestions?: string[];
  /** Return an error sentence to refuse a tag ("That does not look like an email address."). */
  validate?: (tag: string) => string | null;
  /** Case-insensitive duplicates are refused (default true). */
  unique?: boolean;
  max?: number;
  placeholder?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

/** A token field (HIG): Enter, comma or Tab adds what was typed as a chip, Backspace on an empty field
 * removes the last one, every chip has its own remove button. Recipients, tags, clients on a brief. */
export function TagInput(props: TagInputProps) {
  const { value, defaultValue = [], onChange, suggestions = [], validate, unique = true, max, placeholder = 'Type and press Enter', name, className } = props;
  const f = useFieldProps(props, props.invalid);
  const [tags, setTags] = useControllable(value, defaultValue, onChange);
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const uid = useId();
  const full = max !== undefined && tags.length >= max;
  const opts: ListOption[] = useMemo(() => (text.trim() ? search(suggestions.filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase())), text, (s) => s).slice(0, 8) : []).map((s) => ({ value: s, label: s })), [suggestions, text, tags]);
  const open = opts.length > 0 && !full;

  const add = (raw: string) => {
    const t = raw.trim().replace(/,$/, '');
    if (!t) return;
    if (full) { setErr(`${max} at most.`); return; }
    if (unique && tags.some((x) => x.toLowerCase() === t.toLowerCase())) { setErr(`${t} is already in.`); return; }
    const e = validate?.(t); if (e) { setErr(e); return; }
    setTags([...tags, t]); setText(''); setErr(''); setActive(-1);
  };
  const remove = (i: number) => { setTags(tags.filter((_, j) => j !== i)); input.current?.focus(); };
  const errId = err ? `${uid}-err` : undefined;

  return (
    <div className={cx('ar-tags-wrap', className)}>
      <div ref={box} className={cx('ar-input', 'ar-tags', (f.invalid || err) && 'is-invalid', f.disabled && 'is-disabled')} onClick={() => input.current?.focus()}>
        <ul className="ar-tags-list" aria-label="Added">
          {tags.map((t, i) => (
            <li key={t + i} className="ar-chip-token">
              <span className="ar-truncate">{t}</span>
              {!f.disabled && <button type="button" className="ar-chip-x" aria-label={`Remove ${t}`} onClick={(e) => { e.stopPropagation(); remove(i); }}><CloseIcon size={12} /></button>}
            </li>
          ))}
        </ul>
        <input
          ref={input}
          id={f.id}
          className="ar-input-el ar-tags-input"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? `${uid}-list` : undefined}
          aria-activedescendant={open && active >= 0 ? `${uid}-o${active}` : undefined}
          aria-label={props['aria-label']}
          aria-describedby={[f['aria-describedby'], errId].filter(Boolean).join(' ') || undefined}
          aria-invalid={f['aria-invalid'] || !!err || undefined}
          disabled={f.disabled || full}
          placeholder={full ? `${max} added` : placeholder}
          value={text}
          onChange={(e) => { setText(e.target.value); setErr(''); setActive(-1); if (e.target.value.endsWith(',')) add(e.target.value); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); add(open && active >= 0 ? opts[active].value : text); }
            else if (e.key === 'Tab' && text.trim()) { add(text); }
            else if (e.key === 'Backspace' && !text && tags.length) remove(tags.length - 1);
            else if (e.key === 'ArrowDown' && open) { e.preventDefault(); setActive((a) => Math.min(opts.length - 1, a + 1)); }
            else if (e.key === 'ArrowUp' && open) { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
            else if (e.key === 'Escape' && text) { e.preventDefault(); e.stopPropagation(); setText(''); }
          }}
          onBlur={() => { if (text.trim()) add(text); }}
        />
      </div>
      {err && <p className="ar-field-error" id={errId} role="alert">{err}</p>}
      {name && tags.map((t) => <input key={t} type="hidden" name={name} value={t} />)}
      <Popup open={open} anchor={box} onDismiss={() => setActive(-1)}>
        <ul id={`${uid}-list`} role="listbox" aria-label="Suggestions" className="ar-listbox ar-scroll">
          {opts.map((o, i) => <OptionRow key={o.value} id={`${uid}-o${i}`} option={o} selected={false} active={i === active} onPick={() => add(o.value)} onHover={() => setActive(i)} />)}
        </ul>
      </Popup>
    </div>
  );
}
