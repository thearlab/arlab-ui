import { Fragment, useEffect, useId, useRef, useState, type ReactNode, type CSSProperties, type KeyboardEvent } from 'react';
import { Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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
  account?: NavigationSlot; help?: NavigationSlot; header?: ReactNode;
  collapsed?: boolean; defaultCollapsed?: boolean; onCollapsedChange?: (collapsed: boolean) => void;
  /** Opt-in browser persistence, unique per application. Spaces fold uses `${storageKey}:panel`. */
  storageKey?: string;
  secondaryNavigation?: ReactNode; secondaryLabel?: string; defaultSecondaryCollapsed?: boolean;
  /** Presence opts into an outer spaces rail. Selection and panel content belong to the app. */
  spaces?: Space[]; activeSpace?: string; onSpaceChange?: (id: string) => void;
  brandMark?: ReactNode; brandHref?: string; panelLabel?: string;
  panelCollapsed?: boolean; onPanelCollapsedChange?: (collapsed: boolean) => void; defaultPanelCollapsed?: boolean;
  railFooter?: (opts: {collapsed: true}) => ReactNode;
  mode?: 'light' | 'dark'; className?: string; style?: CSSProperties;
}
/** Router-independent navigation. Import @arlab/ui/navigation/styles.css for standalone use. */
export function SidebarShell({brand,toolName,navigation,children,account,help,header,navigationKey,
  collapsed,defaultCollapsed=false,onCollapsedChange,storageKey,secondaryNavigation,secondaryLabel='Context navigation',defaultSecondaryCollapsed=false,
  spaces,activeSpace,onSpaceChange,brandMark,brandHref='/',panelLabel,panelCollapsed,onPanelCollapsedChange,defaultPanelCollapsed=false,railFooter,
  mode,className='',style}:SidebarShellProps) {
  const hasSpaces=spaces!==undefined;
  const [ownCollapsed,setOwnCollapsed]=useState(defaultCollapsed);
  const [ownPanelCollapsed,setOwnPanelCollapsed]=useState(defaultPanelCollapsed);
  const [secondaryCollapsed,setSecondaryCollapsed]=useState(defaultSecondaryCollapsed);
  const [drawer,setDrawer]=useState<'main'|'secondary'|'spaces'|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const titleId=useId(), panelId=useId(), tooltipId=useId();
  const [tooltip,setTooltip]=useState<{label:string;x:number;y:number}|null>(null);
  const isCollapsed=collapsed??ownCollapsed;
  const isPanelCollapsed=panelCollapsed??ownPanelCollapsed;
  const active=spaces?.find(space=>space.id===activeSpace);
  const label=panelLabel || active?.label || toolName;
  const compactMark=brandMark ?? <ArlabMark height={12}/>;
  const brandLink=<a className="contour-shell-mark" href={brandHref} aria-label={`${toolName} home`}>{compactMark}</a>;
  const panelDisabled=panelCollapsed!==undefined&&!onPanelCollapsedChange;
  useEffect(()=>{
    if(!storageKey)return;
    try {
      if(collapsed===undefined){const saved=localStorage.getItem(storageKey);if(saved!==null)setOwnCollapsed(saved==='true');}
      if(panelCollapsed===undefined){const saved=localStorage.getItem(`${storageKey}:panel`);if(saved!==null)setOwnPanelCollapsed(saved==='true');}
    } catch { /* optional storage */ }
  },[storageKey,collapsed,panelCollapsed]);
  const toggle=()=>{
    if(collapsed!==undefined&&!onCollapsedChange)return;
    const next=!isCollapsed;if(collapsed===undefined)setOwnCollapsed(next);
    if(storageKey)try{localStorage.setItem(storageKey,String(next));}catch{/* optional storage */}
    onCollapsedChange?.(next);
  };
  const togglePanel=()=>{
    if(panelDisabled)return;
    const next=!isPanelCollapsed;if(panelCollapsed===undefined)setOwnPanelCollapsed(next);
    if(storageKey)try{localStorage.setItem(`${storageKey}:panel`,String(next));}catch{/* optional storage */}
    onPanelCollapsedChange?.(next);
  };
  useEffect(()=>{
    const key=(event:globalThis.KeyboardEvent)=>{if(event.key==='Escape')setTooltip(null);if((event.metaKey||event.ctrlKey)&&event.key==='\\'&&!event.altKey&&window.matchMedia('(min-width: 760px)').matches){event.preventDefault();if(hasSpaces)togglePanel();else toggle();}};
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
  const mainNav=(mobile=false)=><AppNavigation brand={brand} compactBrand={brandLink} toolName={toolName} collapsed={mobile?false:isCollapsed} onToggle={mobile?()=>setDrawer(null):toggle} toggleDisabled={!mobile&&collapsed!==undefined&&!onCollapsedChange} toggleLabel={mobile?'Close navigation':undefined} footer={account} help={help}>
    <NavigationDismissContext.Provider value={mobile?()=>setDrawer(null):undefined}>{navigation}</NavigationDismissContext.Provider>
  </AppNavigation>;
  const tile=(space:Space)=><DeptTile compact department={space.dept || space.label} icon={space.icon} color={space.dept?space.color:space.color||'var(--cn-ink)'}/>;
  const arrows=(event:KeyboardEvent<HTMLElement>)=>{
    if(!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    const targets=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[data-space-control]:not(:disabled)'));
    const index=targets.indexOf(document.activeElement as HTMLElement);if(index<0||!targets.length)return;
    event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?targets.length-1:(index+(['ArrowUp','ArrowLeft'].includes(event.key)?-1:1)+targets.length)%targets.length;targets[next]?.focus();
  };
  const spaceList=(mobile=false)=><nav className="contour-spaces-list" aria-label="Spaces" onKeyDown={arrows} data-mobile={mobile||undefined}>
    {spaces?.map((space,spaceIndex)=>{const selected=space.id===activeSpace;const shared={className:'contour-space-control','data-app-space':!space.dept||undefined,'data-space-control':true,'data-tour':space['data-tour'] ?? `space-${space.id}`,'aria-label':space.label,'aria-current':selected?'page' as const:undefined,title:space.label,'aria-describedby':!mobile&&tooltip?.label===space.label?tooltipId:undefined,onFocus:(event:React.FocusEvent<HTMLElement>)=>{if(!mobile){const rect=event.currentTarget.getBoundingClientRect();setTooltip({label:space.label,x:rect.right+8,y:rect.top+rect.height/2});}},onBlur:()=>setTooltip(null),onMouseEnter:(event:React.MouseEvent<HTMLElement>)=>{if(!mobile){const rect=event.currentTarget.getBoundingClientRect();setTooltip({label:space.label,x:rect.right+8,y:rect.top+rect.height/2});}},onMouseLeave:(event:React.MouseEvent<HTMLElement>)=>{if(document.activeElement!==event.currentTarget)setTooltip(null);}};const content=<>{tile(space)}<span className="contour-space-name">{space.label}</span>{space.count!==undefined&&<span className="contour-space-count" aria-label={`${space.count} items`}>{space.count}</span>}</>;const choose=()=>{onSpaceChange?.(space.id);setTooltip(null);setDrawer(null);};return <Fragment key={space.id}>{spaceIndex>0&&!!spaces[spaceIndex-1].dept!==!!space.dept&&<div className="contour-spaces-divider" role="separator"/>}{space.href&&!space.disabled?<a key={space.id} {...shared} href={space.href} onClick={event=>{if(onSpaceChange&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&event.button===0){event.preventDefault();choose();}else if(!onSpaceChange)setDrawer(null);}}>{content}</a>:<button key={space.id} {...shared} type="button" disabled={space.disabled} onClick={choose}>{content}</button>}</Fragment>;})}
  </nav>;
  const fold=<button type="button" className="contour-nav-toggle" aria-label={isPanelCollapsed?'Expand space navigation':'Collapse space navigation'} aria-expanded={!isPanelCollapsed} aria-controls={panelId} disabled={panelDisabled} onClick={togglePanel}>{isPanelCollapsed?<PanelLeftOpen size={14}/>:<PanelLeftClose size={14}/>}</button>;
  const panel=(mobile=false)=><aside id={mobile?undefined:panelId} className="contour-space-panel" aria-label={`${label} navigation`} hidden={!mobile&&isPanelCollapsed}>
    <header>{active&&tile(active)}<span title={label}>{label}</span></header>
    <ScrollArea className="contour-space-panel-scroll" label={`${label} sections`} height={undefined} maxHeight={undefined}><NavigationDismissContext.Provider value={mobile?()=>setDrawer(null):undefined}>{navigation}</NavigationDismissContext.Provider></ScrollArea>
    {!mobile&&<footer className="contour-space-panel-footer">{fold}</footer>}
  </aside>;
  const slot=(value:NavigationSlot|undefined)=>typeof value==='function'?value({collapsed:true}):value;
  const railEnd=railFooter?railFooter({collapsed:true}):<>{slot(help)}{slot(account)}</>;
  return <div className={`contour-shell ${className}`} data-spaces={hasSpaces||undefined} data-collapsed={!hasSpaces&&isCollapsed||undefined} data-panel-collapsed={hasSpaces&&isPanelCollapsed||undefined} data-secondary-collapsed={secondaryCollapsed||undefined} data-mode={mode} style={style}>
    {hasSpaces?<><aside className="contour-spaces-rail"><header>{brandLink}</header><ScrollArea className="contour-spaces-scroll" label="Available spaces" height={undefined} maxHeight={undefined}>{spaceList()}</ScrollArea><footer>{railEnd}{isPanelCollapsed&&fold}</footer></aside>{panel()}</>:<div className="contour-shell-primary">{mainNav()}</div>}
    {secondaryNavigation&&<aside className="contour-shell-secondary" aria-label={secondaryLabel}><header><span>{secondaryLabel}</span><button type="button" className="contour-nav-toggle" aria-label={`${secondaryCollapsed?'Expand':'Collapse'} ${secondaryLabel}`} aria-expanded={!secondaryCollapsed} onClick={()=>setSecondaryCollapsed(!secondaryCollapsed)}>{secondaryCollapsed?<PanelLeftOpen size={14}/>:<PanelLeftClose size={14}/>}</button></header>{!secondaryCollapsed&&<div className="contour-shell-secondary-content">{secondaryNavigation}</div>}</aside>}
    <div className="contour-shell-workspace"><header className="contour-shell-topbar" data-empty={!header||undefined}>
      <div className="contour-shell-mobile-actions">{hasSpaces&&<>{brandLink}<button type="button" className="contour-mobile-space" aria-label={`Choose space: ${label}`} aria-haspopup="dialog" aria-expanded={drawer==='spaces'} onClick={()=>setDrawer('spaces')}>{active&&tile(active)}<span>{label}</span></button></>}<button type="button" className="contour-nav-toggle" aria-label={hasSpaces?'Open space navigation':'Open navigation'} aria-haspopup="dialog" aria-expanded={drawer==='main'} onClick={()=>setDrawer('main')}><Menu size={14}/></button>{secondaryNavigation&&<button type="button" className="contour-nav-toggle" aria-label={`Open ${secondaryLabel}`} aria-expanded={drawer==='secondary'} onClick={()=>setDrawer('secondary')}><PanelLeftOpen size={14}/></button>}</div>{header}
    </header><main className="contour-shell-content">{children}</main></div>
    {tooltip&&<div className="contour-space-tooltip" role="tooltip" id={tooltipId} style={{left:tooltip.x,top:tooltip.y}}>{tooltip.label}</div>}
    <dialog className="contour-navigation-drawer" ref={dialog} aria-labelledby={titleId} onCancel={()=>setDrawer(null)} onClose={()=>setDrawer(null)}><div className="contour-navigation-drawer-heading"><span id={titleId}>{drawer==='spaces'?'Spaces':drawer==='secondary'?secondaryLabel:hasSpaces?label:toolName}</span><button type="button" className="contour-nav-toggle" aria-label="Close navigation drawer" onClick={()=>setDrawer(null)}><X size={14}/></button></div>
      {drawer==='spaces'?<><ScrollArea className="contour-space-panel-scroll" label="Available spaces" height={undefined} maxHeight={undefined}>{spaceList(true)}</ScrollArea><footer className="contour-spaces-mobile-footer">{railEnd}</footer></>:drawer==='main'?hasSpaces?panel(true):mainNav(true):drawer==='secondary'?<div className="contour-shell-secondary-content"><NavigationDismissContext.Provider value={()=>setDrawer(null)}>{secondaryNavigation}</NavigationDismissContext.Provider></div>:null}
    </dialog>
  </div>;
}
