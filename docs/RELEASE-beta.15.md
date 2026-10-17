# Contour V2 beta.15

The collection workspace now keeps the same table mounted as it narrows to the record-name column beside a selected detail. Search, sorting, scroll position and the persistent right filter rail survive selection. The showcase opens this layout automatically, without a list toggle or layout switcher.

## Components

- `CollectionWorkspace`: optional `collectionMode="condense"`, `sidebar` and `sidebarLabel`. Existing separate `navigator` behavior remains the default. Phone filter controls open the shared sheet.
- `InfiniteTable`: `selectedRowKey`, `condensedHeaderActions` and `condensedFooterActions`. Selected virtual rows are revealed without mounting all preceding records. Errors retain a visible Retry action even in a narrow list.
- `RecordCollection`: `selectedId`, and compact action slots when `progressive` is enabled. The compact list shows record names without the secondary description.
- `RecordHeader`: cleaner status/action band, grouped context controls and separate record tabs. Metadata opens from a compact information button. Existing public props remain available.
- `Calendar`: redesigned period controls, quiet grid, event time/tone/token markers, `maxEventsPerDay`, `onDayDetails`, complete event agenda and narrow-container event counts. Application-owned dates/events and existing controlled/keyboard behavior are preserved.
- `KanbanBoard`: `height`/`fill`, bounded visible geometry, retained offscreen document footprint, axis-specific scroll containment and Shift-wheel support over cards.

## Validation

- Shared TypeScript/build, CSS scoping and table typography guard pass; 130 component exports and 146 icons remain available.
- 78 public component interaction regressions pass.
- 50 theme contrast pairs pass.
- Showcase production build and Studio consumer TypeScript pass.
- Studio Registry, detail, Apps, search, Connector, Connections and Admin regression suites pass using isolated fixtures, with no live writes.
- Browser review confirms automatic one-column condensation, one persistent filter rail, no layout/list toggles and no horizontal page overflow in the example. Calendar light/dark/390px phone and five-week views were reviewed.

Install from the immutable Git release:

```json
"@arlab/ui": "git+https://github.com/thearlab/arlab-ui.git#v2.0.0-beta.15"
```

V1 remains on its existing branch and tags. Previous V2 tags are unchanged. To roll back a consumer, restore its previous immutable tag and lockfile, then rebuild. This release does not deploy Studio to production.
