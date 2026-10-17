import {
  Button, IconButton, Avatar, Status, SectionHead, TextAction, Meter,
  Notice, EmptyState, FileUpload, Dropdown, Picker, Select, ComboboxPicker,
  Field, Checkbox, Radio, Switch, SwitchRow, Chip, Panel, Card, Row, Facts,
  Stat, CollectionCard, LinkTile, Refreshing, Toast, Popover, DropdownMenu,
  Dialog, Sheet, ConfirmDialog, Disclosure, FieldRow, SheetSection,
  Breadcrumbs, DetailHeader, Steps, DayTimeline, PageLoading, ContourProvider,
  Input, ScrollArea, LoadingBar, Skeleton, Loader, PageBar, SaveBar, CopyBlock,
  SegmentedControl, TabStrip, TextLink, Timestamp, LegendDot, Stack,
  StateView, AccountMenu, Tooltip, Rows, StatRow, PageGrid, CardGrid,
  ReadableDoc, Markdown, Toc, ColumnChart, Sparkline, StackedBar, BarList,
  Inspector, DataTable, ProjectStatusSheet, Gate, NavTree, RecordHeader, PhaseBar, DailyVerdictStrip, AppSwitcher,
  FilterRow, SortHead, ConfirmStrip, Kbd,
} from '@arlab/ui';
import type { ComponentProps } from 'react';

const close = () => {};
const options = [{value: 'a', label: 'Alpha'}];
const project = {id:'p', name:'Project', client:'ARLAB', status:'Planning', owner:'AM', due:'2026-10-17', progress:0};
const dropdownChange: NonNullable<ComponentProps<typeof Dropdown>['onChange']> = event => {
  const value: string = event.target.value;
  const name: string | undefined = event.currentTarget.name;
  void value; void name;
};

// Realistic minimal compositions must not pass `undefined` for unused settings,
// cast components, add index signatures, or import the legacy runtime.
export const minimumSettings = <ContourProvider mode="dark" aria-label="Workspace">
  <Panel><Field label="Name"><Input /></Field></Panel>
  <Card title={<span>Settings</span>} action={<Button onClick={close}>Edit</Button>} />
  <Button disabled type="submit" onClick={event => event.currentTarget.focus()}>Save</Button>
  <IconButton label="Close" onClick={close}><span>×</span></IconButton>
  <Avatar /><Avatar size={22} src="/avatar.png" name="Amal" title="Amal" /><Status title="Ready to run" role="status">Ready</Status><SectionHead title="Overview" />
  <TextAction onClick={close}>Open</TextAction><Meter value={20} />
  <Notice>Information</Notice><EmptyState /><FileUpload />
  <FileUpload onChange={file => {const selected: File | null = file; void selected;}} />
  <Dropdown options={options} onChange={dropdownChange} />
  <Dropdown options={[{value:"all",label:"Every PM",count:12,description:"All project managers"}]} />
  <Dropdown name="project" defaultValue="a"><option value="a">Alpha</option></Dropdown>
  <Picker options={options} /><Select options={options} /><ComboboxPicker options={options} />
  <Checkbox label="Allow" checked onChange={event => event.currentTarget.checked} />
  <Radio label="Option" name="choice" /><Switch /><Switch label="Enabled" hint="Available" />
  <SwitchRow label={<span>Notifications</span>} hint="Optional" />
  <Chip>Tag</Chip><Row title="Owner" /><Facts items={[["Owner", <Avatar />], ...Object.entries({team:"ARLAB"})]} />
  <Stat label="Projects" value={5} /><CollectionCard title="Project" /><LinkTile title="Docs" />
  <Refreshing /><Toast>Saved</Toast>
  <Popover trigger={<Button>Details</Button>}>Content</Popover>
  <Popover open onOpenChange={close} trigger={props => <Button {...props}>Details</Button>}>
    {dismiss => <Button onClick={dismiss}>Dismiss</Button>}
  </Popover>
  <DropdownMenu items={[{label:'Edit', onSelect:close}, {separator:true}]} />
  <DropdownMenu trigger={props => <Button {...props}>Menu</Button>} items={[]} />
  <DropdownMenu header={<span>Account</span>} trigger={<Button>Account</Button>} items={[]} />
  <Dialog open={false} onClose={close} /><Sheet open={false} onClose={close} />
  <ConfirmDialog open={false} onClose={close} onConfirm={close} />
  <Disclosure title="More" /><FieldRow label="Mode"><Picker options={options} /></FieldRow>
  <SheetSection title="People" /><Breadcrumbs items={['Home', {label:<span>Projects</span>, href:'/projects'}]} />
  <DetailHeader title="Project" /><Steps steps={['First', 'Second']} /><DayTimeline />
  <PageLoading /><ScrollArea>Content</ScrollArea><LoadingBar /><Skeleton /><Loader />
  <PageBar title="Projects" /><SaveBar dirty /><CopyBlock>const value = 1;</CopyBlock>
  <SegmentedControl options={['List', 'Grid']} value="List" onChange={close} />
  <SegmentedControl options={[{value:"list",label:"List view"},{value:"grid",label:"Grid view",disabled:true}]} value="list" onChange={close} />
  <TabStrip options={['Overview', {label:'Settings', value:'settings'}]} value="Overview" onChange={close} />
  <TextLink href="/projects">Projects</TextLink><Timestamp date="2026-10-17" /><LegendDot>Projects</LegendDot>
  <Stack /><StateView /><StateView actionLabel="Add person" onAction={close} />
  <StateView action={<Button onClick={close}>Invite</Button>} /><AccountMenu /><Tooltip label="Help"><Button>Help</Button></Tooltip>
  <Rows /><StatRow /><PageGrid /><CardGrid /><ReadableDoc title="Guide" />
  <Markdown># Guide</Markdown><Toc items={[]} /><ColumnChart /><Sparkline /><StackedBar /><BarList />
  <Inspector items={[project]} /><DataTable rows={[project]} />
  <ProjectStatusSheet open={false} onClose={close} project={project} onSave={close} />
  <Gate /><NavTree items={[]} value="" onChange={close} /><AppSwitcher value="Workspace" onChange={close} />
  <FilterRow query="" status="All statuses" onQueryChange={close} onStatusChange={close} />
  <SortHead label="Name" /><ConfirmStrip onConfirm={close} onCancel={close} /><Kbd>Enter</Kbd>
