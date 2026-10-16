import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "./ui.js";

export interface CalendarEvent {
  id: string;
  /** Local calendar date, YYYY-MM-DD. No timezone conversion is performed. */
  date: string;
  title: string;
  description?: string;
  disabled?: boolean;
}
export interface CalendarProps {
  value?: string | null;
  defaultValue?: string | null;
  onSelect?: (date: string) => void;
  /** Controlled displayed month, YYYY-MM. */
  month?: string;
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
  /** Explicit rolling period. When supplied, takes precedence over month. */
  startDate?: string;
  defaultStartDate?: string;
  onStartDateChange?: (date: string) => void;
  /** 1–12 rows for an explicit period. Month view expands to fit every day. */
  weeks?: number;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  events?: CalendarEvent[];
  onEventSelect?: (event: CalendarEvent) => void;
  min?: string;
  max?: string;
  isDateDisabled?: (date: string) => boolean;
  disabled?: boolean;
  locale?: string;
  label?: string;
  className?: string;
}
function parseDate(value?: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(12, 0, 0, 0);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}
const keyOf = (date: Date) =>
  `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const dayNumber = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};
function shiftMonth(date: Date, offset: number) {
  const next = new Date(date);
  next.setDate(1);
  next.setMonth(next.getMonth() + offset);
  const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(date.getDate(), last));
  return next;
}
/** Real dates and application-owned events. Selection never writes an event or changes a record. */
export function Calendar({
  value,
  defaultValue = null,
  onSelect,
  month,
  defaultMonth,
  onMonthChange,
  startDate,
  defaultStartDate,
  onStartDateChange,
  weeks,
  weekStartsOn = 1,
  events = [],
  onEventSelect,
  min,
  max,
  isDateDisabled,
  disabled = false,
  locale = "en-GB",
  label = "Calendar",
  className = "",
}: CalendarProps) {
  const today = keyOf(new Date()),
    id = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalMonth, setInternalMonth] = useState(
    defaultMonth ||
      (parseDate(value || defaultValue)
        ? keyOf(parseDate(value || defaultValue)!).slice(0, 7)
        : undefined) ||
      today.slice(0, 7),
  );
  const [internalStart, setInternalStart] = useState(defaultStartDate);
  const [focused, setFocused] = useState<string | null>(null);
  const pendingFocus = useRef<string | null>(null),
    root = useRef<HTMLElement>(null);
  const rolling = startDate !== undefined || defaultStartDate !== undefined;
  const activeMonth = month ?? internalMonth,
    activeStart = startDate ?? internalStart;
  const anchor = rolling
    ? parseDate(activeStart)
    : parseDate(`${activeMonth}-01`);
  const validWeeks =
    weeks === undefined ||
    (Number.isInteger(weeks) && weeks >= 1 && weeks <= 12);
  const validBounds =
    (!min || !!parseDate(min)) &&
    (!max || !!parseDate(max)) &&
    !(min && max && min > max);
  const valid = !!anchor && validWeeks && validBounds;
  const safeAnchor = anchor || parseDate(today)!;
  const first = rolling
    ? safeAnchor
    : addDays(safeAnchor, -((safeAnchor.getDay() - weekStartsOn + 7) % 7));
  const lastMonthDay = new Date(
    safeAnchor.getFullYear(),
    safeAnchor.getMonth() + 1,
    0,
  ).getDate();
  const needed = Math.ceil(
    (((safeAnchor.getDay() - weekStartsOn + 7) % 7) + lastMonthDay) / 7,
  );
  const rows = rolling ? (weeks ?? 5) : Math.max(weeks ?? needed, needed);
  const dates = Array.from({ length: valid ? rows * 7 : 0 }, (_, index) =>
    addDays(first, index),
  );
  const end = dates[dates.length - 1] || first,
    firstKey = keyOf(first),
    endKey = keyOf(end);
  const selected = value !== undefined ? value : internalValue;
  const unavailable = (date: string) =>
    disabled ||
    !!(min && date < min) ||
    !!(max && date > max) ||
    !!isDateDisabled?.(date);
  const tabDate = [focused, selected, today, ...dates.map(keyOf)].find(
    (date) => date && date >= firstKey && date <= endKey && !unavailable(date),
  );
  const full = (date: Date) =>
    date.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const short = (date: Date) =>
    date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const movePeriod = (date: Date) => {
    if (rolling) {
      const next = keyOf(date);
      if (startDate === undefined) setInternalStart(next);
      onStartDateChange?.(next);
    } else {
      const next = keyOf(date).slice(0, 7);
      if (month === undefined) setInternalMonth(next);
      onMonthChange?.(next);
    }
  };
  useEffect(() => {
    const key = pendingFocus.current;
    if (!key) return;
    const button = root.current?.querySelector<HTMLButtonElement>(
      `[data-calendar-date="${key}"]`,
    );
    if (button && !button.disabled) {
      button.focus();
      pendingFocus.current = null;
    }
  }, [firstKey, endKey, focused]);
  const navigate = (amount: number) => {
    pendingFocus.current = null;
    setFocused(null);
    movePeriod(
      rolling
        ? addDays(first, amount * rows * 7)
        : shiftMonth(safeAnchor, amount),
    );
  };
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    let target: Date | undefined;
    const offset = (date.getDay() - first.getDay() + 7) % 7;
    if (event.key === "ArrowLeft") target = addDays(date, -1);
    if (event.key === "ArrowRight") target = addDays(date, 1);
    if (event.key === "ArrowUp") target = addDays(date, -7);
    if (event.key === "ArrowDown") target = addDays(date, 7);
    if (event.key === "Home") target = addDays(date, -offset);
    if (event.key === "End") target = addDays(date, 6 - offset);
    if (event.key === "PageUp")
      target = rolling
        ? addDays(date, -rows * 7)
        : shiftMonth(date, event.shiftKey ? -12 : -1);
    if (event.key === "PageDown")
      target = rolling
        ? addDays(date, rows * 7)
        : shiftMonth(date, event.shiftKey ? 12 : 1);
    if (!target) return;
    event.preventDefault();
    const direction = target < date ? -1 : 1;
    for (
      let attempts = 0;
      attempts < 366 && unavailable(keyOf(target));
      attempts++
    )
      target = addDays(target, direction);
    const key = keyOf(target);
    if (unavailable(key)) return;
    pendingFocus.current = key;
    setFocused(key);
    if (key < firstKey || key > endKey)
      movePeriod(
        rolling
          ? addDays(
              first,
              key < firstKey
                ? -Math.ceil((dayNumber(first) - dayNumber(target)) / 7) * 7
                : Math.ceil((dayNumber(target) - dayNumber(end)) / 7) * 7,
            )
          : target,
      );
    else
      root.current
        ?.querySelector<HTMLButtonElement>(`[data-calendar-date="${key}"]`)
        ?.focus();
  };
  const itemsByDate = new Map<string, CalendarEvent[]>();
  events.forEach((item) => {
    if (!parseDate(item.date)) return;
    const existing = itemsByDate.get(item.date) || [];
    existing.push(item);
    itemsByDate.set(item.date, existing);
  });
  return (
    <section
      ref={root}
      className={`ct-event-calendar ${className}`}
      aria-label={label}
    >
      <header className="ct-event-calendar-heading">
        <IconButton
          label={rolling ? "Previous period" : "Previous month"}
          disabled={disabled || !valid}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={14} />
        </IconButton>
        <strong id={`${id}-period`} aria-live="polite">
          {valid
            ? rolling
              ? `${short(first)} – ${short(end)}`
              : safeAnchor.toLocaleDateString(locale, {
                  month: "long",
                  year: "numeric",
                })
            : "Date unavailable"}
        </strong>
        <IconButton
          label={rolling ? "Next period" : "Next month"}
          disabled={disabled || !valid}
          onClick={() => navigate(1)}
        >
          <ChevronRight size={14} />
        </IconButton>
      </header>
      {!valid ? (
        <p role="alert">
          Provide valid dates and a week count between 1 and 12.
        </p>
      ) : (
        <table
          className="ct-event-calendar-grid"
          aria-labelledby={`${id}-period`}
        >
          <thead>
            <tr>
              {Array.from({ length: 7 }, (_, n) => (
                <th key={n} scope="col">
                  <abbr
                    title={addDays(first, n).toLocaleDateString(locale, {
                      weekday: "long",
                    })}
                  >
                    {addDays(first, n).toLocaleDateString(locale, {
                      weekday: "short",
                    })}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, row) => (
              <tr key={row}>
                {dates.slice(row * 7, row * 7 + 7).map((date) => {
                  const key = keyOf(date),
                    items = itemsByDate.get(key) || [];
                  return (
                    <td
                      key={key}
                      data-selected={selected === key || undefined}
                      data-outside={
                        (!rolling &&
                          date.getMonth() !== safeAnchor.getMonth()) ||
                        undefined
                      }
                    >
                      <button
                        type="button"
                        data-calendar-date={key}
                        tabIndex={key === tabDate ? 0 : -1}
                        disabled={unavailable(key)}
                        aria-label={full(date)}
                        aria-pressed={selected === key}
                        aria-current={key === today ? "date" : undefined}
                        onFocus={() => setFocused(key)}
                        onKeyDown={(e) => keyDown(e, date)}
                        onClick={() => {
                          if (value === undefined) setInternalValue(key);
                          onSelect?.(key);
                        }}
                      >
                        <time dateTime={key}>{date.getDate()}</time>
                      </button>
                      {items.length > 0 && (
                        <ul aria-label={`Events for ${full(date)}`}>
                          {items.map((item) => (
                            <li key={item.id}>
                              {onEventSelect ? (
                                <button
                                  type="button"
                                  disabled={disabled || item.disabled}
                                  title={item.description}
                                  onClick={() => onEventSelect(item)}
                                  aria-label={`${item.title}, ${full(date)}`}
                                >
                                  {item.title}
                                </button>
                              ) : (
                                <span title={item.description}>
                                  {item.title}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <footer aria-live="polite">
        {selected && parseDate(selected)
          ? `Selected: ${full(parseDate(selected)!)}`
          : "Choose a date"}
      </footer>
    </section>
  );
}
