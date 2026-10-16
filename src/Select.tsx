'use client';

import { Children, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type SelectHTMLAttributes, type KeyboardEvent, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icons';

const SEARCH_FROM = 8;
type Option = { value: string; label: string; disabled: boolean; count?: string };
function optionsFrom(children: ReactNode): Option[] {
  return Children.toArray(children).flatMap(child => {
    if (!isValidElement<{value?: string; children?: ReactNode; disabled?: boolean; 'data-count'?: string | number}>(child)) return [];
    if (child.type !== 'option') return optionsFrom(child.props.children);
    const label = Children.toArray(child.props.children).join('');
    const count = child.props['data-count'];
    return [{ value: String(child.props.value ?? label), label, disabled: !!child.props.disabled, count: count == null ? undefined : String(count) }];
  });
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Marks the field invalid (red border); pair it with an error hint. */
  error?: boolean;
}

/** The Contour dropdown with native form semantics: a hidden native <select> keeps forms, `onChange(e)`,
 *  `required` and validation working; the visible part is a viewport-aware listbox. 8 or more options get a
 *  search box; fewer jump by typing (type-ahead). Arrow keys, Home/End, Enter, Escape, Tab. Disabled options
 *  are skipped. `<option data-count={n}>` shows a count on the right. */
export function Select({ children, value, defaultValue, onChange, id, className = '', style, error = false, ...props }: SelectProps) {
  const uid = useId();
  const listId = `${uid}-options`;
  const trigger = useRef<HTMLButtonElement>(null);
  const native = useRef<HTMLSelectElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: '', at: 0 });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [local, setLocal] = useState(String(defaultValue ?? ''));
  const [position, setPosition] = useState<CSSProperties>({left: 0, top: 0, width: 240, maxHeight: 320});
  const options = optionsFrom(children);
  const selected = String(value ?? local);
  const searchable = options.length >= SEARCH_FROM;
  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  const close = (focus = false) => { setOpen(false); if (focus) trigger.current?.focus(); };
  const choose = (option: Option) => {
    if (option.disabled || !native.current) return;
    native.current.value = option.value;
    native.current.dispatchEvent(new Event('change', { bubbles: true }));
    close(true);
  };
  const show = () => { setQuery(''); setActive(Math.max(0, options.findIndex(o => o.value === selected))); setOpen(true); };
  useLayoutEffect(() => {
    if (!open || !trigger.current) return;
    const rect = trigger.current.getBoundingClientRect();
    const below = innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const up = below < 220 && above > below;
    const maxHeight = Math.min(304, Math.max(100, up ? above : below));
    const width = Math.min(Math.max(rect.width, 180), innerWidth - 24);
    setPosition({ left: Math.max(12, Math.min(rect.left, innerWidth - width - 12)), ...(up ? {bottom: innerHeight - rect.top + 6} : {top: rect.bottom + 6}), width, maxHeight });
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => { if (!menu.current?.contains(e.target as Node) && !trigger.current?.contains(e.target as Node)) close(); };
    const scroll = (e: Event) => { if (!menu.current?.contains(e.target as Node)) close(); };
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', scroll);
    document.addEventListener('scroll', scroll, true);
    return () => { document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', scroll); document.removeEventListener('scroll', scroll, true); };
  }, [open]);
  useEffect(() => { if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({block: 'nearest'}); }, [active, open, listId]);
  useEffect(() => { if (open && !searchable) list.current?.focus(); }, [open, searchable]);
  function keyboard(e: KeyboardEvent) {
    if (!searchable && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now(), t = typed.current; t.text = (now - t.at > 700 ? '' : t.text) + e.key.toLowerCase(); t.at = now;
      const at = filtered.findIndex(o => !o.disabled && o.label.toLowerCase().startsWith(t.text));
      if (at >= 0) setActive(at);
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); return; }
    if (e.key === 'Tab') { close(true); return; }
    if (e.key === 'Enter' && filtered[active]) { e.preventDefault(); choose(filtered[active]); return; }
    if (['ArrowDown','ArrowUp','Home','End'].includes(e.key)) {
      e.preventDefault();
      let next = e.key === 'Home' ? 0 : e.key === 'End' ? filtered.length - 1 : active + (e.key === 'ArrowDown' ? 1 : -1);
      const direction = e.key === 'ArrowUp' || e.key === 'End' ? -1 : 1;
      while (filtered[next]?.disabled) next += direction;
      if (next >= 0 && next < filtered.length) setActive(next);
    }
  }
  const label = props['aria-label'] || (id ? document.querySelector(`label[for="${id}"]`)?.textContent : '') || 'Choose an option';
  return <div className={`arlab-dropdown ${className}`} style={style}>
    <select {...props} id={id ? `${id}-native` : undefined} ref={native} value={value} defaultValue={defaultValue} aria-hidden="true" aria-label={undefined} tabIndex={-1} className="arlab-dropdown-native" onInvalid={e => { e.preventDefault(); trigger.current?.focus(); }} onChange={e => { setLocal(e.target.value); onChange?.(e); }}>{children}</select>
    <button type="button" id={id} ref={trigger} className="arlab-dropdown-trigger" disabled={props.disabled} role="combobox" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby']} aria-expanded={open} aria-haspopup="listbox" aria-controls={open ? listId : undefined} aria-required={props.required} aria-invalid={error || undefined} onClick={() => open ? close() : show()} onKeyDown={e => { if (['ArrowDown','ArrowUp'].includes(e.key)) { e.preventDefault(); show(); } }}>
      <span>{options.find(o => o.value === selected)?.label || options[0]?.label || 'Choose an option'}</span><Icon name="ChevronDown" size={16} className={open ? 'rotated' : ''} />
    </button>
    {open && createPortal(<div ref={menu} className="arlab-dropdown-panel" style={position} onKeyDown={keyboard}>
      {searchable && <label className="arlab-dropdown-search"><Icon name="Search" size={16} /><input autoFocus aria-label={`Search ${label}`} role="combobox" aria-expanded="true" aria-controls={listId} aria-activedescendant={filtered[active] ? `${listId}-${active}` : undefined} value={query} placeholder="Search" onChange={e => { setQuery(e.target.value); setActive(0); }} /></label>}
      <div ref={list} className="arlab-dropdown-options" id={listId} role="listbox" aria-label={String(label)} tabIndex={searchable ? undefined : 0} aria-activedescendant={!searchable && filtered[active] ? `${listId}-${active}` : undefined}>
        {filtered.map((o, index) => <button type="button" tabIndex={-1} key={o.value} id={`${listId}-${index}`} role="option" className={`arlab-dropdown-option${index === active ? ' highlighted' : ''}`} aria-selected={o.value === selected} aria-disabled={o.disabled || undefined} disabled={o.disabled} onPointerMove={() => setActive(index)} onClick={() => choose(o)}><span>{o.label}</span>{o.count != null && <small className="option-count">{o.count}</small>}{o.value === selected && <Icon name="Check" size={16} />}</button>)}
        {!filtered.length && <p className="arlab-dropdown-empty">No matching options<span>Try another word.</span></p>}
      </div>
    </div>, trigger.current?.closest('.arlab-dialog') || document.body)}
  </div>;
}
