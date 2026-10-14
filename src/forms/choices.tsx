'use client';
import { createContext, forwardRef, useContext, useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { useControllable } from '../hooks';
import { cx } from '../lib/cx';
import { useFieldProps } from './Field';

function setRef<T>(r: React.Ref<T> | undefined, v: T) { if (typeof r === 'function') r(v); else if (r) (r as React.MutableRefObject<T>).current = v; }

// ---------------------------------------------------------------------------------------------------
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** The visible label. Without one, pass aria-label. */
  label?: ReactNode;
  /** A quieter second line. */
  description?: ReactNode;
  /** Neither on nor off (a "select all" with some chosen). */
  indeterminate?: boolean;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  invalid?: boolean;
}
/** A checkbox: for options in dense forms and lists, and for picking rows. Space toggles. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, description, indeterminate, onChange, invalid, className, ...rest }, ref) {
  const f = useFieldProps(rest, invalid);
  const el = useRef<HTMLInputElement | null>(null);
  useEffect(() => { if (el.current) el.current.indeterminate = !!indeterminate; }, [indeterminate]);
  const descId = description ? `${f.id}-desc` : undefined;
  const { labelId: _l, invalid: _i, ...native } = f;
  const box = (
    <input
      ref={(x) => { el.current = x; setRef(ref, x); }}
      type="checkbox"
      className="ar-check-input"
      aria-checked={indeterminate ? 'mixed' : undefined}
      {...rest}
      {...native}
      aria-describedby={[native['aria-describedby'], descId].filter(Boolean).join(' ') || undefined}
      onChange={(e) => onChange?.(e.target.checked, e)}
    />
  );
  if (!label) return <span className={cx('ar-check', 'ar-check--bare', className)}>{box}</span>;
  return (
    <label className={cx('ar-check', f.disabled && 'is-disabled', className)} htmlFor={native.id}>
      {box}
      <span className="ar-check-text">
        <span className="ar-check-label">{label}</span>
        {description && <span className="ar-check-desc" id={descId}>{description}</span>}
      </span>
    </label>
  );
});

// ---------------------------------------------------------------------------------------------------
export interface ChoiceOption<V extends string = string> { value: V; label: ReactNode; description?: ReactNode; disabled?: boolean }

interface GroupProps { legend: ReactNode; help?: ReactNode; error?: ReactNode; hideLegend?: boolean; orientation?: 'vertical' | 'horizontal'; required?: boolean; disabled?: boolean; className?: string }

function Group({ legend, help, error, hideLegend, orientation = 'vertical', required, disabled, className, id, children }: GroupProps & { id: string; children: ReactNode }) {
  return (
    <fieldset className={cx('ar-group', orientation === 'horizontal' && 'ar-group--row', className)} disabled={disabled}
      aria-describedby={[error ? `${id}-err` : '', help ? `${id}-help` : ''].filter(Boolean).join(' ') || undefined} aria-invalid={error ? true : undefined}>
      <legend className={cx('ar-field-label', hideLegend && 'ar-visually-hidden')}>{legend}{required && <span className="ar-field-req" aria-hidden="true"> *</span>}</legend>
      <div className="ar-group-items">{children}</div>
      {error && <p className="ar-field-error" id={`${id}-err`}>{error}</p>}
      {help && <p className="ar-field-help" id={`${id}-help`}>{help}</p>}
    </fieldset>
  );
}

export interface CheckboxGroupProps<V extends string = string> extends GroupProps {
  options: ChoiceOption<V>[];
  value?: V[];
  defaultValue?: V[];
  onChange?: (value: V[]) => void;
  name?: string;
}
/** Several checkboxes under one legend (a fieldset). */
export function CheckboxGroup<V extends string = string>({ options, value, defaultValue = [], onChange, name, ...g }: CheckboxGroupProps<V>) {
  const id = useId();
  const [v, setV] = useControllable<V[]>(value, defaultValue, onChange);
  return (
    <Group {...g} id={id}>
      {options.map((o) => (
        <Checkbox key={o.value} name={name} value={o.value} label={o.label} description={o.description} disabled={o.disabled}
          checked={v.includes(o.value)} onChange={(c) => setV(c ? [...v, o.value] : v.filter((x) => x !== o.value))} />
      ))}
    </Group>
  );
}

