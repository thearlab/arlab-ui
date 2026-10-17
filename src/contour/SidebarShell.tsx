import { Fragment, useEffect, useId, useRef, useState, type ReactNode, type CSSProperties, type KeyboardEvent } from 'react';
import { Menu, X, PanelLeftClose, PanelLeftOpen, CircleHelp, Settings2, LayoutGrid } from 'lucide-react';
import { NavigationDismissContext } from './NavigationContext.js';
import { AppNavigation, type NavigationSlot } from './AppNavigation.js';
import { ArlabMark } from '../ArlabMark.js';
import { DeptTile } from './DeptTile.js';
import { ScrollArea } from './scroll-area.js';

export interface Space {
  id: string; label: string; dept?: string; icon?: ReactNode; color?: string;
  href?: string; count?: number; disabled?: boolean;
  /** Stable application-owned onboarding target. Defaults to space-{id}. */
  "data-tour"?: string;
}
export interface SidebarShellProps {
  brand: ReactNode;
  toolName: string;
  navigation: ReactNode;
  /** Route key used to dismiss mobile drawers when custom router links navigate. */
  navigationKey?: string;
  children: ReactNode;
  /** Bounded application surfaces own their inner scrolling. Default preserves document scrolling. */
  contentLayout?: 'scroll' | 'fill';
  account?: NavigationSlot; help?: NavigationSlot; header?: ReactNode;
  /** Rail utility actions use the shared neutral tile and an external label. */
  onHelp?: () => void;
  onSettings?: () => void;
  settings?: NavigationSlot;
  /** Only the OUTER spaces rail folds. The inner tools panel stays open. */
  railCollapsed?: boolean;
  defaultRailCollapsed?: boolean;
  onRailCollapsedChange?: (collapsed: boolean) => void;
  /** @deprecated Single navigation is permanently expanded. Use railCollapsed for the outer spaces rail. */
  collapsed?: boolean; defaultCollapsed?: boolean; onCollapsedChange?: (collapsed: boolean) => void;
  /** Opt-in browser persistence, unique per application. Outer rail uses `${storageKey}:rail`. */
  storageKey?: string;
  secondaryNavigation?: ReactNode; secondaryLabel?: string; defaultSecondaryCollapsed?: boolean;
  /** Presence opts into an outer spaces rail. Selection and panel content belong to the app. */
  spaces?: Space[]; activeSpace?: string; onSpaceChange?: (id: string) => void;
  brandMark?: ReactNode; brandHref?: string; panelLabel?: string;
  /** @deprecated Host-controlled legacy visibility only; no panel-fold control is rendered. */
  panelCollapsed?: boolean; onPanelCollapsedChange?: (collapsed: boolean) => void; defaultPanelCollapsed?: boolean;
  railFooter?: (opts: {collapsed: boolean}) => ReactNode;
  mode?: 'light' | 'dark'; className?: string; style?: CSSProperties;
}
/** Router-independent navigation. Import @arlab/ui/navigation/styles.css for standalone use. */
export function SidebarShell({brand,toolName,navigation,children,account,help,header,navigationKey,
  collapsed,defaultCollapsed=false,onCollapsedChange,railCollapsed,defaultRailCollapsed=true,onRailCollapsedChange,onHelp,onSettings,settings,storageKey,secondaryNavigation,secondaryLabel='Context navigation',defaultSecondaryCollapsed=false,
  spaces,activeSpace,onSpaceChange,brandMark,brandHref='/',panelLabel,panelCollapsed,onPanelCollapsedChange,defaultPanelCollapsed=false,railFooter,
  mode,className='',style,contentLayout='scroll'}:SidebarShellProps) {
  const hasSpaces=spaces!==undefined;
  const [ownRailCollapsed,setOwnRailCollapsed]=useState(defaultRailCollapsed);
  const [secondaryCollapsed,setSecondaryCollapsed]=useState(defaultSecondaryCollapsed);
  const [drawer,setDrawer]=useState<'main'|'secondary'|'spaces'|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const titleId=useId(), panelId=useId(), railId=useId(), tooltipId=useId();
  const [tooltip,setTooltip]=useState<{label:string;x:number;y:number}|null>(null);
  const isCollapsed=false;
  const isPanelCollapsed=panelCollapsed??defaultPanelCollapsed;
  const isRailCollapsed=railCollapsed??ownRailCollapsed;
  const active=spaces?.find(space=>space.id===activeSpace);
  const label=panelLabel || active?.label || toolName;
  const compactMark=brandMark ?? <ArlabMark compact height={32}/>;
  const brandLink=<a className="contour-shell-mark" href={brandHref} aria-label={`${toolName} home`}>{compactMark}</a>;
  const railDisabled=railCollapsed!==undefined&&!onRailCollapsedChange;
  const railBrand=<a className="contour-shell-mark contour-rail-brand" data-compact={isRailCollapsed||undefined} href={brandHref} aria-label={`${toolName} home`}>{isRailCollapsed?compactMark:brand}</a>;
  useEffect(()=>{
    if(!storageKey)return;
    try {
      if(railCollapsed===undefined){const saved=localStorage.getItem(`${storageKey}:rail`);if(saved!==null)setOwnRailCollapsed(saved==='true');}
    } catch { /* optional storage */ }
  },[storageKey,collapsed,railCollapsed]);
  const toggleRail=()=>{
    if(railDisabled)return;
    const next=!isRailCollapsed;
    if(railCollapsed===undefined)setOwnRailCollapsed(next);
    if(storageKey)try{localStorage.setItem(`${storageKey}:rail`,String(next));}catch{/* optional storage */}
    onRailCollapsedChange?.(next);
  };
  useEffect(()=>{
    const key=(event:globalThis.KeyboardEvent)=>{if(event.key==='Escape')setTooltip(null);if((event.metaKey||event.ctrlKey)&&event.key==='\\'&&!event.altKey&&window.matchMedia('(min-width: 760px)').matches){event.preventDefault();if(hasSpaces)toggleRail();}};
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  });
  useEffect(()=>{const media=window.matchMedia('(min-width: 760px)');const close=()=>{if(media.matches)setDrawer(null);};media.addEventListener('change',close);return()=>media.removeEventListener('change',close);},[]);
  useEffect(()=>{
    const node=dialog.current;if(!node)return;
    if(!drawer){if(node.open)node.close();return;}
    const previous=document.activeElement as HTMLElement|null;
    if(!node.open)node.showModal();
    return()=>{if(node.open)node.close();if(previous?.isConnected)previous.focus();};
  },[drawer]);
  useEffect(()=>{setDrawer(null);},[navigationKey,activeSpace]);
  const mainNav=(mobile=false)=><AppNavigation brand={brand} compactBrand={brandLink} toolName={toolName} showToolName={false} collapsed={false} footer={account} help={settings || onSettings ? ({collapsed})=><>{railAction('settings',collapsed)}</> : undefined}>
    <NavigationDismissContext.Provider value={mobile?()=>setDrawer(null):undefined}>{navigation}</NavigationDismissContext.Provider>
  </AppNavigation>;
  const tile=(space:Space)=>space.dept?<DeptTile compact department={space.dept} icon={space.icon} color={space.color}/>:<span className="contour-rail-action-glyph" aria-hidden="true">{space.icon || <LayoutGrid size={14}/>}</span>;
  const arrows=(event:KeyboardEvent<HTMLElement>)=>{
    if(!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    const targets=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[data-space-control]:not(:disabled)'));
    const index=targets.indexOf(document.activeElement as HTMLElement);if(index<0||!targets.length)return;
    event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?targets.length-1:(index+(['ArrowUp','ArrowLeft'].includes(event.key)?-1:1)+targets.length)%targets.length;targets[next]?.focus();
  };
  const spaceList=(mobile=false)=><nav className="contour-spaces-list" aria-label="Spaces" onKeyDown={arrows} data-mobile={mobile||undefined}>
    {spaces?.map((space,spaceIndex)=>{const selected=space.id===activeSpace;const shared={className:'contour-space-control','data-app-space':!space.dept||undefined,'data-space-control':true,'data-tour':space['data-tour'] ?? `space-${space.id}`,'aria-label':space.label,'aria-current':selected?'page' as const:undefined,title:space.label,'aria-describedby':!mobile&&tooltip?.label===space.label?tooltipId:undefined,onFocus:(event:React.FocusEvent<HTMLElement>)=>{if(!mobile){const rect=event.currentTarget.getBoundingClientRect();setTooltip({label:space.label,x:rect.right+8,y:rect.top+rect.height/2});}},onBlur:()=>setTooltip(null),onMouseEnter:(event:React.MouseEvent<HTMLElement>)=>{if(!mobile){const rect=event.currentTarget.getBoundingClientRect();setTooltip({label:space.label,x:rect.right+8,y:rect.top+rect.height/2});}},onMouseLeave:(event:React.MouseEvent<HTMLElement>)=>{if(document.activeElement!==event.currentTarget)setTooltip(null);}};const content=<>{tile(space)}<span className="contour-space-name">{space.label}</span>{space.count!==undefined&&<span className="contour-space-count" aria-label={`${space.count} items`}>{space.count}</span>}</>;const choose=()=>{onSpaceChange?.(space.id);setTooltip(null);setDrawer(null);};return <Fragment key={space.id}>{spaceIndex>0&&!!spaces[spaceIndex-1].dept!==!!space.dept&&<div className="contour-spaces-divider" role="separator"/>}{space.href&&!space.disabled?<a key={space.id} {...shared} href={space.href} onClick={event=>{if(onSpaceChange&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&event.button===0){event.preventDefault();choose();}else if(!onSpaceChange)setDrawer(null);}}>{content}</a>:<button key={space.id} {...shared} type="button" disabled={space.disabled} onClick={choose}>{content}</button>}</Fragment>;})}
  </nav>;
  const slot=(value:NavigationSlot|undefined,compact=isRailCollapsed)=>typeof value==='function'?value({collapsed:compact}):value;
  const railAction=(action:'help'|'settings',compact=isRailCollapsed)=>{
    const callback=action==='help'?onHelp:onSettings;
    const custom=action==='help'?help:settings;
    if(!callback)return slot(custom,compact);
    const Glyph=action==='help'?CircleHelp:Settings2;
    const text=action==='help'?'Help':'Settings';
    return <button type="button" className="contour-rail-action" data-compact={compact||undefined} aria-label={text} title={compact?text:undefined} onClick={callback}><span className="contour-rail-action-glyph" aria-hidden="true"><Glyph size={14}/></span><span className="contour-rail-action-label">{text}</span></button>;
  };
  const panel=(mobile=false)=><aside id={mobile?undefined:panelId} className="contour-space-panel" aria-label={`${label} navigation`} hidden={!mobile&&isPanelCollapsed}>
    <header><span title={label}>{label}</span></header>
    <ScrollArea className="contour-space-panel-scroll" label={`${label} sections`} height={undefined} maxHeight={undefined}><NavigationDismissContext.Provider value={mobile?()=>setDrawer(null):undefined}>{navigation}</NavigationDismissContext.Provider></ScrollArea>
    {account&&<footer className="contour-space-panel-footer">{slot(account,false)}</footer>}
  </aside>;
  const railToggle=<button type="button" className="contour-rail-action contour-rail-toggle" aria-label={isRailCollapsed?'Expand spaces rail':'Collapse spaces rail'} aria-expanded={!isRailCollapsed} aria-controls={railId} title={isRailCollapsed?'Expand spaces rail':undefined} disabled={railDisabled} onClick={toggleRail}><span className="contour-rail-action-glyph" aria-hidden="true">{isRailCollapsed?<PanelLeftOpen size={14}/>:<PanelLeftClose size={14}/>}</span><span className="contour-rail-action-label">Collapse rail</span></button>;
  const railEnd=railFooter?railFooter({collapsed:isRailCollapsed}):<>{railAction('settings')}</>;
  return <div className={`contour-shell ${className}`} data-spaces={hasSpaces||undefined} data-collapsed={!hasSpaces&&isCollapsed||undefined} data-panel-collapsed={hasSpaces&&isPanelCollapsed||undefined} data-rail-collapsed={hasSpaces&&isRailCollapsed||undefined} data-secondary-collapsed={secondaryCollapsed||undefined} data-mode={mode} style={style}>
    {hasSpaces?<><aside id={railId} className="contour-spaces-rail" aria-label="Workspace spaces"><header>{railBrand}</header><ScrollArea className="contour-spaces-scroll" label="Available spaces" height={undefined} maxHeight={undefined}>{spaceList()}</ScrollArea><footer>{railEnd}{railToggle}</footer></aside>{panel()}</>:<div className="contour-shell-primary">{mainNav()}</div>}
    {secondaryNavigation&&<aside className="contour-shell-secondary" aria-label={secondaryLabel}><header><span>{secondaryLabel}</span><button type="button" className="contour-nav-toggle" aria-label={`${secondaryCollapsed?'Expand':'Collapse'} ${secondaryLabel}`} aria-expanded={!secondaryCollapsed} onClick={()=>setSecondaryCollapsed(!secondaryCollapsed)}>{secondaryCollapsed?<PanelLeftOpen size={14}/>:<PanelLeftClose size={14}/>}</button></header>{!secondaryCollapsed&&<div className="contour-shell-secondary-content">{secondaryNavigation}</div>}</aside>}
    <div className="contour-shell-workspace"><header className="contour-shell-topbar" data-empty={!header||undefined}>
      <div className="contour-shell-mobile-actions">{hasSpaces&&<>{brandLink}<button type="button" className="contour-mobile-space" aria-label={`Choose space: ${label}`} aria-haspopup="dialog" aria-expanded={drawer==='spaces'} onClick={()=>setDrawer('spaces')}>{active&&tile(active)}<span>{label}</span></button></>}<button type="button" className="contour-nav-toggle" aria-label={hasSpaces?'Open space navigation':'Open navigation'} aria-haspopup="dialog" aria-expanded={drawer==='main'} onClick={()=>setDrawer('main')}><Menu size={14}/></button>{secondaryNavigation&&<button type="button" className="contour-nav-toggle" aria-label={`Open ${secondaryLabel}`} aria-expanded={drawer==='secondary'} onClick={()=>setDrawer('secondary')}><PanelLeftOpen size={14}/></button>}</div>{header}
    </header><main className="contour-shell-content" data-content-layout={contentLayout}>{children}</main></div>
    {tooltip&&<div className="contour-space-tooltip" role="tooltip" id={tooltipId} style={{left:tooltip.x,top:tooltip.y}}>{tooltip.label}</div>}
    <dialog className="contour-navigation-drawer" ref={dialog} aria-labelledby={titleId} onCancel={()=>setDrawer(null)} onClose={()=>setDrawer(null)}><div className="contour-navigation-drawer-heading"><span id={titleId}>{drawer==='spaces'?'Spaces':drawer==='secondary'?secondaryLabel:hasSpaces?label:toolName}</span><button type="button" className="contour-nav-toggle" aria-label="Close navigation drawer" onClick={()=>setDrawer(null)}><X size={14}/></button></div>
      {drawer==='spaces'?<><ScrollArea className="contour-space-panel-scroll" label="Available spaces" height={undefined} maxHeight={undefined}>{spaceList(true)}</ScrollArea><footer className="contour-spaces-mobile-footer">{railAction('settings',false)}</footer></>:drawer==='main'?hasSpaces?panel(true):mainNav(true):drawer==='secondary'?<div className="contour-shell-secondary-content"><NavigationDismissContext.Provider value={()=>setDrawer(null)}>{secondaryNavigation}</NavigationDismissContext.Provider></div>:null}
    </dialog>
  </div>;
}
