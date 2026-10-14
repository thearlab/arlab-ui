import { useState } from 'react';
import { Kanban, KanbanCard, type KanbanColumnDef, type KanbanTagTone } from '../board';
import { CalendarMonth, CalendarWeek, MiniCalendar, Timeline, type CalendarEvent } from '../time';
import { IconButton } from '../core/IconButton';
import { MoreHorizontalIcon } from '../core/icons';
import { moveCard } from '../lib/kanban';
import { Stack } from '../layout';
import type { Story } from './types';

interface Job { id: string; name: string; text: string; people: string[]; service: string; status: [string, KanbanTagTone]; due: string }
const job = (id: string, name: string, text: string, people: string[], status: [string, KanbanTagTone], due: string, service = 'Snapchat Lens'): Job => ({ id, name, text, people, service, status, due });
const START: Record<string, Job[]> = {
  blocked: [job('j1', 'Msheireb Street Scavenger Hunt', 'Waiting for client voiceover', ['Nadia Fares', 'Habib S.', 'Hadi'], ['Blocked', 'bad'], '20 Oct')],
  risk: [
    job('j2', 'Disney, Toy Story 5 | AR Lens Concept Deck | Snapchat | Sept 2026', 'V1 done, client feedback pending action', ['Habib S.', 'Yasmina Muslimany'], ['At risk', 'warn'], '14 Oct'),
    job('j3', 'Fanta Ad Yogi Face Lens', 'Concept deck overdue, next steps locked on approvals', ['Rita Allam'], ['At risk', 'warn'], '16 Oct'),
  ],
  due: [
    job('j4', 'Fanta Ad Yogi Marker Tech', 'Revisions in progress, one day overdue', ['Manon Darrouzes', 'Rafi'], ['Delayed', 'warn'], '9 Oct'),
    job('j5', 'Digital Arabic Library', 'Delayed, overdue on Amazon task', ['Walaa AlSalem'], ['Due today', 'info'], 'Today', 'Web app'),
  ],
  track: [job('j6', 'Ram Clinics', 'Process testing complete, workflow handed over', ['Laure'], ['On track', 'ok'], '21 Sep', 'Interactive screens')],
};
const COLS: KanbanColumnDef[] = [
  { id: 'blocked', title: 'Blocked', swatch: 'var(--bad)' },
  { id: 'risk', title: 'At risk', swatch: 'var(--warn)', limit: 1 },
  { id: 'due', title: 'Delayed or due today', swatch: 'var(--info)' },
  { id: 'track', title: 'On track', swatch: 'var(--ok)' },
];
const card = (j: Job) => (
  <KanbanCard title={j.name} text={j.text} people={j.people} date={j.due}
    tags={[{ label: j.service, tone: 'accent' }, { label: j.status[0], tone: j.status[1] }]}
    action={<IconButton size="sm" label={`More for ${j.name}`}><MoreHorizontalIcon /></IconButton>} />
);

function Board({ cols = COLS, start = START, adding }: { cols?: KanbanColumnDef[]; start?: Record<string, Job[]>; adding?: boolean }) {
  const [items, setItems] = useState(start);
  const [opened, setOpened] = useState('');
  return (
    <>
      <Kanban label="Ongoing projects" columns={cols} items={items} getId={(j) => j.id} getLabel={(j) => j.name} renderCard={card}
        onMove={(id, col, i) => setItems((s) => moveCard(s, id, col, i, (j) => j.id) as Record<string, Job[]>)}
        onOpen={(j) => setOpened(j.name)} onAdd={adding ? () => setOpened('a new card') : undefined} />
      {opened && <p className="ar-fine" role="status">Opened {opened}.</p>}
    </>
  );
}

