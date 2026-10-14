'use client';
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { Tooltip } from '../core/Tooltip';
import { IconButton } from '../core/IconButton';
import { ChevronDownIcon, CloseIcon, PanelRightIcon, SidebarIcon } from '../core/icons';
import { useDismiss, useFocusTrap, useMediaQuery, useScrollLock } from '../hooks';

/* The app shell from the restyle: the whole app is one rounded frame on a tinted ground.
 *   rail (areas, icons)  |  context column (the area's pages, groups, counts)  |  main  |  aside
 * The page scrolls as a document (one scroller, no rubber band); the rail, the context column and
 * the aside are sticky and scroll on their own only when they overflow. Under 1180px the aside
 * becomes an overlay panel; under 820px the rail becomes a bottom bar and the context column a row
 * of pills at the top of the page. */

export interface NavTarget {
  /** A real URL, so middle-click, copy link and new tab work. */
  href?: string;
  /** Called on a plain click (after preventDefault when `href` is set): plug in your router here. */
  onSelect?: () => void;
}

export interface RailItem extends NavTarget {
  id: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  /** true: a red dot ("something needs you"); a number: a red count. Say what in `badgeLabel`. */
  badge?: boolean | number;
  badgeLabel?: string;
}

export interface ContextItem extends NavTarget {
  id: string;
  label: string;
  active?: boolean;
  /** A colour dot (a department, a project status). Any CSS colour or token. */
  swatch?: string;
  icon?: ReactNode;
  /** A quiet count on the right. */
  count?: number;
  /** A red count: something needs the person. */
  alert?: number;
  alertLabel?: string;
  children?: ContextItem[];
}

export interface ContextGroup {
  id: string;
  label: string;
  items: ContextItem[];
  /** Folds with its header button (default true). */
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const follow = (t: NavTarget, after?: () => void) => (e: MouseEvent) => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  if (t.onSelect) { if (t.href) e.preventDefault(); t.onSelect(); }
  after?.();
};

function NavLink({ t, className, current, children, label }: { t: NavTarget; className: string; current?: boolean; children: ReactNode; label?: string }) {
  const props = { className, 'aria-current': current ? ('page' as const) : undefined, 'aria-label': label, onClick: follow(t) };
  return t.href ? <a href={t.href} {...props}>{children}</a> : <button type="button" {...props}>{children}</button>;
}

const badgeText = (b: RailItem) => b.badgeLabel ?? (typeof b.badge === 'number' ? `${b.badge} need you` : 'needs you');

// ---------------------------------------------------------------------------------------------
export interface RailProps {
  items: RailItem[];
  /** Items pinned to the bottom (help, settings). */
  footer?: RailItem[];
  /** Top slot: the account avatar or menu. */
  top?: ReactNode;
  /** Bottom slot under the footer items: the ARLAB tile. */
  brand?: ReactNode;
  label?: string;
}

/** The icon rail of main areas. Labels show as tooltips; the active area is tinted. */
export function Rail({ items, footer = [], top, brand, label = 'Main areas' }: RailProps) {
  const item = (it: RailItem) => (
    <li key={it.id}>
      <Tooltip label={it.label} placement="right" describe={false}>
        <span className="ar-rail-tipwrap">
          <NavLink t={it} className="ar-rail-item" current={it.active} label={it.badge ? `${it.label}, ${badgeText(it)}` : it.label}>
            <span aria-hidden="true" className="ar-rail-icon">{it.icon}</span>
            {it.badge ? <span className="ar-rail-badge" data-count={typeof it.badge === 'number' ? it.badge : undefined} aria-hidden="true">{typeof it.badge === 'number' ? (it.badge > 99 ? '99+' : it.badge) : ''}</span> : null}
          </NavLink>
        </span>
      </Tooltip>
    </li>
  );
  return (
    <nav className="ar-rail" aria-label={label}>
      {top && <div className="ar-rail-top">{top}</div>}
      <ul role="list" className="ar-rail-list">{items.map(item)}</ul>
      <span className="ar-rail-gap" />
      {!!footer.length && <ul role="list" className="ar-rail-list">{footer.map(item)}</ul>}
      {brand && <div className="ar-rail-brand">{brand}</div>}
    </nav>
  );
}

// ---------------------------------------------------------------------------------------------
export interface ContextNavProps {
  /** The area's name, shown as the column heading ("Projects"). */
  title?: string;
  groups: ContextGroup[];
  label?: string;
  /** Extra content under the groups (a "new" button). */
  footer?: ReactNode;
  /** Pinned above the groups (a search field). */
  header?: ReactNode;
}

const OPEN_KEY = 'arlab:ctx-open:';
function useGroupOpen(id: string, initial: boolean): [boolean, (v: boolean) => void] {
  const [open, setOpen] = useState(initial);
  useEffect(() => { try { const v = localStorage.getItem(OPEN_KEY + id); if (v !== null) setOpen(v === '1'); } catch { /* storage blocked */ } }, [id]);
  return [open, (v) => { setOpen(v); try { localStorage.setItem(OPEN_KEY + id, v ? '1' : '0'); } catch { /* storage blocked */ } }];
}