// ---------------------------------------------------------------------------------------------------
const RadioCtx = createContext<{ name: string; value: string | undefined; set: (v: string) => void } | null>(null);

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: ReactNode;
  description?: ReactNode;
  value: string;
  onChange?: (value: string) => void;
}
/** One radio button. Use inside a RadioGroup (arrow keys move and choose, as native radios do). */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ label, description, value, onChange, className, id, ...rest }, ref) {
  const g = useContext(RadioCtx);
  const auto = useId();
  const rid = id ?? auto;
  return (
    <label className={cx('ar-check', 'ar-radio', rest.disabled && 'is-disabled', className)} htmlFor={rid}>
      <input ref={ref} id={rid} type="radio" className="ar-check-input ar-radio-input" value={value}
        name={g?.name ?? rest.name} checked={g ? g.value === value : rest.checked}
        aria-describedby={description ? `${rid}-desc` : undefined}
        onChange={() => { g?.set(value); onChange?.(value); }} {...rest} />
      <span className="ar-check-text">
        <span className="ar-check-label">{label}</span>
        {description && <span className="ar-check-desc" id={`${rid}-desc`}>{description}</span>}
      </span>
    </label>
  );
});

export interface RadioGroupProps<V extends string = string> extends GroupProps {
  options?: ChoiceOption<V>[];
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
  name?: string;
  /** Radio children instead of options. */
  children?: ReactNode;
}
/** 2 to 5 mutually exclusive choices, all visible, under one legend. */
export function RadioGroup<V extends string = string>({ options, value, defaultValue, onChange, name, children, ...g }: RadioGroupProps<V>) {
  const id = useId();
  const [v, setV] = useControllable<V | undefined>(value, defaultValue, onChange as (v: V | undefined) => void);
  return (
    <RadioCtx.Provider value={{ name: name ?? `r${id}`, value: v, set: (x) => setV(x as V) }}>
      <Group {...g} id={id}>
        {children ?? options?.map((o) => <Radio key={o.value} value={o.value} label={o.label} description={o.description} disabled={o.disabled} />)}
      </Group>
    </RadioCtx.Provider>
  );
}

// ---------------------------------------------------------------------------------------------------
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  /** What it turns on, as a noun phrase ("Daily status email"). */
  label?: ReactNode;
  description?: ReactNode;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Label first, switch at the end of the row (settings lists). Default true. */
  labelFirst?: boolean;
  size?: 'sm' | 'md';
}
/** On or off, taking effect at once (settings). A native checkbox with role="switch": Space toggles. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({ label, description, onChange, labelFirst = true, size = 'md', className, ...rest }, ref) {
  const f = useFieldProps(rest);
  const descId = description ? `${f.id}-desc` : undefined;
  const { labelId: _l, invalid: _i, ...native } = f;
  const control = (
    <span className={cx('ar-switch', size === 'sm' && 'ar-switch--sm')}>
      <input ref={ref} type="checkbox" role="switch" className="ar-switch-input" {...rest} {...native}
        aria-describedby={[native['aria-describedby'], descId].filter(Boolean).join(' ') || undefined}
        onChange={(e) => onChange?.(e.target.checked, e)} />
      <span className="ar-switch-track" aria-hidden="true"><span className="ar-switch-thumb" /></span>
    </span>
  );
  if (!label) return <span className={className}>{control}</span>;
  return (
    <label className={cx('ar-switch-row', labelFirst && 'is-label-first', f.disabled && 'is-disabled', className)} htmlFor={native.id}>
      {!labelFirst && control}
      <span className="ar-check-text">
        <span className="ar-check-label">{label}</span>
        {description && <span className="ar-check-desc" id={descId}>{description}</span>}
      </span>
      {labelFirst && control}
    </label>
  );
});

// ---------------------------------------------------------------------------------------------------
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Show the value at the end of the row, formatted. */
  showValue?: boolean;
  format?: (v: number) => string;
  /** Labels under the track at these values. */
  marks?: { value: number; label: string }[];
}
/** Pick a value on a range with live feedback (a native range input). Arrow keys step, Page keys
 * jump, Home and End go to the ends. Pair with a NumberInput when exact values matter. */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider({ value, defaultValue, onChange, min = 0, max = 100, step = 1, showValue, format = String, marks, className, ...rest }, ref) {
  const f = useFieldProps(rest);
  const [v, setV] = useControllable<number>(value, defaultValue ?? min, onChange);
  const pct = max > min ? ((v - min) / (max - min)) * 100 : 0;
  const { labelId: _l, invalid: _i, ...native } = f;
  return (
    <div className={cx('ar-slider', className)} style={{ ['--_pct' as string]: `${pct}%` }}>
      <div className="ar-slider-row">
        <input ref={ref} type="range" className="ar-slider-input" min={min} max={max} step={step} value={v}
          aria-valuetext={format(v)} {...rest} {...native} onChange={(e) => setV(Number(e.target.value))} />
        {showValue && <output className="ar-slider-value" htmlFor={native.id}>{format(v)}</output>}
      </div>
      {marks && (
        <div className="ar-slider-marks" aria-hidden="true">
          {marks.map((m) => <span key={m.value} style={{ insetInlineStart: `${((m.value - min) / (max - min)) * 100}%` }}>{m.label}</span>)}
        </div>
      )}
    </div>
  );
});
