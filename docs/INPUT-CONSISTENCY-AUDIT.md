# Shared control consistency audit

Source audit of the entire Contour stylesheet set, component implementations, and showcase catalogue composition. Snapshot taken during concurrent beta.8 changes; line numbers may move. This is not browser certification. No API writes or production changes were made.

## Coverage

The showcase's generated `public/component-contract.json` currently contains 119 entries; the four new DataLists exports bring the intended surface to 123. Existing demos use both explicit branches and grouped branches in `catalogue.jsx`, `DashboardDemos.jsx`, and `RecordLayoutsDemo.jsx`. Do not treat absence of an individual switch branch as a missing demo. Regenerate the public contract after adding the new exports.

Scanned every CSS rule in `src/contour/*.css` for control, field, filtering, editing and parent typography selectors. Checked source composition for base fields, numeric/color/temporal controls, FieldRow/SheetSection, table/column filters/FilterSidebar, editor/InlineEdit, Modal, dropdown/popover, tags/search, and new data lists. Also scanned showcase CSS and editor/catalogue demo composition. Parent browser verification remains necessary for all catalogue specimens in both themes and phone layouts.

## Highest-impact conflicts

| Source | Reproduction / impact | Recommended correction |
| --- | --- | --- |
| `dashboard.css:119–161` | Any shared Dropdown/Button rendered inside EditorLayout, InlineEdit, CodeDisplay, MediaGallery or another listed parent inherits the parent's button border, padding, background, font and hover. This includes content slots, not just the parent's own toolbar. | Give bespoke native leaf buttons explicit classes; style those classes. Shared children must own their visual rules. Keep parent rules for layout only. |
| `dashboard.css:1616–1637` | Text/search/number inputs inside FilterSidebar or column popover become 12px, minimum 38px, padding 8px 10px. The selector catches embedded search inputs and can recreate an inner border. | Remove visual descendant rules after using BaseFields/Input in every filter. Use explicit layout wrappers for width. Preserve checkbox focus via the checkbox primitive. |
| `dashboard.css:28–65` | NumberInput, ColorPicker, InlineEdit and CodeDisplay input descendants override the base input's token padding; `ct-code input` later becomes 10px monospace. Invalid InlineEdit inputs can have their error border replaced by a later generic focus rule. | One base control stylesheet; explicit `code` or embedded variants only when semantically intended. Invalid-state selector must win in every focus state. |
| `styles.css:762–784` | UI.Field wraps a shared Input/Textarea with stronger border, different padding, and different minimum textarea height than the same input outside Field. | Field should supply label, hint and layout, never restyle descendants. Base control owns rest/focus/invalid/disabled dimensions. |
| `dashboard.css:1638–1655` | Table header actions and filter footer buttons override any shared Button passed by a consumer, including primary/destructive action appearance. | Use shared Button's size/variant API; remove descendant button appearance overrides. |
| `dashboard.css:1656–1660` | Broad table/filter button focus adds outlines to temporal triggers and other composite controls; only dropdown-trigger is exempt. | Define focus once per primitive. Parent containers should not add or remove focus outlines for arbitrary children. |
| `library.css:574–581` | FieldRow's descendant strong/p rules also hit arbitrary dropdown option copy or nested child content. | Target direct copy wrapper children, not every strong/p below FieldRow. |
| `dashboard.css:833–857` | Broad input focus rules apply to controls even when a composite owns the outside border; high-specificity parent rules then create inconsistent error/focus behavior. | Centralize state ownership with explicit default/embedded classes and a consistent invalid > focus precedence. |

## Secondary sources of drift

