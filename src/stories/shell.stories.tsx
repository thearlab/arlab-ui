import type { CSSProperties, ReactNode } from 'react';
import { AppShell, EditorShell, PageBar, PageHeader, SectionHead } from '../shell';
import { Button, IconButton, SegmentedControl, ArlabTile } from '../core';
import { ChevronLeftIcon, PlusIcon, SunIcon, ChatIcon, TimerIcon, SearchIcon } from '../core/icons';
import { Breadcrumbs, Tabs } from '../navigation';
import { PageGrid, Col, Stack } from '../layout';
import { context, rail, railFooter, PROJECTS } from './demo';
import type { Story } from './types';

const card: CSSProperties = { background: 'var(--surface)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-1)', padding: 18, minWidth: 0 };
const Box = ({ title, children }: { title: string; children: ReactNode }) => <section style={card}><h2 style={{ fontSize: 'var(--fs-md)', margin: '0 0 10px' }}>{title}</h2>{children}</section>;
const Lines = ({ n = 3 }: { n?: number }) => <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10, fontSize: 'var(--fs-sm)', color: 'var(--ink-2)' }}>{PROJECTS.slice(0, n).map((p) => <li key={p.id} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><b style={{ color: 'var(--ink)' }}>{p.name}</b><br />{p.note}</li>)}</ul>;
const Account = <button type="button" aria-label="Laure, account" style={{ width: 40, height: 40, borderRadius: 14, border: 0, color: '#fff', fontWeight: 700, background: 'linear-gradient(135deg, var(--hue-1), var(--hue-2))' }}>L</button>;
const Aside = <><Box title="Your recent project work"><Lines n={2} /></Box><Box title="Labby, this morning"><p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--ink-2)' }}>9 of your projects need someone today. Msheireb Street Scavenger Hunt is blocked on the client voiceover.</p></Box></>;

