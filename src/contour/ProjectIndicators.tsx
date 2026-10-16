import { useEffect, useState, type CSSProperties } from "react";
import { ScrollArea } from "./scroll-area.js";
export interface DeadlineCountdownProps {
  deadline: string | number | Date;
  label?: string;
  showSeconds?: boolean;
  now?: number;
}
export function DeadlineCountdown({
  deadline,
  label = "Deadline",
  showSeconds = false,
  now: fixedNow,
}: DeadlineCountdownProps) {
  const [now, setNow] = useState(() => fixedNow ?? Date.now());
  useEffect(() => {
    if (fixedNow !== undefined) {
      setNow(fixedNow);
      return;
    }
    const timer = setInterval(
      () => setNow(Date.now()),
      showSeconds ? 1000 : 60000,
    );
    return () => clearInterval(timer);
  }, [fixedNow, showSeconds]);
  const end = new Date(deadline).getTime();
  const delta = end - now;
  const seconds = Math.max(0, Math.floor(Math.abs(delta) / 1000));
  const days = Math.floor(seconds / 86400),
    hours = Math.floor((seconds % 86400) / 3600),
    minutes = Math.floor((seconds % 3600) / 60);
  const text = days
    ? `${days}d ${hours}h`
    : hours
      ? `${hours}h ${minutes}m`
      : showSeconds
        ? `${minutes}m ${seconds % 60}s`
        : `${minutes}m`;
  return (
    <div className="ct-countdown" data-overdue={delta < 0 || undefined}>
      <span>{label}</span>
      <strong
        role="timer"
        aria-label={
          Number.isFinite(end)
            ? `${delta < 0 ? "Overdue by" : "Due in"} ${text}`
            : "Invalid deadline"
        }
      >
        {Number.isFinite(end)
          ? `${delta < 0 ? "Overdue · " : ""}${text}`
          : "Date unavailable"}
      </strong>
      {Number.isFinite(end) && (
        <time dateTime={new Date(end).toISOString()}>
          {new Date(end).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      )}
    </div>
  );
}
export interface Phase {
  id: string;
  label: string;
  color?: string;
}
export interface PhaseBarProps {
  phases: Phase[];
  current: string;
  onChange?: (id: string) => void;
  label?: string;
  disabled?: boolean;
}
export function PhaseBar({
  phases,
  current,
  onChange,
  label = "Project phases",
  disabled,
}: PhaseBarProps) {
  const selected = phases.findIndex((phase) => phase.id === current);
  return (
    <ol className="ct-phases" aria-label={label}>
      {phases.map((phase, index) => {
        const content = (
          <>
            <span
              className="ct-phase-track"
              style={
                {
                  "--phase-color":
                    phase.color || `var(--chart-${(index % 7) + 1}, #8d617d)`,
                } as CSSProperties
              }
            />
            <small>{index < selected ? "✓" : index + 1}</small>
            <span>{phase.label}</span>
          </>
        );
        return (
          <li
            key={phase.id}
            data-active={phase.id === current || undefined}
            data-complete={index < selected || undefined}
          >
            {onChange ? (
              <button
                type="button"
                disabled={disabled}
                aria-current={phase.id === current ? "step" : undefined}
                aria-label={`${phase.label}${index < selected ? ", completed" : ""}`}
                onClick={() => onChange(phase.id)}
              >
                {content}
              </button>
            ) : (
              <div aria-current={phase.id === current ? "step" : undefined}>
                {content}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
export interface DailyVerdict {
  date: string;
  state: "on-track" | "attention" | "blocked" | "pending";
  label?: string;
}
const verdictLabels = {
  "on-track": "On track",
  attention: "Needs attention",
  blocked: "Blocked",
  pending: "Pending",
};
export interface DailyVerdictStripProps {
  days: DailyVerdict[];
  label?: string;
  onSelect?: (day: DailyVerdict) => void;
  layout?: 'cards' | 'row';
  dateStyle?: 'compact' | 'plain';
  locale?: string;
}
export function DailyVerdictStrip({
  days,
  label = "Daily project status",
  onSelect,
  layout = 'cards',
  dateStyle = layout === 'row' ? 'plain' : 'compact',
  locale = 'en-GB',
}: DailyVerdictStripProps) {
  const strip = (
    <div className={`ct-verdicts ${layout === 'row' ? 'ct-verdicts-row' : ''}`} data-date-style={dateStyle} role="group" aria-label={label}>
      {days.length ? (
        days.map((day) => {
          const date = /^\d{4}-\d{2}-\d{2}$/.test(day.date) ? new Date(`${day.date}T12:00:00`) : null;
          const valid = date && Number.isFinite(date.getTime()) && `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}` === day.date;
          const fullDate = valid ? date.toLocaleDateString(locale, {weekday:'long',day:'numeric',month:'long',year:'numeric'}) : day.date || 'Date unavailable';
          const content = (
            <>
              <time dateTime={valid ? day.date : undefined} title={fullDate} aria-label={fullDate}>{dateStyle === 'plain' ? valid ? date.toLocaleDateString(locale, {day:'numeric',month:'short'}) : fullDate : valid ? day.date.slice(5) : fullDate}</time>
              <span>{day.label || verdictLabels[day.state]}</span>
            </>
          );
          return onSelect ? (
            <button
              key={day.date}
              type="button"
              data-state={day.state}
              onClick={() => onSelect(day)}
              aria-label={`${fullDate}: ${day.label || verdictLabels[day.state]}`}
            >
              {content}
            </button>
          ) : (
            <div key={day.date} data-state={day.state}>
              {content}
            </div>
          );
        })
      ) : (
        <p>No daily updates yet.</p>
      )}
    </div>
  );
  return layout === 'row' ? <ScrollArea axis="horizontal" label={label} className="ct-verdict-scroll">{strip}</ScrollArea> : strip;
}
