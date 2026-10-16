import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type TableHTMLAttributes } from 'react';
import { ChevronDown, ChevronRight, CircleHelp, PanelLeftClose, PanelLeftOpen, Search, X, Check } from 'lucide-react';
import { IconButton, Logo, Modal } from './ui.js';
import { ScrollArea } from './scroll-area.js';
import { Icon } from './icons.js';

/* Application compositions added in 2.0.0-beta.2 for real apps (first: the internal dashboard). They emit the
   reference markup (workspace.jsx) so the published Contour CSS styles them exactly; data and callbacks come
   from the app. */

// ---------------------------------------------------------------------------------------------------------------
// SidebarShell: the reference workspace (scrollable sidebar with a fixed header and bottom, 60px top bar).

export interface NavItem {
  id: string;
  label: string;
  /** A 16-18px Lucide icon element. */
  icon?: ReactNode;
  /** A small boxed count (the reference's nav-count). */
  count?: number;
  /** A team space: a coloured square before the label (a CSS colour or var()). */
  dot?: string;
  active?: boolean;
  onSelect: () => void;
}
export interface NavSection { label: string; items: NavItem[] }
export interface SidebarShellProps {
  /** The tool's name under the logo (e.g. "Internal dashboard"). */
  tool?: string;
  /** Contextual sections, each under its small uppercase label (e.g. Workspace, Work, People, Admin). */
  sections?: NavSection[];
  /** Team spaces (departments): coloured dots, plain labels. */
  spaces?: NavSection;
  /** The person, at the foot of the sidebar. */
  account?: { name: string; detail?: string; initials?: string; onOpen?: () => void; menu?: ReactNode };
  /** "Help & shortcuts" at the foot of the sidebar. */
  onHelp?: () => void;
  /** Top bar: breadcrumb items (the last is the current page) and the right-hand actions. */
  crumbs?: { label: ReactNode; onSelect?: () => void }[];
  onSearch?: () => void;
  searchLabel?: string;
  topActions?: ReactNode;
  /** The workspace. The page scrolls; the sidebar and the top bar stay. */
  children?: ReactNode;
  /** Brand in the sidebar header (defaults to the Contour Logo). */
  brand?: ReactNode;
}

const KEY = 'contour:sidebar-collapsed';
const readFolded = () => { try { return localStorage.getItem(KEY) === 'true'; } catch { return false; } };

function useNarrow() {
  const q = '(max-width:1099px)';
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => { const m = window.matchMedia(q); const u = () => setNarrow(m.matches); m.addEventListener('change', u); return () => m.removeEventListener('change', u); }, []);
  return narrow;
}

