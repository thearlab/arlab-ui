# Satin Lift component foundation audit

17 October 2026. Local review changes, not a published version.

The audit follows the complete Contour stylesheet build manifest, including shared base styles, library compositions, standalone navigation and scrolling, dashboards and editors, record layouts, collection workspaces, calendars, headers, data lists, infinite tables, kanban, buttons and services. Font declarations are included in the manifest too.

## Component coverage

| Family | Components and treatment |
| --- | --- |
| Actions | Button, IconButton, TextAction, embedded control actions, PillButton, segmented controls, menu options, calendar navigation and table filter/pager actions use shared 7px control geometry. Hover outlines use restrained chrome tokens rather than strong text-tone borders. Public control heights remain unchanged. |
| Fields | Input, Textarea, SearchField, Select/Dropdown/Picker, TagInput, temporal controls, color inputs and swatch selection use shared surfaces, 7px corners and restrained focus. Embedded fields remain transparent inside their owning control. Error, disabled and selected semantics remain separate. |
| Surfaces | Panel, CollectionCard, LinkTile, ConfirmStrip, CopyBlock, navigation trees, inspector compositions, editor and preview frames, countdowns and media containers use 14px surface geometry, satin rims and shared elevation. Panel title rails and row hovers remain full width. |
| Overlays | Dialog/Modal, Sheet, Popover, dropdown panels, temporal popups, column filters, GuidedTour and queued notifications use the same surface and elevation tokens. Floating dialogs/tours use panel corners; picker/menu surfaces use control corners. Full-window sheets keep square screen edges. |
| Data | FilterableTable, InfiniteTable, collection workspace, record layouts, FacetList, RankList, StatNote and legacy table examples inherit the selected type and colors. Table geometry remains bounded and flush variants retain square attachment edges. |
| Calendars | Calendar, date/time pickers, DayTimeline, phase/verdict displays and collection groups use semantic corner roles. Day and month interaction controls use 7px corners; larger scheduling surfaces use 14px. |
| Editors/media | EditorLayout, PreviewFrame, QR/CodeDisplay, MediaGallery, MediaUploadField and attached-file sections now share the new surface construction. Reorder rows retain control geometry; reorder groups use surface geometry. |
| Boards | Kanban columns/cards inherit shared panels. Legacy library kanban examples now use the same corner and elevation tokens. Hover borders no longer switch to strong text colors. Drag affordances and pointer behavior remain unchanged. |
| Shell | Standalone navigation uses Satoshi and current neutral light/dark fallback colors. Embedded menus and account controls share control corners. Structural sidebar identity experiments remain separate from the foundation update. |
| Status and documentation | Historical sage/ochre/blue/rose/lilac classes resolve through current semantic tokens. Historic toast and demo/documentation chrome use current colors. Old comparison-selector names remain for compatibility, but their former hard-coded palettes are removed. |

## Intentional shapes and materials

The following remain deliberate, rather than legacy design remnants:

- Dots, status marks, avatars that are circular and switch pill tracks keep their functional shapes.
- Thin chart bars, progress tracks, skeleton strips, swatch markers and wireframe graphics keep compact or square geometry.
- Flush tables, attached full-window sheets, iframe content and image slots retain square adjoining edges where appropriate.
- QR scan artwork keeps a white scanplate with neutral `#1B1B1E` foreground so scan contrast does not change with dark mode. Its frame uses current border tokens.
- Scrims, inset dividers, subtle thumb highlights and drag shadows are neutral optical effects, not alternate color foundations.
- Vivid department fills and white department icons follow the approved foundation; no automatic darkening was reintroduced by this CSS audit.

No Manrope or IBM Plex literals remain in any stylesheet in the current Contour build. No former purple dark-surface literals remain. The separate legacy export is preserved for existing consumers; this audit does not remove its API or pretend it has migrated applications that still import that entry point.

## Verification

- `tests/contour-foundation-completeness.test.mjs` follows the actual build manifest and guards fonts, old palette literals, semantic component corners, subtle hover boundaries and the explicit QR exception.
- `tests/satin-finish.test.mjs` guards surface/control role separation, embedded input behavior, icon perimeters, full-width panel rails/rows and standalone navigation fallbacks.
- The built stylesheet parser and scope check pass, including standalone navigation and scrollbar isolation.

These source and built-output checks do not replace browser review of each product page. Application-owned CSS and legacy imports outside the package remain the responsibility of each consuming application.
