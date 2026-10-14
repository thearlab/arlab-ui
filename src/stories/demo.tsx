// Sample data for stories, shaped like the internal dashboard (from the restyle preview).
import type { ReactNode } from 'react';
import { ChartIcon, ChatIcon, FolderIcon, GlobeIcon, HelpIcon, HomeIcon, SettingsIcon, SparkIcon, UsersIcon } from '../core/icons';
import type { ContextGroup, RailItem } from '../shell';

export const PEOPLE = ['Nadia Fares', 'Habib S.', 'Hadi Karam', 'Yasmina Muslimany', 'Manon Darrouzes', 'Rafi Haddad', 'Walaa AlSalem', 'Rita Allam', 'Laure'];

export type Status = 'Blocked' | 'At risk' | 'Delayed' | 'Due today' | 'On track';
export interface DemoProject { id: string; name: string; service: string; status: Status; note: string; people: string[]; live: string; tracker: string; next: string }
export const PROJECTS: DemoProject[] = [
  { id: 'msheireb', name: 'Msheireb Street Scavenger Hunt', service: 'Snapchat Lens', status: 'Blocked', note: 'Waiting for client voiceover', people: ['Nadia Fares', 'Habib S.', 'Hadi Karam'], live: '20 Oct', tracker: 'ongoing', next: 'Get the voiceover from the client, then finish the build.' },
  { id: 'disney', name: 'Disney, Toy Story 5 | AR Lens Concept Deck', service: 'Snapchat Lens', status: 'At risk', note: 'V1 done, client feedback pending action', people: ['Habib S.', 'Yasmina Muslimany', 'Nadia Fares'], live: '14 Oct', tracker: 'ongoing', next: 'Chase the client for V1 feedback before Thursday.' },
  { id: 'fanta-marker', name: 'Fanta Ad Yogi Marker Tech', service: 'Snapchat Lens', status: 'Delayed', note: 'Revisions in progress, one day overdue', people: ['Manon Darrouzes', 'Habib S.', 'Rafi Haddad'], live: '9 Oct', tracker: 'revisions', next: 'Ship the revised marker build.' },
  { id: 'digital-arabic', name: 'Digital Arabic Library', service: 'Interactive screens', status: 'Due today', note: 'Delayed, overdue on Amazon task', people: ['Rita Allam', 'Walaa AlSalem'], live: '14 Oct', tracker: 'ongoing', next: 'Close the Amazon task today.' },
  { id: 'ram', name: 'Ram Clinics', service: 'WebAR', status: 'On track', note: 'Process testing complete, workflow handed over', people: ['Hadi Karam', 'Laure'], live: '21 Sep', tracker: 'delivered', next: 'Nothing, delivered.' },
  { id: 'autolens', name: 'AutoLens', service: 'Internal tool', status: 'On track', note: 'Pipeline stage 6 of 8 green', people: ['Rafi Haddad'], live: '30 Oct', tracker: 'ongoing', next: 'Stage 7: deploy to Lens Studio.' },
];
export const STATUS_TONE: Record<Status, 'bad' | 'warn' | 'info' | 'ok'> = { Blocked: 'bad', 'At risk': 'warn', Delayed: 'warn', 'Due today': 'info', 'On track': 'ok' };

const ic = (n: ReactNode) => n;
export const rail = (active = 'home'): RailItem[] => [
  { id: 'home', label: 'Home', icon: ic(<HomeIcon />), href: '#home' },
  { id: 'projects', label: 'Projects', icon: ic(<FolderIcon />), href: '#projects', badge: true, badgeLabel: '1 project is blocked' },
  { id: 'clients', label: 'Client servicing', icon: ic(<ChatIcon />), href: '#clients' },
  { id: 'people', label: 'People', icon: ic(<UsersIcon />), href: '#people' },
  { id: 'agents', label: 'Agents', icon: ic(<SparkIcon />), href: '#agents' },
  { id: 'reports', label: 'Reports', icon: ic(<ChartIcon />), href: '#reports' },
  { id: 'website', label: 'Website', icon: ic(<GlobeIcon />), href: '#website' },
].map((r) => ({ ...r, active: r.id === active }));
export const railFooter: RailItem[] = [
  { id: 'help', label: 'Help', icon: <HelpIcon />, href: '#help' },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon />, href: '#settings' },
];
export const context = (active = 'home'): { title: string; groups: ContextGroup[] } => ({
  title: 'Home',
  groups: [
    { id: 'demo-home', label: 'Home', items: [
      { id: 'home', label: 'Home', swatch: 'var(--hue-2)', href: '#home', active: active === 'home' },
      { id: 'creative', label: 'Creative', swatch: 'var(--hue-4)', href: '#creative', active: active === 'creative' },
      { id: 'engineering', label: 'Engineering', swatch: 'var(--hue-1)', href: '#engineering', count: 12, active: active === 'engineering' },
      { id: 'cs', label: 'Client servicing', swatch: 'var(--hue-3)', href: '#cs' },
    ] },
    { id: 'demo-live', label: 'Live projects', items: PROJECTS.slice(0, 5).map((p) => ({ id: p.id, label: p.name, swatch: `var(--${STATUS_TONE[p.status] === 'ok' ? 'ok' : STATUS_TONE[p.status]})`, href: `#p-${p.id}`, alert: p.status === 'Blocked' ? 1 : undefined, alertLabel: 'blocked' })) },
    { id: 'demo-coming', label: 'Coming', defaultOpen: false, items: [{ id: 'c1', label: 'Creators Discovery v3', swatch: 'var(--ink-3)', href: '#c1' }] },
  ],
});
