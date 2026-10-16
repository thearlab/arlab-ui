# Contour V2 migration audit

Contour is the target design system for all ARLAB internal tools. V2 replaces the default package entry and stylesheet. This beta packages the approved design for integration testing before a stable release; it is not a drop-in v1 upgrade.

## Audit before integration

Baseline: v1.8.1, ef9da7d52185d061b5ae2c211040608a02991092. Existing v1 tags remain immutable. The old remote v2 branch and uncommitted local contour branch are preserved. All inspected consumers use exact Git tags, so none updates without a dependency change.

Known consumers: internal dashboard, internal tool template, Studio, Reader and showcase at v1.8.1; Projects at v1.2.0; Signal Pitch Studio at v1.6.0; Creative Library at v1.0.8; ID and Test Agents at v1.0.6. Local dashboard-contour and live-test copies also exist. These are local inventory findings, not a complete GitHub dependency graph.

## Required migration

1. Pin the published V2 tag, install, verify the lockfile commit and installed package version.
2. Load `@arlab/ui/styles.css`, Manrope and IBM Plex Mono. Wrap the app in `ContourProvider mode="light"` or `mode="dark"`. The provider owns the theme boundary; v1 initTheme alone does not configure it.
3. Migrate props and compositions, not just the dependency version. IconButton uses label (aria-label is still forwarded); Avatar uses initials/color/name; SortHead uses direction none/ascending/descending; Dropdown/Picker use the new documented options API. Card is now a Panel composition. SidebarShell now accepts application-owned navigation and content; see docs/NAVIGATION.md for the beta.2 contract. Other specialized gallery compositions still require real data and callbacks.
4. Replace removed root exports using the new contract. Temporary `@arlab/ui/legacy` and `@arlab/ui/legacy/styles.css` retain the old implementation for staged migrations only. They are not the final unified design.
5. Validate navigation, forms, dialogs, permissions, empty/loading/error states and light/dark responsive layouts with the application's actual data. Preserve backend behavior and deploy separately from the dependency change.

## Beta limitations and release gates

89 showcased entries and 145 icons are packaged. Some complex compositions (calendar, timeline, board) still carry showcase defaults and require application integration work. JSX-generated declarations are an initial contract, not a fully curated TypeScript API. React 19 is exercised by the source showcase; React 18 integration must be checked before migrating React 18 consumers. DOM interaction checks do not replace browser visual testing. No consumer is claimed migrated until its build and workflows pass.

V2 CSS is scoped to `.arlab-contour`. Legacy CSS remains separately available. Do not mix legacy and V2 components in the same theme boundary without checking their visual interaction.

## Rollback

Restore each consumer's previous package.json and lockfile commit, rebuild and redeploy its previous artifact. Do not retag releases. Backend migrations are outside this design-system change.
