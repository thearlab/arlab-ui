import { isValidElement, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Button, Kbd } from './library.js';
export interface AppHeaderProps {
  context: ReactNode;
  actions?: ReactNode;
  search?: ReactNode | { onClick: () => void; label?: string; shortcut?: string };
}
/** A single-row application header. Context shrinks before actions; phone search becomes icon-only. */
export function AppHeader({context,actions,search}:AppHeaderProps) {
  const searchAction=search && typeof search==='object' && !isValidElement(search) && 'onClick' in search ? search : null;
  return <div className="ct-app-header">
    <div className="ct-app-header-context">{context}</div>
    <div className="ct-app-header-actions">
      {searchAction?<Button className="ct-app-header-search" aria-label={searchAction.label||'Search'} onClick={searchAction.onClick}><Search size={14}/><span className="ct-app-header-search-label">{searchAction.label||'Search'}</span>{searchAction.shortcut&&<span className="ct-app-header-shortcut"><Kbd>{searchAction.shortcut}</Kbd></span>}</Button>:search?<div className="ct-app-header-search-content">{search as ReactNode}</div>:null}
      {actions}
    </div>
  </div>;
}
