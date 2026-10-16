import { type ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ScrollArea } from './scroll-area.js';

export type NavigationSlot = ReactNode | ((state: { collapsed: boolean }) => ReactNode);

export interface AppNavigationProps {
  brand: ReactNode;
  toolName: string;
  collapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
  footer?: NavigationSlot;
  help?: NavigationSlot;
  className?: string;
  mode?: "light" | "dark";
  toggleLabel?: string;
  toggleDisabled?: boolean;
}
/** Fixed identity and account areas around an independently scrolling navigation. */
export function AppNavigation({ brand, toolName, collapsed, onToggle, children, footer, help, className = '', mode, toggleLabel, toggleDisabled = false }: AppNavigationProps) {
  return <aside className={`contour-navigation ${className}`} data-mode={mode} data-collapsed={collapsed || undefined} aria-label={`${toolName} navigation`}>
    <header className="contour-navigation-header">
      <div className="contour-navigation-brand"><div className="contour-navigation-logo">{brand}</div>
        <button type="button" className="contour-nav-toggle" disabled={toggleDisabled} aria-label={toggleLabel ?? (collapsed ? 'Expand navigation' : 'Collapse navigation')} aria-expanded={!collapsed} onClick={onToggle}>
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>
      <div className="contour-navigation-name">{toolName}</div>
    </header>
    <ScrollArea className="contour-navigation-scroll" label={`${toolName} sections`} height={undefined} maxHeight={undefined}>
      {children}
    </ScrollArea>
    {(help || footer) && <footer className="contour-navigation-footer">{help && <div className="contour-navigation-help">{typeof help === "function" ? help({ collapsed }) : help}</div>}{footer && <div className="contour-navigation-account">{typeof footer === "function" ? footer({ collapsed }) : footer}</div>}</footer>}
  </aside>;
}
