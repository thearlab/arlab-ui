'use client';

import type { ReactNode } from 'react';
import { LoadingBar } from '../LoadingBar';
import { SearchButton } from '../SearchButton';
import { ThemeToggle } from '../ThemeToggle';
import { AccountMenu, Brand, type ShellAccount, type ShellBrand } from './parts';

export interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
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
  /** The workspace. Fills the viewport under the top bar; children manage their own scroll. */
  children: ReactNode;
}

const TOKENS = new Set(['accent', 'accent-secondary', 'live', 'warn', 'crit', 'info', 'ink-faint']);
const dotStyle = (dot?: string) => ({ background: dot ? (TOKENS.has(dot) ? `var(--${dot})` : dot) : 'var(--ink-faint)' });

function Item({ item }: { item: NavItem }) {
  return (
    <button type="button" className={`arlab-side-item${item.active ? ' on' : ''}`} onClick={item.onSelect} aria-current={item.active ? 'page' : undefined} title={item.label}>
      {item.icon && <span className="arlab-side-icon">{item.icon}</span>}
      <span className="arlab-side-label">{item.label}</span>
      {typeof item.count === 'number' && <span className="arlab-side-count">{item.count}</span>}
    </button>
  );
}

/** Shell A: a persistent sidebar (sections, groups, recent, the person) beside a thin top bar
 * (breadcrumbs, search, actions) and a workspace that fills the viewport. For tools with several
 * sections and collections: Agents Studio, ARLAB Knowledge. Router-agnostic: navigation is callbacks. */
export function SidebarShell({ brand, nav, recent, account, topbar, loading = false, children }: SidebarShellProps) {
  return (
    <div className="arlab-app">
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
          <ThemeToggle />
        </div>
      </aside>
      <div className="arlab-main">
        <LoadingBar active={loading} />
        {topbar && (
          <div className="arlab-topbar">
            {topbar.crumbs && <div className="arlab-crumbs">{topbar.crumbs}</div>}
            {topbar.search && <SearchButton placeholder={topbar.search.placeholder ?? 'Search'} onClick={topbar.search.onOpen} />}
            {topbar.actions}
          </div>
        )}
        <div className="arlab-body">{children}</div>
      </div>
    </div>
  );
}
