# Route and component contracts

These additions keep the existing defaults. Apps can adopt each option independently.

| Need | Shared API |
| --- | --- |
| Section action that navigates | `<TextAction href="/knowledge">Knowledge</TextAction>`; `external` adds a safe new-tab target. Without `href` it remains a non-submit button. |
| Relative date with exact hover date | `<Timestamp date={updatedAt} relative />` or `format="relative"`. Its `time` element retains `dateTime` and absolute `title`. |
| Link tile alignment | Icon, title, badge and trailing arrow align at the first text line, whether a description is present or not. |
| Supporting workspace column | `<WorkspaceGrid layout="sidebar" supportingWidth={380}>…</WorkspaceGrid>`. The default stays 280px and the grid still stacks at its responsive breakpoint. |
| Quiet agenda day controls | `<DayTimeline dayVariant="quiet" … />`. Selection remains visible. |
| Inspector width | `<EditorLayout inspectorWidth={380} … />`. The width remains capped at 40% and the inspector becomes a sheet in compact layouts. |
| Tabs inside padded panels | `<TabStrip inset="flush" … />`; tabs inside `EditorLayout`'s inspector are flush automatically. |
| Route scroll ownership | Wrap the route in `<ShellPage scroll="page">…</ShellPage>` for ordinary content, or `scroll="child"` when its table or editor owns the inner scroller. This overrides `SidebarShell.contentLayout` for that route. |
| Iframe preview height | Same-origin previews observe their own document. For sandboxed or cross-origin documents, put `<script>${previewHeightBridgeScript(window.location.origin)}</script>` in the preview document and give `<PreviewFrame autoHeight heightMessageOrigin="null" … />` for a sandboxed `srcDoc`, or the preview's exact origin for an external URL. The receiver checks both origin and iframe window. |
| Kanban trackpad scroll | A vertical column contains vertical overscroll while allowing horizontal scroll chaining to the board. The board caps its height to visible space and supports Shift + wheel horizontally. |

For an iframe bridge, generate the script in the host, before building the document string. The `targetOrigin` argument must be the exact host origin. Do not interpolate arbitrary content into `srcDoc` without sanitizing it.