export function SidebarShell({ tool, sections = [], spaces, account, onHelp, crumbs = [], onSearch, searchLabel = 'Find anything', topActions, children, brand }: SidebarShellProps) {
  const narrow = useNarrow();
  const [collapsed, setCollapsed] = useState(readFolded);
  const [mobileNav, setMobileNav] = useState(false);
  useEffect(() => { try { localStorage.setItem(KEY, String(collapsed)); } catch { /* storage unavailable */ } }, [collapsed]);
  useEffect(() => { if (!narrow) setMobileNav(false); }, [narrow]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === '\\') { e.preventDefault(); if (narrow) setMobileNav(true); else setCollapsed((c) => !c); } };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [narrow]);
  const pick = (fn: () => void) => () => { setMobileNav(false); fn(); };
  const folded = collapsed || narrow;

  const sidebar = (inDrawer: boolean) => (
    <aside className={`app-sidebar ${folded && !inDrawer ? 'collapsed' : ''}`}>
      <header className="sidebar-fixed-header">
        <div className="sidebar-brand">
          {brand ?? <Logo />}
          <IconButton className="sidebar-collapse" label={narrow ? 'Open main navigation' : collapsed ? 'Expand main navigation' : 'Collapse main navigation'}
            aria-expanded={narrow ? mobileNav : !collapsed} onClick={() => (narrow ? setMobileNav(true) : setCollapsed(!collapsed))}>
            {narrow || collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </IconButton>
        </div>
        {tool && <div className="sidebar-tool-name">{tool}</div>}
      </header>
      <ScrollArea className="sidebar-navigation-scroll" label="Main navigation sections">
        {sections.filter((s) => s.items.length).map((s) => (
          <section key={s.label} className="sidebar-section" aria-label={s.label}>
            <h2 className="nav-group-label">{s.label}</h2>
            <nav className="workspace-navigation" aria-label={`${s.label} pages`}>
              {s.items.map((i) => (
                <button key={i.id} type="button" title={i.label} aria-label={i.label} className={i.active ? 'active' : ''} aria-current={i.active ? 'page' : undefined} data-tour={`nav-${i.id}`} onClick={pick(i.onSelect)}>
                  {i.icon}
                  <span>{i.label}</span>
                  {typeof i.count === 'number' && <span className="nav-count">{i.count}</span>}
                </button>
              ))}
            </nav>
          </section>
        ))}
        {spaces && spaces.items.length > 0 && (
          <section className="sidebar-secondary sidebar-section" aria-label={spaces.label}>
            <h2 className="nav-group-label">{spaces.label}</h2>
            {spaces.items.map((i) => (
              <button key={i.id} type="button" title={i.label} aria-label={i.label} className={i.active ? 'active' : ''} aria-current={i.active ? 'page' : undefined} data-tour={`nav-${i.id}`} onClick={pick(i.onSelect)}>
                <span className="space-dot" style={i.dot ? { background: i.dot } : undefined} />
                {i.label}
              </button>
            ))}
          </section>
        )}
      </ScrollArea>
      <div className="sidebar-bottom">
        {onHelp && (folded && !inDrawer
          ? <IconButton className="sidebar-help" label="Help and shortcuts" onClick={pick(onHelp)}><CircleHelp size={14} /></IconButton>
          : <button type="button" title="Help and shortcuts" aria-label="Help and shortcuts" className="help-link" onClick={pick(onHelp)}><CircleHelp size={16} /> Help &amp; shortcuts</button>)}
        {account && (account.menu ?? (
          <button type="button" aria-label="Your account" title="Your account" className="profile" onClick={account.onOpen}>
            <span className="avatar lilac" aria-hidden="true">{account.initials ?? initialsOf(account.name)}</span>
            <span><strong>{account.name}</strong>{account.detail && <small>{account.detail}</small>}</span>
            <ChevronDown size={14} />
          </button>
        ))}
      </div>
    </aside>
  );

  return (
    <div className={`app-shell app-workspace is-app ${folded ? 'nav-collapsed' : ''}`}>
      {sidebar(false)}
      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-left">
            {narrow && <IconButton className="nav-toggle" label="Open main navigation" onClick={() => setMobileNav(true)} aria-expanded={mobileNav} aria-haspopup="dialog"><PanelLeftOpen size={14} /></IconButton>}
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <span key={i} className="topbar-crumb">
                  {i > 0 && <ChevronRight className="breadcrumb-chevron" size={14} />}
                  {last ? <span aria-current="page">{c.label}</span>
                    : c.onSelect ? <button type="button" className="breadcrumb-root" onClick={c.onSelect}>{c.label}</button>
                    : <span className="breadcrumb-root">{c.label}</span>}
                </span>
              );
            })}
          </div>
          <div className="topbar-right">
            {topActions}
            {onSearch && <button type="button" className="global-search" onClick={onSearch}><Search size={16} /><span>{searchLabel}</span><kbd>⌘ K</kbd></button>}
          </div>
        </header>
        {children}
      </div>
      <Modal open={mobileNav} onClose={() => setMobileNav(false)} title="Navigation" sheet className="nav-drawer">{sidebar(true)}</Modal>
    </div>
  );
}