</ContourProvider>;

// Necessary contracts and native control types must remain enforced.
// @ts-expect-error Accessible icon button labels are required.
const unlabeledIcon = <IconButton />;
// @ts-expect-error A modal requires an open state and close handler.
const unownedModal = <Dialog />;
// @ts-expect-error A field requires its visible label.
const unlabeledField = <Field />;
// @ts-expect-error Controls keep native boolean disabled semantics.
const invalidDisabled = <Button disabled="yes" />;
// @ts-expect-error Only supported theme modes are accepted.
const invalidMode = <ContourProvider mode="neon" />;
// @ts-expect-error Checkbox checked is a boolean, not an arbitrary setting.
const invalidCheckbox = <Checkbox label="Allow" checked="yes" />;
// @ts-expect-error Dropdown callbacks receive an event-shaped object, not a raw string.
const invalidDropdown = <Dropdown options={options} onChange={(value: string) => {}} />;
// @ts-expect-error Markdown must receive source text.
const invalidMarkdown = <Markdown>{42}</Markdown>;
void [unlabeledIcon, unownedModal, unlabeledField, invalidDisabled, invalidMode, invalidCheckbox, invalidDropdown, invalidMarkdown];

// @ts-expect-error Numeric avatar sizing does not accept unvalidated CSS strings.
const invalidAvatarSize = <Avatar size="tiny" />;
// @ts-expect-error Object segmented options require a stable value.
const invalidSegment = <SegmentedControl options={[{label:'List'}]} value="list" onChange={close} />;
// @ts-expect-error Option counts are numbers, including zero.
const invalidOptionCount = <Dropdown options={[{value:'all',label:'All',count:'twelve'}]} />;

export const extendedContracts = <>
  <Button href="/projects" onClick={event=>event.currentTarget.href}>Projects</Button>
  <Button href="https://example.com" external disabled>External</Button>
  <LinkTile title="Guide" href="/guide" meta="Updated today" badge={<Status>New</Status>} />
  <Picker prefix="PM" options={[{value:"all",label:"Every PM",count:12}]} />
  <RecordHeader title="Amina" label="Person" backLabel="People" onBack={close} />
  <PhaseBar density="compact" phases={[{id:"brief",label:"Brief"}]} current="brief" />
  <DailyVerdictStrip days={[{date:"2026-10-17",state:"due-today"},{date:"2026-10-18",state:"at-risk"},{date:"2026-10-19",state:"delayed"},{date:"2026-10-20",state:"no-update"}]} />
  <Gate title="Sign in" description="Use your team account" action={<Button>Sign in</Button>} fine="Team access only" />
  <DayTimeline date="2026-10-17" items={[{id:"review",time:"09:30",title:"Review",state:"late",href:"/review"}]} days={[{value:"2026-10-17",label:"Sat"}]} value="2026-10-17" onChange={close} onSelect={(name,item)=>{const id:string=item.id;void name;void id;}} />
</>;

