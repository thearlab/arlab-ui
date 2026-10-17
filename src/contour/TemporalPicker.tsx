import {
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { CalendarDays, Clock3, ChevronLeft, ChevronRight } from "lucide-react";
import { Dropdown } from "./ui.js";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  label: string;
  hint?: string;
  error?: string;
  onChange: (value: string) => void;
  type: "date" | "time";
};
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parse = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(+match[1], +match[2] - 1, +match[3]);
  return iso(date) === value ? date : null;
};
export function TemporalPicker({
  type,
  label,
  hint,
  error,
  id: provided,
  value,
  defaultValue,
  onChange,
  disabled,
  readOnly,
  required,
  min,
  max,
  name,
}: Props) {
  const generated = useId(),
    id = provided || generated;
  const [internal, setInternal] = useState(String(defaultValue || ""));
  const selected = String(value ?? internal);
  const [open, setOpen] = useState(false),
    [month, setMonth] = useState(() => parse(selected) || new Date()),
    [focused, setFocused] = useState(() => selected || iso(new Date()));
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });
  const trigger = useRef<HTMLButtonElement>(null),
    panel = useRef<HTMLDivElement>(null);
  const lower = String(min || ""),
    upper = String(max || "");
  const available = (v: string) =>
    (!lower || v >= lower) && (!upper || v <= upper);
  const commit = (v: string) => {
    setInternal(v);
    onChange(v);
  };
  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    element.setAttribute("popover", "auto");
    const toggle = (event: Event) => {
      if ((event as ToggleEvent).newState === "closed") setOpen(false);
    };
    element.addEventListener("toggle", toggle);
    return () => element.removeEventListener("toggle", toggle);
  }, [type]);
  const close = () => {
    panel.current?.hidePopover();
    setOpen(false);
    trigger.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    const position = () => {
      const r = trigger.current?.getBoundingClientRect();
      if (r)
        setAnchor({
          left: Math.max(8, Math.min(r.left, window.innerWidth - 320)),
          top:
            r.bottom + 8 + 340 > window.innerHeight
              ? Math.max(8, r.top - 340)
              : r.bottom + 8,
        });
    };
    position();
    panel.current?.showPopover();
    const raf = requestAnimationFrame(() =>
      panel.current
        ?.querySelector<HTMLButtonElement>('button[tabindex="0"]')
        ?.focus(),
    );
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [open]);
  if (type === "time") {
    const [hh = "", mm = ""] = selected.split(":");
    const minutes = Array.from({ length: 60 }, (_, i) =>
      String(i).padStart(2, "0"),
    );
    const hours = Array.from({ length: 24 }, (_, i) =>
      String(i).padStart(2, "0"),
    );
    return (
      <div className="ct-field ct-time-picker">
        <label id={`${id}-label`}>
          {label}
          {required && <span aria-hidden="true">*</span>}
        </label>
        <div
          className="ct-time-controls"
          role="group"
          aria-labelledby={`${id}-label`}
          aria-describedby={hint || error ? `${id}-message` : undefined}
        >
          <Clock3 size={14} aria-hidden="true" />
          <Dropdown
            children={undefined}
            defaultValue={undefined}
            searchable={false}
            name={undefined}
            aria-invalid={!!error}
            aria-describedby={hint || error ? `${id}-message` : undefined}
            aria-label={`${label} hours`}
            value={hh}
            placeholder="HH"
            disabled={disabled || readOnly}
            options={hours.map((h) => ({
              value: h,
              label: h,
              disabled: !minutes.some((m) => available(`${h}:${m}`)),
            }))}
            onChange={(e: { target: { value: string } }) => {
              const hour = e.target.value;
              const minute = available(`${hour}:${mm || "00"}`)
                ? mm || "00"
                : minutes.find((m) => available(`${hour}:${m}`)) || "00";
              commit(`${hour}:${minute}`);
            }}
          />
          <span aria-hidden="true">:</span>
          <Dropdown
            children={undefined}
            defaultValue={undefined}
            searchable={false}
            name={undefined}
            aria-invalid={!!error}
            aria-describedby={hint || error ? `${id}-message` : undefined}
            aria-label={`${label} minutes`}
            value={mm}
            placeholder="MM"
            disabled={disabled || readOnly}
            options={minutes.map((m) => ({
              value: m,
              label: m,
              disabled: !available(`${hh || "00"}:${m}`),
            }))}
            onChange={(e: { target: { value: string } }) =>
              commit(`${hh || "00"}:${e.target.value}`)
            }
          />
        </div>
        <input type="hidden" name={name} value={selected} />
        {(hint || error) && (
          <small id={`${id}-message`} role={error ? "alert" : undefined}>
            {error || hint}
          </small>
        )}
      </div>
    );
  }
  const start = new Date(month.getFullYear(), month.getMonth(), 1),
    count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(),
    offset = (start.getDay() + 6) % 7;
  const days = Array.from(
    { length: count },
    (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
  );
  const shift = (amount: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + amount, 1));
  const moveFocus = (date: Date, key: string) => {
    const delta: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -((date.getDay() + 6) % 7),
      End: 6 - ((date.getDay() + 6) % 7),
    };
    if (!(key in delta)) return;
    const next = new Date(date);
    next.setDate(next.getDate() + delta[key]);
    const v = iso(next);
    setFocused(v);
    setMonth(next);
    requestAnimationFrame(() =>
      panel.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${v}"]`)
        ?.focus(),
    );
  };
  const date = parse(selected);
  return (
    <div className="ct-field ct-date-picker">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true">*</span>}
      </label>
      <button
        ref={trigger}
        id={id}
        type="button"
        className="ct-temporal-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${id}-message` : undefined}
        disabled={disabled || readOnly}
        onClick={() => {
          const d = parse(selected) || new Date();
          setMonth(d);
          setFocused(iso(d));
          setOpen(!open);
        }}
      >
        <CalendarDays size={14} aria-hidden="true" />
        <span>
          {date
            ? date.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Choose a date"}
        </span>
      </button>
      <input type="hidden" name={name} value={selected} />
      <div
        ref={panel}
        className="ct-calendar"
        role="dialog"
        aria-label={`Choose ${label}`}
        style={{ top: anchor.top, left: anchor.left }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
        }}
      >
        <div className="ct-calendar-heading">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => shift(-1)}
          >
            <ChevronLeft size={14} />
          </button>
          <strong aria-live="polite">
            {month.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </strong>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => shift(1)}
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="ct-calendar-week" aria-hidden="true">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="ct-calendar-days" role="group" aria-label="Dates">
          {Array.from({ length: offset }, (_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {days.map((d) => {
            const v = iso(d);
            return (
              <button
                type="button"
                key={v}
                data-date={v}
                tabIndex={focused === v ? 0 : -1}
                aria-label={d.toLocaleDateString(undefined, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                aria-pressed={selected === v}
                aria-current={v === iso(new Date()) ? "date" : undefined}
                disabled={!available(v)}
                onKeyDown={(e) => {
                  if (
                    [
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                      "Home",
                      "End",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                    moveFocus(d, e.key);
                  }
                }}
                onClick={() => {
                  commit(v);
                  close();
                }}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
        <div className="ct-calendar-footer">
          <button
            type="button"
            disabled={!available(iso(new Date()))}
            onClick={() => {
              commit(iso(new Date()));
              close();
            }}
          >
            Today
          </button>
          {!required && (
            <button
              type="button"
              onClick={() => {
                commit("");
                close();
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {(hint || error) && (
        <small id={`${id}-message`} role={error ? "alert" : undefined}>
          {error || hint}
        </small>
      )}
    </div>
  );
}