export const initialsOf = (name: string) => {
  const base = name.includes('@') ? name.split('@')[0].replace(/[._-]+/g, ' ') : name;
  return base.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || '?';
};

// ---------------------------------------------------------------------------------------------------------------
// Page frame: the page heading (context line, title, description, one main action), then a tabs row and a
// filter row on their own lines, then the content. The reference's .workspace-page / .page-heading.

export interface PageHeaderProps {
  /** The small dim line above the title (a date, or where the page sits). */
  context?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** One main action (a primary Button); secondary actions as quiet buttons before it. */
  actions?: ReactNode;
  /** Small things beside the title (counts, status pills). */
  meta?: ReactNode;
}
export function PageHeader({ context, title, description, actions, meta }: PageHeaderProps) {
  return (
    <div className="page-heading">
      <div>
        {context && <div className="page-context">{context}</div>}
        <h2>{title}{meta && <span className="page-heading-meta">{meta}</span>}</h2>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-heading-actions">{actions}</div>}
    </div>
  );
}

export interface PageFrameProps extends PageHeaderProps {
  /** A Tabs row under the heading. */
  tabs?: ReactNode;
  /** A FilterBar row under the tabs. */
  filters?: ReactNode;
  children?: ReactNode;
  /** Wider pages (tables) drop the reading max width. */
  wide?: boolean;
}
export function PageFrame({ tabs, filters, children, wide = true, ...head }: PageFrameProps) {
  return (
    <div className={`workspace-page page-frame ${wide ? 'wide' : ''}`}>
      <PageHeader {...head} />
      {tabs && <div className="page-tabs-row">{tabs}</div>}
      {filters && <div className="page-filter-row">{filters}</div>}
      <div className="page-frame-body">{children}</div>
    </div>
  );
}

/** A row of filters: search first, then dropdowns, then anything trailing (a count, a clear link). */
export function FilterBar({ children }: { children?: ReactNode }) {
  return <div className="lib-filter-row filter-bar">{children}</div>;
}

// ---------------------------------------------------------------------------------------------------------------
// Tabs: the reference app switcher strip, for page tabs (tablist) and segments (pressed), with counts.

export interface TabOption { value: string; label: ReactNode; count?: number; icon?: ReactNode; disabled?: boolean }
export interface TabsProps {
  options: (TabOption | string)[];
  value: string;
  onChange: (value: string) => void;
  /** tabs: page or section tabs (arrow keys). segments: a filter or view switch. */
  kind?: 'tabs' | 'segments';
  label?: string;
  className?: string;
}
export function Tabs({ options, value, onChange, kind = 'tabs', label = 'Sections', className = '' }: TabsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const tabs = kind === 'tabs';
  return (
    <div ref={ref} className={`lib-app-switcher contour-tabs ${className}`} role={tabs ? 'tablist' : 'group'} aria-label={label}
      onKeyDown={(e) => {
        if (!tabs || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault();
        const live = opts.filter((o) => !o.disabled), at = live.findIndex((o) => o.value === value);
        const next = e.key === 'Home' ? live[0] : e.key === 'End' ? live[live.length - 1] : live[(at + (e.key === 'ArrowRight' ? 1 : live.length - 1)) % live.length];
        if (!next) return;
        onChange(next.value);
        requestAnimationFrame(() => ref.current?.querySelector<HTMLButtonElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus());
      }}>
      {opts.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" data-value={o.value} disabled={o.disabled} onClick={() => onChange(o.value)}
            {...(tabs ? { role: 'tab', 'aria-selected': on, tabIndex: on ? 0 : -1 } : { 'aria-pressed': on })}>
            {o.icon}<span>{o.label}</span>{typeof o.count === 'number' && <span className="nav-count">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Toasts: announce without stealing focus.

interface ToastItem { id: number; message: ReactNode }
const ToastContext = createContext<{ toast: (message: ReactNode, durationMs?: number) => void }>({ toast: () => {} });
export function ToastProvider({ children }: { children?: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const toast = useCallback((message: ReactNode, durationMs = 4000) => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, message }]);
    window.setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), durationMs);
  }, []);
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="toast" role="status"><Check size={16} /><span>{t.message}</span>
            <button type="button" aria-label="Dismiss notification" onClick={() => setItems((x) => x.filter((y) => y.id !== t.id))}><X size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);

