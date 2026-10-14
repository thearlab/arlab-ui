'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useControllable, useFocusTrap } from '../hooks';
import { cx } from '../lib/cx';
import { addDays, addMonths, compare, fromISO, monthGrid, monthName, parseDate, sameMonth, startOfWeek, today, weekdayNames, type ISODate } from '../lib/dates';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../core/icons';
import { IconButton } from '../core/IconButton';
import { useFieldProps } from './Field';
import { Popup } from './listbox';

/** "14 Oct 2026" */
export const formatDate = (iso: ISODate) => fromISO(iso)!.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).replace('Sept', 'Sep');

export interface DatePickerProps {
  /** 'YYYY-MM-DD', or null for none. */
  value?: ISODate | null;
  defaultValue?: ISODate | null;
  onChange?: (value: ISODate | null) => void;
  min?: ISODate;
  max?: ISODate;
  /** Days that cannot be picked (weekends, holidays). */
  isDisabled?: (day: ISODate) => boolean;
  /** 1 = Monday (default), 0 = Sunday. */
  weekStart?: 0 | 1;
  placeholder?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  /** Start open (previews and tests). */
  defaultOpen?: boolean;
  className?: string;
}

/** Type a date ("14/10/2026", "14 Oct 2026") or pick it from a calendar. In the calendar: arrows move
 * a day or a week, Page Up and Down a month (with Shift a year), Home and End the week, Enter picks,
 * Esc closes and returns to the field. */
