# Contour V2 beta.8

This release unifies form controls and adds application-owned data workflows. It is published as the immutable Git tag v2.0.0-beta.8. Existing V1 and prior beta tags are unchanged.

## Included

- Input and Textarea own nested control appearance, 12px regular form text, embedded fields, quiet focus and touch-target geometry. Dropdown search uses a soft half-pixel divider.
- FacetList supports grouped and flat selection APIs. RankList supports keyboard selection, muted share bars and metadata. StatNote keeps figures neutral with semantic notes; StatNoteRow aligns the metric parts.
- InfiniteTable virtualizes fixed-height custom rows and incrementally loads local or remote data. Remote sorting stays caller-owned, with abort signals and explicit error retry.
- KanbanBoard accepts real columns/cards and controlled movement. It provides per-column scrolling, collapse, pointer handles, keyboard moves, move menus, phone tabs, loading and empty/error states.
- Tables and collections accept flush layouts; CollectionLayout supports a responsive right filter sidebar. AccountMenu accepts application actions. RecordHeader metadata opens in a shared side sheet.

## Verification

- Package TypeScript/build, legacy CSS parsing, tour placement and provider/standalone CSS isolation checks pass.
- All 124 catalogue exports and real specimens render; all 146 icon exports are present.
- 46 interaction checks pass, including grouped filter selection, listbox keyboard selection, stat actions, bounded 10,000-row DOM, full-array sorting, failed load/retry, cancellation and controlled Kanban indexes.
- 46 contrast pairs pass across both themes.
- Live-browser checks cover form typography across light/dark catalogue specimens and mobile field composites; searchable-dropdown filtering; fixed infinite-table headers while scrolling, failed request feedback/retry; keyboard Kanban movement/read-only mode; phone column tabs; and the Record details sheet.
- Studio typechecks and builds against the candidate package. Its migration review and deployment remain separate from this library release.

## Integration notes

KanbanBoard replaces the old Contour demo contract: pass application data and handlers. InfiniteTable requires fixed row geometry and cancellation-safe host fetching. See MIGRATION-V2.md and the component guides. These checks do not certify every consuming application's workflows or every physical touch device.

## Rollback

Pin a consumer to its previous immutable tag and lockfile commit, rebuild, and deploy its previous artifact. Do not move a published tag. The showcase can be restored from its previous Pages deployment. No backend schema changes are included.
