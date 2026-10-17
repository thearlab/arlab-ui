# Table workspaces

Use `InfiniteTable` for one continuous, bounded result surface. It shares its header anatomy and column definitions with `FilterableTable`; pagination remains available for consumers that explicitly need it.

```tsx
<CollectionLayout title="Agents" showTitle={false} variant="flush" sidebar={({mobile}) => <FilterSidebar showHeader={!mobile} {...filters} />}>
 {({filterTrigger}) => <InfiniteTable
  title="Agents" variant="flush" fill rows={rows} rowKey="id" columns={columns}
  search={<SearchField label="Search agents" value={query} onChange={onQueryChange} />}
  headerActions={filterTrigger}
  footerActions={<ActionGroup><Button onClick={manageGroups}>Manage groups</Button><Button variant="primary" onClick={createAgent}>Create an agent</Button></ActionGroup>}
  filterKey={queryIdentity} onRowClick={openRecord} rowLabel={row => `Open ${row.name}`}
 />}
</CollectionLayout>
```

The layout needs a bounded parent with `min-height: 0`. `fill` uses its available height; omit it and use `height` for an embedded specimen. `header` can hold tabs or custom identity content; `headerActions` holds filter/view controls. The title remains the accessible table name even when the header contains tabs. Search belongs in `search`, and collection creation/management belongs in `footerActions`. Do not repeat totals in a page heading or filter footer: the table displays one numeric pill. Status text communicates loading, failure or completion without repeating the total.

Local mode sorts the complete filtered array, exposes rows in chunks and virtualizes the visible window. It does not imply that the backend is paginated. Remote mode delegates sorting, hasMore, totalCount and append requests to the host; requests are abortable and failures expose Retry. Keep rows at the declared fixed rowHeight (default 64px), with custom cells fitting two lines. Provide a stable filterKey that changes for search/filter changes but excludes selected record IDs and detail tabs; this preserves scroll when a mounted collection opens beside a record. Without filterKey, a new local rows array remains a reset boundary for compatibility.

`RecordCollection progressive` composes this pattern with standard record columns. Its search, headerActions, footerActions and filterKey slots behave identically. It uses one horizontal/vertical scroll surface on phones, while filters open as a native modal sheet. Default RecordCollection and FilterableTable pagination remains supported.

## Typography

All table variants use the same semantic aliases: `--text-table` → `--text-sm` (13px body and identity links), `--text-table-meta` → `--text-xs` (12px supporting text and dates), and `--text-table-heading` → `--text-xs` (12px column labels). Status/count pills use the existing `--text-2xs` (11px) token. Identity links and strong values use `--weight-medium`; ordinary values use `--weight-regular`. RecordCollection has no separate font-size override. Change the shared tokens to retune the system, rather than adding page CSS or inline font sizes. The build checks table typography declarations for hardcoded font sizes.

Table entry links have no underline, including on hover. Whole-row hover, the link colour change, and the existing keyboard focus treatment communicate navigation; ordinary TextLink components outside tables keep their own styling.
