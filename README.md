# @arlab/ui 1.0

The design system for ARLAB's internal tools: tokens, elements, layout primitives and two application shells. Built from what Agents Studio and ARLAB Knowledge are: applications, not pages. The specification and visual reference is the "ARLAB UI 1.0" page; the showcase (`arlab-ui-showcase`) renders every export live in both themes.

Installed as a git dependency pinned to a tag. The repository is public, so no token and no SSH
key are needed to install it, in CI or on a laptop:

```json
"dependencies": { "@arlab/ui": "git+https://github.com/thearlab/arlab-ui.git#v1.0.6" }
```

The `github:thearlab/arlab-ui#v1.0.6` shorthand also works, but npm resolves it to an SSH URL,
which needs a key on the machine doing the install. The explicit `git+https` form above needs
nothing. Do not pin v1.0.0 to v1.0.3: their stylesheet has a rule with no selector, which browsers
forgive and real CSS compilers (Tailwind v4, Lightning CSS) do not.

React 18 peer dependency, TypeScript, ESM, no bundler, no router dependency (shells navigate through callbacks).

## Usage

Load the two typefaces and the stylesheet once, at the app's entry point, before the app's own CSS:

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```
```ts
import '@arlab/ui/styles.css';
import './styles.css';
import { initTheme } from '@arlab/ui';
initTheme(); // before first paint, no theme flash
```

## Principles

1. Application, not document. A persistent shell, a workspace that fills the viewport, master-detail where there is a collection, panels where there is a group.
2. One accent, spent in three places: the active item, the primary action, the moment that needs a person (a gate).
3. Rows and type carry structure. A panel groups; a card is only for a liftable object. Metadata is a labelled property row.
4. Tabs are controls: a full-width segmented strip, the active tab raised. No underlined words, no icons, no descriptions.
5. Room: 14.5px base, roomy rows, quiet uppercase panel headings, 8 to 10px corners on surfaces, pills only for buttons, badges, chips.
6. Both themes are designed, not inverted. Every token has a light and a dark value; nothing uses a literal colour.
7. Copy is part of the component: sentence case, verb + object buttons, no help text under controls, no em dashes, numerals.

## Tokens

Cool neutrals. Surfaces step `--sunken` (sidebar, tracks) to `--ground` (workspace, header band) to `--raise` (panes, panels, inputs), with `--sunken-2` for hover on sunken. Ink: `--ink`, `--ink-dim`, `--ink-faint` (AA on raise), `--ink-inactive` (placeholders only). Lines: `--line`, `--line-soft`, `--line-hover`. Accent `--accent` with `--accent-deep` (as text), `--accent-tint` (surface), `--accent-line` (gate border, focus), `--accent-secondary` (the dialog edge only). Status `--live`, `--warn`, `--crit`, `--info`, each with a `--*-tint`. Identity colours (intelligences, departments) are dots only, drawn from those.

Type: `--font-sans` Outfit, `--font-mono` JetBrains Mono. Scale `--text-2xs` 11 (panel headings, uppercase) · `--text-xs` 12.5 (labels, meta, chips) · `--text-sm` 13.5 · `--text-base` 14.5 · `--text-md` 16 · `--text-xl` 22 · `--text-2xl` 28 · `--text-3xl` 34.

Corners: `--radius-sm` 6 (items, segments) · `--radius-md` 8 (inputs, tracks) · `--radius-lg` 10 (panels) · `--radius-xl` 12 (dialogs) · `--radius-pill`. Elevation: `--shadow` (panels, selected item, raised tab), `--shadow-pop` (dialogs, menus, palette, toasts). Motion: `--ease`, `--dur` 150ms, `--dur-slow` 280ms, none under reduced motion. Frame: `--side-w` 252, `--list-w` 372, `--top-h` 58.

## Shells

Two, sharing the brand lockup, the ⌘K search, the account menu and the theme toggle.

- `SidebarShell` for tools with several sections and collections (Agents Studio, ARLAB Knowledge): sidebar with grouped items and counts, Recent, the person at the bottom; a top bar with breadcrumbs, search and actions; a workspace that fills the viewport.
- `TopNavShell` for a tool with one job and two to five views (the internal-tool template, Test Agents, Test Social Calendar): a 58px bar with brand, links, search, actions and the account; the page scrolls beneath it.

## Layout primitives

`SplitView` (`ListPane`, `ListGroup`, `ListItem`, `ListSkeleton`, `DetailPane`) · `DetailHeader` (`PropertyRow`, `TabStrip`) · `DetailBody`, `Columns`, `Stack` · `Panel` (with `gate`) · `Rows`, `RowItem`, `Facts`, `EmptyNote`, `Timeline`, `StepList` · `Dashboard`, `AttentionItem`, `ActivityItem` · `ReadPage` · `Gate` · `CopyBlock` · `ReadableDoc`.

Two row components, and the choice matters: `Rows` + `RowItem` for a list
**inside a `Panel`** (they carry the panel's own padding and a hairline between
rows), `ArlabList` + `Row` for a list **outside** one. Both take `title` and
`meta` for a two-line row, or `children`/`title` alone for one line, with the
trailing slot (`right` on `RowItem`, `trailing` on `Row`) never shrinking.

## Elements

`Button` (primary | ghost | danger, sm) · `IconButton` · `Badge` (accent | live | warn | crit) · `Chip` (`on`) · `Avatar` · `Field`, `Label`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `SegmentedControl`, `TagInput`, `ComboboxPicker`, `Dropzone` · `Card` family (liftable objects only) · `Skeleton`, `LoadingBar`, `SearchButton` · `Dialog`, `DialogFooter`, `ToastProvider`/`useToast`, `DropdownMenu`, `Popover`, `Tooltip`, `Collapsible`, `CommandPalette` · `NavTree`, `Toc`/`useScrollspy`, `Breadcrumbs` · `Steps`, `LegendDot`, `Timestamp`, `ScoreBar`, `KanbanBoard` · `ThemeToggle`, `initTheme`, `setTheme`, `getTheme` · `ArlabMark`, icons.

Removed in 1.0: `Tabs` (use `TabStrip`), `Kicker`, `ChipGroup`, `DashCard`, `NavCard`, `IconTile`, the 0.7 `Panel` (use `Panel` + `Rows`). The `Navbar` family stays exported for the transition and is superseded by `TopNavShell`.

## Favicon

Every ARLAB app uses the same favicon shape: a black rounded square with a single ARLAB-pink glyph, as an SVG. `favicon.svg` in this repo is the default; copy it to `public/favicon.svg`, link it, and swap only the inner glyph for your tool.

## Releasing a change

Bump `version`, commit, tag (`git tag v1.0.1 && git push --tags`), then bump the `#v1.0.1` ref in the consumer and `npm install` (force a refresh with `rm -rf node_modules/@arlab && npm install`). `prepare` builds `dist/` on install. Every change is looked at in the showcase, in both themes, before it is tagged.
