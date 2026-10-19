# ARLAB UI 2.0.0-beta.31

Pin `github:thearlab/arlab-ui#v2.0.0-beta.31`. Earlier tags remain unchanged.

- `PageBar size="compact"` gives page headers the shared compact title role while retaining a semantic heading. Compose it with `PageFrame` and its fixed tabs slot for a full-width separator above independently scrolling results.
- `InfiniteTable showHeader={false}` avoids duplicate title/search/actions when its parent page owns those controls. Column headings, sort, selection, virtualization and loading remain unchanged.
- `CollectionLayout heading="h2"` supports nested collections without duplicating a page's h1. The default remains h1.
- `CardGrid trackMode="fill"` keeps sparse category grids on the same track widths as fuller groups. The existing auto-fit default remains unchanged.
- `DayTimeline showTime={false}` shows task content without the left time/status column. Its day controls now have a thin separator; entry-only scrolling retains the heading and days.
- Interactive `DailyVerdictStrip` dates use shared buttons and an optional `selectedDate` state. Arrow keys, Home and End change the selected day without bubbling to a surrounding record carousel. Read-only usage remains supported.
- `TextAction tone="neutral"` supports quiet management links/actions without pink labels. Existing accent actions remain the default.

All application records, filters and callbacks remain caller-owned. This release does not deploy consuming apps or change backend data.
