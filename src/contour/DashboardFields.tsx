import { Input } from "./BaseFields.js";
import { TemporalPicker } from "./TemporalPicker.js";
import { useId, useState, useEffect, useContext, type InputHTMLAttributes } from "react";
import { ContourThemeContext } from "./ThemeContext.js";
import { tokensFor } from "./system.js";
import { Minus, Plus, Check } from "lucide-react";
type FieldBase = { label: string; hint?: string; error?: string };
export type DatePickerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> &
  FieldBase & { onChange: (value: string) => void };
export function DatePicker(props: DatePickerProps) {
  return <TemporalPicker {...props} type="date" />;
}
export function TimePicker(props: DatePickerProps) {
  return <TemporalPicker {...props} type="time" />;
}
export interface DateRangePickerProps extends FieldBase {
  value: { start: string; end: string };
  onChange: (value: { start: string; end: string }) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
}
export function DateRangePicker({
  label,
  value,
  onChange,
  min,
  max,
  disabled,
  required,
  hint,
  error,
}: DateRangePickerProps) {
  const invalid =
    value.start && value.end && value.end < value.start
      ? "The end date must be on or after the start date."
      : error;
  return (
    <fieldset className="ct-range" disabled={disabled}>
      <legend>{label}</legend>
      <div>
        <DatePicker
          label="From"
          value={value.start}
          min={min}
          max={max}
          required={required}
          onChange={(start) => onChange({ ...value, start })}
        />
        <DatePicker
          label="To"
          value={value.end}
          min={value.start || min}
          max={max}
          required={required}
          onChange={(end) => onChange({ ...value, end })}
          error={invalid || undefined}
        />
      </div>
      {hint && <small>{hint}</small>}
    </fieldset>
  );
}
export interface NumberInputProps
  extends
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "type" | "value" | "onChange" | "min" | "max" | "step"
    >,
    FieldBase {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
}
export function NumberInput({
  label,
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  error,
  hint,
  id: suppliedId,
  disabled,
  readOnly,
  ...props
}: NumberInputProps) {
  const generated = useId();
  const id = suppliedId || generated;
  const increment = Number.isFinite(step) && step > 0 ? step : 1;
  const clamp = (number: number) => Math.min(max, Math.max(min, number));
  const move = (direction: number) =>
    onChange(
      clamp(
        Number(
          (
            (value ?? (Number.isFinite(min) ? min : 0)) +
            direction * increment
          ).toFixed(10),
        ),
      ),
    );
  const invalid =
    error ||
    (value !== null && (value < min || value > max)
      ? "Enter a value within the allowed range."
      : undefined);
  return (
    <div className="ct-field">
      <label htmlFor={id}>
        {label}
        {props.required && <span>Required</span>}
      </label>
      <div className="ct-number">
        <button className="ct-control-action"
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => move(-1)}
          disabled={disabled || readOnly || (value !== null && value <= min)}
        >
          <Minus size={13} />
        </button>
        <Input
          {...props}
          id={id}
          type="number"
          inputMode="decimal"
          value={value ?? ""}
          min={Number.isFinite(min) ? min : undefined}
          max={Number.isFinite(max) ? max : undefined}
          step={increment}
          disabled={disabled}
          readOnly={readOnly}
          onChange={(event) =>
            onChange(
              event.target.value === "" ||
                !Number.isFinite(event.target.valueAsNumber)
                ? null
                : event.target.valueAsNumber,
            )
          }
          aria-invalid={!!invalid}
          aria-describedby={invalid || hint ? `${id}-message` : undefined}
        />
        <button className="ct-control-action"
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => move(1)}
          disabled={disabled || readOnly || (value !== null && value >= max)}
        >
          <Plus size={13} />
        </button>
      </div>
      {(invalid || hint) && (
        <small id={`${id}-message`} role={invalid ? "alert" : undefined}>
          {invalid || hint}
        </small>
      )}
    </div>
  );
}
export interface ColorPickerProps extends FieldBase {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  swatches?: string[];
}
const hex = /^#[0-9a-f]{6}$/i;
export function ColorPicker({
  label,
  value,
  onChange,
  disabled,
  swatches = [],
  hint,
  error,
}: ColorPickerProps) {
  const id = useId();
  const mode = useContext(ContourThemeContext) ?? "light";
  const fallbackColor = tokensFor("contour",mode).accent;
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const invalid =
    error ||
    (!hex.test(draft)
      ? `Use a six-digit hex colour, such as ${fallbackColor}.`
      : undefined);
  return (
    <div className="ct-field">
      <label htmlFor={id}>{label}</label>
      <div className="ct-color">
        <input
          type="color"
          aria-label={`Choose ${label}`}
          value={hex.test(value) ? value : fallbackColor}
          disabled={disabled}
          onChange={(event) => {
            setDraft(event.target.value);
            onChange(event.target.value.toUpperCase());
          }}
        />
        <Input
          id={id}
          value={draft}
          disabled={disabled}
          spellCheck={false}
          maxLength={7}
          aria-invalid={!!invalid}
          aria-describedby={hint || invalid ? `${id}-message` : undefined}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            if (hex.test(next)) onChange(next.toUpperCase());
          }}
        />
      </div>
      {swatches.length > 0 && (
        <div
          className="ct-swatches"
          role="group"
          aria-label={`${label} presets`}
        >
          {swatches
            .filter((color) => hex.test(color))
            .map((color) => (
              <button
                type="button"
                key={color}
                title={color}
                aria-label={`Use ${color}`}
                aria-pressed={value.toLowerCase() === color.toLowerCase()}
                disabled={disabled}
                onClick={() => onChange(color)}
              >
                <span style={{ background: color }} />
                <Check
                  size={10}
                  aria-hidden="true"
                  style={{
                    opacity:
                      value.toLowerCase() === color.toLowerCase() ? 1 : 0,
                  }}
                />
              </button>
            ))}
        </div>
      )}
      {(invalid || hint) && (
        <small id={`${id}-message`} role={invalid ? "alert" : undefined}>
          {invalid || hint}
        </small>
      )}
    </div>
  );
}