// ---------------------------------------------------------------------------------------------------------------
// Table: the reference project table styling for any data table (numbers right-aligned by the app).

export function Table({ className = '', ...rest }: TableHTMLAttributes<HTMLTableElement>) {
  return <div className="table-scroll"><table className={`project-table data-table ${className}`} {...rest} /></div>;
}

// ---------------------------------------------------------------------------------------------------------------
// Departments: one colour per department from the department tokens (never a status colour).

const DEPT: Record<string, string> = { company: 'dept-company', creative: 'dept-creative', engineering: 'dept-engineering', 'clients-servicing': 'dept-client', 'strategy-growth': 'dept-strategy' };
export const deptColor = (id: string) => `var(--${DEPT[id] || 'strong'})`;

// ---------------------------------------------------------------------------------------------------------------
// Layout: 12-column page grid columns (PageGrid is the reference's .lib-page-grid).

export function Col({ span = 12, children, className = '' }: { span?: number; children?: ReactNode; className?: string }) {
  return <div className={`page-col ${className}`} style={{ gridColumn: `span ${span}` }}>{children}</div>;
}

// ---------------------------------------------------------------------------------------------------------------
// Theme: the person's light or dark choice, remembered, else the system's. Feed `mode` to ContourProvider.

export function useContourTheme(): ['light' | 'dark', (m: 'light' | 'dark') => void] {
  const sys = () => (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const [mode, setMode] = useState<'light' | 'dark'>(() => { try { const v = localStorage.getItem('contour:mode'); return v === 'dark' || v === 'light' ? v : sys(); } catch { return sys(); } });
  const set = (m: 'light' | 'dark') => { setMode(m); try { localStorage.setItem('contour:mode', m); } catch { /* storage unavailable */ } document.documentElement.dataset.theme = m; };
  useEffect(() => { document.documentElement.dataset.theme = mode; document.documentElement.style.colorScheme = mode; }, [mode]);
  return [mode, set];
}

// ---------------------------------------------------------------------------------------------------------------
// Time: "3 min ago", "2 days ago", "on 4 Oct".

export function formatRelativeTime(at: string | number | Date, now = Date.now()) {
  const t = new Date(at).getTime();
  if (!Number.isFinite(t)) return '';
  const s = Math.round((now - t) / 1000), abs = Math.abs(s), fut = s < 0;
  const say = (n: number, u: string) => (fut ? `in ${n} ${u}${n === 1 ? '' : 's'}` : `${n} ${u}${n === 1 ? '' : 's'} ago`);
  if (abs < 45) return 'just now';
  if (abs < 3600) return say(Math.round(abs / 60), 'min');
  if (abs < 86400) return say(Math.round(abs / 3600), 'hour');
  if (abs < 86400 * 7) return say(Math.round(abs / 86400), 'day');
  return `on ${new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
}

export type PillTone = 'ok' | 'warn' | 'bad' | 'info' | 'quiet' | 'default' | 'strong' | 'fresh';

/** One registry icon per department, for department tiles. */
const DEPT_ICON: Record<string, string> = { company: 'Building2', engineering: 'Code2', creative: 'Palette', 'clients-servicing': 'Contact', 'strategy-growth': 'TrendingUp' };
export const deptIcon = (id: string, size = 14) => (DEPT_ICON[id] ? <Icon name={DEPT_ICON[id]} size={size} /> : undefined);
