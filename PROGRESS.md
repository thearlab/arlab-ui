# @arlab/ui v2: progress

Branch `v2` (not tagged, not released, no consumer bumped; everything stays on v1.8.1).
Paused on 2026-10-14 at the usage limit. Resume from "Next".

## Done (phase 1, foundations, part)
- v2 branches created in arlab-ui, arlab-ui-showcase and arlab-internal-tool-template.
- v1 sources removed from `src/` (still on `main` and in git history). Kept and moved for reuse:
  `core/icons.tsx`, `core/ArlabMark.tsx`, `core/DeptIcon.tsx`, `disclosure/Tour.tsx`, `lib/tourPlace.ts`.
- `src/tokens/tokens.css`: the restyle palette (ground, frame, surface; ink 1 to 3; violet and ARLAB
  magenta accents; status; hero; category hues), light and a real dark palette, type scale (rem),
  4px spacing, radius, elevation, motion (HIG durations and easings, reduced motion), z-index,
  frame sizes, touch sizes, prefers-contrast.
- `scripts/contrast.mjs` + `src/lib/color.ts`: 56 pairs x 4 palettes, all pass; writes `docs/CONTRAST.md`.
- `src/tokens/base.css`: cascade layers, reset, base type, focus ring, scrollbars, reduced motion, utilities.
- `src/tokens/compat.css`: v1 token names aliased to v2. `src/tokens/tokens.ts`: breakpoints, durations, z.
- `src/lib/`: cx, keys (nextIndex, typeahead, moveItem, shortcuts), place (anchored placement),
  search (ranked matching), format (relative time, money, plural, initials, hues). Not yet unit tested.
- Showcase and template Vite configs can run on the local arlab-ui source (alias) for hot reload.

## In progress
- Nothing half-written. `src/index.ts` does not exist yet, so the v2 package does not build.

## Next
1. hooks (controllable state, dismiss + overlay stack, focus trap, anchored position, media query),
   core components (Button, IconButton, ThemeToggle with System/Light/Dark, AccentToggle, Spinner, Kbd,
   VisuallyHidden, Portal), layout primitives (PageGrid, Col, CardGrid, Stack) reworked, `src/index.ts`,
   build script that inlines `src/index.css`.
2. Story format (`src/stories`, exported as `@arlab/ui/stories`) + `harness/` (Vite) + vitest + axe +
   Playwright visual script (light, dark, phone; fails on console errors and horizontal overflow).
3. Component groups: shell, navigation, forms, data, charts, board, time, feedback, overlays,
   disclosure, content (plan: parallel agents owning one folder each).
4. Patterns, MIGRATION.md, README, CLAUDE.md; showcase rebuild with coverage page; template rebuild.

## Dev servers
- Showcase :5190 and template :5191 were restarted on the installed v1.8.1 package (UI_SRC=0) because
  the v2 source does not build yet. Restart with the local source once `src/index.ts` exists:
  showcase `npx vite --port 5190` (local source is the default), template `UI_SRC=1 npx vite --port 5191`
  (BFF: `npx wrangler pages dev dist --port 8796`).
