# UI kit polish follow-up

Implemented in shared Contour source against `ARLAB-UI-KIT-TELLS.md`, 17 October 2026. These changes follow beta.21 and are not a new published tag yet. Bright pink primary buttons and browser-header title dots are retained.

| Request | Shared implementation |
| --- | --- |
| 1. Quiet tags | Chip: 22px, borderless sunken fill, dim 12px medium text, 5px tag radius, ellipsis and embedded bare removal control. Action chips retain button chrome. TagInput reuses Chip. |
| 2. Plain dates | Timestamp defaults to date-only text with tabular numerals. `showTime`, `format`, and `variant="chip"` preserve opt-in time and chrome. |
| 3. Quiet calendar | Plain dim date numbers, pink today with white text, whole-cell selected fill, subtle weekend fill. DatePicker remains an input control. |
| 4. Meaningful chart colour | ColumnChart, BarList and StackedBar use one hue by default. Explicit categorical colours, multi-series comparisons and labelled highlights remain available. |
| 5. Quiet tables | Sort controls reveal arrows on hover/focus or when sorted. DataTable uses shared row activation, preserves selection controls and shows a bare hover chevron. InfiniteTable loads on scroll; recovery controls appear only after failure or a completed request that appended no rows. |
| 6. Facts proximity | Label column constrained to 112–200px; phone layout still stacks. |
| 7. Required marker | A small inline asterisk replaces the far-right word. Field and FormFieldGroup expose the requirement on associated controls. Temporal and number labels use the same placement. |
| 8. Ghost hierarchy | Ghost is transparent and borderless, with soft hover fill. Secondary/quiet buttons remain visibly bordered. |
| 9. Inline deadline | `DeadlineCountdown variant="inline"` supports overdue, due today and future labels. Full-day values omit an empty hours suffix. |
| 10. Header status | DetailHeader puts status below its title, matching RecordHeader. |
| 11. Segments | Track hugs its segments; `block` explicitly fills available width. |
| 12. Nested surfaces | Disclosure uses a bare icon; FileUpload/Dropzone use one outer surface and a filled inner drop area. |
| 13. Info mark | Notice uses the shared Info glyph. |
| 14. Kanban furniture | Whole cards support keyboard opening. Read-only cards expose no open/drag/move furniture. Editing controls reveal on hover/focus and remain visible on touch devices. |
| 15. Specific empty states | StateView supports `icon`, `action`, `actionLabel`, `onAction` and contextual copy. The fallback create label is generic. |
| 16. Work previews | CollectionCard's existing media/footer API is retained and demonstrated. Media replaces the fallback icon, uses 16:9 cover cropping and the panel radius. Footer actions remain outside the primary button. |
| Dark semantics | Explicit distinct green, blue, violet, amber and red tones replace white-blended dark hues. Semantic foregrounds meet 4.5:1 against their tints in both modes. Danger actions retain red on hover. |

Additional feedback in this pass: single navigation shares full-width rows and chrome glyphs with the spaces rail; collapse moves to the fixed footer. Help/settings/collapse use one alignment. The light toggle inset highlight is removed. The logout registry uses Lucide DoorOpen with the existing stroke. PageLoading fills a bounded parent. TimePicker uses 12px text and equal 56px numeric controls. Scrollable project tables use separate borders; virtual rows and fixed headers retain full-width alignment.

## Integration notes

- Timestamp's default presentation, Chip geometry, Planning status hue, calendar date chrome, chart defaults, ghost styling and footer toggle position intentionally change. Old immutable package tags are unaffected.
- `SidebarShell.railFooter` receives the actual boolean collapsed state, including the expanded rail.
- PageLoading requires a parent with a bounded height. Direct SidebarShell content fills automatically; other layout wrappers must propagate available height. The catalogue now demonstrates an explicitly bounded specimen.
- The pink-only background treatment remains a review-only showcase proposal. It has not been merged into shared foundation tokens.
- Library build includes CSS parsing, public declaration checks and all exported components. Regression tests cover date defaults, chart colour intent, required fields, deadlines, row opening, kanban furniture, infinite-table recovery, footer ordering and semantic contrast.

## Verification

- Library build and public types: pass; 88 regression tests pass.
- Showcase production build: pass; 108 regression tests pass. Generated contracts, guides, token files and logout icon exports are synchronized.
- Browser: semantic notice and danger-action colors checked in dark mode; info uses the Info glyph. All three bottom glyphs share the same x coordinate and 30px geometry in single and double navigation.
- Browser: time controls use 12px text and equal 56px widths.
- Browser: loading preview occupies its full 1518 × 458.5 desktop container and 360 × 416 phone container.
- Browser: virtualized table retains a 1393px table/row/viewport width after scrolling. Header top matches viewport top; rendered DOM remains bounded. On a 390px phone, the 620px table scrolls inside its 292px viewport and the page stays 390px wide.
- Existing approved brand-contrast exceptions remain recorded by the showcase colour audit. No new semantic text contrast exception is required.
