# @arlab/ui

Shared design tokens and React UI primitives for ARLAB's internal tools (Agents Studio, ARLAB Knowledge, and future apps). Encodes ARLAB's anti-AI-slop design rules in one place.

## Stack

- React 18 (peer dep), TypeScript ^5.9, ESM only
- No build tooling beyond `tsc` (+ a `cp` of the stylesheet); no bundler
- Ships type declarations (`dist/index.d.ts`)

## Distribution

Private package, NOT on npm. Consumed as a git dependency pinned to a tag:

```json
"@arlab/ui": "github:thearlab/arlab-ui#v0.7.0"
```

Current version: 0.7.0. Consumer entry point: `import '@arlab/ui/styles.css'` once, then import primitives from `@arlab/ui`. Call `initTheme()` on boot before first paint to avoid a theme flash.

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
- Fonts (Outfit + JetBrains Mono) are NOT bundled - the consuming app must load them (Google Fonts link) at its entry point.
- Every primitive defends its own `box-sizing`/layout/focus ring and assumes no global reset - do not rely on a consumer's normalize.
- The reticle motif (`.arlab-reticle`) is deliberately used on exactly two surfaces (Dialog, CommandPalette). Do not spread it - a signature stays a signature only if it is not wallpaper.
