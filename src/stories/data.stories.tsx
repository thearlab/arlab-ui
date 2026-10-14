import { useState } from 'react';
import { Avatar, AvatarGroup, Badge, Card, CardBody, CardFooter, CardHeader, Chip, DataTable, EmptyState, Facts, Heatmap, List, ListRow, ListSkeleton, Meter, Panel, Pill, Progress, Skeleton, SkeletonText, StatTile, StatusDot, Table, TableRow, SortHead, Timestamp, type DataColumn, type HeatmapRow } from '../data';
import { BarChart, Legend, LineChart, Sparkline } from '../charts';
import { Button, IconButton } from '../core';
import { MoreVerticalIcon, EditIcon, ClockIcon, ChatIcon, TimerIcon, FolderIcon } from '../core/icons';
import { CardGrid, Inline, Stack } from '../layout';
import { money } from '../lib/format';
import type { Story } from './types';

const NOW = Date.now();
const people = ['Nadia Fares', 'Habib Saleh', 'Hadi Khoury', 'Laure Dubois', 'Rafi Haddad', 'Walaa AlSalem', 'Yasmina Muslimany'];
const more = <IconButton size="sm" label="More actions"><MoreVerticalIcon /></IconButton>;

function ProjectCard({ name, ctx, tone, label, date, selected, onOpen }: { name: string; ctx: string; tone: 'bad' | 'warn' | 'ok' | 'info'; label: string; date: string; selected?: boolean; onOpen?: () => void }) {
  return (
    <Card title={name} menu={more} context={ctx} selected={selected} onOpen={onOpen}
      people={<><span><Avatar name="Nadia Fares" size="xs" decorative /> Nadia Fares</span><span><Avatar name="Habib Saleh" size="xs" decorative /> Habib S.</span></>}
      foot={<><Pill tone="accent">Snapchat Lens</Pill><Pill tone={tone}>{label}</Pill></>} footEnd={<><ClockIcon size={14} aria-hidden="true" /> {date}</>} />
  );
}

function CardsDemo() {
  const [sel, setSel] = useState('a');
  return (
    <CardGrid cols={3}>
      <ProjectCard name="Msheireb Street Scavenger Hunt" ctx="Waiting for client voiceover" tone="bad" label="Blocked" date="20 Oct" selected={sel === 'a'} onOpen={() => setSel('a')} />
      <ProjectCard name="Disney, Toy Story 5 | AR Lens Concept Deck | Snapchat | Sept 2026" ctx="V1 done, client feedback pending action. A long context line that must clamp to two lines and never push the foot out of line." tone="warn" label="At risk" date="14 Oct" selected={sel === 'b'} onOpen={() => setSel('b')} />
      <ProjectCard name="Fanta Ad Yogi Marker Tech" ctx="Revisions in progress, one day overdue" tone="ok" label="On track" date="9 Oct" selected={sel === 'c'} onOpen={() => setSel('c')} />
    </CardGrid>
  );
}

const rows = Array.from({ length: 24 }, (_, i) => ({ id: `agent-${i}`, name: ['scout-rate', 'pitch-deck-run', 'labby-daily', 'trend-detect', 'brief-reader', 'seo-writer'][i % 6] + (i >= 6 ? `-${i}` : ''), runs: (i * 37) % 260 + 3, cost: ((i * 1.37) % 6) + 0.004 * i, owner: people[i % people.length], last: NOW - i * 3_600_000 * 7 }));
type R = (typeof rows)[number];
const cols: DataColumn<R>[] = [
  { key: 'name', header: 'Agent', cell: (r) => <b>{r.name}</b>, sortValue: (r) => r.name, rowHeader: true, width: 220 },
  { key: 'owner', header: 'Owner', cell: (r) => <Inline gap="xs" wrap={false}><Avatar name={r.owner} size="xs" decorative /><span>{r.owner}</span></Inline>, sortValue: (r) => r.owner, hideBelow: 'phone', width: 200 },
  { key: 'last', header: 'Last run', cell: (r) => <Timestamp date={r.last} />, sortValue: (r) => r.last, hideBelow: 'tablet', width: 140 },
  { key: 'runs', header: 'Runs', cell: (r) => r.runs.toLocaleString('en-US'), sortValue: (r) => r.runs, align: 'end', width: 90 },
  { key: 'cost', header: 'Spent', cell: (r) => money(r.cost), sortValue: (r) => r.cost, align: 'end', width: 100 },
];
const actions = (r: R) => <IconButton size="sm" label={`Edit ${r.name}`}><EditIcon /></IconButton>;

