import { DeptTile, departmentIdentity } from './DeptTile.js';
import { NavigationDismissContext } from './NavigationContext.js';
import { useContext, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
export { SidebarShell, type SidebarShellProps, type Space } from './SidebarShell.js';
export { AppNavigation, type AppNavigationProps } from './AppNavigation.js';
export { ScrollArea } from './scroll-area.js';
export function NavigationSection({ label, children }: { label: string; children: ReactNode }) {
  return <section className="contour-navigation-section" aria-label={label}><h2>{label}</h2>{children}</section>;
}
export interface NavigationItemProps {
  label: string; icon?: ReactNode; active?: boolean; count?: number;
  /** Department identity uses its own outlined, hover and selected colors. Ordinary page links retain the pink active state. */
  department?: string;
  /** Optional department identity color; ignored for ordinary page links. */
  color?: string;
  href?: string; onSelect?: () => void; disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  "data-tour"?: string;
}
/** Router-independent. Supply href for normal links or onSelect for client routing. */
export function NavigationItem({ label, icon, department, color, active, count, href, onSelect, disabled, onClick, "data-tour": tour }: NavigationItemProps) {
  const dismiss = useContext(NavigationDismissContext);
  const select = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => { onClick?.(event); onSelect?.(); dismiss?.(); };
  const identity = department ? departmentIdentity(department, color) : undefined;
  const content = <>{department ? <DeptTile compact department={department} color={color} icon={icon} /> : <span className="contour-navigation-item-icon" aria-hidden="true">{icon ?? label.slice(0, 1)}</span>}<span className="contour-navigation-item-label">{label}</span>{count !== undefined && <span className="contour-navigation-item-count">{count}</span>}</>;
  const shared = { className: 'contour-navigation-item', 'data-department': identity?.key, style:identity ? {'--department-color':identity.color,'--department-ink':identity.ink} as CSSProperties : undefined, 'data-tour': tour, title: label, 'aria-label': label, 'aria-current': active ? 'page' as const : undefined };
  return href && !disabled ? <a {...shared} href={href} onClick={select}>{content}</a> : <button {...shared} type="button" disabled={disabled} onClick={select}>{content}</button>;
}

export { ArlabMark, type ArlabMarkProps } from '../ArlabMark.js';
