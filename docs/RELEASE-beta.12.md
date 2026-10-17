# Contour V2 beta.12

## 2.0.0-beta.12

- Added CollectionWorkspace: a full collection becomes a compact navigator beside the selected record. Split, focus and stacked layouts are application-controlled; phones show the detail with app-owned Back navigation.
- Added RecordNavigator with quiet selection, full-name tooltips, real links, keyboard focus movement and shared scrolling. Selected records are revealed after async loading and when the navigator becomes visible again.
- Added borderless RecordSection and wrapping ActionGroup for dashboard details and forms. DetailSections adds editor and wide arrangements; columns and forms adapt to record-container width.
- RecordHeader accepts optional description/contextActions; Stack retains native div attributes.
- RecordCollection opens from the whole row. Paginated and virtualized tables share click/Enter/Space activation and skip nested controls, links and labels.
- MediaGallery adds controlled ordering and semantic captions, preserving first-image workflows without local thumbnail CSS.
- Catalogue: 129 entries and 146 icons. Existing tags and API defaults remain available.

```tsx
<CollectionWorkspace
  layout={focusRecord ? 'focus' : 'split'}
  collection={<CollectionLayout title="Agents" search={<Search/>}><RecordCollection records={records} onOpen={open}/></CollectionLayout>}
  navigator={<RecordNavigator title="Agents" records={records} selectedId={selectedId} onOpen={open} search={<Search/>}/>}
  detail={selectedId ? <RecordLayout><RecordHeader {...headerProps}/><RecordBody {...bodyProps}><DetailSections layout="editor"><RecordSection title="Instructions"><Editor/></RecordSection><RecordSection title="Reference"><Reference/></RecordSection></DetailSections></RecordBody></RecordLayout> : undefined}
/>
```

The application owns route/selection, tabs, filters, data loading and dirty/pending guards. Omit detail to show the full collection. The collection remains mounted while a record is selected, preserving its table sorting and pagination. Each visible pane owns one shared scroll surface. On phone the navigator is hidden and the record's Back action restores the collection. Choose stacked for a short list above a detail and focus for a full-width record. RecordSection avoids nested cards; ActionGroup supplies responsive control grouping.

For a popup-backed table, pass onRowClick and rowLabel. Keep a real link in the identity cell when modifier-click/new-tab behavior is useful. Row activation ignores nested links, buttons, labels, editable content and custom interactive controls. The shared behavior applies to FilterableTable and InfiniteTable; RecordCollection enables it by default.

MediaGallery onReorder emits a reordered copy without mutating supplied items. caption(item,index) supplies application-specific semantics such as the first image being edited. Disabled controls and upload states prevent ordering changes while work is pending.

Verification: package/showcase builds, 64 interaction checks and 50 theme contrast pairs; Studio typecheck/build and isolated Admin, Registry and detail fixtures with no live writes. Browser review covers all seven tabs for both record kinds in light, dark and phone, selected-list behavior, focus mode and narrow desktop proportions. No backend or schema changes. Studio production deployment remains separate. Roll back by pinning beta.11 and rebuilding; never move an immutable tag.
