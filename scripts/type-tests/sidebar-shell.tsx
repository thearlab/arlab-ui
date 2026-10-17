import {SidebarShell, ArlabMark, NavigationSection, NavigationItem, AccountMenu} from '@arlab/ui';
export const shell = <SidebarShell brand={<ArlabMark/>} toolName="Studio"
  spaces={[{id:'creative',label:'Creative',dept:'creative'},{id:'admin',label:'Admin'}]} activeSpace="creative"
  railCollapsed={false} onRailCollapsedChange={collapsed=>{const next:boolean=collapsed;void next;}}
  onHelp={()=>{}} onSettings={()=>{}}
  navigation={<NavigationSection label="Workspace"><NavigationItem label="Overview" active/></NavigationSection>}
  account={({collapsed})=><AccountMenu collapsed={collapsed} name="Maya"/>}>Content</SidebarShell>;
export const legacyPanelProps = <SidebarShell brand="ARLAB" toolName="Legacy" spaces={[]} panelCollapsed={false} onPanelCollapsedChange={()=>{}} railFooter={({collapsed})=><span>{collapsed?'Compact':'Expanded'}</span>} navigation="Tools">Content</SidebarShell>;
// @ts-expect-error Rail state is a boolean, not a width or string.
const invalid = <SidebarShell brand="ARLAB" toolName="Studio" railCollapsed="yes" navigation="Tools">Content</SidebarShell>;
void invalid;
