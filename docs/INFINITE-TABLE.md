# InfiniteTable

`InfiniteTable` is a bounded, fixed-row-height table for a host-filtered collection. It uses the same `FilterColumn<Row>` and `SharedTableHead` as `FilterableTable`, and the shared `ScrollArea`. It has no network client or built-in filter controls. Pair it with FilterSidebar/FacetList and pass the filtered rows/query identity from the host.

## Common props

| Prop | Contract |
| --- | --- |
| `columns` | `FilterColumn<Row>[]`: key/label/header/width/align/sortable/sortValue/value/render, identical to FilterableTable. |
| `rows` | Host-owned records with stable unique keys. Local: complete filtered result. Remote: accumulated pages in server order. |
| `rowKey` | Record key property or `(row) => string \| number`. |
| `variant` | Shared frame style: `contained` (default) or `flush`. |
| `title`, `headerActions` | Accessible table title (default Records) and shared controls in its header. |
| `rowHeight` | Fixed pixel height, default 64, minimum 44. Custom cell content must fit within two lines and `rowHeight - 16` pixels. Overflow is clipped to preserve correct virtualization. Use a larger fixed height for richer cells. |
| `overscan` | Extra rows above/below the viewport; default 6. |
| `chunkSize` | Local incremental disclosure count, default 50. Does not choose the host's server page size. |
| `height` | Bounded ScrollArea height, default 480. Numeric pixels or CSS height. A percentage requires a constrained parent. |
| `filterKey` | String/number query identity. Change it when host filters change. Keep it stable during remote append. |
| `loading`, `emptyMessage` | Initial/query loading and genuinely empty filtered result. |

## Local mode

Omit `mode`, or use `mode="local"`. Pass the **entire filtered collection**, optionally `initialSort` (`{key,direction:'ascending'|'descending'}`). Shared `sortTableRows` applies natural ordering with empty values last. Sorting runs on that entire collection, then incremental disclosure and virtualization are applied. The table never sorts only the currently exposed chunk.

```tsx
<InfiniteTable
  title="Agents"
  columns={columns}
  rows={filteredAgents}
  rowKey="skillId"
  filterKey={`${search}:${intelligence}`}
  initialSort={{ key: 'name', direction: 'ascending' }}
/>
```

Changing local `rows` identity, sort, filter key, row height or chunk size resets scroll/disclosure. Memoize filtered rows so unrelated parent renders do not reset position. All local records are already in memory; this is rendering virtualization, not server pagination.

## Remote mode

`mode="remote"` requires:

- `sort: TableSort | null` and `onSortChange(nextSort)`.
- `hasMore: boolean` and `loadingMore: boolean`.
- `onLoadMore(signal: AbortSignal): Promise<void>`.
- Optional `error` message and `totalCount` (filtered count excluding header).

The component **never locally sorts remote rows**. When sort/filter changes, the host must clear/replace the old rows, reset its cursor, and manage initial loading. Include non-sort query dimensions in `filterKey`; controlled sort is already part of internal request identity.

`onLoadMore` must append the next page to the matching host query before resolving and reject on failure. Forward the signal to fetch and check it before changing host state. The component aborts on query changes/unmount and ignores stale promise completions for its own state; it cannot prevent an external callback from writing stale host data if the callback ignores cancellation.

A synchronous ref lock prevents duplicate in-flight calls. Failed requests require Retry. An automatically requested page that resolves without increasing row count is not retried automatically; the visible Load more button permits an explicit retry. This prevents hot loops from exhausted or empty server pages. Keep `hasMore` accurate.

```tsx
<InfiniteTable
  mode="remote"
  title="Runs"
  columns={columns}
  rows={accumulatedRuns}
  rowKey="id"
  sort={sort}
  onSortChange={setSort}
  filterKey={queryKey}
  hasMore={hasMore}
  loading={initialLoading}
  loadingMore={loadingMore}
  error={loadError}
  totalCount={total}
  onLoadMore={loadNextPage}
/>
```

## Accessibility and rendering

- Semantic table headers use shared ascending/descending buttons and `aria-sort`.
- Table `aria-rowcount` includes the header; unknown server totals are `-1`.
- Virtual data rows expose their full-result `aria-rowindex`; spacer rows are hidden from assistive technology.
- Only a visible window plus overscan is mounted. Custom cells should use concise content and provide an explicit detail action if more content is needed.
- The actual ScrollArea viewport receives passive scroll handling throttled with requestAnimationFrame; ResizeObserver updates viewport/header measurements.
- Header stays sticky inside the same scrolling table. Horizontal overflow uses the shared scrollbar.
- Footer announces loading/errors and offers an explicit Load more/Retry action.
- Virtualization means offscreen cells are not in the DOM or the browser's find-in-page results. Use host search/filtering or a nonvirtual export for complete inspection.

## Validation before release

TypeScript passes. Pure window calculations checked at top/middle/end with 10,000 rows, and the component's full-array local sorting / unchanged remote ordering checked through a source execution harness. A lightweight source-execution hook harness also passed duplicate-inflight, failure/retry, query abort, stale completion, unmount cancellation and local near-bottom bounded-render checks. This harness is not a browser or React integration test. Parent integration must verify the following in the actual showcase:

1. Default local table exposes 50 records but mounts only viewport + overscan.
2. Near bottom increases disclosure by 50 without jumping the viewport.
3. Global descending local sort can bring record 10,000 into the first viewport.
4. Remote header click calls onSortChange and never sorts the supplied chunk.
5. Repeated near-bottom events while pending call onLoadMore once.
6. Rejected page produces Retry; automatic scroll does not resubmit it.
7. Query replacement aborts the previous signal; stale completion does not clear a newer loading/error state.
8. Unmount removes listeners/observers, cancels RAF and aborts the request.
9. Phone and dark mode retain sticky headings, shared scrollbars and readable clipped custom cells.
