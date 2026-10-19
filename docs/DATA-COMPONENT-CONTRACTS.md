# Data component additions after the full v1 audit

These additions are opt-in. Existing component defaults, foundation tokens and layouts remain unchanged.

## Responsive table columns

`FilterColumn.hideOnPhone?: boolean` is shared by `FilterableTable` and `InfiniteTable`.
When true, both header and body cells are hidden at 600px and below, including from the accessibility tree. Data and sorting stay available on larger screens. Keep at least the record's name visible. Hidden data can be shown in the record detail view.

```tsx
const columns = [
  {key: 'name', label: 'Name'},
  {key: 'department', label: 'Department', hideOnPhone: true},
];
```

## InfiniteTable groups

`groupBy?: keyof Row | ((row: Row) => string | number | null | undefined)` inserts a heading before each contiguous run of matching values. Null and undefined are labelled `Ungrouped`. Grouping never reorders data. Sort or group the source records on the host when each group should occur only once. Remote mode keeps the server's ordering, including across page boundaries.

`renderGroup?: ({label: string, count: number}) => ReactNode` customizes the heading. Its count is the number of records currently loaded in that contiguous group. It may increase when a remote page or local chunk is appended. It is not an inferred server total.

Group headings use the same fixed `rowHeight` as records, retaining bounded DOM rendering, correct spacer heights and selection reveal. Keep custom headings within that height. Header count pills continue to count records, not group headings. Accessible row indexes include headings. A grouped remote table reports an unknown accessible total until its final page is loaded, because future group counts are unknown.

```tsx
<InfiniteTable columns={columns} rows={rows} rowKey="id"
  groupBy="department"
  renderGroup={({label, count}) => <span>{label} · {count}</span>}
/>
```

## CollectionCard media and footer

`media?: ReactNode` replaces the decorative folder with a 16:9 media surface. Supply meaningful image alt text when needed. The media slot is part of the primary card action, so do not put interactive controls inside media.

`footer?: ReactNode` supplies secondary content or actions. When provided, the card renders as an article, with the primary button and footer as siblings. This allows real footer buttons or links without invalid nested controls. If `onClick` is omitted, the article's main content is a noninteractive div. Without a footer slot, the existing single-button card and meta footer are retained.

```tsx
<CollectionCard title="Campaign" media={<img src="/cover.webp" alt="Campaign preview" />}
  onClick={openProject} footer={<Button onClick={openSettings}>Settings</Button>} />
```

## Two-series charts

`ColumnChart` and `Sparkline` accept `secondaryData?: {label: string; value: number}[]`, `primaryLabel?: string` and `secondaryLabel?: string`.

`ColumnChart` also accepts `labelInterval?: number` (default 1). Use `labelInterval={7}` for weekly category/value ticks across thirty daily bars: labels appear at indices 0, 7, 14, 21 and 28. The interval is floored, bounded to at least one, and non-finite values fall back to one. Every datum remains focusable with its complete category and exact values, including comparison values. Hover/focus reveals the same complete values; the native title and accessible data table remain available. Sparse ticks reduce text density without dropping records or changing bar heights. Use `color` to choose a quieter series hue and `highlight` for the selected datum.

Comparison values match the primary categories by `label`, regardless of input order. Extra secondary categories are ignored. Missing categories are shown as “Not available” in the table and accessible description. A sparkline leaves a gap instead of connecting through missing values. The charts share a scale across both series; columns display paired bars and the sparkline uses a dashed second line. A legend and the existing accessible data-table alternative expose both series. The single-series appearance stays unchanged.

```tsx
<Sparkline data={actual} secondaryData={budget}
  primaryLabel="Actual" secondaryLabel="Budget" />
```

## Inline Skeleton

`Skeleton inline` renders a span suitable for a text line or table cell, rather than row blocks. `width` and `height` accept standard CSS values, defaulting to `8ch` and `1em`. `label` names the loading status. Existing block skeletons retain their rows API.

```tsx
<span>Spend: <Skeleton inline width="6ch" label="Loading spend" /></span>
```

## Verification

After TypeScript emission, run `node --test scripts/data-contracts.test.mjs`. The suite checks shared responsive markers, contiguous server order and append behavior, a 10,000-record virtualized collection, remote accessible totals, valid card action nesting, inline loading semantics and category-aligned comparisons. Public TypeScript examples are in `scripts/type-tests/data-contracts.tsx`.
