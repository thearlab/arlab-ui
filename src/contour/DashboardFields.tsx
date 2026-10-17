import { Input } from "./BaseFields.js";
import { Popover } from "./library.js";
import { TemporalPicker } from "./TemporalPicker.js";
import { useId, useState, useEffect, useContext, type InputHTMLAttributes, type PointerEvent } from "react";
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
        {props.required && <span aria-hidden="true">*</span>}
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
        <CustomColorPanel label={label} value={hex.test(value) ? value : fallbackColor} disabled={disabled} onChange={next => {setDraft(next);onChange(next);}} />
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

/** HSV uses the same six-digit public value contract as ColorPicker. */
function fromHex(value:string):[number,number,number] {
 const channels=[1,3,5].map(i=>parseInt(value.slice(i,i+2),16)/255);
 const [r,g,b]=channels,max=Math.max(...channels),min=Math.min(...channels),d=max-min;
 const hue=d===0?0:max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;
 return [(hue*60+360)%360,max===0?0:d/max,max];
}
function toHex([h,s,v]:[number,number,number]):string {
 const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;
 const rgb=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
 return '#'+rgb.map(channel=>Math.round((channel+m)*255).toString(16).padStart(2,'0')).join('').toUpperCase();
}
function CustomColorPanel({label,value,disabled,onChange}:{label:string;value:string;disabled?:boolean;onChange:(value:string)=>void}) {
 const [hsv,setHsv]=useState<[number,number,number]>(()=>fromHex(value));
 const [open,setOpen]=useState(false);
 useEffect(()=>setHsv(previous=>toHex(previous).toLowerCase()===value.toLowerCase()?previous:fromHex(value)),[value]);
 useEffect(()=>{if(disabled)setOpen(false);},[disabled]);
 const update=(next:[number,number,number])=>{if(disabled)return;setHsv(next);onChange(toHex(next));};
 const position=(event:PointerEvent<HTMLDivElement>)=>{const bounds=event.currentTarget.getBoundingClientRect();if(!bounds.width||!bounds.height)return;update([hsv[0],Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width)),Math.max(0,Math.min(1,1-(event.clientY-bounds.top)/bounds.height))]);};
 return <Popover label={`Choose ${label}`} open={open} onOpenChange={setOpen} trigger={<button type="button" className="ct-control-action ct-color-trigger" aria-label={`Choose ${label}`} aria-haspopup="dialog" disabled={disabled}><span style={{background:value}}/></button>}>
  <div className="ct-color-panel" role="group" aria-label={`${label} controls`}>
   <div className="ct-color-plane" aria-hidden="true" style={{backgroundColor:`hsl(${hsv[0]},100%,50%)`}} onPointerDown={event=>{if(disabled)return;event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);position(event);}} onPointerMove={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))position(event);}} onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId)){position(event);event.currentTarget.releasePointerCapture(event.pointerId);}}} onPointerCancel={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}><span style={{left:`${hsv[1]*100}%`,top:`${(1-hsv[2])*100}%`,background:value}}/></div>
   {(['Hue','Saturation','Brightness'] as const).map((name,index)=><label className="ct-color-channel" key={name}><span>{name}<output>{Math.round(hsv[index]*(index===0?1:100))}{index===0?'°':'%'}</output></span><input type="range" aria-label={`${label} ${name.toLowerCase()}`} min={0} max={index===0?359:100} step={1} value={Math.round(hsv[index]*(index===0?1:100))} disabled={disabled} onChange={event=>{const next:[number,number,number]=[...hsv];next[index]=Number(event.target.value)/(index===0?1:100);update(next);}}/></label>)}
  </div>
 </Popover>;
}
