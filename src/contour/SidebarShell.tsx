import { useEffect, useId, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NavigationDismissContext } from './NavigationContext.js';
import { AppNavigation, type NavigationSlot } from './AppNavigation.js';

export interface SidebarShellProps {
  brand: ReactNode;
  toolName: string;
  /** Your routed navigation; no sample routes or local page state is injected. */
  navigation: ReactNode;
  /** Route key used to dismiss mobile drawers when custom router links navigate. */
  navigationKey?: string;
  children: ReactNode;
  account?: NavigationSlot;
  help?: NavigationSlot;
  header?: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Opt-in browser persistence, unique per application. */
  storageKey?: string;
  secondaryNavigation?: ReactNode;
  secondaryLabel?: string;
  defaultSecondaryCollapsed?: boolean;
  mode?: 'light' | 'dark';
  className?: string;
  style?: CSSProperties;
}

/** Application layout with independently scrolling navigation and workspace.
 * Import @arlab/ui/navigation/styles.css; a ContourProvider is not required.
 */
export function SidebarShell({ brand, toolName, navigation, children, account, help, header,
  navigationKey, collapsed, defaultCollapsed = false, onCollapsedChange, storageKey,
  secondaryNavigation, secondaryLabel = 'Context navigation', defaultSecondaryCollapsed = false,
  mode, className = '', style }: SidebarShellProps) {
  const [ownCollapsed, setOwnCollapsed] = useState(defaultCollapsed);
  const [secondaryCollapsed, setSecondaryCollapsed] = useState(defaultSecondaryCollapsed);
  const [drawer, setDrawer] = useState<'main' | 'secondary' | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const isCollapsed = collapsed ?? ownCollapsed;
  useEffect(() => {
    if (!storageKey || collapsed !== undefined) return;
    try { const saved = localStorage.getItem(storageKey); if (saved !== null) setOwnCollapsed(saved === 'true'); } catch { /* unavailable storage must not break navigation */ }
  }, [storageKey, collapsed]);
  const toggle = () => {
    const next = !isCollapsed;
    if (collapsed === undefined) {
      setOwnCollapsed(next);
      if (storageKey) { try { localStorage.setItem(storageKey, String(next)); } catch { /* optional persistence */ } }
    }
    onCollapsedChange?.(next);
  };
  useEffect(() => {
    const media = window.matchMedia('(min-width: 760px)');
    const close = () => { if (media.matches) setDrawer(null); };
    media.addEventListener('change', close);
    return () => media.removeEventListener('change', close);
  }, []);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (!drawer) { if (node.open) node.close(); return; }
    const previous = document.activeElement as HTMLElement | null;
    if (!node.open) node.showModal();
    return () => { if (node.open) node.close(); if (previous?.isConnected) previous.focus(); };
  }, [drawer]);
  useEffect(() => { setDrawer(null); }, [navigationKey]);
  const mainNav = (mobile = false) => <AppNavigation brand={brand} toolName={toolName}
    collapsed={mobile ? false : isCollapsed} onToggle={mobile ? () => setDrawer(null) : toggle}
    toggleDisabled={!mobile && collapsed !== undefined && !onCollapsedChange}
    toggleLabel={mobile ? 'Close navigation' : undefined} footer={account} help={help}>
    <NavigationDismissContext.Provider value={mobile ? () => setDrawer(null) : undefined}>{navigation}</NavigationDismissContext.Provider>
  </AppNavigation>;
  return <div className={`contour-shell ${className}`} data-collapsed={isCollapsed || undefined} data-secondary-collapsed={secondaryCollapsed || undefined} data-mode={mode} style={style}>
    <div className="contour-shell-primary">{mainNav()}</div>
    {secondaryNavigation && <aside className="contour-shell-secondary" aria-label={secondaryLabel}>
      <header><span>{secondaryLabel}</span><button type="button" className="contour-nav-toggle" aria-label={`${secondaryCollapsed ? 'Expand' : 'Collapse'} ${secondaryLabel}`} aria-expanded={!secondaryCollapsed} onClick={() => setSecondaryCollapsed(!secondaryCollapsed)}>{secondaryCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}</button></header>
      {!secondaryCollapsed && <div className="contour-shell-secondary-content">{secondaryNavigation}</div>}
    </aside>}
    <div className="contour-shell-workspace">
      <header className="contour-shell-topbar" data-empty={!header || undefined}>
        <div className="contour-shell-mobile-actions"><button type="button" className="contour-nav-toggle" aria-label="Open navigation" aria-expanded={drawer === 'main'} onClick={() => setDrawer('main')}><Menu size={14} /></button>
          {secondaryNavigation && <button type="button" className="contour-nav-toggle" aria-label={`Open ${secondaryLabel}`} aria-expanded={drawer === 'secondary'} onClick={() => setDrawer('secondary')}><PanelLeftOpen size={14} /></button>}
        </div>{header}
      </header>
      <main className="contour-shell-content">{children}</main>
    </div>
    <dialog className="contour-navigation-drawer" ref={dialog} aria-labelledby={titleId} onCancel={() => setDrawer(null)} onClose={() => setDrawer(null)}>
      <div className="contour-navigation-drawer-heading"><span id={titleId}>{drawer === 'secondary' ? secondaryLabel : toolName}</span><button type="button" className="contour-nav-toggle" aria-label="Close navigation drawer" onClick={() => setDrawer(null)}><X size={14} /></button></div>
      {drawer === 'main' ? mainNav(true) : drawer === 'secondary' ? <div className="contour-shell-secondary-content"><NavigationDismissContext.Provider value={() => setDrawer(null)}>{secondaryNavigation}</NavigationDismissContext.Provider></div> : null}
    </dialog>
  </div>;
}