function DataTableDemo(p: Partial<Parameters<typeof DataTable<R>>[0]>) {
  const [open, setOpen] = useState<string | null>(null);
  return <DataTable<R> rows={rows.slice(0, 8)} columns={cols} rowKey={(r) => r.id} rowLabel={(r) => r.name} label="Every agent" rowActions={actions} onRowOpen={(r) => setOpen(r.id)} activeKey={open} defaultSort={{ key: 'cost', dir: 'desc' }} {...p} />;
}
const longRows = Array.from({ length: 2000 }, (_, i) => ({ ...rows[i % rows.length], id: `r${i}`, name: `event-${String(i + 1).padStart(4, '0')}` }));

const days = ['8 Oct', '9 Oct', '10 Oct', '11 Oct', '12 Oct', '13 Oct', 'Today'];
const hmCols = days.map((d) => ({ key: d, label: d }));
const hmRows: HeatmapRow[] = [
  { key: 'scout', label: 'scout-rate', values: [0.12, null, 1.39, 1.71, null, 0.91, undefined] },
  { key: 'pitch', label: 'pitch-deck-run', values: [null, 0.4, null, 2.1, 0.05, null, undefined] },
  { key: 'labby', label: 'labby-daily', values: [0.08, 0.08, 0.08, 0.08, 0.08, 0.08, undefined] },
  { key: 'long', label: 'a-very-long-agent-name-that-truncates', values: [8.67, 2.5, 4.84, 0.69, null, null, undefined] },
];
function HeatmapDemo({ loading = true }: { loading?: boolean }) {
  const [hit, setHit] = useState('');
  const r = loading ? hmRows : hmRows.map((x) => ({ ...x, values: x.values.map((v) => (v === undefined ? 0.3 : v)) }));
  return <Stack gap="sm"><Heatmap label="Agent spend by day" rowHeader="Agent" columns={hmCols} rows={r} format={money} onCellClick={(row, c, v) => setHit(`${row.label}, ${c.label}, ${money(v)}`)} /><p className="ar-fine" aria-live="polite">{hit ? `Opened ${hit}` : 'Click a cell to open its runs.'}</p></Stack>;
}

const bars = ['15 Sep', '21 Sep', '27 Sep', '3 Oct', '9 Oct', '12 Oct', '13 Oct', 'Today'].map((label, i) => ({ label, value: [0.4, 1.2, 0, 3.4, 8.67, 2.5, 4.84, 0.69][i] }));
const month = Array.from({ length: 30 }, (_, i) => ({ label: `${(i % 30) + 15 > 30 ? i - 15 : i + 15} ${i < 16 ? 'Sep' : 'Oct'}`, value: i > 26 ? null : Math.round((Math.sin(i / 3) + 1.4) * 30) / 10 }));
const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({ label, value: [2.5, 5, 3.8, 7, 2, 5.2, 7.6][i] }));

