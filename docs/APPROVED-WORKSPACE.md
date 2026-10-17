# Approved workspace foundation

The approved Preview is the shared Contour foundation, not an application skin. Import @arlab/ui/styles.css and wrap the application in ContourProvider. Use Satoshi 400/500 with 600 headings, DM Mono, 14px framed surfaces and 7px controls.

## One source of settings

src/contour/satin-foundation.js owns radius, satin rim paint, elevation, button/input chrome, tag sheen and loading animation tokens. src/contour/surfaces.css applies the same paint contract to framed components. Panel composes Surface. New application containers should compose Surface or Panel; do not copy a class from the showcase or restyle component internals.

Framed containers share --surface-radius, --surface-border-width, --surface-border-color, --surface-gradient and --surface-elevation. Overlays use --surface-overlay-elevation. Interactive cards use --surface-hover-elevation without moving their content. Flush embedded tables/calendar inherit their enclosing frame. Rows remain full width inside that frame. Semantic states keep their own colour and focus/drag feedback.

## Reusable workspace composition

- WorkspaceContent: one bounded content scroller and an optional fixed footer. Supply SaveBar through footer, outside scrolling children.
- WorkspaceGrid: equal columns or layout="sidebar" for a main column and 280px secondary column. Responsive stacking belongs to the library.
- WorkspaceIntro: heading, description and actions with approved typography.
- RecordCell: name, one metadata line and an optional leading mark in a custom table cell.
- UsageValue: aligned figure and a soft neutral usage bar.
- DateStatus: date and status treatment used by milestones.
- ProgressSummary: separated label and meter.

These helpers have live entries in the component catalogue. Application data, selection, unsaved-change guards and backend writes remain caller-owned.

## Standard loading

PageLoading defaults to the content-preview page. StateView state="loading" delegates to the same component. Placeholder surface/bar gradients and trailing dots animate; centered copy stays still. Reduced-motion mode stops decoration. Set SidebarShell contentLayout="fill" for a bounded application surface and use WorkspaceContent, or PageFrame scrollable=false when inner panes own scrolling. No local centering rules are required.

## Navigation and calendar

Single SidebarShell navigation is expanded with no collapse button, shortcut or visible tool-name line. Legacy collapsed props are accepted and ignored. The outer spaces rail remains collapsible; phone drawers remain available. The shell contains overscroll. Calendar accepts height or fill for bounded scrolling, with its period header outside the scroll area. variant="flush" removes the outer frame while keeping the grid dividers.

## Verification and integration

The showcase has a package-only /workspace.html page that imports only @arlab/ui/styles.css. In review, compare computed typography, colour, borders, gradients, shadows and spacing against Preview. Do not use a showcase wrapper to fix a package defect.

When upgrading a running Vite application, stop its dev server and restart with --force after updating the package and lockfile. A package.json version alone does not prove the running prebundle is current. On the dashboard at port 5193, installed beta.24 source used visibleColumns but the served prebundle still used columns.length. This retained hidden virtual columns while scrolling. Restarting the consuming server is required to receive the existing compact-table fix. This library release does not deploy applications or change their backend data.
