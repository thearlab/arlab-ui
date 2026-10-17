# Persistent collection and filter rail

`CollectionWorkspace` now accepts optional `collectionMode="condense"`. Default `"navigator"` retains the original independent compact navigator behavior.

In condense mode the same mounted `collection` element stays visible beside a selected `detail`; no `navigator` is required. The collection pane gains `data-condensed` when selected. Shared CSS narrows its table to the first column while retaining its header, footer, scroll instance and local state. Other cells/column definitions are hidden, including their focusable children. Virtual spacer rows retain their first cell. Hosts should put record identity in column one and keep compact header/footer actions suitable for a narrow pane. Do not supply a second table or reconstruct it under a different React key on selection.

`sidebar={({mobile, close}) => <Filters ... />}` adds one persistent desktop right rail outside the collection/detail stage, so selection does not remount desktop filter state. `sidebarLabel` defaults to `Filters`. On phone the desktop rail is hidden and a workspace-level Filters trigger opens a shared native modal sheet. Call `close()` from mobile filter content when appropriate. The trigger is outside the left collection pane. Supply controlled filter values because mobile content is a separate rendered instance, as in CollectionLayout.

`layout="focus"` hides the selected left collection; `layout="stacked"` places it above detail on desktop. Phone always hides the condensed left collection while a record is selected. The host supplies its existing collection breadcrumb or navigation action to clear selection. Detail entry uses a short fade and disables animation for reduced motion.

The shared table remains responsible for selected-row indication and reveal. Filters, route identity, selected record and unsaved-change policies remain app-owned. No package export change is needed: these are additions to CollectionWorkspaceProps.

Validation: TypeScript passed. An isolated Vite/happy-dom source fixture verified identical collection/input DOM nodes and values across browse, selected, focus and back states; desktop facet DOM/state persistence; one collection mount; phone filter dialog dismissal/focus restoration; and default navigator compatibility. Browser review covered actual column condensation, constrained viewport geometry and selected virtual-row reveal in Studio. Public component tests cover the retained table instance, filter state, scroll position, compact controls and recovery after a load error.

## Compact table controls

Progressive `RecordCollection` and `InfiniteTable` accept `condensedHeaderActions` and `condensedFooterActions`. A narrow list shows its title and one count pill, compact header tools (for example an icon refresh), and only essential footer actions. Full table search, tabs, progress copy and Load more stay hidden in the narrow list; automatic progressive loading continues. Remote errors retain their visible Retry action. Paginated tables retain their original pagination behavior. `selectedId` (RecordCollection) or `selectedRowKey` (tables) marks the active row. InfiniteTable reveals selected rows outside the initial local chunk without mounting every preceding record.
