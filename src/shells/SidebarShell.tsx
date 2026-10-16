'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LoadingBar } from '../LoadingBar';
import { ThemeToggle } from '../ThemeToggle';
import { Icon } from '../icons';
import { Avatar } from '../Avatar';
import { DropdownMenu } from '../DropdownMenu';
import { Brand, type ShellAccount, type ShellBrand } from './parts';

export interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  /** A department or space: drawn as a small coloured square before the label. */
  dot?: string;
  /** 1.x: a colour tile for a department. In 2.0 it draws as a dot of the same colour. */
  tile?: { letter?: string; icon?: ReactNode; color: string };
  active?: boolean;
  onSelect: () => void;
}

export interface NavSection { label: string; items: NavItem[] }

export interface SidebarShellProps {
  brand: ShellBrand;
  nav: {
    /** The small line under the brand, e.g. "The ARLAB team". */
    label?: string;
    /** The applications (this app and its siblings); the current one sits on the soft pink tint. */
    apps?: NavItem[];
    /** The contextual navigation's first section (1.x `items`), headed `itemsLabel` (default "Workspace"). */
    items: NavItem[];
    itemsLabel?: string;
    /** More contextual sections, each under its own small label. */
    groups?: NavSection[];
    /** Team spaces (departments): coloured dots, plain labels. */
    spaces?: NavSection;
  };
  /** 1.x: recently opened things. Kept for compatibility, shown as a section. */
  recent?: { id: string; label: string; dot?: string; onSelect: () => void }[];
  account: ShellAccount;
  /** "Help & shortcuts" at the foot of the sidebar. */
  help?: { label?: string; onSelect: () => void };
  topbar?: { crumbs?: ReactNode; search?: { placeholder?: string; onOpen: () => void }; actions?: ReactNode };
  loading?: boolean;
  /** Fold the sidebar to icons. Leave undefined to let the person choose (remembered per browser). */
  collapsed?: boolean;
  /** Fold by itself while true (reading wants the width); the person can still expand it. */
  autoCollapse?: boolean;
  aside?: ReactNode;
  onAsideClose?: () => void;
  /** Show the light/dark switch in the top bar (default true). */
  themeInTopbar?: boolean;
  children: ReactNode;
}

const TOKENS = new Set(['accent', 'accent-secondary', 'live', 'warn', 'crit', 'info', 'ink-faint', 'dept-creative', 'dept-engineering', 'dept-client', 'dept-company']);
const paint = (c?: string) => (c ? (TOKENS.has(c) ? `var(--${c})` : c) : 'var(--strong)');
const KEY = 'arlab:sidebar-collapsed';

function NavButton({ item, kind }: { item: NavItem; kind: 'app' | 'nav' | 'space' }) {
  const dot = item.dot ?? item.tile?.color;
  const cls = kind === 'app' ? (item.active ? 'current' : '') : kind === 'nav' ? (item.active ? 'active' : '') : (item.active ? 'active' : '');
  return (
    <button type="button" className={cls || undefined} onClick={item.onSelect} aria-current={item.active ? 'page' : undefined} title={item.label} aria-label={typeof item.count === 'number' ? `${item.label}, ${item.count}` : item.label} data-tour={`nav-${item.id}`}>
      {kind === 'space' || (!item.icon && dot) ? <i className="arlab-space-dot" style={{ background: paint(dot) }} aria-hidden="true" /> : item.icon}
      <span>{item.label}</span>
      {typeof item.count === 'number' && <span className="arlab-nav-count">{item.count}</span>}
    </button>
  );
}

/** The Contour workspace shell: one light sidebar (brand and collapse, workspace label, applications,
 * contextual sections with the selected left bar, team spaces as dots, help and the account) beside a
 * 60px top bar (breadcrumbs, search, actions) and a workspace that fills the viewport. Collapsed state is
 * remembered per browser; 760-1099px shows the sidebar folded; under 760px it opens as a drawer from the
 * top bar's panel button. Router-agnostic: navigation is callbacks. */
