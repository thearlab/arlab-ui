# Changelog

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
