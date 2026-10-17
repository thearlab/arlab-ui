# Contour V2 beta.25

The approved workspace appearance is now entirely shared. Surface and its foundation tokens own the rounded satin rim and soft elevation. Panel composes Surface; framed tables, calendars, editors, uploads and overlays receive the same treatment. Buttons and fields use shared chrome gradients; tags get a lighter sheen. Dimensions, main pink and semantic status hues stay consistent.

Export WorkspaceContent, WorkspaceGrid, WorkspaceIntro, RecordCell, UsageValue, DateStatus and ProgressSummary. These are the compositions used by Preview and are independently showcased. See APPROVED-WORKSPACE.md.

PageLoading and loading StateView use the standard full-container content preview. Fix centering by preserving the loader's own grid inside bounded shell content. Animate placeholder gradients and three trailing dots without moving the copy; respect reduced motion. The Loading page tab renders this same component directly.

Single navigation is permanently expanded, without a collapse control, collapse shortcut or visible app-name line. The outer spaces rail still folds and phone drawers remain available. Legacy single collapse props are accepted for source compatibility and ignored.

Add Calendar height/fill and variant="flush", bounded SidebarShell contentLayout and PageFrame scrollable=false; contain shell overscroll. Left-align condensed headings beside their dot. Fix SaveBar padding and responsive action placement, FileUpload's plus badge alignment and Kbd typography.

The showcase is full screen, with a simplified Preview and single/double sidebar toggle. Delete the old Layouts implementation and font/proposal controls. Rebuild Playground with actual package controls and correct its Facts tuple data. /workspace.html verifies the same workspace without showcase CSS.

Install: `git+https://github.com/thearlab/arlab-ui.git#v2.0.0-beta.25`. Applications must explicitly upgrade and restart their Vite prebundle. Publishing the library does not deploy a consuming application. Existing version tags remain unchanged.
