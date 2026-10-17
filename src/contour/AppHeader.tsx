import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Button, Kbd } from './library.js';
export interface AppHeaderProps {
  context: ReactNode;
  actions?: ReactNode;
  search?: { onClick: () => void; label?: string; shortcut?: string };
}
/** A single-row application header. Context shrinks before actions; phone search becomes icon-only. */
export function AppHeader({context,actions,search}:AppHeaderProps) {
  return <div className="ct-app-header">
    <div className="ct-app-header-context">{context}</div>
    <div className="ct-app-header-actions">
      {search&&<Button className="ct-app-header-search" aria-label={search.label||'Search'} onClick={search.onClick}><Search size={14}/><span className="ct-app-header-search-label">{search.label||'Search'}</span>{search.shortcut&&<span className="ct-app-header-shortcut"><Kbd>{search.shortcut}</Kbd></span>}</Button>}
      {actions}
    </div>
  </div>;
}
