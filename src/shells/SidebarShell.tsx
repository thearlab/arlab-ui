'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LoadingBar } from '../LoadingBar';
import { SearchButton } from '../SearchButton';
import { ThemeToggle } from '../ThemeToggle';
import { ArlabMark } from '../ArlabMark';
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
  /** A group with `collapsible` folds into a disclosure (closed unless it holds the active item). */
  nav: { items: NavItem[]; groups?: { label: string; items: NavItem[]; collapsible?: boolean }[] };
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
  /** Labelled links pinned above the person at the bottom of the sidebar (Help, other ARLAB places). */
  footer?: { id: string; label: string; icon?: ReactNode; href?: string; onSelect?: () => void }[];
  /** Show the light/dark switch at the right of the top bar (default true). */
  themeInTopbar?: boolean;
  /** The workspace. Fills the viewport under the top bar; children manage their own scroll. */
  children: ReactNode;
}

const TOKENS = new Set(['accent', 'accent-secondary', 'live', 'warn', 'crit', 'info', 'ink-faint']);
const dotStyle = (dot?: string) => ({ background: dot ? (TOKENS.has(dot) ? `var(--${dot})` : dot) : 'var(--ink-faint)' });

function Item({ item }: { item: NavItem }) {
  return (
    <button type="button" className={`arlab-side-item${item.active ? ' on' : ''}`} onClick={item.onSelect} aria-current={item.active ? 'page' : undefined} aria-label={item.label} data-tour={`nav-${item.id}`} data-tip={typeof item.count === 'number' ? `${item.label} · ${item.count}` : item.label}>
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
export function SidebarShell({ brand, nav, recent, account, topbar, loading = false, collapsed, autoCollapse = false, aside, onAsideClose, themeInTopbar = true, footer, children }: SidebarShellProps) {
  // Phone (under 768px): a slim top bar with a menu button; the sidebar opens over the page as a sheet.
  const [sheet, setSheet] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null), sideRef = useRef<HTMLElement>(null);
  const closeSheet = () => { setSheet(false); menuBtn.current?.focus(); };
  useEffect(() => {
    if (!sheet) return;
    const side = sideRef.current; side?.querySelector<HTMLElement>('button, a')?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
      if (e.key !== 'Tab' || !side) return;
      const f = Array.from(side.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])')).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [sheet]); // eslint-disable-line react-hooks/exhaustive-deps
  const navRef = useRef<HTMLElement>(null);
  const activeId = [...nav.items, ...(nav.groups?.flatMap((g) => g.items) ?? [])].find((i) => i.active)?.id;
  // The active item is always fully visible in the scrolling menu.
  // Bring the active item into view only when it is actually hidden, and only by the minimum, inside the menu itself
  // (never scrolls the page, never moves a menu the person scrolled while the item is visible).
  useEffect(() => {
    const n = navRef.current, el = n?.querySelector<HTMLElement>('.arlab-side-item.on');
    if (!n || !el) return;
    const nr = n.getBoundingClientRect(), r = el.getBoundingClientRect();
    if (r.top < nr.top) n.scrollTop -= nr.top - r.top + 8;
    else if (r.bottom > nr.bottom) n.scrollTop += r.bottom - nr.bottom + 8;
  }, [activeId]);
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
    <div className={`arlab-app${min ? ' rail-min' : ''}${aside ? ' has-aside' : ''}${sheet ? ' side-open' : ''}`}>
      <header className="arlab-phonebar">
        <ArlabMark height={16} />
        {/* The page names itself in its own header below; the bar holds only the mark and the menu. */}
        <span className="arlab-phonebar-t" />
        <button ref={menuBtn} type="button" className="arlab-icon-btn" aria-label="Open the menu" aria-expanded={sheet} aria-controls="arlab-side" onClick={() => setSheet(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </header>
      {sheet && <button type="button" className="arlab-side-scrim" aria-label="Close the menu" tabIndex={-1} onClick={closeSheet} />}
      <aside className="arlab-side" id="arlab-side" ref={sideRef} {...(sheet ? { role: 'dialog', 'aria-modal': true, 'aria-label': 'Menu' } : {})}
        onClick={(e) => { if (sheet && (e.target as HTMLElement).closest('nav .arlab-side-item, .arlab-side-links .arlab-side-item')) setSheet(false); }}>
        <Brand {...brand} />
        <nav aria-label="Sections" ref={navRef}>
          {nav.items.map((i) => <Item key={i.id} item={i} />)}
          {nav.groups?.map((g) => g.collapsible ? (
            <details key={g.label} className="arlab-side-fold" open={g.items.some((i) => i.active) || undefined}>
              <summary className="arlab-side-group">{g.label}<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg></summary>
              {g.items.map((i) => <Item key={i.id} item={i} />)}
            </details>
          ) : (
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
        {footer && footer.length > 0 && (
          <div className="arlab-side-links">
            {footer.map((f) => f.href
              ? <a key={f.id} className="arlab-side-item" href={f.href} target="_blank" rel="noreferrer" aria-label={`${f.label}, opens in a new tab`} data-tip={f.label}>{f.icon && <span className="arlab-side-icon">{f.icon}</span>}<span className="arlab-side-label">{f.label}</span></a>
              : <button key={f.id} type="button" className="arlab-side-item" onClick={f.onSelect} data-tip={f.label}>{f.icon && <span className="arlab-side-icon">{f.icon}</span>}<span className="arlab-side-label">{f.label}</span></button>)}
          </div>
        )}
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
