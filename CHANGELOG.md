# Changelog

## 2.0.0-beta.15

- CollectionWorkspace adds optional `collectionMode="condense"`: the same table narrows to its identity column beside the selected detail, retaining sort, filters, scroll and mounted state. Its persistent right filter rail remains available in browse and detail; phones use the shared filter sheet. Existing separate-navigator behavior remains the default.
- InfiniteTable and progressive RecordCollection add compact header/footer action slots. The narrowed list shows one count pill, essential icon tools and creation controls, while full-table tabs, search and progress copy stay out of the compact list. Remote load errors preserve explicit retry. Selected rows receive a soft active state; virtual selection reveals the required window without rendering preceding rows.
- RecordHeader separates the status/action band from record tabs, groups context tools, uses a compact information button and adapts actions to narrow detail containers.
- Calendar gains a quiet month grid, compact date controls, optional event times and tone/token markers, overflow disclosure and a full day agenda. Narrow containers and phones show event counts and readable agenda content. Controlled dates, rolling periods, keyboard navigation and bounds remain supported; events are application-owned.
- Kanban columns allow horizontal scroll chaining over cards. Height/fill sizing keeps the horizontal scrollbar within available layout space; below-fold boards retain their document footprint. Shift-wheel supports horizontal movement without intercepting native horizontal deltas.
- Existing immutable V2 tags and legacy entry points remain unchanged. Validation includes package/showcase builds, public interaction regressions and theme contrast checks; see the beta.15 release notes.

## 2.0.0-beta.14

- Added V2 CommandPalette composed from the shared SearchField, native Modal, ScrollArea, Pill and Kbd. Caller-owned items/routing preserve application permissions and edit guards; arrow navigation, Enter activation, Escape and trigger-focus restoration remain available. Result DOM is bounded and matched totals are announced.
- AppHeader wraps custom search content in a responsive shared slot, so pages can use one contextual SearchField above their table and compact record list.
- SearchField forwards native input attributes, keyboard handlers and inputRef to its existing Input primitive. Clearing returns focus to the same field. Studio can drop its legacy search popup without local visual CSS.
- Verified 130 component contracts, 146 icons, 69 shared interaction checks, isolated real-Shell search checks, typed consumer builds and actual phone focus/layout.

## 2.0.0-beta.13

- Table body, identity links, metadata, dates, column labels and pills share one token-based typography contract across all pages and variants. The build rejects hardcoded table font sizes.
- Shared table headers place search beside one numeric count pill. InfiniteTable adds bounded fill and fixed footerActions; RecordCollection opts into progressive virtual rows without page controls. Explicit filterKey retains scroll across host renders and resets only when the query changes.
- CollectionLayout accepts function children with a phone filterTrigger. Empty hidden headings and toolbars no longer consume space. PageBar/CollectionLayout/RecordHeader support showTitle; RecordHeader supports showBack for breadcrumb-led workspaces. Existing defaults remain available.
- SidebarShell adds optional department spaces, controlled selection, keyboard navigation, tooltips/counts, a persisted foldable tools panel, separate native phone drawers and fixed account/help controls. Fold controls live in bottom footers. The complete canonical ARLAB logo sits inside a square brand area.
- Exported ArlabMark (full/compact) from both V2 entries; folded single navigation retains the real brand. PageLoading accepts a custom mark and workspace name. DeptTile supports compact icon tiles and custom colours.
- Verified 68 public component interaction checks, 5 isolated spaces-shell checks, 50 theme contrast pairs, scoped stylesheet/build checks and browser light/dark/phone layouts.

## 2.0.0-beta.12

- Added CollectionWorkspace: a full collection becomes a compact navigator beside the selected record. Split, focus and stacked layouts are application-controlled; phones show the detail with app-owned Back navigation.
- Added RecordNavigator with quiet selection, full-name tooltips, real links, keyboard focus movement and shared scrolling. Selected records are revealed after async loading and when the navigator becomes visible again.
- Added borderless RecordSection and wrapping ActionGroup for dashboard details and forms. DetailSections adds editor and wide arrangements; columns and forms adapt to record-container width.
- RecordHeader accepts optional description/contextActions; Stack retains native div attributes.
- RecordCollection opens from the whole row. Paginated and virtualized tables share click/Enter/Space activation and skip nested controls, links and labels.
- MediaGallery adds controlled ordering and semantic captions, preserving first-image workflows without local thumbnail CSS.
- Catalogue: 129 entries and 146 icons. Existing tags and API defaults remain available.

## 2.0.0-beta.11

- CollectionLayout accepts pills beside its title and an updated metadata slot alongside its description. Rich description content is supported.
- Heading and tabs now span the full collection width. The single 1px tab separator extends above the desktop filter sidebar; results and filters begin below it.
- Title pills, actions and update metadata wrap on phones without page overflow. Existing simple title/description calls remain supported.
- PageBar exposes updated and pillsPlacement. Its existing below-title pill placement remains the default outside CollectionLayout.
- Verified package/showcase builds, 57 interaction checks, 50 theme contrast pairs, and desktop/light/dark/phone geometry. Studio compatibility is checked separately.

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

## 2.0.0-beta.9

- Added AppHeader with a shrinking context slot, responsive search action and stable action alignment. Breadcrumbs supports one-line truncation with a full-title tooltip.
- Extended TagInput for externally labelled forms, disabled fields, native input attributes and batch commit on blur. Studio can use the shared tag field directly.
- Added shared scrollable dialog/sheet layout with fixed actions, configurable viewport-clamped width, descriptions and controlled dismissal. Native Escape now respects pending-state dismissal guards.
- Filter-sidebar selects fill their section width and result labels use singular/plural correctly.
- Catalogue: 125 entries, 146 icons; 49 interaction checks and 46 contrast pairs. Existing tags and APIs remain available.

## 2.0.0-beta.8

- Unified nested text/number fields through Input and Textarea, with 12px regular text, quiet 1px focus, cohesive dropdown options and a soft half-pixel search separator.
- Added grouped FacetList, accessible RankList, neutral StatNote and aligned StatNoteRow. Existing flat APIs remain available.
- Added InfiniteTable with bounded virtual rows, full-array local sorting, host-controlled remote sorting, cancellation and explicit retry.
- Replaced demo KanbanBoard with application-owned columns/cards, drag and keyboard moves, collapse, phone tabs and shared scroll areas.
- Added flush table and collection variants, responsive right-hand filter composition and application-owned AccountMenu actions.
- Replaced floating Record details disclosure with a labelled side sheet and shared scrolling.
- Catalogue: 124 entries, 146 icons. 46 interaction checks and 46 contrast pairs pass. Existing tags and legacy entry points remain unchanged.

## 2.0.0-beta.7

- Added full-width collection and focused record layouts with responsive phone lists, accessible tabs and shared scrolling.
- Added FormGrid/FormFieldGroup; isolated Facts rows and aligned Panel typography with Contour tokens.
- Added code/short Textarea variants without application CSS.
- Replaced Calendar demo data with controlled real-date periods, application events, five-week views, date limits and keyboard navigation.
- Added a plain-date, unboxed row variant to DailyVerdictStrip.
- Extended the catalogue to 119 entries; 39 interaction checks and 46 contrast pairs pass. Existing V1 and beta tags remain immutable.
