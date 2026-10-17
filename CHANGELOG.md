# Changelog

## 2.0.0-beta.24

- Promote the approved subtle pink background treatment from the showcase into shared light/dark foundation tokens, including page, navigation, top bars, containers and controls. Preserve typography, geometry, primary colours and semantic states.
- Add PageFrame, ReadingLayout, DocumentContent, DocumentOutline, Inline, ContentInset, Table, FileDropzone and DropRegion for application-owned knowledge and editing workflows.
- Keep compact collection rows edge-to-edge when a consuming application composes its own table.
- Existing tags remain immutable. Consumers must explicitly upgrade to beta.24.

## 2.0.0-beta.23

- Fix condensed collection tables during virtual scrolling. Render one actual column, including one-column spacer/group/empty rows, instead of hiding the other columns while retaining their spans. Agent names and row dividers now fill the compact list pane.
- Preserve the mounted collection, selection, sort state and scroll position when entering or leaving record details. Apply the same column contract to InfiniteTable and FilterableTable.
- Validate with 90 regression tests and the exact Studio agents detail route, including scrolling through the compact list. No foundation or public API changes.

## 2.0.0-beta.22

- Polish shared data components: borderless compact Chip, plain-date Timestamp with opt-in chip/time, quieter calendar dates and one-colour chart defaults with explicit category/highlight options.
- Quiet table controls, share whole-row DataTable activation and show InfiniteTable recovery actions only after failed or stalled loads. Preserve full-width row dividers and sticky headers while scrolling.
- Restore distinct dark semantic hues and tinted surfaces; error notices and destructive actions retain red. Add a separate Planning tone.
- Align single and double navigation styling, footer action geometry and fixed bottom collapse controls. Remove the light toggle inset highlight and replace the logout glyph with the shared outline DoorOpen icon.
- Add inline DeadlineCountdown and block SegmentedControl options; bring Facts labels closer to values, place required markers beside labels and align record-header status placement.
- Reduce nested disclosure/upload chrome, use an Info icon for information notices, quiet kanban editing furniture and demonstrate contextual empty states and media/footer collection cards.
- Keep loading previews full-size inside bounded containers and reduce TimePicker to equal 56px controls with 12px shared field typography.
- Keep the pink-only background experiment isolated to the local showcase proposal. No new shared canvas gradient is introduced.
- Validate the library with 88 regression tests, public type checks and the complete CSS/component build. Previous immutable tags remain unchanged.

## 2.0.0-beta.21

- Apply Satin Lift across shared components: Satoshi 400/500 interface and 600 headings, DM Mono code, 14px surfaces, 7px controls, neutral charcoal dark mode, satin rims and soft elevation. Satoshi loads from the official Fontshare service; consuming applications must allow its stylesheet and font hosts.
- Unify all brand roles, icons, focus, navigation selection and primary hover on main ARLAB pink (#E414DB light, #F04EE8 dark). Keep the former accent-deep token as an alias, without a separate darker pink.
- Unify checkbox/helper alignment, filter counts, table sorting controls, full-width row hover, action sizing, compact chips, date-only timestamps and metric alignment. FacetList uses neutral borderless hover with soft pink selection.
- Share the full spaces SidebarShell: only the outer rail folds; tools and account remain fixed. Expanded and collapsed states use the real ARLAB marks. AccountMenu now renders informational identity and a separate Log out action; former menu items are not rendered. onLogout is preferred and onSelect('Log out') remains a fallback.
- Rebuild EditorLayout, CodeDisplay, CollectionGroup and StateView with shared components. Dialog, Sheet and ConfirmDialog omit the footer separator.
- Add framed ScrollArea headers and optional hideScrollbar. Kanban hides its scrollbar controls while preserving native scrolling. Calendar dates are square and DayTimeline empty content has consistent padding.
- PageLoading defaults to centered content-preview loading with gently animated placeholders and no central spinner. Refreshing centers the shared circular loader over existing content, without visible badge text. Reduced motion is respected.
- Complete dashboard contracts, public optional types and curated icon coverage. Add a CSS build guard for selectorless rules before theme scoping.
- Exact bright-pink text, white button labels and some vivid department glyphs include documented contrast exceptions; the color report lists them explicitly.

## 2.0.0-beta.20

- Compact TagInput chips use dedicated 24px remove actions, 28px tags and shared field typography without enlarging the public Button/IconButton contract. Long labels wrap safely and retain a full-name tooltip.
- TimePicker uses two equal 64px hour/minute dropdowns instead of inheriting the generic 150px minimum. Time values, disabled bounds and keyboard behavior are preserved.
- Dropdown marks selection with its semantic selected background and aria-selected, without an extra checkmark.
- Existing Contour foundation tokens remain unchanged; local Platinum and typography previews are not deployed.

## 2.0.0-beta.19

- Fix optional public prop declarations and add a strict consumer type check.
- Add six requested application icons and twelve social/platform icons, all using the existing Lucide style.
- Standardize Button/IconButton sizing and add ActionGroup equalWidth.
- Complete condensed-table chrome and optional count visibility while preserving pager totals.
- Add danger-quiet, preserve record names beside phone search, and remove the inherited grey Facts surface inside Disclosure.
- Keep the current Contour palette and fonts; Platinum proposals are development-only.

## 2.0.0-beta.18

- DetailSections wide now explicitly fills its parent, including when nested inside a flex Stack. It no longer shrinks into a centered content-width column.
- RecordBody supports un-tabbed records as labelled regions. Existing labelledBy usage keeps the tabpanel contract, scroll resets and fixed footer.
- Hidden-title RecordHeaders no longer force their tools onto a second row in compact containers when the status/actions fit together.
- The real ARLAB mark is standalone: its compact sidebar link has no square border or background; the existing hit area and keyboard focus remain.

## 2.0.0-beta.17

- Completed dashboard requests 6–12: bounded paginated fill, scoped header typography, countLabel/formatCount and responsive searchWidth across table variants, consistent quiet toolbar buttons, tab-free RecordHeader and aligned condensed headings. Existing tabbed records and default numeric counts remain compatible.
- Shared controls, tokens, virtual row behavior and immutable earlier tags are preserved.

## 2.0.0-beta.16

- Added optional CommandPalette groups, quiet status/count PillButton filters, counted/disabled TabStrip options and AppHeader pageActions. Existing plain options and default button APIs remain supported.
- Restored the shared solid-color spaces rail: 28px department tiles, white icons, accent selection square, ink app tiles and group dividers, without the left indicator. Dedicated solid tokens preserve contrast without changing softer chart tones.
- RecordBody accepts footer content or a footerRef outside its content scroll. Save and Publish controls can remain fixed to the selected record pane, with empty footer targets hidden.

- Reset body-sized h2/h3, RecordSection and Panel heading tracking to normal. Small interface titles no longer inherit display-heading compression; component font sizes and weights remain unchanged.
- CopyBlock accepts an optional application-owned copy callback and error callback. Failed copying now displays useful recovery text, allowing applications to reuse the shared code block without losing their clipboard fallback.

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
