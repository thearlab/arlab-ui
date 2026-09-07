'use client';

import type { ReactNode } from 'react';
import { SearchButton } from '../SearchButton';
import { ThemeToggle } from '../ThemeToggle';
import { AccountMenu, Brand, type ShellAccount, type ShellBrand } from './parts';

export interface TopNavLink { id: string; label: string; active?: boolean; onSelect: () => void }

export interface TopNavShellProps {
  brand: ShellBrand;
  links: TopNavLink[];
  search?: { placeholder?: string; onOpen: () => void };
  actions?: ReactNode;
  account: ShellAccount;
  /** The page. The document scrolls naturally under a sticky bar. */
  children: ReactNode;
}

/** Shell B: a sticky 58px bar (brand, three to five links, search, actions, account) and the page
 * below it. For a tool with one job and a few views: the internal-tool template, Test Agents,
 * Test Social Calendar. Router-agnostic: navigation is callbacks. */
export function TopNavShell({ brand, links, search, actions, account, children }: TopNavShellProps) {
  return (
    <div className="arlab-topnav-app">
      <header className="arlab-topnav">
        <Brand {...brand} />
        <nav className="arlab-topnav-links" aria-label="Sections">
          {links.map((l) => (
            <button key={l.id} type="button" className={`arlab-topnav-link${l.active ? ' on' : ''}`} aria-current={l.active ? 'page' : undefined} onClick={l.onSelect}>{l.label}</button>
          ))}
        </nav>
        <span className="arlab-topnav-spacer" />
        {search && <SearchButton placeholder={search.placeholder ?? 'Search'} onClick={search.onOpen} />}
        {actions}
        <AccountMenu account={account} compact />
        <ThemeToggle />
      </header>
      <div className="arlab-topnav-page">{children}</div>
    </div>
  );
}
