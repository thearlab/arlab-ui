import { useState } from 'react';
import { AccentToggle, ArlabMark, ArlabTile, Button, ButtonLink, IconButton, Kbd, SegmentedControl, Spinner, ThemeToggle, Tooltip } from '../core';
import { ArrowRightIcon, CloseIcon, DownloadIcon, EditIcon, MoreHorizontalIcon, PlusIcon, SettingsIcon, TrashIcon, BellIcon, ChartIcon, FolderIcon } from '../core/icons';
import { Inline, Stack } from '../layout';
import type { Story } from './types';

function SegDemo() {
  const [v, setV] = useState('inspector');
  return <SegmentedControl label="Layout" value={v} onChange={setV} options={[{ value: 'inspector', label: 'Inspector' }, { value: 'grid', label: 'Grid by day' }]} />;
}

export const stories: Story[] = [
  {
    id: 'button', title: 'Button', group: 'Buttons', components: ['Button', 'ButtonLink', 'buttonClass'],
    summary: 'A verb and an object ("Save changes"). One primary per view; danger only for destructive actions, never the default.',
    usage: `<Button variant="primary" onClick={save} loading={saving} loadingLabel="Saving">Save changes</Button>`,
    a11y: ['A real <button type="button">, Enter and Space press it.', 'Loading keeps focus, sets aria-busy and ignores clicks.', 'Disabled only for a state reason, and say the reason nearby.'],
    covers: ['Button'],
    states: [
      { name: 'Variants', render: () => <Inline><Button variant="primary">Save changes</Button><Button>Export CSV</Button><Button variant="soft">Add a filter</Button><Button variant="ghost">Cancel</Button><Button variant="danger">Delete brief</Button></Inline> },
      { name: 'Sizes', render: () => <Inline align="center"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button></Inline> },
      { name: 'With icons', render: () => <Inline><Button variant="primary" icon={<PlusIcon />}>New project</Button><Button icon={<DownloadIcon />}>Export</Button><Button variant="ghost" iconEnd={<ArrowRightIcon />}>Open as page</Button></Inline> },
      { name: 'Loading', render: () => <Inline><Button variant="primary" loading loadingLabel="Saving">Save</Button><Button loading>Checking</Button></Inline> },
      { name: 'Disabled', render: () => <Inline><Button variant="primary" disabled>Save changes</Button><Button disabled>Export</Button><Button variant="danger" disabled>Delete</Button></Inline> },
      { name: 'Link and block', render: () => <Stack gap="sm"><ButtonLink href="#settings" variant="secondary">Open settings</ButtonLink><Button variant="primary" block>Sign in with ARLAB</Button></Stack> },
      { name: 'Long label', render: () => <div style={{ width: 200 }}><Button block>Send the satisfaction survey to every client this week</Button></div> },
    ],
  },
  {
    id: 'icon-button', title: 'Icon button', group: 'Buttons', components: ['IconButton'],
    summary: 'Square, icon only, always named. Back, close, edit, more, previous, next.',
    usage: `<IconButton label="Edit brief" onClick={edit}><EditIcon /></IconButton>`,
    a11y: ['`label` is the accessible name and the tooltip (shown on hover and keyboard focus, Esc hides it).', '`pressed` makes it a toggle (aria-pressed).'],
    covers: ['IconButton'],
    states: [
      { name: 'Variants', render: () => <Inline><IconButton label="Close"><CloseIcon /></IconButton><IconButton label="Settings" variant="secondary"><SettingsIcon /></IconButton><IconButton label="Edit" variant="soft"><EditIcon /></IconButton><IconButton label="Add" variant="primary"><PlusIcon /></IconButton><IconButton label="Delete" variant="danger"><TrashIcon /></IconButton></Inline> },
      { name: 'Sizes', render: () => <Inline><IconButton size="sm" label="More"><MoreHorizontalIcon /></IconButton><IconButton label="More"><MoreHorizontalIcon /></IconButton><IconButton size="lg" label="More"><MoreHorizontalIcon /></IconButton></Inline> },
      { name: 'Toggle, dot, loading, disabled', render: () => <Inline><IconButton label="Show chart" pressed><ChartIcon /></IconButton><IconButton label="Notifications, 3 new" dot><BellIcon /></IconButton><IconButton label="Refreshing" loading><FolderIcon /></IconButton><IconButton label="Edit" disabled><EditIcon /></IconButton></Inline> },
    ],
  },
  {
    id: 'segmented-control', title: 'Segmented control', group: 'Navigation', components: ['SegmentedControl'],
    summary: '2 to 6 related choices that change one view or setting (Inspector or Grid by day). For page sections use Tabs.',
    usage: `<SegmentedControl label="Layout" value={layout} onChange={setLayout} options={[{ value: 'inspector', label: 'Inspector' }, { value: 'grid', label: 'Grid by day' }]} />`,
    a11y: ['A radio group: Tab enters on the chosen option, arrows move and choose, Home and End jump.', 'Icon-only options need an aria-label.'],
    covers: ['SegmentedControl'],
    states: [
      { name: 'Default', render: () => <SegDemo /> },
      { name: 'Counts, small, disabled option', render: () => <SegmentedControl size="sm" label="Keys" defaultValue="keys" options={[{ value: 'keys', label: 'Keys', count: 28 }, { value: 'people', label: 'People', count: 46 }, { value: 'apps', label: 'Apps', disabled: true }]} /> },
      { name: 'Full width', render: () => <SegmentedControl block label="Period" defaultValue="30" options={[{ value: '1', label: 'Today' }, { value: '7', label: '7 days' }, { value: '30', label: '30 days' }, { value: '45', label: '45 days' }]} /> },
    ],
  },
  {
    id: 'theme-toggle', title: 'Theme and accent', group: 'Brand', components: ['ThemeToggle', 'AccentToggle', 'initTheme', 'setTheme', 'setAccent'],
    summary: 'Follow the system by default; the System, Light, Dark choice lives in the account menu or settings. ARLAB magenta is the default accent, violet the alternative.',
    usage: `initTheme(); // before first paint\n<ThemeToggle labels />\n<AccentToggle />`,
    a11y: ['Both are radio groups with arrow-key movement.', 'The icon variant names the theme it switches to.'],
    covers: [],
    states: [
      { name: 'Theme, icons', render: () => <ThemeToggle /> },
      { name: 'Theme, labels', render: () => <ThemeToggle labels size="md" /> },
      { name: 'Theme, one button', render: () => <ThemeToggle variant="icon" /> },
      { name: 'Accent', render: () => <AccentToggle /> },
    ],
  },
  {
    id: 'tooltip', title: 'Tooltip', group: 'Feedback', components: ['Tooltip'],
    summary: 'A few words on hover and keyboard focus. Never the only place something important is said.',
    usage: `<Tooltip label="Copies the link"><Button>Share</Button></Tooltip>`,
    a11y: ['Shows on hover after 400 ms and at once on keyboard focus; Esc hides it (WCAG 1.4.13).', 'Linked with aria-describedby while showing.'],
    covers: [],
    states: [{ name: 'Default', render: () => <Inline><Tooltip label="Copies the link to this project"><Button>Share</Button></Tooltip><Tooltip label="Opens in a new tab" placement="right"><Button variant="ghost">Open</Button></Tooltip></Inline> }],
  },
  {
    id: 'spinner-kbd', title: 'Spinner and keys', group: 'Feedback', components: ['Spinner', 'Kbd'],
    summary: 'A spinner for unknown-length work inside a control; keys for shortcuts, in the HIG order.',
    a11y: ['A Spinner with a label is a status region; without one it is decorative.'],
    covers: [],
    states: [
      { name: 'Spinner', render: () => <Inline><Spinner /><Spinner size={24} label="Loading projects" /></Inline> },
      { name: 'Keys', render: () => <Inline><Kbd keys="mod+k" /><Kbd keys="shift+?" /><Kbd>Esc</Kbd><Kbd>J</Kbd><Kbd>K</Kbd></Inline> },
    ],
  },
  {
    id: 'brand', title: 'ARLAB mark and tile', group: 'Brand', components: ['ArlabMark', 'ArlabTile', 'deptIcon'],
    summary: 'The wordmark (inherits text colour) and the app tile: a black rounded square with one pink glyph.',
    covers: [],
    states: [
      { name: 'Mark', render: () => <Inline gap="lg"><ArlabMark height={22} /><span style={{ color: 'var(--accent)' }}><ArlabMark height={22} /></span></Inline> },
      { name: 'Tile', render: () => <Inline gap="lg"><ArlabTile size={40} label="ARLAB" /><ArlabTile size={40} glyph={<path d="M4 5h16v11H8l-4 4z" />} label="Chat tool" /><ArlabTile size={28} /></Inline> },
    ],
  },
];
