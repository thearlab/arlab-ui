'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { LoadingBar } from '../LoadingBar';
import { SearchButton } from '../SearchButton';
import { ThemeToggle } from '../ThemeToggle';
import { AccountMenu, Brand, type ShellAccount, type ShellBrand } from './parts';

export interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  /** A colour tile instead of an icon, for collections with an identity (departments). Shows
   * `icon` (white, see deptIcon) or else `letter`, or else the label's first letter. */
  tile?: { letter?: string; icon?: ReactNode; color: string };
  active?: boolean;
  onSelect: () => void;
}

export interface SidebarShellProps {
  brand: ShellBrand;
  nav: { items: NavItem[]; groups?: { label: string; items: NavItem[] }[] };
  /** Recently opened things; `dot` is a token name ('info', 'accent', 'live', ...) or any CSS color. */
  recent?: { id: string; label: string; dot?: string; onSelect: () => void }[];
  account: ShellAccount;
  topbar?: { crumbs?: ReactNode; search?: { placeholder?: string; onOpen: () => void }; actions?: ReactNode };
  loading?: boolean;
  /** Fold the rail to icons. Leave undefined to let the person choose (remembered per browser). */
  collapsed?: boolean;
  /** Fold the rail by itself while true (e.g. a document is open, reading wants the width). The
   * person can still expand it; that override lasts until autoCollapse changes. */
  autoCollapse?: boolean;
  /** A right-hand panel (usually a RailPanel). While it is open the left rail folds; expanding the
   * left rail calls onAsideClose. */
  aside?: ReactNode;
  onAsideClose?: () => void;
  /** Show the light/dark switch at the right of the top bar (default true). */
  themeInTopbar?: boolean;
  /** The workspace. Fills the viewport under the top bar; children manage their own scroll. */
  children: ReactNode;
}

const TOKENS = new Set(['accent', 'accent-secondary', 'live', 'warn', 'crit', 'info', 'ink-faint']);
const dotStyle = (dot?: string) => ({ background: dot ? (TOKENS.has(dot) ? `var(--${dot})` : dot) : 'var(--ink-faint)' });

function Item({ item }: { item: NavItem }) {
  return (
    <button type="button" className={`arlab-side-item${item.active ? ' on' : ''}`} onClick={item.onSelect} aria-current={item.active ? 'page' : undefined} aria-label={item.label} data-tip={typeof item.count === 'number' ? `${item.label} · ${item.count}` : item.label}>
      {item.tile ? <span className="arlab-side-tile" style={{ background: item.tile.color }} aria-hidden="true">{item.tile.icon ?? item.tile.letter ?? item.label.slice(0, 1)}</span>
        : item.icon && <span className="arlab-side-icon">{item.icon}</span>}
      <span className="arlab-side-label">{item.label}</span>
      {typeof item.count === 'number' && <span className="arlab-side-count">{item.count}</span>}
    </button>
  );
}

/** Shell A: a persistent sidebar (sections, groups, recent, the person) beside a thin top bar
 * (breadcrumbs, search, actions) and a workspace that fills the viewport. For tools with several
 * sections and collections: Agents Studio, ARLAB Knowledge. Router-agnostic: navigation is callbacks. */
export function SidebarShell({ brand, nav, recent, account, topbar, loading = false, collapsed, autoCollapse = false, aside, onAsideClose, themeInTopbar = true, children }: SidebarShellProps) {
  const [pref, setPref] = useState(() => { try { return localStorage.getItem('arlab:rail') === 'min'; } catch { return false; } });
  const [override, setOverride] = useState<boolean | null>(null);
  useEffect(() => { setOverride(null); }, [autoCollapse]);
  const min = collapsed ?? (aside ? true : override ?? (autoCollapse ? true : pref));
  const toggle = () => {
    if (aside && min) { onAsideClose?.(); setOverride(false); return; }
    if (autoCollapse) { setOverride(!min); return; }
    const next = !min; setPref(next);
    try { localStorage.setItem('arlab:rail', next ? 'min' : 'full'); } catch { /* storage unavailable */ }
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === '\\') { e.preventDefault(); toggle(); } };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });
  return (
    <div className={`arlab-app${min ? ' rail-min' : ''}${aside ? ' has-aside' : ''}`}>
      <aside className="arlab-side">
        <Brand {...brand} />
        <nav aria-label="Sections">
          {nav.items.map((i) => <Item key={i.id} item={i} />)}
          {nav.groups?.map((g) => (
            <div key={g.label}>
              <div className="arlab-side-group">{g.label}</div>
              {g.items.map((i) => <Item key={i.id} item={i} />)}
            </div>
          ))}
        </nav>
        <div className="arlab-side-grow">
          {recent && recent.length > 0 && (
            <div className="arlab-side-recent">
              <div className="arlab-side-group">Recent</div>
              {recent.map((r) => (
                <button key={r.id} type="button" className="arlab-side-item" onClick={r.onSelect} title={r.label}>
                  <span className="arlab-side-dot" style={dotStyle(r.dot)} aria-hidden="true" />
                  <span className="arlab-side-label">{r.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="arlab-side-me">
          <AccountMenu account={account} />
          {!(themeInTopbar && topbar) && <ThemeToggle />}
          {(
            <button type="button" className="arlab-icon-btn arlab-rail-toggle" onClick={toggle} aria-pressed={min} aria-label={min ? 'Expand the sidebar' : 'Collapse the sidebar'} data-tip={min ? 'Expand  ⌘\\' : 'Collapse  ⌘\\'}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><path d="M9 4.5v15" /><path className="chev" d="M15.5 10l-2 2 2 2" /></svg>
            </button>
          )}
        </div>
      </aside>
      <div className="arlab-main">
        <LoadingBar active={loading} />
        {topbar && (
          <div className="arlab-topbar">
            {topbar.crumbs && <div className="arlab-crumbs">{topbar.crumbs}</div>}
            {topbar.search && <SearchButton placeholder={topbar.search.placeholder ?? 'Search'} onClick={topbar.search.onOpen} />}
            {topbar.actions}
            {themeInTopbar && <span className="arlab-topbar-theme"><ThemeToggle /></span>}
          </div>
        )}
        <div className="arlab-body">{children}</div>
      </div>
      {aside}
    </div>
  );
}