// Notification service, onboarding ownership and app-controlled iframe preview contracts.
import {ToastProvider as ContractToastProvider, useToast as useContractToast, useGuidedTour as useContractTour, PreviewFrame as ContractPreviewFrame} from '@arlab/ui';
import {createRef as createContractRef} from 'react';
function ServiceContractExample() {
  const notifications=useContractToast();
  const tour=useContractTour({steps:[{target:'[data-tour="space-creative"]',title:'Creative',body:'Open your workspace.'}],storageKey:'studio-tour',version:2,autoStart:true});
  const previewRef=createContractRef<HTMLIFrameElement>();
  return <ContractToastProvider maxVisible={2} duration={5000}>
    <button onClick={()=>{const id=notifications.toast({title:'Saved',tone:'info',duration:0,action:{label:'Undo',onClick:()=>{}}});notifications.update(id,{description:'Saved just now'});notifications.dismiss(id);tour.start();tour.close('done');tour.reset();}}>Save</button>
    <ContractPreviewFrame title="Site" ref={previewRef} autoHeight allow="fullscreen" onLoad={event=>event.currentTarget.focus()} onHeightChange={height=>height.toFixed()} overlay={<span>Live</span>} renderOverlay={({loading})=>loading ? 'Working' : null}/>
  </ContractToastProvider>;
}

export const editableContracts = <>
  <ComboboxPicker allowCustom prefix="Client" options={options} />
  <TagInput value={[]} onChange={close} normalize={value=>value.toLowerCase()} validate={value=>value.endsWith('@thearlab.com') || 'Use your work email'} />
  <MediaUploadField label="Files" items={[{id:'brief',name:'Brief.pdf',src:'/brief.pdf',type:'pdf'}]} onFiles={close} kinds={['image','pdf','file']} onLink={url=>{const value:string=url;void value;}} />
  <Timeline items={[{id:'published',title:'Published',tone:'ok',meta:'Version 2',actions:<Button>View</Button>}]} />
</>;
import {TagInput,MediaUploadField,Timeline} from '@arlab/ui';

// Group moves preserve the flat ReorderList API and offer a separate controlled groups contract.
import {ReorderList as ContractReorderList} from '@arlab/ui';
const groupedReorderContract = <ContractReorderList label="Stages" groups={[{id:'brief',label:'Brief',items:[{id:'a',label:'Idea'}]},{id:'ready',label:'Ready',items:[]}]} onGroupsChange={groups=>groups.map(group=>group.items.map(item=>item.id))}/>;
// @ts-expect-error Grouped mode requires its controlled change callback.
const invalidGroupedReorder = <ContractReorderList label="Stages" groups={[]}/>;

const selectedFoundationExamples = <>
  <PageLoading variant="content-preview" title="Opening your workspace" />
  <AppSwitcher value="ops" onChange={value=>void value} options={[{value:'ops',label:'Operations',description:'Daily work'}]} />
</>;
void selectedFoundationExamples;

const framedScrollContract = <ScrollArea title="Project activity" description="Recent updates" actions={<Button>Refresh</Button>} height={300}><Rows /></ScrollArea>;
const customScrollHeaderContract = <ScrollArea label="All activity" header={<strong>All activity</strong>} maxHeight="50vh"><Rows /></ScrollArea>;

import {AppHeader as HeaderSizingExample,Icon as HeaderIdentityIcon} from '@arlab/ui';
export const matchingHeaderActions = <HeaderSizingExample context="Projects" pageActionsEqualWidth
  pageActions={<><Button>Export</Button><Button variant="primary">Add project</Button></>} />;
// @ts-expect-error Equal-width page action grouping is a boolean option.
const invalidHeaderSizing = <HeaderSizingExample context="Projects" pageActionsEqualWidth="yes" />;
export const namedApplicationHeader = <HeaderSizingExample appName="Agents Studio" appIcon={<HeaderIdentityIcon name="Workflow" size={14}/>} context="Agents" />;
export const countedCheckbox = <Checkbox label="Running" trailing={<span>24</span>} hint="Only active projects" />;

import {EditorLayout as ContractEditorLayout, CollectionGroup as ContractCollectionGroup} from '@arlab/ui';
const editorLayoutContract=<ContractEditorLayout title="Campaign" viewport="tablet" onViewportChange={viewport=>{const selected:'desktop'|'tablet'|'mobile'=viewport;void selected;}} propertiesLabel="Page settings" footer={<Button>Save</Button>} sidebar={<Input/>}><div>Preview</div></ContractEditorLayout>;
const collectionGroupContract=<ContractCollectionGroup title="Creative" items={[{id:'one',label:'Read only',description:'Reference'},{id:'two',label:'Open',onOpen:()=>{}}]}/>;
