import { CollectionCard, Skeleton, ColumnChart, Sparkline, FilterableTable, InfiniteTable, Button } from '@arlab/ui';
import type { FilterColumn } from '@arlab/ui';
const rows = [{id:'a', name:'A', department:'Creative', spend:4}];
const columns: FilterColumn<(typeof rows)[number]>[] = [
  {key:'name', label:'Name'},
  {key:'spend', label:'Spend', hideOnPhone:true, render:row => row.spend},
];
export const specimens = <>
  <CollectionCard title="Project" media={<img alt="" src="/cover.png" />} footer={<Button>Open settings</Button>} onClick={() => {}} />
  <Skeleton inline width="6ch" height="1em" label="Loading spend" />
  <ColumnChart data={[{label:'Mon',value:4}]} secondaryData={[{label:'Mon',value:3}]} primaryLabel="Actual" secondaryLabel="Budget" />
  <Sparkline data={[{label:'Mon',value:4}]} secondaryData={[{label:'Mon',value:3}]} />
  <FilterableTable columns={columns} rows={rows} rowKey="id" />
  <InfiniteTable columns={columns} rows={rows} rowKey="id" groupBy="department" renderGroup={({label,count}) => <span>{label} {count}</span>} />
  <InfiniteTable columns={columns} rows={rows} rowKey="id" groupBy={row => row.department} mode="remote" sort={null} onSortChange={() => {}} hasMore={false} loadingMore={false} onLoadMore={async signal => {signal.throwIfAborted();}} />
</>;
// @ts-expect-error Responsive hiding must use a boolean.
const invalidColumn: FilterColumn<(typeof rows)[number]> = {key:'name',label:'Name',hideOnPhone:'yes'};
// @ts-expect-error Group callback must read the actual record shape.
const invalidGroup = <InfiniteTable columns={columns} rows={rows} rowKey="id" groupBy={row => row.missing} />;
void invalidColumn; void invalidGroup;