const T = '2026-10-14';
const EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Patil weekly sync', date: T, start: '09:30', end: '10:00' },
  { id: 'e2', title: 'Disney Toy Story 5 review', date: T, start: '11:00', end: '12:00', tone: 'warn' },
  { id: 'e3', title: 'Creators Discovery v3 walkthrough', date: T, start: '15:00', end: '16:00', tone: 'info' },
  { id: 'e4', title: 'Studio day', date: T, tone: 'neutral' },
  { id: 'e5', title: 'Msheireb live', date: '2026-10-20', tone: 'bad' },
  { id: 'e6', title: 'Design review', date: '2026-10-15', start: '10:00', end: '11:30' },
  { id: 'e7', title: 'Client call, Ram Clinics', date: '2026-10-15', start: '10:30', end: '11:00', tone: 'ok' },
  { id: 'e8', title: 'Lunch and learn', date: '2026-10-16', start: '13:00', end: '14:00', tone: 'info' },
  { id: 'e9', title: 'Gitex', date: '2026-10-12', endDate: '2026-10-13', tone: 'neutral' },
  { id: 'e10', title: 'Quarterly planning', date: '2026-10-02', start: '14:00', end: '17:00' },
  { id: 'e11', title: 'Late deploy', date: '2026-10-17', start: '19:00', end: '20:00', tone: 'bad' },
];

function MonthWithAgenda() {
  const [day, setDay] = useState<string | null>(T);
  const list = EVENTS.filter((e) => day && day >= e.date && day <= (e.endDate ?? e.date));
  return (
    <Stack gap="sm">
      <CalendarMonth label="Team calendar" events={EVENTS} today={T} value={day} onChange={setDay} />
      <section aria-label="Events on the chosen day" className="ar-fine">{day ? `${list.length} on ${day}: ${list.map((e) => e.title).join(', ') || 'nothing'}` : 'Pick a day'}</section>
    </Stack>
  );
}

const NOW = new Date(2026, 9, 14, 11, 20);

