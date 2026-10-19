# ARLAB UI V2: Contour

The shared design system for ARLAB internal tools. Satin Lift: Satoshi interface and 600-weight headings, DM Mono code, vivid ARLAB pink, neutral charcoal dark surfaces, satin edges and soft elevation. Containers use 14px corners and controls use 7px. This is the V2 integration beta; Studio is the first migration target.

Version `2.0.0-beta.33` removes empty list bands from row-only panels and simplifies command search spacing. It includes the department, field and calendar refinements from beta.32. See [release notes](docs/RELEASE-beta.33.md).

```json
"@arlab/ui": "github:thearlab/arlab-ui#v2.0.0-beta.33"
```

```jsx
import { ContourProvider, Button } from '@arlab/ui';
import '@arlab/ui/styles.css';
// Satoshi 400/500 loads from its official Fontshare stylesheet; DM Mono 400 is self-hosted.
export function App() {
  return <ContourProvider mode="light"><Button variant="primary">Create project</Button></ContourProvider>;
}
```

The root entry now exports Contour. Do not upgrade a v1 app by changing its dependency alone. Read [the migration audit](MIGRATION-V2.md), [complete component guide](docs/CONTOUR-GUIDE.md) and [machine-readable contract](docs/component-contract.json).

## Showcase

Repository: https://github.com/thearlab/arlab-ui-showcase. The Contour showcase imports the real package, covers 148 component entries and 164 curated icons, and includes light/dark layouts, independent double navigation, fixed-header/footer scrollable sidebars and loading states.

## Development

`npm ci` builds the package on install. `npm run build` validates legacy CSS, emits ESM and declarations, checks tour placement and scopes Contour CSS to its theme boundary. `npm run check:contour` checks every catalogue export, icon count and stylesheet boundary.

V1 remains available at the immutable v1 tags. Temporary `/legacy` and `/legacy/styles.css` entry points support staged application migration. New application work belongs in Contour; reusable additions must be showcased in the same release.

See MIGRATION-V2.md for beta limitations and remaining stable-release gates.

## Standalone navigation

[Navigation integration guide](docs/NAVIGATION.md): SidebarShell, AppNavigation, NavigationSection, NavigationItem and ScrollArea can be used without a provider or showcase styles.

## Persistent table workspaces

Use `CollectionWorkspace collectionMode="condense"` to keep the same table alongside the selected record and `sidebar` for persistent right filters. Progressive tables support compact header/footer actions and selected-record reveal. See [the integration contract](docs/COLLECTION-WORKSPACE-CONDENSE.md), [Calendar](docs/CALENDAR.md) and [beta.15 release notes](docs/RELEASE-beta.15.md).

## Subtle pink foundation and reading layouts

Beta.24 promotes the approved pink-only canvas and chrome treatment into shared light/dark tokens. Use ContourProvider and the shared stylesheet; application CSS overrides are unnecessary. See [beta.24 notes](docs/RELEASE-beta.24.md) and [reading components](docs/READING-LAYOUTS.md).

The approved Preview composition is exported through WorkspaceContent, WorkspaceGrid, WorkspaceIntro, RecordCell, UsageValue, DateStatus and ProgressSummary. Surface owns the shared framed-container finish. The isolated `/workspace.html` route loads only package styles for parity verification.

Dashboard composition uses the existing Panel browser frame, compact embedded StateView feedback and opt-in two-column mobile StatNoteRow. See [Dashboard composition](docs/DASHBOARD-COMPOSITION.md) for spacing, scrolling and data-state responsibilities.