function HomePage() {
  return (
    <>
      <PageHeader icon={<SunIcon />} title="Good morning, Laure" description="Tuesday 14 October. 14 projects need someone, 2 tool requests wait on you." facts={[['Meetings today', 3], ['ClickUp due today', 5], ['Logged this week', '34 h']]} />
      <PageGrid>
        <Col span={8}><Box title="Your day"><Lines /></Box></Col>
        <Col span={4}><Box title="Waiting on you"><Lines n={2} /></Box></Col>
      </PageGrid>
      <SectionHead title="Needs someone today" action={<Button size="sm" variant="ghost" icon={<PlusIcon />}>Add a project</Button>} />
      <PageGrid>{PROJECTS.slice(0, 3).map((p) => <Col key={p.id} span={4}><Box title={p.name}><p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--ink-2)' }}>{p.note}</p></Box></Col>)}</PageGrid>
    </>
  );
}

export const stories: Story[] = [
  {
    id: 'app-shell', title: 'App shell', group: 'App shell', components: ['AppShell', 'Rail', 'ContextNav', 'ContextPills', 'TopBar', 'MobileBar'],
    summary: 'The whole app as one rounded frame: an icon rail of areas, a context column with the area\'s pages and counts, the page, and an optional right panel. On phones the rail becomes a bottom bar and the column a row of pills.',
    usage: `<AppShell rail={areas} railFooter={[help, settings]} account={<AccountMenu />} brand={<ArlabTile />}\n  context={{ title: 'Projects', groups }} crumbs={<Breadcrumbs items={...} />} actions={<HelpButton />}\n  aside={<RecentWork />}>\n  <PageHeader ... />\n  ...\n</AppShell>`,
    a11y: ['A skip link jumps to the page. The rail and the column are labelled navigation landmarks, the page is <main>.', 'Active pages carry aria-current="page"; red counts are read out ("1 project is blocked").', 'The pages column folds with the top-bar button (remembered); the right panel opens as a dialog on narrow screens and closes with Esc.'],
    covers: ['SidebarShell'],
    isolate: true,
    states: [
      { name: 'Home with the right panel', render: () => <AppShell rail={rail('home')} railFooter={railFooter} account={Account} brand={<ArlabTile size={30} />} context={context('home')} crumbs={<Breadcrumbs items={[{ label: 'Home', href: '#home' }, { label: 'Today' }]} />} actions={<><IconButton label="Messages"><ChatIcon /></IconButton><IconButton label="Time this week"><TimerIcon /></IconButton></>} aside={Aside} asideLabel="context panel"><HomePage /></AppShell> },
      { name: 'No context column, no panel', render: () => <AppShell rail={rail('reports')} railFooter={railFooter} account={Account} crumbs={<b>Reports</b>}><PageHeader title="Reports" description="Monthly numbers for every department." /><Box title="This month"><Lines /></Box></AppShell> },
      { name: 'Admin page with the pinned bar', render: () => <AppShell rail={rail('people')} railFooter={railFooter} account={Account} context={context('engineering')} crumbs={<Breadcrumbs items={[{ label: 'Company', href: '#c' }, { label: 'Engine admin' }]} />}><PageBar title="Engine admin" tabs={<Tabs label="Admin sections" variant="pill" defaultValue="spend" items={[{ value: 'spend', label: 'Agent spend' }, { value: 'logs', label: 'Logs' }, { value: 'jobs', label: 'Jobs', count: 2 }, { value: 'keys', label: 'Keys and people', count: 11 }]} />} /><Stack><Box title="Summary"><Lines /></Box><Box title="Every agent"><Lines n={6} /></Box></Stack></AppShell> },
    ],
  },
  {
    id: 'page-header', title: 'Page header', group: 'App shell', components: ['PageHeader'],
    summary: 'Every page has an identity: a soft gradient hero with an icon, the name, one line of purpose and up to four key facts. One primary action at most.',
    usage: `<PageHeader icon={<FolderIcon />} title="Ongoing projects" description="Work moving through stages." facts={[['Live', 14], ['Blocked', 1]]} actions={<Button variant="primary">Add a project</Button>} />`,
    a11y: ['The title is the page h1 (level 2 inside a dialog). Facts are a description list.'],
    covers: ['ReadPage'],
    states: [
      { name: 'Hero with facts', wide: true, render: () => <PageHeader icon={<SunIcon />} title="Good morning, Laure" description="Tuesday 14 October. 14 projects need someone, 2 tool requests wait on you." facts={[['Meetings today', 3], ['ClickUp due today', 5], ['Logged this week', '34 h']]} /> },
      { name: 'With an action and an eyebrow', wide: true, render: () => <PageHeader eyebrow="Projects" icon={<span style={{ width: 22, height: 22, borderRadius: 7, background: 'var(--hue-4)' }} />} title="Msheireb Street Scavenger Hunt" description="Snapchat Lens, Complex" facts={[['Live date', '20 Oct'], ['On the tracker', 'ongoing']]} actions={<><Button>Share</Button><Button variant="primary">Open in ClickUp</Button></>} /> },
      { name: 'Plain, long title', wide: true, render: () => <PageHeader variant="plain" title="Disney, Toy Story 5 | AR Lens Concept Deck | Snapchat | Sept 2026 and a title that keeps going to test wrapping" description="Plain headers suit dense work pages." /> },
    ],
  },
  {
    id: 'page-bar', title: 'Page bar and section head', group: 'App shell', components: ['PageBar', 'SectionHead'],
    summary: 'The working-page bar from the admin pattern: title, tabs beside it, search and the main action, pinned while the body scrolls. Section heads name a block and carry its facts and one action.',
    covers: ['PageBar', 'SectionHead', 'Section'],
    states: [
      { name: 'Page bar', wide: true, render: () => <PageBar pinned={false} title="Access" meta={<span className="ar-fine">12 people</span>} tabs={<SegmentedControl label="View" defaultValue="people" options={[{ value: 'people', label: 'People', count: 12 }, { value: 'waiting', label: 'Waiting', count: 3 }]} />} actions={<><IconButton label="Search people" variant="secondary"><SearchIcon /></IconButton><Button variant="primary" icon={<PlusIcon />}>Add a member</Button></>} /> },
      { name: 'Section head', wide: true, render: () => <SectionHead title="Needs someone today" meta={<span className="ar-fine">14 projects</span>} action={<Button size="sm" variant="ghost">See all</Button>} /> },
    ],
  },
  {
    id: 'editor-shell', title: 'Editor shell (CMS style)', group: 'App shell', components: ['EditorShell'],
    summary: 'For editors, not lists: a slim toolbar (back, the item picker, mode, sections, device) over a full-bleed canvas, an optional inspector, and a save chip in the corner.',
    a11y: ['The toolbar is a labelled toolbar; the canvas is <main> with a skip link; the save chip is a status region.'],
    covers: [],
    isolate: true,
    states: [
      { name: 'Website editor', render: () => <EditorShell start={<><Button variant="ghost" size="sm" icon={<ChevronLeftIcon />}>Website</Button><SegmentedControl size="sm" label="Mode" defaultValue="edit" options={[{ value: 'edit', label: 'Click to edit' }, { value: 'use', label: 'Use the page' }]} /></>} center={<><Button variant="ghost" size="sm">Home sections</Button><Button variant="ghost" size="sm">HTML pages</Button><Button variant="ghost" size="sm">Google and sharing</Button></>} end={<SegmentedControl size="sm" label="Device" defaultValue="desktop" options={[{ value: 'desktop', label: 'Desktop' }, { value: 'phone', label: 'Phone' }]} />} status="All saved"><div style={{ display: 'grid', placeItems: 'center', minHeight: 420, color: 'var(--ink-3)' }}>The page being edited</div></EditorShell> },
      { name: 'With an inspector, unsaved', render: () => <EditorShell start={<Button variant="ghost" size="sm" icon={<ChevronLeftIcon />}>Decks</Button>} end={<Button variant="primary" size="sm">Publish</Button>} status="2 unsaved changes" statusTone="warn" inspector={<Box title="Hero block"><Lines n={2} /></Box>}><div style={{ display: 'grid', placeItems: 'center', minHeight: 420, color: 'var(--ink-3)' }}>Canvas</div></EditorShell> },
    ],
  },
];