export const stories: Story[] = [
  {
    id: 'kanban', title: 'Kanban', group: 'Boards', components: ['Kanban', 'KanbanCard', 'moveCard'],
    summary: 'Work moving through stages (ongoing projects, briefs, tool requests). Controlled: apply onMove to your items.',
    usage: `<Kanban label="Ongoing projects" columns={cols} items={items} getId={(p) => p.id} getLabel={(p) => p.name}\n  renderCard={(p) => <KanbanCard title={p.name} text={p.next} people={p.team} tags={[...]} date={p.due} />}\n  onMove={(id, col, i) => setItems((s) => moveCard(s, id, col, i, (p) => p.id))} onOpen={openProject} />`,
    a11y: ['Each card is one tab stop. Space picks it up, arrows move it within and across columns, Space drops, Esc cancels; every step is announced.', 'Enter opens the card when onOpen is set (otherwise it also picks up).', 'Pointer: drag with a mouse or pen, or long-press on touch (a swipe still scrolls). Esc cancels a drag.', 'The board scrolls sideways inside its own box; columns are 82% wide on a phone.'],
    covers: ['Kanban on ongoing projects, briefs and tool requests'],
    states: [
      { name: 'Board', wide: true, render: () => <Board adding /> },
      { name: 'Empty column, over its limit, collapsed', wide: true, render: () => <Board start={{ ...START, track: [] }} cols={[...COLS.slice(0, 3), { ...COLS[3] }, { id: 'done', title: 'Done', collapsed: true }]} /> },
      { name: 'Read only (no onMove)', wide: true, render: () => <Kanban label="Briefs" columns={COLS.slice(0, 2)} items={START} getId={(j) => j.id} getLabel={(j) => j.name} renderCard={card} /> },
    ],
  },
  {
    id: 'calendar-month', title: 'Calendar, month', group: 'Content and time', components: ['CalendarMonth'],
    summary: 'A month of events with a chosen day. Pair it with a list of the chosen day\'s events.',
    usage: `<CalendarMonth label="Team calendar" events={events} value={day} onChange={setDay} onEventClick={open} />`,
    a11y: ['An ARIA grid: one day is a tab stop; arrows move by day and week, Home and End to the week ends, Page Up and Page Down by month, Enter picks.', 'Each day is named with its date and how many events it has. Event chips are for the pointer; keyboard people pick the day and read its list.', 'Phone width shows dots in place of titles.'],
    covers: ['Calendar page'],
    states: [
      { name: 'Month with a chosen day', wide: true, render: () => <MonthWithAgenda /> },
      { name: 'Quiet month, Sunday first', wide: true, render: () => <CalendarMonth label="Holidays" today={T} defaultMonth="2026-11-01" weekStart={0} events={[{ id: 'h', title: 'National day', date: '2026-11-30', tone: 'ok' }]} /> },
    ],
  },
  {
    id: 'calendar-week', title: 'Calendar, week', group: 'Content and time', components: ['CalendarWeek'],
    summary: 'A working week: all-day events on top, timed events in an hour grid, overlaps side by side, a line at now. A list of days on a phone.',
    usage: `<CalendarWeek events={events} defaultWeek={today} onEventClick={open} scrollToHour={8} />`,
    a11y: ['The hour grid is a scroll region you can reach with Tab; each event is a button named with its title, day and time.', 'On a phone, the same events are a list of days.'],
    covers: ['Calendar page'],
    states: [{ name: 'Week', wide: true, render: () => <CalendarWeek label="My week" events={EVENTS} defaultWeek={T} now={NOW} height={420} /> }],
  },
  {
    id: 'mini-calendar', title: 'Mini calendar', group: 'Content and time', components: ['MiniCalendar'],
    summary: 'A compact month for side panels: pick a day, dots on the days with something on them.',
    usage: `<MiniCalendar value={day} onChange={setDay} marked={busyDays} />`,
    a11y: ['The same grid keys as the month view.', 'Days outside min and max cannot be picked.'],
    covers: [],
    states: [
      { name: 'Default', render: () => <MiniCalendar today={T} defaultValue={T} marked={['2026-10-15', '2026-10-16', '2026-10-20']} label="Pick a day" /> },
      { name: 'Limited range', render: () => <MiniCalendar today={T} defaultMonth={T} min="2026-10-10" max="2026-10-24" label="Pick a live date" /> },
    ],
  },
  {
    id: 'timeline', title: 'Timeline', group: 'Content and time', components: ['Timeline'],
    summary: 'What happened, grouped by day with the day sticky, or the steps of a process as done, now and next.',
    usage: `<Timeline label="Project history" items={[{ id, date, time: '14:11', title: 'Laure published the deck', detail: 'Version 2', tone: 'ok' }]} />`,
    a11y: ['An ordered list per day under a day heading. The current step carries aria-current="step" and every state is spoken.'],
    covers: ['Timeline'],
    states: [
      { name: 'Activity by day', render: () => <Timeline label="Project history" today={T} items={[
        { id: 'a', date: T, time: '14:11', title: 'Laure published hig-ux-reviewer', meta: 'version 1.0', tone: 'ok' },
        { id: 'b', date: T, time: '09:02', title: 'Sam entered a wrong 2FA code', detail: 'Failed sign-in, 3 in a row', tone: 'bad' },
        { id: 'c', date: '2026-10-13', time: '17:40', title: 'Nadia moved Msheireb Street Scavenger Hunt to Blocked', detail: 'Waiting for client voiceover', tone: 'warn' },
        { id: 'd', date: '2026-10-06', time: '10:15', title: 'Habib added a brief', tone: 'info' },
      ]} /> },
      { name: 'Progress', render: () => <Timeline label="Brief to delivery" items={[
        { id: '1', title: 'Brief received', detail: '2 Oct', state: 'done' },
        { id: '2', title: 'Concept approved', detail: '9 Oct', state: 'done' },
        { id: '3', title: 'Build', detail: 'In progress, 3 of 5 screens', state: 'now' },
        { id: '4', title: 'Client review', state: 'next' },
        { id: '5', title: 'Live', detail: 'Planned 20 Oct', state: 'next' },
      ]} /> },
      { name: 'With actions, long text', render: () => <Timeline label="Approvals" items={[
        { id: 'x', time: '11:02', title: 'Fred asked to approve the Disney, Toy Story 5 concept deck before it goes to the client on Friday morning', tone: 'accent', actions: <IconButton size="sm" label="More for this approval"><MoreHorizontalIcon /></IconButton> },
      ]} /> },
      { name: 'Empty', render: () => <Timeline label="History" items={[]} empty="Nothing has happened on this project yet." /> },
    ],
  },
];
