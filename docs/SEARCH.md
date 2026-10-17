# Workspace search

Import `CommandPalette` and `CommandItem` from `@arlab/ui`. V2 owns its native Modal, SearchField/Input, ScrollArea, result rows, pills and keyboard hints. The legacy entry remains available to consumers that have not migrated.

The application controls `open`, `onClose`, the Cmd/Ctrl+K listener and routing callbacks. Items have `id`, `title`, optional `summary`/`typeLabel`, and `onSelect`. Filter by all query words by default, or provide `(query, items) => items`. The component renders at most 24 matches while announcing the full matching total. No remote requests or page routes are injected.

Arrow keys move the active result while focus stays in the shared input. Enter selects, Escape uses native dialog dismissal, and closing restores the original trigger. Result clicks use the same callback. Search resets on opening; clear keeps focus in the input. Native modal focus containment prevents focus moving behind search. The app remains responsible for guarding pending edits when result callbacks navigate.

`SearchField` forwards native input attributes, keyboard handlers, and `inputRef` to the same shared Input used by every other field. It does not have a separate input style. Use the existing discrete focus border.

For a searchable collection page, pass the controlled shared SearchField into `AppHeader.search` and keep the query in the host page URL/state. Reuse that value for the table and compact navigator, and omit their search props to avoid duplicate controls. AppHeader sizes the field responsively. Studio uses this for Agents, Workflows, Apps, Keys, Admin and In Claude. Cmd/Ctrl+K continues to open CommandPalette for global navigation.