function ListDemo() {
  const [v, setV] = useState<string | null>('scout');
  return (
    <List label="Every agent" selectable value={v} onChange={setV}>
      <ListRow value="scout" title="scout-rate" meta="241 runs" tone="warn" toneLabel="needs a look" trailing={<><Sparkline label="30 days, peak 34 on 12 Oct" values={[1, 3, 0, 5, 8, 2, 0, 4, 9, 12, 3, 5]} />$5.09</>} />
      <ListRow value="pitch" title="pitch-deck-run" meta="88 runs" trailing={<><Sparkline label="30 days, peak 12" values={[0, 0, 2, 4, 1, 0, 6, 12, 3, 0, 0, 1]} />$3.12</>} />
      <ListRow value="labby" title="labby-daily" meta="30 runs, every day" trailing="$2.40" />
      <ListRow value="long" title="an-agent-with-a-very-long-name-that-has-to-truncate-cleanly" meta="Never published, a leftover from a test" tone="bad" toneLabel="flagged" trailing="$0.00" />
    </List>
  );
}

function ChipsDemo() {
  const [on, setOn] = useState<string[]>(['used']);
  const opts = [['used', 'Projects on the site', 624], ['not', 'Not on the site', 133], ['strip', 'Client strip', 13], ['unused', 'Not used', 156]] as const;
  const [tags, setTags] = useState(['Snapchat', 'Engineering', 'Due this week']);
  return (
    <Stack gap="sm">
      <Inline>{opts.map(([k, l, n]) => <Chip key={k} selected={on.includes(k)} count={n} onSelectedChange={(s) => setOn(s ? [...on, k] : on.filter((x) => x !== k))}>{l}</Chip>)}</Inline>
      <Inline>{tags.map((t) => <Chip key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Chip>)}{!tags.length && <span className="ar-fine">No filters</span>}</Inline>
    </Stack>
  );
}

