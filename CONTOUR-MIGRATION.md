# Contour migration log (@arlab/ui 2.0, branch `contour`)

Source of truth: the ARLAB Internal Design System folder (Contour direction): `src/styles.css` unscoped rules,
`src/contour.css` (wins), `src/library.css`, `src/ui.jsx`, `src/library.jsx`, `src/catalogue.jsx`, `src/icons.jsx`,
`src/system.js` (tokens, component contract), `WORKLOG.md` (accepted refinements). First consumer: the internal
dashboard, branch `design/contour` (worktree `subapps/arlab-internal-dashboard-contour`). Not released, not deployed.

## Done

### 1. Foundations
- Tokens by value, names unchanged from 1.x: porcelain surfaces, graphite ink, `--strong` control borders, ARLAB pink
  accent with `--action` #A80FA3 / white label in light and #F04EE8 / #251123 in dark, `--link`, `--focus`, `--tint`.
- Status vocabulary ok/warn/bad/info (+ quiet), `--ok`/`--bad` aliases of `--live`/`--crit`.
- Department and chart tokens, nav tokens, space scale, z-index scale, durations 120/180/240ms, spec ease.
- Type: Manrope (UI) + IBM Plex Mono (code), scale 11/12/13/14/16/18/22/28/34.
- Radius by role: 3 (marks, tags, items), 5 (controls, buttons), 8 (panels, menus, dialogs). Pill only for dots/avatars.
- Native thin scrollbars with the spec thumb/track/hover colours, light and dark.
- One focus ring: 2px `--focus`, offset 2.
- Dashboard: 49 pill corners and 84 literal radii mapped to the roles; 206 literal font sizes mapped to the scale.

### 2. Actions
- Button: 12px/500, line-height 1.3, padding 8px 13px, min-height 38 (44 under 560px), 5px corners; hover sunken;
  primary pressed inset ring; new `quiet` variant (Cancel); ghost dim; danger tinted; disabled sunken at .65.
- IconButton: 32px, borderless, 5px, dim ink, sunken hover (36px min under 560px).
- Dashboard: removed the rule that turned every button into a pill (`workspace.css`).

### Icons
- `Icon` + `iconRegistry` from `@arlab/ui`: Lucide, stroke 1.65, sizes 14/16/20 (48 for empty states),
  aria-hidden unless `label`. The 1.x named icons (ChevronDownIcon...) now render the registry icon of the same meaning.
- `deptIcon` uses registry icons (Building2, Code2, Palette, Contact, TrendingUp).
- Dashboard: all 63 hand-drawn icons replaced (tools map, Agents jobs, CMS, Editor, Projects, Clients, Ongoing,
  Client projects, Timesheet tree, Gallery, prototypes, briefs). Left: the Website admin traffic chart (a chart, not an icon).
- Icons the apps needed that the registry lacks (added from Lucide, same stroke, group "Added for the apps"):
  Building2 (Company department), Presentation (prototypes, decks), Briefcase, ShoppingCart, Megaphone, Sparkles, Github.

### 3. Fields
- Select is the reference Dropdown (moved from the dashboard into @arlab/ui): hidden native select for forms, trigger
  with the strong border, panel at 8px with 5px padding, 37px options, search row from 8 options, type-ahead, Escape.
- Picker (labelled filters with counts) draws exactly like the dropdown. New SearchField. Field, Label (with the dim
  side note), Hint, Input and Textarea at the reference values (13px input, 10px 12px padding, 5px corners).

### 4. Choices
- 16px checkbox and radio on the strong border (radio: action fill with a 4px inset ring), 36x22 switch with a 14px knob,
  12px labels with a 9px gap. Native checkboxes take the action colour everywhere.

### 5. Navigation
- SidebarShell is the reference workspace shell, ported rule by rule from the Layouts view: brand and collapse button,
  workspace label, optional Applications switcher, contextual sections under 9px uppercase labels with rules and the
  selected left bar, team spaces as coloured dots, Help & shortcuts, the account row; 68px folded state remembered;
  760-1099px folded with a drawer; native dialog drawer under 760px. Top bar 60px with breadcrumbs, search and theme.
- Tabs: the reference app-switcher strip, for page tabs (tablist, arrow keys) and filter segments (pressed); counts boxed.
  SegmentedControl renders Tabs. Every tab strip in the dashboard uses it.
- IconButton: bordered by default (raise fill, line border, strong border on hover), 32px, 14px icon at 1.5 stroke,
  `ghost` variant for dense rows, tooltip defaults to the aria-label.
- Type and weight roles (`--type-*`, `--weight-*`) measured from the reference; the dashboard's 600/700 weights became 500
  and its sizes moved one step down to the reference's density (body 12, meta 11, section titles 15/600).
- deptColor lives in @arlab/ui on the department tokens (departments no longer borrow status colours).

## Deliberate differences from the spec
- Tabs scroll sideways on small screens instead of stacking into a column (Laure asked for no wrapping).
- `--dept-strategy` (#497b8f light, #8fb7c8 dark): the reference has four departments, ARLAB has five; the chart teal.
- Checkbox tick drawn at stroke 2.25 inside the 16px box (the reference uses the native checkbox; 1.65 reads too thin).
- The dashboard sidebar has no Applications group (Laure); Knowledge and Agents Studio stay as top bar links.

## Pending
- Groups 6-16 (Selection/Chips, Data, Collections, Status, Overlays, Feedback, Documents, Editing, Operations, Identity,
  Scheduling) and the per-page pass, including the page redesigns Laure asked for (every Website page, Tool requests,
  Services, Presentations).
- v2 structure: src/tokens, src/components/<Group>/, MIGRATION.md (1.x to 2.0), README, CHANGELOG, version 2.0.0, the
  literal-value check script; remove ScrollIndicator and the other 1.x leftovers.
- The departments self-check in the dashboard (`npx tsx src/departments.ts`) fails until the dashboard depends on 2.0
  (it imports deptColor from the installed 1.8.1).

## Notes
- Live preview: dashboard worktree on 127.0.0.1:5193 (`vite --mode local-ui`), back end on 5192.
- Typecheck against this branch: `npx tsc --noEmit -p tsconfig.contour.json` in the dashboard worktree (remove that file
  once 2.0.0 is tagged and the dashboard depends on it).
- The preview's extra packages (lucide-react, @fontsource/manrope, @fontsource/ibm-plex-mono) are installed with
  --no-save in the main dashboard's node_modules; a plain `npm install` there prunes them.
- Local `/engine/projects` times out (30s) on the local back end; unrelated to the redesign.
