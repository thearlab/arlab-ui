# Contour V2 migration audit

Contour is the target design system for all ARLAB internal tools. V2 replaces the default package entry and stylesheet. This beta packages the approved design for integration testing before a stable release; it is not a drop-in v1 upgrade.

## Audit before integration

Baseline: v1.8.1, ef9da7d52185d061b5ae2c211040608a02991092. Existing v1 tags remain immutable. The old remote v2 branch and uncommitted local contour branch are preserved. All inspected consumers use exact Git tags, so none updates without a dependency change.

Known consumers: internal dashboard, internal tool template, Studio, Reader and showcase at v1.8.1; Projects at v1.2.0; Signal Pitch Studio at v1.6.0; Creative Library at v1.0.8; ID and Test Agents at v1.0.6. Local dashboard-contour and live-test copies also exist. These are local inventory findings, not a complete GitHub dependency graph.

## Required migration

1. Pin the published V2 tag, install, verify the lockfile commit and installed package version.
2. Load `@arlab/ui/styles.css`; it loads Satoshi from its official Fontshare stylesheet and includes self-hosted DM Mono. Wrap the app in `ContourProvider mode="light"` or `mode="dark"`. The provider owns the theme boundary; v1 initTheme alone does not configure it.
3. Migrate props and compositions, not just the dependency version. IconButton uses label (aria-label is still forwarded); Avatar uses initials/color/name; SortHead uses direction none/ascending/descending; Dropdown/Picker use the new documented options API. Card is now a Panel composition. SidebarShell now accepts application-owned navigation and content; see docs/NAVIGATION.md for the beta.2 contract. Other specialized gallery compositions still require real data and callbacks.
4. Replace removed root exports using the new contract. Temporary `@arlab/ui/legacy` and `@arlab/ui/legacy/styles.css` retain the old implementation for staged migrations only. They are not the final unified design.
5. Validate navigation, forms, dialogs, permissions, empty/loading/error states and light/dark responsive layouts with the application's actual data. Preserve backend behavior and deploy separately from the dependency change.

## Beta limitations and release gates

125 showcased entries and 146 icons are packaged. Calendar and Kanban now accept application data; other specialized gallery compositions still require application integration work. JSX-generated declarations are an initial contract, not a fully curated TypeScript API. React 19 is exercised by the source showcase; React 18.3.1 is exercised by Studio integration and the isolated navigation smoke test. DOM interaction checks do not replace browser visual testing. No consumer is claimed migrated until its build and workflows pass.

V2 CSS is scoped to `.arlab-contour`. Legacy CSS remains separately available. Do not mix legacy and V2 components in the same theme boundary without checking their visual interaction.

## Rollback

Restore each consumer's previous package.json and lockfile commit, rebuild and redeploy its previous artifact. Do not retag releases. Backend migrations are outside this design-system change.

## Beta.3 additions

The dashboard request families are exported with application-owned state and callbacks. See [Dashboard components](docs/DASHBOARD-COMPONENTS.md) for integration details and custom date/time picker contracts. Added typography weight tokens and the 10px/11px micro scales. NavigationItem supports router click handlers without removing real anchor destinations. Existing beta.2 navigation and v1 compatibility paths remain available.

## Beta.7: application layouts and calendar

Use CollectionLayout + RecordCollection for a collection destination, then RecordLayout + RecordHeader + RecordBody for a focused detail route. Applications own links, filters, selected tabs and unsaved-change guards. DetailSections provides reading, split and stacked proportions; FormGrid/FormFieldGroup own control spacing and typography. Avoid application CSS targeting shared component internals. Facts now uses an isolated ct-facts layout to prevent legacy flat-grid rules corrupting grouped rows.

Textarea accepts variant="code" and size="short". Panel headings/body use the Contour type roles directly.

Calendar now receives actual application events and dates. onSelect emits YYYY-MM-DD. Use controlled month/onMonthChange for months, or startDate/onStartDateChange with weeks={5} for exactly five rolling weeks. Month view expands if a requested week count would omit dates. Events default to empty; migrate any old demo callback expecting a bare day number to the ISO date string. Selection and events never write data automatically.

