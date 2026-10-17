# FilterSidebar option rows

Multi-select groups use the shared Checkbox with a trailing metadata slot. The grid reserves 16px for the checkbox, lets the label use the remaining width, and keeps the count in a right-aligned max-content column. Counts use tabular figures and stay on one line, including zero. Long labels truncate with an ellipsis and expose their full text through a native tooltip and accessible checkbox name.

Checkbox hint remains supporting text across a separate full row. Counts are never passed as hints or placed inside the label copy. The same layout applies to every multi-select group, in both full and compact sidebars. Facet counts also remain on one line without shrinking their label to accommodate wrapped numbers.

Filter headers and the CollectionLayout Filters trigger use labels and counts without a decorative filter icon. Collapse, expansion and close controls retain their functional navigation icons. Search/select/facet filter contracts, controlled selections, reset behavior and phone-sheet composition are unchanged.

```tsx
<FilterSidebar filters={[{
  id: 'status', label: 'Status', type: 'multi',
  options: [{value: 'running', label: 'Running', count: 12}],
}]} value={filters} onChange={setFilters} />
```

For a standalone checkbox with metadata, use trailing. It is intended for non-interactive metadata; actual supporting copy belongs in hint.

```tsx
<Checkbox label="Running" trailing={<span>12</span>}
  hint="Only published records" checked={running} onChange={changeRunning} />
```