function Group({ g }: { g: ContextGroup }) {
  const collapsible = g.collapsible !== false;
  const hasActive = g.items.some((i) => i.active || i.children?.some((c) => c.active));
  const [open, setOpen] = useGroupOpen(g.id, g.defaultOpen ?? true);
  const shown = !collapsible || open || hasActive;
  const listId = useId();
  return (
    <div className="ar-ctx-group">
      {collapsible
        ? <button type="button" className="ar-ctx-head" aria-expanded={shown} aria-controls={listId} onClick={() => setOpen(!shown)}><span className="ar-truncate">{g.label}</span><ChevronDownIcon size={16} aria-hidden="true" /></button>
        : <h3 className="ar-ctx-head is-static">{g.label}</h3>}
      {shown && <ul role="list" id={listId} className="ar-ctx-items">{g.items.map((it) => <Item key={it.id} it={it} />)}</ul>}
    </div>
  );
}

function Item({ it, sub }: { it: ContextItem; sub?: boolean }) {
  return (
    <li>
      <NavLink t={it} className={cx('ar-ctx-item', sub && 'is-sub')} current={it.active}>
        {it.swatch ? <span className="ar-ctx-swatch" style={{ background: it.swatch }} aria-hidden="true" /> : it.icon ? <span className="ar-ctx-icon" aria-hidden="true">{it.icon}</span> : null}
        <span className="ar-ctx-label">{it.label}</span>
        {it.alert ? <span className="ar-ctx-alert"><span aria-hidden="true">{it.alert > 99 ? '99+' : it.alert}</span><span className="ar-visually-hidden">, {it.alertLabel ?? `${it.alert} need you`}</span></span>
          : it.count !== undefined ? <span className="ar-ctx-count"><span className="ar-visually-hidden">, </span>{it.count}</span> : null}
      </NavLink>
      {!!it.children?.length && <ul role="list" className="ar-ctx-items">{it.children.map((c) => <Item key={c.id} it={c} sub />)}</ul>}
    </li>
  );
}

/** The context column: the area's pages and collections, grouped, with counts and alerts. */
export function ContextNav({ title, groups, label = 'Pages in this area', footer, header }: ContextNavProps) {
  return (
    <nav className="ar-ctx" aria-label={title ? `${title} pages` : label}>
      {header && <div className="ar-ctx-header">{header}</div>}
      {title && <h2 className="ar-ctx-title">{title}</h2>}
      {groups.map((g) => <Group key={g.id} g={g} />)}
      {footer}
    </nav>
  );
}

/** The phone version of the context column: one scrolling row of pills. */
export function ContextPills({ groups, label = 'Pages in this area' }: { groups: ContextGroup[]; label?: string }) {
  const flat = groups.flatMap((g) => g.items);
  if (!flat.length) return null;
  return (
    <nav className="ar-ctxpills" aria-label={label} data-scroll-x>
      <ul role="list">{flat.map((it) => <li key={it.id}><NavLink t={it} className="ar-ctxpill" current={it.active}>{it.label}{it.alert ? <span className="ar-ctx-alert" aria-label={it.alertLabel ?? `${it.alert} need you`}>{it.alert}</span> : null}</NavLink></li>)}</ul>
    </nav>
  );
}

// ---------------------------------------------------------------------------------------------
export interface TopBarProps {
  /** Where you are: breadcrumbs (Breadcrumbs component, or text). */
  crumbs?: ReactNode;
  /** Right side: faces, quick actions, the help "?" last. */
  actions?: ReactNode;
  /** Shown by AppShell: the button that folds the context column. */
  onToggleContext?: () => void;
  contextOpen?: boolean;
  onToggleAside?: () => void;
  asideOpen?: boolean;
  asideLabel?: string;
}