export const stories: Story[] = [
  {
    id: 'card', title: 'Card', group: 'Data display', components: ['Card', 'CardHeader', 'CardBody', 'CardFooter'],
    summary: 'One anatomy everywhere: title (and a menu), two lines of context, people, a hairline, tags and counts. Interactive cards put a real button on the title.',
    usage: `<Card title={p.name} menu={<Menu />} context={p.next} people={<AvatarGroup names={p.team} />} foot={<Pill tone="warn">At risk</Pill>} footEnd="14 Oct" onOpen={() => open(p.id)} />`,
    a11y: ['The title is the button or link and stretches over the card, so nothing interactive is nested.', 'The menu stays a separate tab stop above the card.', 'Selected cards set aria-current.'],
    covers: ['Card', 'ToolTile', 'Preview', 'MailCard', 'ClientCard', 'ShareCard'],
    states: [
      { name: 'Board cards, clickable, one selected', wide: true, render: () => <CardsDemo /> },
      { name: 'Static with header and footer', render: () => (
        <Card><CardHeader title="Next step" sub="Updated today, 9:02" actions={<Button size="sm" variant="ghost">Edit</Button>} /><CardBody>Get the voiceover from the client, then finish the build.</CardBody><CardFooter><Button size="sm">Open as page</Button></CardFooter></Card>
      ) },
      { name: 'Link card (tool tile)', render: () => <div style={{ maxWidth: 280 }}><Card href="#timesheets" title={<Inline gap="sm" wrap={false}><TimerIcon size={18} aria-hidden="true" />Timesheets</Inline>} context="Log hours against ClickUp tasks." foot={<Pill tone="info" dot>2 to approve</Pill>} /></div> },
      { name: 'Loading', render: () => <Card><Skeleton width="60%" height={16} /><SkeletonText lines={2} /></Card> },
    ],
  },
  {
    id: 'panel', title: 'Panel', group: 'Data display', components: ['Panel'],
    summary: 'A titled section of a page on a card, with an actions slot. Flush panels let a table or list run edge to edge.',
    covers: ['Panel', 'Section', 'SectionHead'],
    states: [
      { name: 'With actions', render: () => <Panel title="Waiting on you" sub="3 things" actions={<Button size="sm" variant="ghost">See all</Button>}><p style={{ margin: 0 }}>2 tool requests to decide, 3 unsorted emails.</p></Panel> },
      { name: 'Empty', render: () => <Panel title="Failures"><EmptyState size="compact">Nothing failed or fell back in this period.</EmptyState></Panel> },
    ],
  },
  {
    id: 'stat-tile', title: 'Stat tile', group: 'Data display', components: ['StatTile'],
    summary: 'A big tabular number with a small muted label. Deltas say the direction in words too.',
    covers: [],
    states: [
      { name: 'Summary band', wide: true, render: () => <Panel><Inline gap="xl" align="start"><StatTile value="$20.58" label="spent" delta={{ text: '12% on last month', direction: 'up', good: false }} /><StatTile value="1,394" label="runs" delta={{ text: '8% on last month', direction: 'up', good: true }} /><StatTile value="<$0.01" label="per text run" /><StatTile value="3" label="failed on their last run" tone="bad" hint="Since 2 Oct" /><StatTile value="34 h 50 m" label="logged this week" delta={{ text: 'same as last week', direction: 'flat' }} /></Inline></Panel> },
      { name: 'Loading', render: () => <Inline gap="xl"><StatTile loading value="" label="spent" /><StatTile loading value="" label="runs" /></Inline> },
    ],
  },
  {
    id: 'pill-badge', title: 'Pill, badge and status dot', group: 'Data display', components: ['Pill', 'Badge', 'StatusDot'],
    summary: 'One fact per pill. Status tones only for state. A red badge only when something needs a look, never a zero. Dots always come with words.',
    covers: ['Pill'],
    states: [
      { name: 'Pill tones', render: () => <Inline><Pill>Agent</Pill><Pill tone="accent">Snapchat Lens</Pill><Pill tone="ok" dot>On track</Pill><Pill tone="warn" dot>At risk</Pill><Pill tone="bad" dot>Blocked</Pill><Pill tone="info" dot>Due today</Pill><Pill size="sm">Small</Pill><Pill icon={<FolderIcon />}>4 projects</Pill></Inline> },
      { name: 'Long pill truncates', render: () => <div style={{ width: 180 }}><Pill tone="accent">Interactive screens and a very long service name</Pill></div> },
      { name: 'Badges', render: () => <Inline><span>Jobs <Badge count={2} tone="alert" label="2 need you" /></span><span>Keys and people <Badge count={11} /></span><span>Messages <Badge count={140} tone="alert" label="140 need you" /></span><span>Nothing <Badge count={0} /></span><Badge count={4} tone="accent" /></Inline> },
      { name: 'Status dots', render: () => <Inline gap="lg"><StatusDot tone="ok">On time</StatusDot><StatusDot tone="warn">Late</StatusDot><StatusDot tone="bad" pulse>Failed</StatusDot><StatusDot tone="neutral">Not reported yet</StatusDot></Inline> },
    ],
  },
  {
    id: 'chip', title: 'Chip', group: 'Data display', components: ['Chip'],
    summary: 'Filter chips in soft tints with counts; the chosen one in the accent tint. Removable chips for applied filters and tokens.',
    a11y: ['A toggle button (aria-pressed). The remove button is a separate, named button ("Remove Snapchat").'],
    covers: ['PillButton'],
    states: [{ name: 'Toggle and remove', render: () => <ChipsDemo /> }],
  },
  {
    id: 'avatar', title: 'Avatar and group', group: 'Data display', components: ['Avatar', 'AvatarGroup'],
    summary: 'Faces make work feel owned: the photo, or initials on the person\'s colour.',
    covers: [],
    states: [
      { name: 'Sizes and fallback', render: () => <Inline><Avatar name="Laure Dubois" size="lg" /><Avatar name="Nadia Fares" /><Avatar name="habib.saleh@thearlab.com" size="sm" /><Avatar name="Rafi" size="xs" /><Avatar name="Broken image" src="/nope.png" /><Avatar name="Sephora" shape="square" /></Inline> },
      { name: 'Group with overflow', render: () => <Inline gap="lg"><AvatarGroup names={people} label="Team" /><AvatarGroup names={people.slice(0, 3)} size="md" /></Inline> },
      { name: 'Every hue', render: () => <Inline>{['Ann', 'Bo', 'Cy', 'Dee', 'Eve', 'Flo', 'Gus', 'Hal', 'Ivy', 'Jo', 'Kai', 'Lu'].map((n) => <Avatar key={n} name={n} />)}</Inline> },
    ],
  },
  {
    id: 'progress-meter', title: 'Progress and meter', group: 'Data display', components: ['Progress', 'Meter'],
    summary: 'Progress for work in flight (determinate when it can be measured). Meter for a value against limits: a monthly cap, a title length.',
    covers: ['Meter'],
    states: [
      { name: 'Progress', render: () => <Stack gap="sm"><Progress label="Applying changes" value={3} max={8} valueText="3 of 8" /><Progress label="Time this week" value={71} tone="ok" /><Progress label="Counting days" /><Progress label="Hidden label" hideLabel value={43} size="sm" /></Stack> },
      { name: 'Meter', render: () => <Stack gap="sm"><Meter label="Web data credits" value={210} max={300} warnAt={240} badAt={300} valueText="210 of 300 credits this month" /><Meter label="Web data credits" value={262} max={300} warnAt={240} badAt={300} valueText="262 of 300, over 80 percent" /><Meter label="Title" value={62} max={69} good={[30, 60]} emptyIsBad valueText="62 characters. Google cuts it after about 60." /><Meter label="Description" value={0} max={184} good={[120, 160]} emptyIsBad valueText="Empty: Google picks one." /></Stack> },
    ],
  },
  {
    id: 'facts', title: 'Facts', group: 'Data display', components: ['Facts'],
    summary: 'A key-value list for a thing (Kind, Can reach, Made by). Two columns on wide panels.',
    covers: ['Facts', 'FieldRow'],
    states: [
      { name: 'One column', render: () => <Facts items={[['Kind', 'Knowledge key'], ['Starts with', <code key="c">cak_live_7f</code>], ['Can reach', 'Engineering docs, read only'], ['Made by', 'Laure, 3 Sep'], ['Notes', null]]} /> },
      { name: 'Two columns, stacked labels', render: () => <Facts columns={2} layout="stacked" items={[['Live date', '20 Oct'], ['On the tracker', 'ongoing'], ['Service', 'Snapchat Lens, Complex'], ['Status', 'Today, 9:02']]} /> },
    ],
  },
  {
    id: 'list', title: 'List', group: 'Data display', components: ['List', 'ListRow'],
    summary: 'Rows of name, meta and one number. Selectable lists are the Inspector\'s left side: the chosen row gets an accent bar.',
    a11y: ['Selectable: a listbox with one tab stop; arrows, Home and End move and choose; type letters to jump.', 'Plain rows that open something are buttons or links.'],
    covers: ['Row'],
    states: [
      { name: 'Selectable (Inspector)', render: () => <div style={{ maxWidth: 420 }}><ListDemo /></div> },
      { name: 'Plain, clickable', render: () => <List label="Your day"><ListRow title="Patil weekly sync" meta="Google Meet" leading={<b className="ar-num" style={{ width: 44 }}>9:30</b>} trailing={<Button size="sm">Join</Button>} /><ListRow title="Disney Toy Story 5 review" meta="With Aya and Rafi" leading={<b className="ar-num" style={{ width: 44 }}>11:00</b>} onOpen={() => {}} trailing={<Pill tone="info">Soon</Pill>} /><ListRow title="Keys unused for 30 days" meta="Engine admin" leading={<span style={{ width: 44 }}><Avatar name="Engine" size="sm" shape="square" decorative /></span>} trailing={<Badge count={10} tone="accent" />} href="#keys" /></List> },
      { name: 'Loading', render: () => <ListSkeleton rows={4} /> },
      { name: 'Empty', render: () => <EmptyState size="compact">No agents ran in this period on OpenRouter.</EmptyState> },
    ],
  },
  {
    id: 'table', title: 'Table', group: 'Data display', components: ['Table', 'TableRow', 'SortHead'],
    summary: 'The styled primitive: its own scroll box, a sticky header, gutters on the first and last cells. Rows that open something open on Enter too.',
    covers: ['Table', 'SortHead'],
    states: [{ name: 'Sortable, clickable rows', wide: true, render: () => {
      const T = () => { const [dir, setDir] = useState<'asc' | 'desc' | null>('asc'); const list = [...people].sort((a, b) => (dir === 'desc' ? b.localeCompare(a) : a.localeCompare(b))); return (
        <Table label="People" maxHeight={260}>
          <thead><tr><SortHead dir={dir} onSort={() => setDir(dir === 'asc' ? 'desc' : 'asc')} scope="col">Person</SortHead><th scope="col">Role</th><th scope="col" className="ar-th--end">Runs</th></tr></thead>
          <tbody>{list.map((n, i) => <TableRow key={n} onOpen={() => {}}><td><Inline gap="sm" wrap={false}><Avatar name={n} size="sm" decorative />{n}</Inline></td><td><Pill tone={i === 0 ? 'accent' : 'neutral'}>{i === 0 ? 'Owner' : 'Member'}</Pill></td><td className="ar-td--end">{(i + 1) * 13}</td></TableRow>)}</tbody>
        </Table>); };
      return <T />;
    } }],
  },
  {
    id: 'data-table', title: 'Data table', group: 'Data display', components: ['DataTable'],
    summary: 'Columns config with sorting, row selection, row actions, a sticky header, virtualisation for long lists, optional column resize, and loading, empty and error states.',
    usage: `<DataTable rows={agents} columns={cols} rowKey={(a) => a.id} rowLabel={(a) => a.name} label="Every agent" selectable onRowOpen={open} rowActions={(a) => <Menu ... />} />`,
    a11y: ['Sortable heads are buttons with aria-sort. Rows open on click or Enter; Up and Down move between rows.', 'Checkboxes are named after the row; the header box is mixed when some are ticked.', 'Virtual tables set aria-rowcount and aria-rowindex. Resize handles take Left and Right.'],
    covers: ['Table'],
    states: [
      { name: 'Sorted, actions, clickable', wide: true, render: () => <DataTableDemo /> },
      { name: 'Selectable with bulk actions', wide: true, render: () => <DataTableDemo selectable defaultSelected={['agent-1', 'agent-2']} selectionActions={(k) => <Button size="sm" variant="danger">Revoke {k.length}</Button>} /> },
      { name: 'Resizable columns', wide: true, render: () => <DataTableDemo resizable dense /> },
      { name: '2,000 rows, virtualised', wide: true, render: () => <DataTable<R> rows={longRows} columns={cols} rowKey={(r) => r.id} rowLabel={(r) => r.name} label="Every event" maxHeight={360} dense onRowOpen={() => {}} /> },
      { name: 'Loading', wide: true, render: () => <DataTableDemo loading /> },
      { name: 'Empty', wide: true, render: () => <DataTableDemo rows={[]} empty="No agents match. Clear a filter." /> },
      { name: 'Error', wide: true, render: () => <DataTableDemo error="the engine did not answer in time." onRetry={() => {}} /> },
    ],
  },
  {
    id: 'heatmap', title: 'Heatmap (grid by day)', group: 'Data display', components: ['Heatmap'],
    summary: 'Patterns over time across many items: rows by days, shaded by amount, totals, skeleton cells for days still loading. A cell opens that day\'s runs.',
    a11y: ['A grid: one tab stop, arrows move between cells, Home and End jump along the row.', 'Each cell says its row, day and value ("scout-rate, 13 Oct, $0.91").'],
    covers: [],
    states: [{ name: 'Today still loading', wide: true, render: () => <HeatmapDemo /> }, { name: 'Loaded', wide: true, render: () => <HeatmapDemo loading={false} /> }],
  },
  {
    id: 'charts', title: 'Charts', group: 'Charts', components: ['BarChart', 'LineChart', 'Sparkline', 'Legend'],
    summary: 'A small, dependency-free set. The data is the loudest thing; one accent; every chart has a title, a one-line summary and the numbers as a hidden table.',
    a11y: ['Bar and spark charts are read as their summary and a data table.', 'The line chart takes focus; Left and Right read each point aloud.'],
    covers: [],
    states: [
      { name: 'Bars by day, labelled', render: () => <Panel title="By day" sub="8 days counted"><BarChart title="Spend by day" summary="Spend peaked on 9 Oct at $8.67." showSummary data={bars} format={(v) => `$${v.toFixed(2)}`} highlight={7} /></Panel> },
      { name: '30 bars, three still loading', wide: true, render: () => <Panel title="Runs by day"><BarChart title="Runs by day" data={month} /></Panel> },
      { name: 'Failures', render: () => <Panel title="Failed runs"><BarChart title="Failed runs by day" tone="bad" data={week.map((d, i) => ({ ...d, value: [0, 2, 0, 0, 5, 1, 0][i] }))} /></Panel> },
      { name: 'Line with Now', render: () => <Panel title="Time this week" sub="from ClickUp"><StatTile value="34 h 50 m" label="logged" /><LineChart title="Hours logged per day this week" summary="Most hours on Sunday, 7.6 h." data={week} now={6} format={(v) => `${v} h`} /></Panel> },
      { name: 'Sparkline and legend', render: () => <Inline gap="lg"><Sparkline label="30 days, 241 runs, peak 34 on 12 Oct" values={month.map((d) => d.value)} /><Sparkline variant="line" width={100} label="Rising this week" values={week.map((d) => d.value)} /><Legend items={[{ label: 'Runs', value: '1,394' }, { label: 'Failed', tone: 'bad', value: 9 }, { label: 'Not loaded', tone: 'muted' }]} /></Inline> },
      { name: 'Empty', render: () => <Panel title="By day"><BarChart title="Spend by day" data={[]} /><EmptyState size="compact">No runs in this period.</EmptyState></Panel> },
    ],
  },
  {
    id: 'timestamp-empty-skeleton', title: 'Timestamp, empty state, skeletons', group: 'Content and time', components: ['Timestamp', 'EmptyState', 'Skeleton', 'SkeletonText', 'ListSkeleton'],
    summary: 'Times in plain words with the full date on hover. Empty states say what is missing and what to do. Loading is a skeleton, never a sentence.',
    covers: ['Timestamp', 'EmptyNote', 'Skel', 'ListSkeleton'],
    states: [
      { name: 'Timestamps', render: () => <Inline gap="lg"><Timestamp date={NOW - 20_000} /><Timestamp date={NOW - 12 * 60_000} /><Timestamp date={NOW - 26 * 3_600_000} /><Timestamp date="2026-09-03T09:02:00" format="date" /><Timestamp date="2026-10-14T09:02:00" format="datetime" /><Timestamp date="nope" /></Inline> },
      { name: 'Empty state', render: () => <Card><EmptyState title="No members yet" action={<Button variant="primary">Add a member</Button>}>Add someone by email and they can sign in right away, even if they have never opened the tool.</EmptyState></Card> },
      { name: 'Skeletons', render: () => <Card><Inline wrap={false}><Skeleton width={40} height={40} circle /><SkeletonText lines={2} /></Inline><Skeleton height={120} radius={12} /></Card> },
    ],
  },
];

void ChatIcon;
