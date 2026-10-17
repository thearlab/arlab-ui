# ARLAB UI v2.0.0-beta.26

- Add CollectionLayout scroll="content" for ordinary card/list results, using a bounded shared ScrollArea with fixed heading, tabs and search. Preserve default table-owned scrolling. Keep result insets inside the viewport so the scrollbar meets the edge.
- Add compact embedded StateView feedback and opt-in two-column phone StatNoteRow layouts.
- Reuse Panel as the approved dashboard module; add a flush body option for edge-to-edge lists. Centralise panel inset, header and body spacing and separate adjacent RecordSection children.
- Top-align generic PageGrid children. Update the showcase with a working scrollable card catalogue and current API examples.
- Application data/error handling remains app-owned. See DASHBOARD-COMPOSITION.md; publishing does not deploy a consumer or repair its backend.


Install: `git+https://github.com/thearlab/arlab-ui.git#v2.0.0-beta.26`. Existing tags are unchanged.