/** The bar above the page: fold the pages column, where you are, then actions. */
export function TopBar({ crumbs, actions, onToggleContext, contextOpen, onToggleAside, asideOpen, asideLabel = 'side panel' }: TopBarProps) {
  return (
    <div className="ar-topbar">
      {onToggleContext && <IconButton className="ar-topbar-ctx" label={contextOpen ? 'Hide the pages column' : 'Show the pages column'} pressed={!contextOpen ? false : undefined} aria-expanded={contextOpen} onClick={onToggleContext}><SidebarIcon /></IconButton>}
      <div className="ar-topbar-crumbs">{crumbs}</div>
      <span className="ar-grow" />
      {actions && <div className="ar-topbar-actions">{actions}</div>}
      {onToggleAside && <IconButton className="ar-topbar-aside" label={asideOpen ? `Hide the ${asideLabel}` : `Show the ${asideLabel}`} aria-expanded={asideOpen} onClick={onToggleAside}><PanelRightIcon /></IconButton>}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
export interface AppShellProps {
  rail: RailItem[];
  railFooter?: RailItem[];
  /** Rail top slot: the account avatar or account menu. */
  account?: ReactNode;
  /** Rail bottom slot (the ARLAB tile). */
  brand?: ReactNode;
  /** The context column of the current area. Omit for areas with a single page. */
  context?: { title?: string; groups: ContextGroup[]; footer?: ReactNode; header?: ReactNode };
  crumbs?: ReactNode;
  actions?: ReactNode;
  /** The right context panel (recent work, time this week, the assistant). */
  aside?: ReactNode;
  asideLabel?: string;
  /** Items for the phone bottom bar (default: the rail items, then the footer items). Keep to 5. */
  mobileItems?: RailItem[];
  children: ReactNode;
  className?: string;
}

const CTX_KEY = 'arlab:ctx-column';

/** The full application frame. Put a PageHeader or PageBar, then the page, as children. */
export function AppShell({ rail, railFooter, account, brand, context, crumbs, actions, aside, asideLabel = 'side panel', mobileItems, children, className }: AppShellProps) {
  const phone = useMediaQuery('(max-width: 820px)');
  const narrow = useMediaQuery('(max-width: 1180px)');
  const [ctxOpen, setCtxOpen] = useState(true);
  const [asideOpen, setAsideOpen] = useState(false);
  useEffect(() => { try { setCtxOpen(localStorage.getItem(CTX_KEY) !== '0'); } catch { /* storage blocked */ } }, []);
  useEffect(() => { if (!narrow) setAsideOpen(false); }, [narrow]);
  const toggleCtx = () => { const v = !ctxOpen; setCtxOpen(v); try { localStorage.setItem(CTX_KEY, v ? '1' : '0'); } catch { /* storage blocked */ } };
  const showCtx = !!context && ctxOpen && !phone;
  const bottom = (mobileItems ?? [...rail, ...(railFooter ?? [])]).slice(0, 5);

  return (
    <div className={cx('ar-shell', className)}>
      <a className="ar-skip-link" href="#ar-main">Skip to content</a>
      <div className="ar-app" data-ctx={showCtx ? '' : undefined} data-aside={aside && !narrow ? '' : undefined}>
        {!phone && <div className="ar-app-rail"><div className="ar-scroll"><Rail items={rail} footer={railFooter} top={account} brand={brand} /></div></div>}
        {showCtx && <div className="ar-app-ctx"><div className="ar-scroll"><ContextNav {...context!} /></div></div>}
        <main id="ar-main" className="ar-app-main" tabIndex={-1}><div className="ar-scroll" data-ar-page-scroller="">
          <TopBar crumbs={crumbs} actions={<>{phone && account}{actions}</>}
            onToggleContext={context && !phone ? toggleCtx : undefined} contextOpen={showCtx}
            onToggleAside={aside && narrow ? () => setAsideOpen(!asideOpen) : undefined} asideOpen={asideOpen} asideLabel={asideLabel} />
          {phone && context && <ContextPills groups={context.groups} label={context.title ? `${context.title} pages` : undefined} />}
          <div className="ar-app-page">{children}</div>
        </div></main>
        {aside && !narrow && <aside className="ar-app-aside" aria-label={asideLabel}><div className="ar-scroll"><div className="ar-app-aside-in">{aside}</div></div></aside>}
      </div>
      {aside && narrow && asideOpen && <AsideOverlay label={asideLabel} onClose={() => setAsideOpen(false)}>{aside}</AsideOverlay>}
      {phone && <MobileBar items={bottom} />}
    </div>
  );
}

/** The phone bottom bar: up to 5 areas, icon and short label. */
export function MobileBar({ items, label = 'Main areas' }: { items: RailItem[]; label?: string }) {
  return (
    <nav className="ar-mobilebar" aria-label={label}>
      <ul role="list">{items.map((it) => (
        <li key={it.id}>
          <NavLink t={it} className="ar-mobilebar-item" current={it.active}>
            <span className="ar-mobilebar-icon" aria-hidden="true">{it.icon}{it.badge ? <span className="ar-rail-badge" /> : null}</span>
            <span className="ar-mobilebar-label">{it.label}</span>
            {it.badge ? <span className="ar-visually-hidden">, {badgeText(it)}</span> : null}
          </NavLink>
        </li>
      ))}</ul>
    </nav>
  );
}

function AsideOverlay({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useFocusTrap(ref, true);
  useDismiss(true, onClose, [ref]);
  useScrollLock(true);
  return (
    <div className="ar-aside-overlay">
      <aside ref={ref} className="ar-aside-panel" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}>
        <IconButton className="ar-aside-close" label={`Close the ${label}`} onClick={onClose}><CloseIcon /></IconButton>
        <div className="ar-scroll"><div className="ar-app-aside-in">{children}</div></div>
      </aside>
    </div>
  );
}