export function DatePicker(props: DatePickerProps) {
  const { value, defaultValue = null, onChange, min, max, isDisabled, weekStart = 1, placeholder = 'dd/mm/yyyy', name, className } = props;
  const f = useFieldProps(props, props.invalid);
  const [v, setV] = useControllable<ISODate | null>(value, defaultValue, onChange);
  const [text, setText] = useState(v ? formatDate(v) : '');
  const [bad, setBad] = useState('');
  const [open, setOpen] = useState(!!props.defaultOpen);
  const [focus, setFocus] = useState<ISODate>(v ?? today());
  const box = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const uid = useId();
  useEffect(() => { setText(v ? formatDate(v) : ''); setBad(''); }, [v]);
  useFocusTrap(panel, open);

  const blocked = (d: ISODate) => (min !== undefined && compare(d, min) < 0) || (max !== undefined && compare(d, max) > 0) || !!isDisabled?.(d);
  const commitText = () => {
    if (!text.trim()) { setV(null); setBad(''); return; }
    const d = parseDate(text);
    if (!d) { setBad('Type a date like 14/10/2026.'); return; }
    if (blocked(d)) { setBad(`${formatDate(d)} cannot be picked.`); return; }
    setV(d); setText(formatDate(d)); setBad('');
  };
  const show = () => { setFocus(v ?? (min && compare(today(), min) < 0 ? min : today())); setOpen(true); };
  const close = () => { setOpen(false); btn.current?.focus(); };
  const pick = (d: ISODate) => { if (blocked(d)) return; setV(d); setOpen(false); btn.current?.focus(); };

  // Focus the roving day after each move.
  useEffect(() => { if (open) panel.current?.querySelector<HTMLButtonElement>(`[data-day="${focus}"]`)?.focus({ preventScroll: true }); }, [open, focus]);

  const onGridKey = (e: KeyboardEvent) => {
    const m: Record<string, () => ISODate> = {
      ArrowLeft: () => addDays(focus, getComputedStyle(e.currentTarget).direction === 'rtl' ? 1 : -1),
      ArrowRight: () => addDays(focus, getComputedStyle(e.currentTarget).direction === 'rtl' ? -1 : 1),
      ArrowUp: () => addDays(focus, -7), ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, e.shiftKey ? -12 : -1), PageDown: () => addMonths(focus, e.shiftKey ? 12 : 1),
      Home: () => startOfWeek(focus, weekStart), End: () => addDays(startOfWeek(focus, weekStart), 6),
    };
    if (m[e.key]) { e.preventDefault(); setFocus(m[e.key]()); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(focus); }
  };

  const grid = monthGrid(focus, weekStart);
  const names = weekdayNames(weekStart, 'short');
  const longNames = weekdayNames(weekStart, 'long');
  const t = today();
  const errId = bad ? `${uid}-err` : undefined;

  return (
    <div className={cx('ar-date', className)}>
      <div ref={box} className={cx('ar-input', (f.invalid || bad) && 'is-invalid', f.disabled && 'is-disabled')}>
        <input
          id={f.id}
          className="ar-input-el"
          value={text}
          placeholder={placeholder}
          aria-label={props['aria-label']}
          aria-describedby={[f['aria-describedby'], errId].filter(Boolean).join(' ') || undefined}
          aria-invalid={f['aria-invalid'] || !!bad || undefined}
          required={f.required}
          disabled={f.disabled}
          autoComplete="off"
          onChange={(e) => { setText(e.target.value); setBad(''); }}
          onBlur={commitText}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitText(); } else if (e.key === 'ArrowDown' && e.altKey) { e.preventDefault(); show(); } }}
        />
        <IconButton ref={btn} size="sm" label={v ? `Choose date, ${formatDate(v)}` : 'Choose date'} tip={false} aria-haspopup="dialog" aria-expanded={open} disabled={f.disabled} onClick={() => (open ? close() : show())}>
          <CalendarIcon size={16} />
        </IconButton>
      </div>
      {bad && <p className="ar-field-error" id={errId} role="alert">{bad}</p>}
      {name && <input type="hidden" name={name} value={v ?? ''} />}
      <Popup open={open} anchor={box} matchWidth={false} onDismiss={() => setOpen(false)} className="ar-popup--datepicker">
        <div ref={panel} role="dialog" aria-modal="false" aria-label="Choose a date" className="ar-datepicker ar-scroll"
          onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } }}>
          <div className="ar-datepicker-head">
            <IconButton size="sm" label="Previous month" onClick={() => setFocus(addMonths(focus, -1))}><ChevronLeftIcon size={16} className="ar-flip-rtl" /></IconButton>
            <h2 className="ar-datepicker-title" aria-live="polite">{monthName(focus)}</h2>
            <IconButton size="sm" label="Next month" onClick={() => setFocus(addMonths(focus, 1))}><ChevronRightIcon size={16} className="ar-flip-rtl" /></IconButton>
          </div>
          <table role="grid" className="ar-datepicker-grid" aria-label={monthName(focus)} onKeyDown={onGridKey}>
            <thead><tr>{names.map((n, i) => <th key={n} scope="col" abbr={longNames[i]}>{n.slice(0, 2)}</th>)}</tr></thead>
            <tbody>
              {grid.map((row) => (
                <tr key={row[0]}>
                  {row.map((d) => {
                    const out = !sameMonth(d, focus), off = blocked(d), sel = d === v;
                    return (
                      <td key={d} role="gridcell" aria-selected={sel || undefined}>
                        <button type="button" data-day={d} tabIndex={d === focus ? 0 : -1} aria-disabled={off || undefined}
                          aria-current={d === t ? 'date' : undefined}
                          aria-label={fromISO(d)!.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          className={cx('ar-datepicker-day', out && 'is-out', off && 'is-off', sel && 'is-selected', d === t && 'is-today')}
                          onClick={() => { setFocus(d); pick(d); }}>
                          {Number(d.slice(8))}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ar-datepicker-foot">
            <button type="button" className="ar-linkbtn" disabled={blocked(t)} onClick={() => pick(t)}>Today</button>
            {v && <button type="button" className="ar-linkbtn" onClick={() => { setV(null); close(); }}>Clear</button>}
          </div>
        </div>
      </Popup>
    </div>
  );
}
