import { ColumnChart, DayTimeline, PageLoading, Facts, InfiniteTable, NavigationProgress, StateView, type FilterColumn } from '@arlab/ui';

const rows = [{id: 'one', title: 'A brief', meta: 'Brief attached'}];
const columns: FilterColumn<typeof rows[number]>[] = [
  {key: 'title', label: 'Title', lineClamp: false, render: row => <div><strong>{row.title}</strong><small>{row.meta}</small></div>},
  {key: 'meta', label: 'Metadata', lineClamp: 3},
];

export const contracts = <>
  <NavigationProgress active label="Opening projects" />
  <PageLoading />
  <PageLoading layout="container" />
  <PageLoading layout="viewport" />
  <PageLoading variant="signature" layout="viewport" />
  <DayTimeline />
  <DayTimeline daySize="compact" dayVariant="quiet" />
  <StateView state="loading" size="compact" variant="embedded" title="Loading projects" />
  <Facts layout="stacked" items={[["Email", "team@example.com"]]} />
  <ColumnChart data={[{label:'1 Oct',value:2}]} labelInterval={7} />
  <InfiniteTable rows={rows} rowKey="id" columns={columns} rowHeight={88} />
</>;

// @ts-expect-error Label intervals are numbers, not CSS density strings.
export const invalidInterval = <ColumnChart labelInterval="weekly" />;
// @ts-expect-error Only the documented fact layouts are supported.
export const invalidFacts = <Facts items={[]} layout="columns" />;
// @ts-expect-error Column line limits must be numeric or explicitly false.
export const invalidClamp: FilterColumn<typeof rows[number]> = {key:'title',label:'Title',lineClamp:'none'};

// @ts-expect-error Only the documented parent/viewport sizing modes are supported.
export const invalidLoadingLayout = <PageLoading layout="full" />;
// @ts-expect-error Day sizing accepts regular or compact.
export const invalidDaySize = <DayTimeline daySize="small" />;
