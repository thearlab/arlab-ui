import { useState } from 'react';
import { Button } from '../core/Button';
import { ChartIcon, FolderIcon, HomeIcon, KeyIcon, PlusIcon, SettingsIcon, UsersIcon } from '../core/icons';
import { Inline, Stack } from '../layout';
import { Breadcrumbs, CommandMenu, LoadMore, Pagination, TabPanel, Tabs, type CommandItem } from '../navigation';
import { Alert, LoadingBar, useToast } from '../feedback';
import type { Story } from './types';

const ADMIN_TABS = [
  { value: 'spend', label: 'Agent spend' }, { value: 'logs', label: 'Logs' }, { value: 'jobs', label: 'Jobs', count: 2 },
  { value: 'failures', label: 'Failures' }, { value: 'releases', label: 'Releases' }, { value: 'keys', label: 'Keys and people', count: 11 },
];
const panel = (t: string) => <p style={{ margin: 0, color: 'var(--ink-2)' }}>{t}</p>;

function UrlTabs() {
  const [v, setV] = useState('logs');
  return (
    <Stack gap="sm">
      <Tabs id="admin" label="Engine admin sections" value={v} onChange={setV} items={ADMIN_TABS} />
      <TabPanel tabsId="admin" value={v}>{panel(`The ${v} tab, rendered by the page. Sync the value to ?view= in onChange.`)}</TabPanel>
    </Stack>
  );
}

const CMD: CommandItem[] = [
  { id: 'home', label: 'Home', group: 'Pages', icon: <HomeIcon />, onSelect: () => {} },
  { id: 'projects', label: 'Ongoing projects', group: 'Pages', icon: <FolderIcon />, keywords: ['kanban'], onSelect: () => {} },
  { id: 'people', label: 'People', group: 'Pages', icon: <UsersIcon />, onSelect: () => {} },
  { id: 'admin', label: 'Engine admin', group: 'Pages', hint: 'Company', icon: <SettingsIcon />, onSelect: () => {} },
  { id: 'msheireb', label: 'Msheireb Street Scavenger Hunt', group: 'Projects', hint: 'Blocked', icon: <ChartIcon />, onSelect: () => {} },
  { id: 'disney', label: 'Disney, Toy Story 5', group: 'Projects', hint: 'At risk', icon: <ChartIcon />, onSelect: () => {} },
  { id: 'new', label: 'Add a project', group: 'Actions', icon: <PlusIcon />, shortcut: 'mod+shift+p', onSelect: () => {} },
  { id: 'key', label: 'Issue an agent key', group: 'Actions', icon: <KeyIcon />, onSelect: () => {} },
];
function CmdDemo({ query, loading, items = CMD }: { query?: boolean; loading?: boolean; items?: CommandItem[] }) {
  const [open, setOpen] = useState(true);
  return <><Button onClick={() => setOpen(true)}>Open the command menu</Button><CommandMenu open={open} onOpenChange={setOpen} items={items} recent={query ? [] : ['msheireb', 'admin']} loading={loading} placeholder="Search pages, projects and actions" /></>;
}

function PagerDemo() {
  const [page, setPage] = useState(2);
  const [size, setSize] = useState(20);
  return <Pagination page={page} total={312} pageSize={size} onPageChange={setPage} pageSizes={[20, 50, 100]} onPageSizeChange={(s) => { setSize(s); setPage(1); }} noun="projects" />;
}
function LoadMoreDemo() {
  const [n, setN] = useState(100);
  const [busy, setBusy] = useState(false);
  return <LoadMore auto={false} hasMore={n < 300} loading={busy} status={`${n} events loaded, back to Mon 6 Oct`} endLabel="That is everything the engine keeps (a year)."
    onLoadMore={() => { setBusy(true); setTimeout(() => { setN((x) => x + 100); setBusy(false); }, 600); }} />;
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <Inline>
      <Button onClick={() => toast('Saved who gets Daily status')}>Plain toast</Button>
      <Button onClick={() => toast('Removed Nadia from this tool', { tone: 'ok', action: { label: 'Undo', onClick: () => toast('Nadia is back') } })}>Toast with undo</Button>
      <Button onClick={() => toast('Could not revoke the key. Try again.', { tone: 'bad' })}>Error toast</Button>
    </Inline>
  );
}
function ToastOpen() {
  const { toast } = useToast();
  useState(() => { setTimeout(() => { toast('Revoked Labby test key', { tone: 'ok', action: { label: 'Undo', onClick: () => {} }, duration: Infinity, id: 'a' }); toast('2 days could not load (3 Oct, 4 Oct)', { tone: 'warn', duration: Infinity, id: 'b' }); }, 0); return 0; });
  return <ToastDemo />;
}