DailyVerdictStrip preserves its default cards. Use layout="row" dateStyle="plain" locale="en-GB" for a single, horizontally scrollable line of dates such as 7 Oct. Full date labels remain accessible.

## Beta.8: cohesive controls and data workflows

All nested text and number fields now compose Input; longer text composes Textarea. `--text-field` defaults to 12px with a CSS fallback for earlier host token maps. Touch targets remain 44px. Remove application CSS overriding shared field fonts, borders or focus shadows.

Use FilterableTable or RecordCollection `variant="flush"` for edge-to-edge dividers. CollectionLayout accepts the same variant and a `sidebar({mobile,close})` render callback; desktop shows the right filter panel and phone opens it in a shared sheet. RecordHeader metadata now opens a side sheet instead of a native details popup.

FacetList supports both the flat API and grouped controlled selections. RankList supports keyboard selection and stable IDs; StatNote carries semantic state beside a neutral number. See the complete guide for their APIs. AccountMenu accepts application-owned items and collapsed presentation.

InfiniteTable is additive; paginated FilterableTable remains available. See [InfiniteTable](docs/INFINITE-TABLE.md). Fixed row geometry is required for virtualization. Remote hosts own filtering, order, cursor state and cancellation-safe result updates.

KanbanBoard no longer injects demo cards or persists its own records. Supply columns, cards and renderCard; implement onMove to update application state and persist as needed. Omitting onMove makes it read-only. The emitted index excludes the moved card. See [KanbanBoard](docs/KANBAN-BOARD.md).

Tags are immutable. Pin v2.0.0-beta.8 explicitly; applications on older exact tags retain their versions. This remains an integration beta; publishing the library does not deploy or certify all consuming applications.

## Beta.9: application frames and access sheets

Use AppHeader with context, optional search and actions inside SidebarShell's header slot. Breadcrumbs truncate keeps long titles on one line with their complete title available on hover.

TagInput accepts label={null} inside FormFieldGroup, an external id, native input attributes, disabled state and commitOnBlur for comma/newline batches. Existing standalone labels and Enter/Backspace behavior remain available.

Dialog, Sheet and Modal accept width, footer, description, scrollable, contentLabel and dismissible. Use scrollable for one shared scrolling content region with fixed framing/actions. Set dismissible={false} while a sensitive operation is pending; Escape, backdrop and close controls then remain inactive. Existing custom-child layouts remain the default when scrollable is omitted.

These are additive changes; beta.8 consumers stay on their immutable tag until explicitly upgraded.

### beta.10 additive APIs

Existing table layout/sort-indicator defaults and string breadcrumbs remain supported. ConfirmDialog now uses generic Confirm action copy when labels are omitted and renders no description when none is supplied. Pass the operation-specific title, description and confirmLabel explicitly. See [integration examples](docs/RELEASE-beta.10.md).

### beta.12 collection/detail workspaces

Use CollectionWorkspace with RecordNavigator for selectable split dashboards; use RecordSection for borderless detail hierarchy and ActionGroup for related controls. Existing full collection and focused RecordLayout compositions remain valid. See [integration contracts](docs/RELEASE-beta.12.md).

## Beta.21: Satin Lift foundation and composed components

Pin v2.0.0-beta.21 explicitly. Earlier immutable tags retain their original implementation. This beta changes visual defaults throughout the library, including the legacy entry's pink aliases.

- Allow the official Fontshare Satoshi stylesheet/font hosts in application CSP and network policy. DM Mono remains packaged locally.
- AccountMenu is now informational identity plus a separate sign-out action. Migrate former account items to explicit application navigation. Use onLogout, or retain the supported onSelect('Log out') fallback.
- Spaces SidebarShell folds its outer rail only. Inner navigation stays open. Move old panel-folding integrations to railCollapsed/onRailCollapsedChange.
- PageLoading defaults to content-preview. The explicit signature variant remains available for compatibility.
- ScrollArea hideScrollbar is optional and defaults false; Kanban enables it without disabling native scrolling.
- Component dimensions and application-owned data/callbacks remain supported. Publishing this library does not upgrade or deploy Studio automatically.
