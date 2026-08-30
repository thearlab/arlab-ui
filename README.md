# @arlab/ui

Shared design tokens and UI primitives for ARLAB's internal tools. Built for Control Room (`arlab-studio`) and ARLAB Knowledge (`arlab-docs`), and meant for any internal tool built after them.

Private package, installed as a git dependency (no registry):

```json
"dependencies": {
  "@arlab/ui": "github:thearlab/arlab-ui#v0.1.0"
}
```

Pin to a tag, not a branch, so a consumer app never picks up an unreviewed change on install.

## Usage

Import the stylesheet once, at your app's entry point:

```ts
import '@arlab/ui/styles.css';
```

Then use the primitives:

```tsx
import { Button, Card, Badge, Row, ArlabList, Field, Label, Input, Skeleton, ThemeToggle, initTheme } from '@arlab/ui';

initTheme(); // call once on boot, before first paint, to avoid a theme flash
```

## What's here

- **Tokens** (`styles.css`): light is the default palette, dark applies via `[data-theme="dark"]` or `prefers-color-scheme`. Same variable names both apps already used (`--ground`, `--raise`, `--ink`, `--accent`, ...), so migrating either app is a rename, not a rewrite.
- **`Button`**, **`Card`**, **`Badge`**, **`Row`/`ArlabList`** (a divided list, use instead of boxing every list item in its own card), **`Field`/`Label`/`Input`**, **`Skeleton`** (a shimmer placeholder, never ship bare "Loading..." text), **`ThemeToggle`** + **`initTheme`/`setTheme`/`getTheme`**.

## Design rules this encodes

From ARLAB's anti-AI-slop playbook: cards are the exception not the default, no mono-uppercase labels on every string, one accent used sparingly (tint for surfaces, deep for text-on-light, raw accent only for small fills), skeletons instead of loading text, real nuanced light and dark palettes rather than an inverted single palette.

## Releasing a change

Bump `version` in `package.json`, commit, tag (`git tag v0.1.1 && git push --tags`), then bump the `#v0.1.1` ref in whichever app's `package.json` should pick it up and run `npm install`.