export const stories: Story[] = [
  {
    id: 'tabs', title: 'Tabs', group: 'Navigation', components: ['Tabs', 'TabPanel'],
    summary: 'Switch between panes of one area. Pill tabs for a page (pinned beside the title), line tabs inside a card. At most six, short nouns, red counts only when something needs you.',
    usage: `<Tabs label="Engine admin sections" value={view} onChange={setView} items={[{ value: 'spend', label: 'Agent spend' }, { value: 'jobs', label: 'Jobs', count: 2 }]} />`,
    a11y: ['WAI-ARIA tabs: Tab enters on the chosen tab, arrows move (and choose, unless activation is manual), Home and End jump, RTL flips the arrows.', 'A red count reads as "2 need you".', 'The chosen tab scrolls into view when the row scrolls sideways on phones.'],
    covers: ['WorkspaceTabs'],
    states: [
      { name: 'Pill, with panels', wide: true, render: () => <Tabs label="Project sections" items={[{ value: 'board', label: 'Board', content: panel('The board.') }, { value: 'list', label: 'List', content: panel('The list.') }, { value: 'files', label: 'Files', count: 3, countTone: 'neutral', content: panel('Files.') }]} /> },
      { name: 'Pill, counts, page renders the panel', wide: true, render: () => <UrlTabs /> },
      { name: 'Line, with icons and a disabled tab', render: () => <Tabs variant="line" label="Person" activation="manual" items={[{ value: 'access', label: 'Access', icon: <KeyIcon />, content: panel('Access.') }, { value: 'activity', label: 'Activity', icon: <ChartIcon />, content: panel('Activity.') }, { value: 'apps', label: 'Apps', disabled: true }]} /> },
      { name: 'Right to left', render: () => <div dir="rtl"><Tabs label="RTL" items={[{ value: 'a', label: 'الأول' }, { value: 'b', label: 'الثاني', count: 4 }, { value: 'c', label: 'الثالث' }]} /></div> },
    ],
  },
  {
    id: 'breadcrumbs', title: 'Breadcrumbs', group: 'Navigation', components: ['Breadcrumbs'],
    summary: 'Where you are, in the top bar. The last item is the current page. Deep paths fold the middle into "…".',
    a11y: ['nav "Breadcrumb" with an ordered list; the current page has aria-current="page".', 'The "…" button says how many levels it shows.'],
    covers: [],
    states: [
      { name: 'Default', render: () => <Breadcrumbs items={[{ label: 'Projects', href: '#projects' }, { label: 'Ongoing projects' }]} /> },
      { name: 'Deep, folded', render: () => <Breadcrumbs items={[{ label: 'Company', href: '#' }, { label: 'Admin', href: '#' }, { label: 'Engine admin', href: '#' }, { label: 'Keys and people', href: '#' }, { label: 'Labby test key' }]} /> },
      { name: 'Long current page', render: () => <div style={{ width: 300 }}><Breadcrumbs items={[{ label: 'Projects', href: '#' }, { label: 'Disney, Toy Story 5 | AR Lens Concept Deck | Snapchat | Sept 2026' }]} /></div> },
    ],
  },
  {
    id: 'pagination', title: 'Pagination and load more', group: 'Navigation', components: ['Pagination', 'LoadMore'],
    summary: 'Prefer LoadMore for long lists people scroll (logs, tables): it loads as the end comes into view and says how far back it reaches. Pagination for reference lists people jump around in.',
    a11y: ['Pagination is a nav with the current page marked; the summary updates politely.', 'LoadMore keeps a real button as a fallback and announces "Loading more".'],
    covers: [],
    states: [
      { name: 'Pagination', wide: true, render: () => <PagerDemo /> },
      { name: 'First and last page', render: () => <Stack gap="sm"><Pagination page={1} total={45} pageSize={20} onPageChange={() => {}} noun="keys" /><Pagination page={3} total={45} pageSize={20} onPageChange={() => {}} noun="keys" /></Stack> },
      { name: 'Empty', render: () => <Pagination page={1} total={0} pageSize={20} onPageChange={() => {}} noun="runs" /> },
      { name: 'Load more', render: () => <LoadMoreDemo /> },
      { name: 'Load more, loading and end', render: () => <Stack gap="sm"><LoadMore auto={false} hasMore loading onLoadMore={() => {}} status="200 events loaded, back to Thu 9 Oct" /><LoadMore hasMore={false} onLoadMore={() => {}} endLabel="That is everything the engine keeps (a year)." /></Stack> },
    ],
  },
  {
    id: 'command-menu', title: 'Command menu', group: 'Navigation', components: ['CommandMenu', 'useCommandMenu'],
    summary: 'One ⌘K menu to jump anywhere or run an action. The placeholder names its scope. It never takes ⌘F, W, T, N or L.',
    usage: `const cmd = useCommandMenu();\n<CommandMenu open={cmd.open} onOpenChange={cmd.setOpen} items={items} recent={recentIds} placeholder="Search pages, projects and people" />`,
    a11y: ['A modal dialog: focus goes to the search, Tab stays inside, Esc closes and gives focus back.', 'A combobox driving a grouped listbox with aria-activedescendant: arrows move, Enter opens.'],
    covers: [],
    isolate: true,
    states: [
      { name: 'Open, with recent', render: () => <CmdDemo /> },
      { name: 'Searching', render: () => <CmdDemo query loading items={[]} /> },
      { name: 'Nothing yet', render: () => <CmdDemo query items={[]} /> },
    ],
  },
  {
    id: 'alert', title: 'Alert', group: 'Feedback', components: ['Alert'],
    summary: 'A banner that stays until its cause is fixed: what happened, then what to do. Icon and title carry the tone, never colour alone.',
    usage: `<Alert tone="warn" title="2 days could not load" actions={<Button size="sm" onClick={retry}>Try again</Button>}>3 Oct and 4 Oct. The rest of the page is up to date.</Alert>`,
    a11y: ['Errors are role=alert (read at once); the others are role=status.', 'Dismiss is a named button.'],
    covers: ['Feedback'],
    states: [
      { name: 'Tones', render: () => <Stack gap="sm">
        <Alert tone="info" title="Deploy times are not connected">Add a Cloudflare token with Pages read to see what is live.</Alert>
        <Alert tone="ok" title="30 days counted" />
        <Alert tone="warn" title="2 days could not load" actions={<Button size="sm">Try again</Button>}>3 Oct and 4 Oct. Reload the page to try again.</Alert>
        <Alert tone="bad" title="This could not load: the engine did not answer" actions={<Button size="sm">Try again</Button>} />
      </Stack> },
      { name: 'Dismissible, long text', render: () => <Alert tone="info" title="Test mode is on" onDismiss={() => {}}>Every message this product sends goes to laure@thearlab.com and two other test addresses only, until test mode is turned off in Messages. Nobody else gets anything.</Alert> },
      { name: 'Page band', wide: true, render: () => <Alert variant="page" tone="warn" title="You are looking at sample data">An outside service is not connected yet.</Alert> },
    ],
  },
  {
    id: 'toast', title: 'Toast', group: 'Feedback', components: ['ToastProvider', 'useToast'],
    summary: 'A short note that something happened. Routine removals get a toast with Undo instead of a confirm. Stays while hovered or focused.',
    usage: `const { toast } = useToast();\ntoast('Removed Nadia', { tone: 'ok', action: { label: 'Undo', onClick: restore } });`,
    a11y: ['Announced in a polite live region labelled Notifications.', 'The timer pauses while the pointer or focus is on a toast; Undo and Dismiss are buttons.'],
    covers: [],
    isolate: true,
    states: [
      { name: 'Showing', render: () => <ToastOpen /> },
      { name: 'Triggers', render: () => <ToastDemo /> },
    ],
  },
  {
    id: 'loading-bar', title: 'Loading bar', group: 'Feedback', components: ['LoadingBar'],
    summary: 'A thin bar at the top while work is in flight. Once per screen. Never a "Loading..." sentence.',
    a11y: ['An indeterminate progressbar with a label.', 'Reduced motion: a still bar.'],
    covers: ['LoadingBar', 'PageLoading'],
    states: [
      { name: 'Inline, in a card', render: () => <div style={{ position: 'relative', height: 80, borderRadius: 'var(--r-md)', background: 'var(--surface)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}><LoadingBar inline active label="Loading the board" /></div> },
      { name: 'Page', render: () => <LoadingBar active label="Loading projects" /> },
    ],
  },
];
