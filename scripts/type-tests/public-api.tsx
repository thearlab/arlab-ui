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
  Inspector, DataTable, ProjectStatusSheet, Gate, NavTree, AppSwitcher,
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
