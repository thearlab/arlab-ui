# ARLAB UI 2.0.0-beta.30

Pin `github:thearlab/arlab-ui#v2.0.0-beta.30`. Previous tags remain unchanged.

## Navigation and motion

- Department spaces and page navigation share three distinct states: transparent resting, neutral hover and pink-tinted active. Active styling persists while hovered, spans the complete entry and uses a stronger label without a left stripe. Department glyphs keep their colors. Both standalone and provider-based navigation use shared light/dark foundation tokens.
- The spaces rail has no divider above its collapse controls. Single navigation remains permanently expanded.
- GuidedTour fades out, changes position while hidden, then fades in. It no longer flies the spotlight across the page. Repeated navigation is guarded, closure cancels pending transitions, focus follows the current stop and reduced motion skips the exit delay.
- IconButton accepts `href` and `external` for real accessible links with the same sizing/chrome as button actions. Disabled links have no destination and cannot activate. Pressed icon buttons use the shared selected treatment.

## Fixed chrome and content scrolling

- Modal accepts optional `headerActions`, beside the native Close control and outside its content scroller. Dialog and Sheet forward the same Modal props. The slot preserves application-owned permission checks and actions.
- PageFrame accepts optional `tabs`, in a fixed full-width separator row immediately below the heading. The tab indicator meets that separator without a padding gap. Header/body/footer scroll ownership remains unchanged.
- KanbanBoard's horizontal gutters now belong to its moving track. Optional `bleed` extends the viewport through PageFrame's content inset while retaining initial card alignment. Custom parents can provide `--page-content-inset`. Existing `inset="flush"`, drag behavior and column scroll ownership remain available.
- DayTimeline accepts optional `itemsMaxHeight` and `itemsLabel` to scroll only schedule entries, leaving its heading and day selectors fixed. Day selectors retain horizontal breathing room, including compact selectors.
- InfiniteTable's loading body uses the shared circular Loader; its toolbar and columns remain mounted. TextAction keeps its natural width inside stacks and grids.
- AppHeader accommodates wrapping page controls without letting them extend beyond its available width.

## Retained integration fixes

- `NavigationProgress` is an accessible thin indeterminate strip.
- Compact/embedded StateView loading respects its size.
- InfiniteTable columns accept `lineClamp?: number | false` for composite cells while preserving fixed virtual row geometry.
- Facts accepts `layout="stacked"`; ColumnChart accepts `labelInterval`.
- Disabled primary buttons retain quiet chrome; Chip's leaf module removes the TagInput barrel cycle.
- PageLoading accepts `layout="container" | "viewport"`. Both retain the approved animated preview, centered copy, ARLAB logo and dots.
- DayTimeline compact day controls and intrinsic-width TabStrip labels remain available.

## Adoption and validation

These APIs are additive. Apps must pass their data, route selection and callbacks; publishing the package does not migrate or deploy consumers automatically. Use one shared stylesheet/provider; no copied navigation, tour or board CSS is needed.

Validation includes public declaration compilation, all library tests, CSS scoping/export checks and the internal dashboard build plus desktop fixture workflows. Mounted tests cover tour transitions, keyboard guarding, cancellation and reduced motion. CSS/DOM checks do not replace browser visual acceptance. Roll back a consumer by restoring its previous exact dependency tag and lockfile, then rebuilding.
