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

## Deliberate differences from the spec
- None yet.

## Notes
- Live preview: dashboard worktree on 127.0.0.1:5193 (`vite --mode local-ui`), back end on 5192.
- Typecheck against this branch: `npx tsc --noEmit -p tsconfig.contour.json` in the dashboard worktree (remove that file
  once 2.0.0 is tagged and the dashboard depends on it).
- The preview's extra packages (lucide-react, @fontsource/manrope, @fontsource/ibm-plex-mono) are installed with
  --no-save in the main dashboard's node_modules; a plain `npm install` there prunes them.
- Local `/engine/projects` times out (30s) on the local back end; unrelated to the redesign.
