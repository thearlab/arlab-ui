# Calendar

A reusable month or rolling-period calendar. Applications supply all events and persistence; the component never creates sample records or writes scheduling data.

## Presentation

The heading contains the human-readable period and exact visible range. Previous, Today and Next reuse shared buttons. Today changes the visible period without silently changing selection. Dates use compact corner controls, a fine grid and subdued weekend surfaces. The selected day has a soft accent surface; today has a small outlined marker. Focus uses the same thin shared focus treatment.

Events show a restrained chart marker, optional time and title. `tone` accepts quiet, ok, warn, bad or info; `color` accepts an application token such as `var(--dept-engineering)`. Meaning must also be expressed in text. `maxEventsPerDay` defaults to 3, and overflow opens the full day agenda. Event details keep their complete titles and descriptions in that agenda.

At 640px or below, including a narrow component container, cells show dates and event counts. Selecting a count opens the readable agenda below the grid. This avoids clipping event names into unreadable fragments. Date controls use larger touch targets on narrow layouts.

## Data contract

- Dates are local `YYYY-MM-DD` strings, not UTC timestamps.
- `value` / `onSelect` control selection; `defaultValue` provides an uncontrolled initial date.
- `month` / `onMonthChange` control a `YYYY-MM` month; `defaultMonth` initializes it.
- `startDate` / `onStartDateChange` control a rolling period and take precedence over month. `defaultStartDate` initializes an uncontrolled rolling period.
- `weeks` accepts 1 to 12. Rolling periods default to five weeks. Month view grows as needed to show every date.
- `events` contain unique `id`, `date`, `title`, and optional `description`, `time`, `tone`, `color`, `disabled`.
- `onEventSelect` receives the original event object. Without it, events are static content.
- `onDayDetails` optionally receives a date when overflow or an event-count control opens the agenda.
- `min`, `max`, `isDateDisabled` and `disabled` govern date selection. Individual events have their own disabled state.
- `weekStartsOn` defaults to Monday (1). `locale` defaults to en-GB.

## Keyboard and accessibility

Dates use a single roving tab stop. Arrow keys move by day/week; Home and End move within a week; Page Up and Page Down move by period (Shift changes a month view by year). Keyboard focus does not select a date. Enter or Space activates the focused native button. Native event buttons retain independent activation. Date labels include the complete human-readable date; today and selection are exposed separately. Invalid period/bound values display an alert instead of a broken grid.

## Example

```tsx
<Calendar
  month={month}
  onMonthChange={setMonth}
  value={date}
  onSelect={setDate}
  events={events}
  onEventSelect={openEvent}
  maxEventsPerDay={3}
/>
```

The local showcase includes month and five-week examples, event details, light/dark themes and phone presentation. Released in beta.15.
