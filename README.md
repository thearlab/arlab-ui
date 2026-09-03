# @arlab/ui

Shared design tokens and UI primitives for ARLAB's internal tools. Built for Agents Studio (`arlab-studio`) and ARLAB Knowledge (`arlab-docs`), and meant for any internal tool built after them.

Private package, installed as a git dependency (no registry):

```json
"dependencies": {
  "@arlab/ui": "github:thearlab/arlab-ui#v0.1.0"
}
```

Pin to a tag, not a branch, so a consumer app never picks up an unreviewed change on install.

## Usage

Load the two typefaces (same as the public site and every internal tool already do) and the stylesheet once, at your app's entry point:

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```
```ts
import '@arlab/ui/styles.css';
```

Then use the primitives:

```tsx
import { Button, Card, CardHeader, Badge, Row, ArlabList, Field, Label, Input, Skeleton, ThemeToggle, initTheme } from '@arlab/ui';

initTheme(); // call once on boot, before first paint, to avoid a theme flash
```

## Tokens

`styles.css` — light is the default palette, dark applies via `[data-theme="dark"]` or `prefers-color-scheme`. Same variable names both apps already used (`--ground`, `--raise`, `--ink`, `--accent`, ...), so migrating either app is a rename, not a rewrite.

- **Type**: Outfit (UI/body — real ARLAB brand equity, don't swap it) + JetBrains Mono (IDs, keys, timestamps — an actual "instrument readout" face, not whatever system mono the OS falls back to). `--text-2xs` through `--text-3xl`, all rem-based so browser text-size/zoom preferences still work.
- **Radius, three tiers with a reason**: `--radius-xs` (6px — structural/data-entry: inputs, rows, tags), `--radius-sm` (8px — floating utility: buttons, popovers, menus), `--radius-md` (14px — elevated content: cards, dialogs, dropzone), `--radius-pill`.
- **Motion**: `--ease` is theARLab's actual verified site easing (`cubic-bezier(0.16,1,0.3,1)`), not an approximation.

## Favicon

Every ARLAB app uses the same favicon shape: a **black rounded square** with a **single ARLAB-pink icon** (`#e414db`), as an **SVG** (crisp at every size, theme-independent). `favicon.svg` in this repo is the canonical default — the ARLAB mark on black. Copy it into your app and link it:

```
public/favicon.svg          # copy the file here
```
```html
<!-- index.html <head> -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

To make it your own tool's icon, keep the black rounded-square background and the pink fill, and swap the inner glyph for something relevant to the tool. Same recipe, different symbol, so every ARLAB app reads as one family. (The internal-tool template already ships this favicon; you only change the glyph.)

## What's here

Primitives: `Button`, `IconButton`, `Card` (+ `CardHeader`/`CardTitle`/`CardDescription`/`CardBody`/`CardFooter`, plus `rail` and `accentHover` variants), `Badge`, `Chip`, `Avatar`, `Row`/`ArlabList`, `Field`/`Label`/`Input`/`Textarea`/`Select`, `Checkbox`, `Radio`, `Switch`, `SegmentedControl`, `Dropzone`, `TagInput`, `Skeleton`, `LoadingBar`.

Navigation & overlays: `Navbar`/`NavbarBrand`/`NavbarSpacer`, `Tabs`, `NavTree`, `Toc`/`useScrollspy`, `Breadcrumbs`, `Popover`, `DropdownMenu`, `ComboboxPicker`, `CommandPalette`, `Dialog`, `Toast`/`ToastProvider`/`useToast`, `Tooltip`, `Collapsible`.

Content: `Steps`, `LegendDot`, `Kicker`, `Timestamp`/`formatRelativeTime`.

Icons: a custom 21-icon SVG set, one shared recipe (24×24, 1.6 stroke, round caps/joins) — import any icon directly, e.g. `import { SearchIcon } from '@arlab/ui'`.

## Design rules this encodes

From ARLAB's anti-AI-slop playbook, plus what later passes fixed:

- Cards are the exception, not the default — reach for `Row`/`ArlabList` first.
- No mono-uppercase labels on every string. `Kicker` exists for a genuine eyebrow, used rarely — not the default label style.
- One accent, used sparingly (`--accent-tint` for surfaces, `--accent-deep` for text-on-light, raw `--accent` only for small fills and the primary button).
- Skeletons instead of loading text; `LoadingBar` instead of nothing for a route change or long fetch.
- Real nuanced light and dark palettes, not an inverted single palette.
- One primitive per concept, composed rather than configured (`Card` + `CardHeader`/`Body`/`Footer`, not a dozen props).
- Every primitive defends its own layout (a `Badge` stays a pill even inside a stretching flex column) and its own `box-sizing`/focus ring — none assume a consumer's global reset.
- **The reticle**: a corner-bracket motif (`.arlab-reticle`) used on exactly two surfaces — `Dialog` and `CommandPalette` — the "focused attention" moments. Deliberately not used anywhere else; a signature stays a signature only if it isn't wallpaper.

## Releasing a change

Bump `version` in `package.json`, commit, tag (`git tag v0.1.1 && git push --tags`), then bump the `#v0.1.1` ref in whichever app's `package.json` should pick it up and run `npm install`.
