// Layout primitives (ARLAB UI 1.0): the grammar of an application screen.
export { SplitView, ListPane, DetailPane, ListGroup, ListItem, ListSkeleton, ListEmpty } from './SplitView';
export type { ListPaneProps, ListGroupProps, ListItemProps } from './SplitView';
export { DetailHeader, DetailBody, PropertyRow, TabStrip, Columns, Stack } from './DetailHeader';
export type { DetailHeaderProps, Prop, TabDef, TabStripProps, ColumnsProps } from './DetailHeader';
export { Panel, PanelBody, Rows, RowItem, Facts, EmptyNote, Timeline, StepList } from './Panel';
export type { PanelProps, RowItemProps, FactsProps, TimelineItem, TimelineState, StepListItem, StepMarker } from './Panel';
export { Dashboard, AttentionItem, ActivityItem } from './Dashboard';
export type { DashboardProps, AttentionItemProps } from './Dashboard';
export { ReadPage, Gate } from './ReadPage';
export type { ReadPageProps, GateProps } from './ReadPage';
export { CopyBlock, ReadableDoc } from './Readable';
export type { CopyBlockProps } from './Readable';