export function SidebarShell({ brand, nav, recent, account, help, topbar, loading = false, collapsed, autoCollapse = false, aside, onAsideClose, themeInTopbar = true, children }: SidebarShellProps) {
  const [pref, setPref] = useState(() => { try { return localStorage.getItem(KEY) === 'true'; } catch { return false; } });
  const [override, setOverride] = useState<boolean | null>(null);
  const [drawer, setDrawer] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { setOverride(null); }, [autoCollapse]);
  const min = collapsed ?? (aside ? true : override ?? (autoCollapse ? true : pref));
  const toggle = () => {
    // Between 760 and 1099px the sidebar is always folded: its button opens the full menu as the drawer.
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1099px)').matches) { setDrawer(true); return; }
    if (aside && min) { onAsideClose?.(); setOverride(false); return; }
    if (autoCollapse) { setOverride(!min); return; }
    const next = !min; setPref(next);
    try { localStorage.setItem(KEY, String(next)); } catch { /* storage unavailable */ }
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === '\\') { e.preventDefault(); toggle(); } };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });
  useEffect(() => { const d = dialog.current; if (!d) return; if (drawer && !d.open) d.showModal(); if (!drawer && d.open) d.close(); }, [drawer]);
  const go = (fn: () => void) => () => { setDrawer(false); fn(); };
  const wrap = (items: NavItem[]) => items.map((i) => ({ ...i, onSelect: go(i.onSelect) }));
  const recentSection: NavSection | null = recent?.length ? { label: 'Recent', items: recent.map((r) => ({ id: r.id, label: r.label, dot: r.dot, onSelect: r.onSelect })) } : null;

  const sidebar = (inDrawer: boolean) => (
    <aside className={`arlab-sidebar${min && !inDrawer ? ' collapsed' : ''}`} aria-label="Main navigation">
      <div className="arlab-sidebar-brand">
        <Brand {...brand} />
        {!inDrawer && (
          <button type="button" className="arlab-icon-btn bordered arlab-sidebar-collapse" onClick={toggle} aria-expanded={!min} aria-label={min ? 'Expand main navigation' : 'Collapse main navigation'} title={min ? 'Expand  ⌘\\' : 'Collapse  ⌘\\'}>
            <Icon name={min ? 'PanelLeftOpen' : 'PanelLeftClose'} size={14} />
          </button>
        )}
      </div>
      {nav.label && <span className="arlab-workspace-label">{nav.label}</span>}
      {nav.apps && nav.apps.length > 0 && (
        <section className="arlab-sidebar-section" aria-label="Applications">
          <h2 className="arlab-nav-group-label">Applications</h2>
          <div className="arlab-app-switcher">{wrap(nav.apps).map((i) => <NavButton key={i.id} item={i} kind="app" />)}</div>
        </section>
      )}
      <div className="arlab-sidebar-scroll">
        {nav.items.length > 0 && (
          <section className="arlab-sidebar-section" aria-label={nav.itemsLabel ?? 'Workspace'}>
            <h2 className="arlab-nav-group-label">{nav.itemsLabel ?? 'Workspace'}</h2>
            <nav className="arlab-workspace-navigation">{wrap(nav.items).map((i) => <NavButton key={i.id} item={i} kind="nav" />)}</nav>
          </section>
        )}
        {(nav.groups ?? []).filter((g) => g.items.length).map((g) => (
          <section key={g.label} className="arlab-sidebar-section" aria-label={g.label}>
            <h2 className="arlab-nav-group-label">{g.label}</h2>
            <nav className="arlab-workspace-navigation">{wrap(g.items).map((i) => <NavButton key={i.id} item={i} kind="nav" />)}</nav>
          </section>
        ))}
        {[nav.spaces, recentSection].filter((x): x is NavSection => !!x && x.items.length > 0).map((g) => (
          <section key={g.label} className="arlab-sidebar-section arlab-sidebar-secondary" aria-label={g.label}>
            <h2 className="arlab-nav-group-label">{g.label}</h2>
            {wrap(g.items).map((i) => <NavButton key={i.id} item={i} kind="space" />)}
          </section>
        ))}
      </div>
      <div className="arlab-sidebar-bottom">
        {help && <button type="button" className="arlab-help-link" onClick={go(help.onSelect)} title={help.label ?? 'Help & shortcuts'}><Icon name="CircleHelp" size={16} /><span>{help.label ?? 'Help & shortcuts'}</span></button>}
        <DropdownMenu
          align="start"
          items={account.menu}
          trigger={(p) => (
            <button type="button" className="arlab-profile" aria-label="Your account" title="Your account" {...p}>
              <Avatar name={account.name} size={28} />
              <span><strong>{account.name}</strong>{account.role && <small>{account.role}</small>}</span>
              <Icon name="ChevronDown" size={14} />
            </button>
          )}
        />
      </div>
    </aside>
  );

  return (
    <div className={`arlab-app${min ? ' nav-collapsed' : ''}${aside ? ' has-aside' : ''}`}>
      {sidebar(false)}
      <dialog ref={dialog} className="arlab-nav-drawer" aria-label="Main navigation" onClose={() => setDrawer(false)} onClick={(e) => { if (e.target === e.currentTarget) setDrawer(false); }}>
        <div className="arlab-nav-drawer-head">
          <Brand {...brand} />
          <button type="button" className="arlab-icon-btn bordered" onClick={() => setDrawer(false)} aria-label="Close navigation"><Icon name="X" size={14} /></button>
        </div>
        {drawer && sidebar(true)}
      </dialog>
      <div className="arlab-main">
        <LoadingBar active={loading} />
        {topbar && (
          <header className="arlab-topbar">
            <div className="arlab-topbar-left">
              <button type="button" className="arlab-icon-btn bordered arlab-nav-toggle" onClick={() => setDrawer(true)} aria-label="Open main navigation" aria-expanded={drawer} aria-haspopup="dialog"><Icon name="PanelLeftOpen" size={14} /></button>
              {topbar.crumbs && <div className="arlab-crumbs">{topbar.crumbs}</div>}
            </div>
            <div className="arlab-topbar-right">
              {topbar.actions}
              {topbar.search && (
                <button type="button" className="arlab-global-search" onClick={topbar.search.onOpen} aria-label={topbar.search.placeholder ?? 'Find anything'}>
                  <Icon name="Search" size={16} /><span>{topbar.search.placeholder ?? 'Find anything'}</span><kbd>⌘ K</kbd>
                </button>
              )}
              {themeInTopbar && <><span className="arlab-topbar-rule" aria-hidden="true" /><ThemeToggle className="bordered" /></>}
            </div>
          </header>
        )}
        <div className="arlab-body">{children}</div>
      </div>
      {aside}
    </div>
  );
}
