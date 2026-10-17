import { isValidElement, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Button, Kbd } from './library.js';
import { ActionGroup } from './CollectionWorkspace.js';
export interface AppHeaderProps {
  appName?: string;
  appIcon?: ReactNode;
  context: ReactNode;
  actions?: ReactNode;
  pageActions?: ReactNode;
  /** Match the widths of related page actions without changing global button geometry. */
  pageActionsEqualWidth?: boolean;
  search?: ReactNode | { onClick: () => void; label?: string; shortcut?: string };
}
/** Responsive application header. Phone search actions become icons; full search fields wrap beneath the record context. */
export function AppHeader({appName,appIcon,context,actions,pageActions,pageActionsEqualWidth=false,search}:AppHeaderProps) {
  const searchAction=search && typeof search==='object' && !isValidElement(search) && 'onClick' in search ? search : null;
  return <div className="ct-app-header" data-page-actions={!!pageActions||undefined} data-app-name={!!appName||undefined}>
    {appName?<div className="ct-app-header-identity">
      <div className="ct-app-header-brand">
        <strong title={appName}><span>{appName}</span></strong>
      </div>
      <div className="ct-app-header-context">{context}</div>
    </div>:<div className="ct-app-header-context">{context}</div>}
    <div className="ct-app-header-actions">
      {searchAction?<Button className="ct-app-header-search" aria-label={searchAction.label||'Search'} onClick={searchAction.onClick}><Search size={14}/><span className="ct-app-header-search-label">{searchAction.label||'Search'}</span>{searchAction.shortcut&&<span className="ct-app-header-shortcut"><Kbd>{searchAction.shortcut}</Kbd></span>}</Button>:search?<div className="ct-app-header-search-content">{search as ReactNode}</div>:null}
      {pageActions&&<div className="ct-app-header-page-actions" role="group" aria-label="Page actions">{pageActionsEqualWidth?<ActionGroup equalWidth>{pageActions}</ActionGroup>:pageActions}</div>}
      {actions}
    </div>
  </div>;
}
