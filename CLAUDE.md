# @arlab/ui

Shared design tokens and React UI primitives for ARLAB's internal tools (Agents Studio, ARLAB Knowledge, and future apps). Encodes ARLAB's anti-AI-slop design rules in one place.

## Stack

- React 18 (peer dep), TypeScript ^5.9, ESM only
- No build tooling beyond `tsc` (+ a `cp` of the stylesheet); no bundler
- Ships type declarations (`dist/index.d.ts`)

## Distribution

PUBLIC repo (MIT), not on npm. Consumed as a git dependency pinned to a tag:

```json
"@arlab/ui": "git+https://github.com/thearlab/arlab-ui.git#v1.1.0"
```

Public means no token and no SSH key, in CI or on a laptop. The `github:thearlab/arlab-ui#v1.1.0`
shorthand works too: npm resolves it to an SSH URL but falls back to anonymous HTTPS. Never pin
v1.0.0 to v1.0.3, whose stylesheet has a rule with no selector: browsers forgive it, real CSS
compilers (Tailwind v4, Lightning CSS) fail the build. `npm run build` refuses to ship CSS that
does not parse, which is what those tags predate.

Current version: 1.5.0. Consumer entry point: `import '@arlab/ui/styles.css'` once, then import primitives from `@arlab/ui`. Call `initTheme()` on boot before first paint to avoid a theme flash.

## Local dev / build

```bash
npm install
npm run build      # tsc + cp src/styles.css dist/styles.css
npm run dev        # tsc --watch
```

`prepare` runs the build automatically on install (so git-dependency consumers get `dist/`).

## Release

1. Bump `version` in `package.json`, commit
2. `git tag vX.Y.Z && git push --tags`
3. In each consumer app, bump the `#vX.Y.Z` ref in its `package.json` and `npm install`

Pin consumers to a tag, never a branch, so an install never picks up unreviewed changes.

## Key files

- `src/index.ts` - barrel export of all primitives, icons, `theme.ts`
- `src/styles.css` - tokens (light default; dark via `[data-theme="dark"]` or `prefers-color-scheme`)
- `src/theme.ts` - `initTheme`, `ThemeToggle`
- `src/*.tsx` - one file per primitive/group (Button, Card, Dialog, Kanban, CommandPalette, icons, ...)
- `favicon.svg` - canonical ARLAB favicon (black rounded square, pink `#e414db` glyph)

## Gotchas

- `prepare` builds on install; a consumer git-dep pull needs `dist/` present, so keep the build passing.
- Fonts (Onest + JetBrains Mono) are NOT bundled - the consuming app must load them (Google Fonts link) at its entry point.
- Every primitive defends its own `box-sizing`/layout/focus ring and assumes no global reset - do not rely on a consumer's normalize.
- The reticle motif (`.arlab-reticle`) is deliberately used on exactly two surfaces (Dialog, CommandPalette). Do not spread it - a signature stays a signature only if it is not wallpaper.

## Scrollbars

No native scrollbars: theARLab uses a scroll-progress line (as thelabs.group does) - a 3px
magenta line on the right edge that fills as you scroll. `<ScrollProgress />` follows the page;
when the page is pinned and an inner column scrolls instead, give that column the `arlab-scroll`
class, wrap it in an `arlab-scroll-host`, and pass its ref: `<ScrollProgress target={ref} />`.

Never hide scrollbars globally (`*`): the indicator only tracks vertical scroll, so a wide table
or code block would lose its only horizontal cue. Hide them only where the indicator replaces them.

## The 1.1 element set (the house style since 2026-10-05)

Set by the docs.thearlab.com revamp. Every ARLAB app follows it; build with these, do not re-invent.

- **Rail** - `SidebarShell`. It folds to icons (account-row button or ⌘\), remembered per browser;
  `autoCollapse` folds it while reading wants the width (a document is open). Collections with an
  identity (departments) are `NavItem.tile` colour tiles carrying the department icon (`tile.icon: deptIcon(id)`, falling back to a letter for a department with no icon yet); the selected item is raised with
  an accent marker; labels become tooltips when folded. The light/dark switch lives at the right of
  the top bar, never in the rail. The line above the account row runs edge to edge.
- **Right panel** - a companion task (an assistant, a chat) is a `RailPanel` passed as `aside`,
  never a floating popup. Opening it folds the left rail; expanding the left rail closes it.
- **Page bar** - one `PageBar` per page: title, its count as a `strong` pill, tabs, search, actions,
  fixed while the page scrolls. A `tile` (with `deptIcon`) only for a collection with an identity; ordinary
  pages (Projects, Clients) carry no tile.
- **Pills, not separators** - one fact per `Pill`. Never "a · b · c" meta strings. Counts are pills;
  something changed this week is `tone="fresh"`; status is ok / warn / bad; an aside is `quiet`.
- **Pickers** - `Picker` for any filter or choice that carries counts or needs finding (it searches
  past 10 options). Native `<select>` only for a plain short list inside a dense form.
- **Segmented tabs** - `SegmentedControl` with `count` per option for 2-6 views of one list.
- **Collections as cards** - `CollectionCard` in a `CardGrid`: name and count, a pill line, the
  latest few items in one inset block (each opens itself), the biggest groups as tags. No ruled rows.
  Long text truncates with an ellipsis; every flex/grid child holding text has `min-width: 0`.
- **Section heads** - `SectionHead`: the name, then its facts as pills.
- **Tables** - `Table` + `SortHead`: fixed header inside its scroll container, edge to edge with the
  gutter in the first and last cells, people as named badges, links as icon buttons. Load more as
  the end scrolls into view rather than pages.
- **Icon buttons** - the bordered square (`IconButton`, `tip` for the tooltip) for back, previous,
  next, close, edit, export. Never a text link with an arrow.
- **Long forms** - a `Sheet` sliding in from the right with `SheetSection` groups, not a centred
  modal. Centred dialogs are for confirmations only.
- **Loading** - `LoadingBar` and `Skeleton`, never a sentence.
