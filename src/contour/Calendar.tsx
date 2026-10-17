import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type CSSProperties,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton, Button } from "./ui.js";

export interface CalendarEvent {
  id: string;
  /** Local calendar date, YYYY-MM-DD. No timezone conversion is performed. */
  date: string;
  title: string;
  description?: string;
  /** Optional display-only local time, such as 09:30. */
  time?: string;
  tone?: "quiet" | "ok" | "warn" | "bad" | "info";
  color?: string;
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
  maxEventsPerDay?: number;
  onDayDetails?: (date: string) => void;
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
  maxEventsPerDay = 3,
  onDayDetails,
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
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
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
  const limit = Number.isFinite(maxEventsPerDay)
    ? Math.max(1, Math.floor(maxEventsPerDay))
    : 3;
  const agendaKey = [expandedDay, selected, today, firstKey].find(
    (key) => key && key >= firstKey && key <= endKey,
  )!;
  const agendaItems = itemsByDate.get(agendaKey) || [];
  const selectDate = (key: string) => {
    setExpandedDay(null);
    if (value === undefined) setInternalValue(key);
    onSelect?.(key);
  };
  const showDay = (key: string) => {
    setExpandedDay(key);
    if (!unavailable(key)) {
      if (value === undefined) setInternalValue(key);
      onSelect?.(key);
    }
    onDayDetails?.(key);
  };
  const eventContent = (item: CalendarEvent) => (
    <>
      <span className="ct-calendar-event-marker" aria-hidden="true" />
      {item.time && <span className="ct-calendar-event-time">{item.time}</span>}
      <span className="ct-calendar-event-title">{item.title}</span>
    </>
  );
  const eventProps = (item: CalendarEvent) => ({
    "data-tone": item.tone || "quiet",
    style: item.color
      ? ({ "--ct-calendar-event-color": item.color } as CSSProperties)
      : undefined,
    title: [item.time, item.title, item.description]
      .filter(Boolean)
      .join(" · "),
  });
  return (
    <section
      ref={root}
      className={`ct-event-calendar ${className}`}
      aria-label={label}
    >
      <header className="ct-event-calendar-heading">
        <div className="ct-calendar-period">
          <strong id={`${id}-period`} aria-live="polite">
            {valid
              ? rolling
                ? `${rows}-week schedule`
                : safeAnchor.toLocaleDateString(locale, {
                    month: "long",
                    year: "numeric",
                  })
              : "Date unavailable"}
          </strong>
          {valid && (
            <span>
              {short(first)} – {short(end)}
            </span>
          )}
        </div>
        <div
          className="ct-calendar-navigation"
          role="group"
          aria-label="Calendar period"
        >
          <IconButton
            label={rolling ? "Previous period" : "Previous month"}
            disabled={disabled || !valid}
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={14} />
          </IconButton>
          <Button
            disabled={disabled || !valid}
            onClick={() => {
              pendingFocus.current = null;
              setFocused(null);
              setExpandedDay(null);
              movePeriod(parseDate(today)!);
            }}
          >
            Today
          </Button>
          <IconButton
            label={rolling ? "Next period" : "Next month"}
            disabled={disabled || !valid}
            onClick={() => navigate(1)}
          >
            <ChevronRight size={14} />
          </IconButton>
        </div>
      </header>
      {!valid ? (
        <p role="alert">
          Provide valid dates and a week count between 1 and 12.
        </p>
      ) : (
        <>
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
                      items = itemsByDate.get(key) || [],
                      overflow = Math.max(0, items.length - limit);
                    return (
                      <td
                        key={key}
                        data-selected={selected === key || undefined}
                        data-weekend={
                          date.getDay() === 0 ||
                          date.getDay() === 6 ||
                          undefined
                        }
                        data-outside={
                          (!rolling &&
                            date.getMonth() !== safeAnchor.getMonth()) ||
                          undefined
                        }
                      >
                        <div className="ct-calendar-day-top">
                          <Button
                            variant="ghost"
                            className="ct-calendar-date"
                            data-calendar-date={key}
                            tabIndex={key === tabDate ? 0 : -1}
                            disabled={unavailable(key)}
                            aria-label={full(date)}
                            aria-pressed={selected === key}
                            aria-current={key === today ? "date" : undefined}
                            onFocus={() => setFocused(key)}
                            onKeyDown={(
                              event: KeyboardEvent<HTMLButtonElement>,
                            ) => keyDown(event, date)}
                            onClick={() => selectDate(key)}
                          >
                            <time dateTime={key}>{date.getDate()}</time>
                          </Button>
                        </div>
                        {items.length > 0 && (
                          <>
                            <ul
                              className="ct-calendar-day-events"
                              aria-label={`Events for ${full(date)}`}
                            >
                              {items.slice(0, limit).map((item) => (
                                <li key={item.id}>
                                  {onEventSelect ? (
                                    <Button
                                      variant="ghost"
                                      className="ct-calendar-event"
                                      {...eventProps(item)}
                                      disabled={disabled || item.disabled}
                                      onClick={() => onEventSelect(item)}
                                      aria-label={`${item.title}, ${full(date)}`}
                                    >
                                      {eventContent(item)}
                                    </Button>
                                  ) : (
                                    <span
                                      className="ct-calendar-event"
                                      {...eventProps(item)}
                                    >
                                      {eventContent(item)}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                            {overflow > 0 && (
                              <Button
                                variant="ghost"
                                className="ct-calendar-more"
                                aria-label={`View all ${items.length} events for ${full(date)}`}
                                disabled={disabled}
                                onClick={() => showDay(key)}
                              >
                                +{overflow} more
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              className="ct-calendar-phone-count"
                              aria-label={`View ${items.length} events for ${full(date)}`}
                              disabled={disabled}
                              onClick={() => showDay(key)}
                            >
                              {items.length}
                              <span className="sr-only"> events</span>
                            </Button>
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <section
            className="ct-calendar-agenda"
            aria-labelledby={`${id}-agenda`}
          >
            <header>
              <h3 id={`${id}-agenda`}>{full(parseDate(agendaKey)!)}</h3>
              <span>
                {agendaItems.length}{" "}
                {agendaItems.length === 1 ? "event" : "events"}
              </span>
            </header>
            {agendaItems.length ? (
              <ul>
                {agendaItems.map((item) => (
                  <li key={item.id}>
                    {onEventSelect ? (
                      <Button
                        variant="ghost"
                        className="ct-calendar-event"
                        {...eventProps(item)}
                        disabled={disabled || item.disabled}
                        aria-label={`${item.title}, ${full(parseDate(agendaKey)!)}`}
                        onClick={() => onEventSelect(item)}
                      >
                        {eventContent(item)}
                        {item.description && (
                          <span className="ct-calendar-event-description">
                            {item.description}
                          </span>
                        )}
                      </Button>
                    ) : (
                      <div className="ct-calendar-event" {...eventProps(item)}>
                        {eventContent(item)}
                        {item.description && (
                          <span className="ct-calendar-event-description">
                            {item.description}
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events scheduled for this day.</p>
            )}
          </section>
        </>
      )}
    </section>
  );
}
