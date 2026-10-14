'use client';
import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
import { clampNumber, stepNumber } from '../lib/forms';
import { useControllable } from '../hooks';
import { CloseIcon, MinusIcon, PlusIcon, SearchIcon } from '../core/icons';
import { useFieldProps } from './Field';

function setRef<T>(r: React.Ref<T> | undefined, v: T) { if (typeof r === 'function') r(v); else if (r) (r as React.MutableRefObject<T>).current = v; }

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Shown inside the box before the text (an icon, "$", "https://"). Decorative. */
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** A clear button while there is text. Calls onClear (or empties an uncontrolled input). */
  clearable?: boolean;
  onClear?: () => void;
  /** Red edge and aria-invalid (a Field with an error sets this for you). */
  invalid?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Class on the outer box. */
  boxClassName?: string;
}

/** A single-line text field. Label it with a Field (or aria-label); the placeholder is a hint, never the label. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { prefix, suffix, clearable, onClear, invalid, size = 'md', className, boxClassName, type = 'text', ...rest }, ref,
) {
  const f = useFieldProps(rest, invalid);
  const inner = useRef<HTMLInputElement | null>(null);
  const [filled, setFilled] = useState(!!(rest.value ?? rest.defaultValue));
  useEffect(() => { if (rest.value !== undefined) setFilled(String(rest.value) !== ''); }, [rest.value]);
  const clear = () => {
    const el = inner.current;
    if (onClear) onClear();
    else if (el) {
      // An uncontrolled input: set the value natively so React's onChange still fires.
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(el, '');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    setFilled(false); el?.focus();
  };
  const { labelId: _l, invalid: _i, ...native } = f;
  return (
    <div className={cx('ar-input', `ar-input--${size}`, f.invalid && 'is-invalid', f.disabled && 'is-disabled', rest.readOnly && 'is-readonly', boxClassName)}>
      {prefix && <span className="ar-input-affix" aria-hidden="true">{prefix}</span>}
      <input
        ref={(el) => { inner.current = el; setRef(ref, el); }}
        type={type}
        className={cx('ar-input-el', className)}
        {...rest}
        {...native}
        onChange={(e) => { setFilled(e.target.value !== ''); rest.onChange?.(e); }}
      />
      {clearable && filled && !f.disabled && !rest.readOnly && (
        <button type="button" className="ar-input-clear" aria-label="Clear" onClick={clear}><CloseIcon size={14} /></button>
      )}
      {suffix && <span className="ar-input-affix" aria-hidden="true">{suffix}</span>}
    </div>
  );
});

export interface SearchInputProps extends Omit<InputProps, 'type' | 'prefix' | 'clearable'> {
  /** Say what it searches: "Search briefs and clients". Also the accessible name when there is no Field. */
  placeholder: string;
}
/** A search box: icon, clear button, Esc clears. Filter as people type. */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput({ placeholder, onKeyDown, ...rest }, ref) {
  const box = useRef<HTMLInputElement | null>(null);
  return (
    <Input
      ref={(el) => { box.current = el; setRef(ref, el); }}
      type="search"
      role="searchbox"
      prefix={<SearchIcon size={16} />}
      clearable
      placeholder={placeholder}
      aria-label={rest['aria-label'] ?? (rest.id ? undefined : placeholder)}
      autoComplete="off"
      boxClassName={cx('ar-search', rest.boxClassName)}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.key === 'Escape' && e.currentTarget.value) { e.preventDefault(); e.stopPropagation(); (rest.onClear ? rest.onClear() : null); if (!rest.onClear) { const el = e.currentTarget; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(el, ''); el.dispatchEvent(new Event('input', { bubbles: true })); } }
      }}
      {...rest}
    />
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Grow with the text up to `maxRows`. */
  autoGrow?: boolean;
  maxRows?: number;
  /** Show "120 of 160" under the box. With maxLength it also warns near the limit. */
  showCount?: boolean;
}
/** Several lines of text. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ invalid, autoGrow, maxRows = 12, showCount, className, rows = 4, onChange, ...rest }, ref) {
  const f = useFieldProps(rest, invalid);
  const el = useRef<HTMLTextAreaElement | null>(null);
  const [len, setLen] = useState(String(rest.value ?? rest.defaultValue ?? '').length);
  const fit = () => {
    const t = el.current; if (!t || !autoGrow) return;
    t.style.height = 'auto';
    const lh = parseFloat(getComputedStyle(t).lineHeight) || 20;
    t.style.height = `${Math.min(t.scrollHeight + 2, lh * maxRows + 20)}px`;
  };
  useLayoutEffect(fit, [rest.value, autoGrow]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (rest.value !== undefined) setLen(String(rest.value).length); }, [rest.value]);
  const { labelId: _l, invalid: _i, ...native } = f;
  const countId = showCount ? `${native.id}-count` : undefined;
  const max = rest.maxLength;
  return (
    <div className={cx('ar-textarea', f.invalid && 'is-invalid', f.disabled && 'is-disabled')}>
      <textarea
        ref={(t) => { el.current = t; setRef(ref, t); }}
        rows={rows}
        className={cx('ar-textarea-el', autoGrow && 'is-auto', className)}
        {...rest}
        {...native}
        aria-describedby={[native['aria-describedby'], countId].filter(Boolean).join(' ') || undefined}
        onChange={(e) => { setLen(e.target.value.length); fit(); onChange?.(e); }}
      />
      {showCount && (
        <span className={cx('ar-textarea-count', max !== undefined && len > max * 0.9 && 'is-near')} id={countId} aria-live="polite">
          {max !== undefined ? `${len} of ${max}` : `${len} characters`}
        </span>
      )}
    </div>
  );
});

export interface NumberInputProps extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'suffix'> {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** A unit after the number ("h", "%"). */
  unit?: string;
  /** Hide the − and + buttons (dense tables). */
  hideSteppers?: boolean;
}
/** A number with − and + buttons. Arrow keys step, Page Up and Down step by ten, the typed value is
 * clamped to min and max when the field loses focus. Empty means null. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, defaultValue = null, onChange, min, max, step = 1, unit, hideSteppers, disabled, ...rest }, ref,
) {
  const [v, setV] = useControllable<number | null>(value, defaultValue, onChange);
  const [text, setText] = useState(v === null || v === undefined ? '' : String(v));
  useEffect(() => { setText(v === null || v === undefined ? '' : String(v)); }, [v]);
  const lo = min ?? -Infinity, hi = max ?? Infinity;
  const commit = (s: string) => {
    if (s.trim() === '') { setV(null); setText(''); return; }
    const n = Number(s.replace(',', '.'));
    if (Number.isNaN(n)) { setText(v === null ? '' : String(v)); return; }
    const c = clampNumber(n, lo, hi, step); setV(c); setText(String(c));
  };
  const bump = (dir: 1 | -1, times = 1) => { let n = text.trim() === '' ? null : Number(text); for (let i = 0; i < times; i++) n = stepNumber(n, dir, step, lo, hi); setV(n); };
  const atMin = v !== null && v !== undefined && v <= lo, atMax = v !== null && v !== undefined && v >= hi;
  return (
    <div className={cx('ar-number', hideSteppers && 'is-bare')}>
      {!hideSteppers && <button type="button" className="ar-number-step" tabIndex={-1} aria-label="Decrease" disabled={disabled || atMin} onClick={() => bump(-1)}><MinusIcon size={14} /></button>}
      <Input
        ref={ref}
        {...rest}
        disabled={disabled}
        inputMode="decimal"
        role="spinbutton"
        aria-valuenow={v ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        value={text}
        suffix={unit}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => { commit(e.target.value); rest.onBlur?.(e); }}
        onKeyDown={(e) => {
          rest.onKeyDown?.(e);
          const k = e.key;
          if (k === 'ArrowUp' || k === 'ArrowDown' || k === 'PageUp' || k === 'PageDown') { e.preventDefault(); bump(k === 'ArrowUp' || k === 'PageUp' ? 1 : -1, k.startsWith('Page') ? 10 : 1); }
          else if (k === 'Home' && min !== undefined) { e.preventDefault(); setV(min); }
          else if (k === 'End' && max !== undefined) { e.preventDefault(); setV(max); }
          else if (k === 'Enter') commit(e.currentTarget.value);
        }}
      />
      {!hideSteppers && <button type="button" className="ar-number-step" tabIndex={-1} aria-label="Increase" disabled={disabled || atMax} onClick={() => bump(1)}><PlusIcon size={14} /></button>}
    </div>
  );
});