- `contour.css:1633` and `library.css:1580` reduce shared search input text to 11px in the knowledge tree/catalogue. `styles.css:2275` also contains the older 10px knowledge-tree rule. Prefer an explicit shared search size API if compact search is required; otherwise remove container typography overrides.
- `styles.css:744` applies native select styling to all selects under the theme. Audit native select fallbacks separately from custom dropdown triggers; avoid two ownership models for the same exported Select.
- Mobile declarations in `styles.css:5389`, `library.css:2140`, `dashboard.css:1151` and dropdown-search rules independently define touch input sizes. Centralize all editable text controls at the intended mobile type/height tokens, including code textareas where editing can otherwise zoom on iOS.
- Showcase `src/dashboard-demos.css:106` restyles shared viewport Buttons. Use a real shared compact/segmented control rather than demonstration-specific padding/font/border overrides.
- Showcase imports its old large `styles.css` before package styles (`src/main.jsx`). Later package order alone does not defeat more specific showcase parent selectors, e.g. `.priority .btn`, `.doc-feedback .btn`, `.knowledge-tree .search-field input`, `.filter-bar select`. Remove duplicated component visual rules from the showcase, leaving actual page/demo layout rules.
- No broad Modal descendant input restyling was found. Modal should remain a container; validate the same fields both inline and in Modal, since inherited wrappers can still leak into modal content.

## New DataLists review

### FacetList

Single mode has radio semantics and selected roving tab stop; arrows/Home/End move and select enabled choices. Multiple mode has checkbox semantics and Space works through native buttons; arrows move without changing selection. Values and baseline counts remain caller-controlled. Empty, loading and explicit disabled choices exist. A phone Filters button opens the shared native Modal sheet; `responsive={false}` avoids nested sheet triggers inside FilterSidebar.

Remaining issue: multiple selection has no visible checkbox/checkmark, only color differences. Add a non-color selection cue. With extreme baseline counts, cap the count column so a label retains usable space; single-line ellipsis/title is already implemented. Test a long list in the mobile sheet, including scrolling to Done and Escape/focus return.

### RankList

Controlled selection uses native buttons with roving focus; Enter/Space select. Bars are decorative neutral 4px tracks, not value-colored pink. Large/invalid values are clamped for bar geometry, data order is caller-owned, and content uses ScrollArea.

Remaining issues:
1. Read-only rows use `aria-label` on a generic div (`DataLists.tsx:78`), whose accessible name is not reliably exposed. Use a labelled group or actual visually hidden rank text.
2. `mark: ReactNode` must be explicitly decorative and noninteractive. Otherwise consumers can nest interactive content in a row button; target `.ct-rank-row` in the keyboard query instead of every button to avoid incidental descendants affecting indexing.
3. Test scrollbar keyboard focus plus row keyboard focus to ensure the extra ScrollArea tab stop is intentional.

### StatNote / StatNoteRow

Value stays neutral; note carries semantic tone; trend color is caller-supplied outcome rather than inferred direction. View supports native links or buttons. Wrapped notes are permitted; CSS subgrid aligns label/value/caption/action rows. Test large counts, lengthy notes and missing captions side by side at narrow widths. Loading currently suppresses note but leaves trend/action: document whether cached context is intentional or hide it when showing an entirely fresh metric.

### AccountMenu

Expanded trigger fills its wrapper; collapsed trigger is 36px with centered 24px avatar. Hidden copy does not remove the accessible account name. Caller-owned items avoid demo actions. Remaining API quality consideration: callers changing name but omitting initials retain default AM; deriving initials from the name would avoid mismatched identities while retaining the default demo result.

## Browser acceptance matrix

For each shared control, compare identical specimens in plain Stack, FormFieldGroup, FieldRow, Panel, Modal, EditorLayout, table header/cell/filter, and FilterSidebar. Check rest, hover, focus, invalid + focus, disabled, readonly, and open states in light/dark and phone. Compare computed font family/weight/size, padding, border width/color, radius, control height, focus outline/shadow. Composite search/tag/color/date/number controls should have one intended boundary and focus indicator. Verify no parent background rule erases primary/danger/selected states.

Catalogue-wide checks should also cover button names, nested interactive content, tab/arrow/escape behavior, popup collision/width, phone reachability, long labels, and empty/loading/error specimens. A build or unchanged TypeScript alone cannot establish visual consistency.


### Form text size, 17 October 2026

Form values, placeholders, dropdown options, temporal triggers and code textareas use `--text-field: 12px` at regular weight. CSS includes a 12px fallback so applications using earlier token maps retain the correct typography. Nested fields compose the same primitives. Removed mobile and coarse-pointer font enlargement while retaining 44px touch targets. Desktop catalogue checks covered 246 specimens across light and dark, with 124 visible controls matching 12px/400. Phone verification covers form primitives and their composites; dropdown options retain a borderless row and the same text size.
