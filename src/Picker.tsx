'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export interface PickerOption { value: string; label: string; count?: number }

export interface PickerProps {
  /** Shown small and uppercase inside the button ("Client", "Shelf"). */
  label: string;
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  /** A search field appears from this many options (default 10). */
  searchFrom?: number;
  className?: string;
}

/** The dropdown for filters and form choices: a button that names the current choice and its
 * count, and a panel of options with counts. Long lists get a search. Arrow keys, Enter, Escape.
 * Use it instead of a native <select> wherever the options carry counts or need to be found. */
export function Picker({ label, value, options, onChange, searchFrom = 10, className = '' }: PickerProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value) || options[0];
  const shown = useMemo(() => (q.trim() ? options.filter((o) => o.label.toLowerCase().includes(q.trim().toLowerCase())) : options), [q, options]);

  useEffect(() => {
    if (!open) return;
    setQ(''); setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    const away = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => { list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' }); }, [active, open]);

  const pick = (o?: PickerOption) => { if (!o) return; onChange(o.value); setOpen(false); };
  const keys = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setOpen(true); return; }
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, shown.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(shown[active]); }
  };

  return (
    <div className={['arlab-picker-x', className].filter(Boolean).join(' ')} ref={wrap} onKeyDown={keys}>
      <button type="button" className="arlab-picker-btn" aria-haspopup="listbox" aria-expanded={open} aria-label={`${label}: ${current?.label}`} onClick={() => setOpen(!open)}>
        <span className="k">{label}</span>
        <span className="v">{current?.label}</span>
        {current?.count !== undefined && <span className="n">{current.count}</span>}
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="arlab-picker-panel">
          {options.length >= searchFrom && (
            <input className="arlab-picker-search" autoFocus placeholder={`Find a ${label.toLowerCase()}`} value={q} aria-label={`Find a ${label.toLowerCase()}`} onChange={(e) => { setQ(e.target.value); setActive(0); }} />
          )}
          <div className="arlab-picker-opts" role="listbox" aria-label={label} ref={list}>
            {shown.map((o, i) => (
              <button key={o.value || '_all'} type="button" role="option" data-i={i} aria-selected={o.value === value}
                className={['arlab-picker-opt', i === active ? 'active' : '', o.value === value ? 'on' : ''].filter(Boolean).join(' ')}
                onMouseEnter={() => setActive(i)} onClick={() => pick(o)}>
                <span className="t">{o.label}</span>
                {o.count !== undefined && <span className="n">{o.count}</span>}
              </button>
            ))}
            {!shown.length && <div className="arlab-picker-none">Nothing matches.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
