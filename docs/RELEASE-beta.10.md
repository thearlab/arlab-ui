# Contour V2 beta.10

## 2.0.0-beta.10

- Clickable Row places its navigation arrow after the trailing value, retaining independent trailing controls.
- FilterableTable adds optional click/Enter/Space row activation, accessible row labels, content-driven auto layout, min/max column widths and all/active/none sort indicators. Per-column sortable:false remains supported. Existing fixed layout and indicator defaults are retained.
- CollectionLayout accepts an optional tabs slot above the search toolbar; search is optional.
- Added --dept-strategy for both themes, DeptTile and department list marks.
- ConfirmDialog no longer injects archive-project copy when description is omitted. Optional description is linked accessibly; pending disables confirmation and dismissal.
- Modal, Dialog, Sheet and ConfirmDialog support an optional small label above the title.
- Breadcrumbs supports string items and rich-label objects with id, href, title and onClick. Real links preserve modified-click navigation.
- AppHeader works with no search, the existing search-action object, or custom React search content.
- 55 interaction checks and 50 theme contrast pairs pass. No changes to previous immutable releases.

Table integration:

```tsx
<FilterableTable
  title="Projects"
  columns={[
    { key: 'name', label: 'Project', minWidth: 180 },
    { key: 'amount', label: 'Budget', width: '20%', align: 'right' },
    { key: 'actions', label: 'Actions', sortable: false, render: row => <RecordActions record={row}/> },
  ]}
  rows={records}
  rowKey="id"
  tableLayout="auto"
  sortIndicators="active"
  onRowClick={row => openRecord(row.id)}
  rowLabel={row => `Open ${row.name}`}
  variant="flush"
/>
```

Column widths accept CSS sizes and percentages. In auto layout, the browser balances content and width constraints; long tables scroll within the shared ScrollArea. Use fixed layout for exact predictable column allocation. Nested interactive cells retain their own actions and do not activate the row. For modifier-click/new-tab navigation, retain a real link in the identity cell.

```tsx
<CollectionLayout title="Projects" tabs={<ProjectTabs/>} search={<ProjectSearch/>}>
  <ProjectTable/>
</CollectionLayout>
<AppHeader context={<Breadcrumbs items={[
  {id: 'projects', label: <ProjectLabel/>, href: '/projects'},
  {label: <RecordLabel/>, title: 'Complete record name'},
]}/> } actions={<AccountActions/>}/>
<ConfirmDialog open={open} onClose={close} onConfirm={remove}
  label="Access management" title="Remove access?" confirmLabel="Remove access"
  description="This person will lose access to the application." pending={saving}/>
```

Search is not required in AppHeader. Application-specific labels, descriptions, callbacks and routing remain application-owned. No backend or schema changes. Studio deployment remains a separate review step. Roll back by pinning beta.9 and rebuilding; never move a published tag.
