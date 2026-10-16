# ARLAB UI V2: Contour

The shared design system for ARLAB internal tools. Manrope, IBM Plex Mono, restrained geometry, a porcelain/graphite foundation and ARLAB pink. This is the V2 integration beta; Studio is the first migration target.

```json
"@arlab/ui": "git+https://github.com/thearlab/arlab-ui.git#v2.0.0-beta.1"
```

```jsx
import { ContourProvider, Button } from '@arlab/ui';
import '@arlab/ui/styles.css';
// Load Manrope (400–700) and IBM Plex Mono (400) in your application.
export function App() {
  return <ContourProvider mode="light"><Button variant="primary">Create project</Button></ContourProvider>;
}
```

The root entry now exports Contour. Do not upgrade a v1 app by changing its dependency alone. Read [the migration audit](MIGRATION-V2.md), [complete component guide](docs/CONTOUR-GUIDE.md) and [machine-readable contract](docs/component-contract.json).

## Showcase

Repository: https://github.com/thearlab/arlab-ui-showcase. The Contour showcase imports the real package, covers 89 component entries and 145 curated icons, and includes light/dark layouts, independent double navigation, fixed-header/footer scrollable sidebars and loading states.

## Development

`npm ci` builds the package on install. `npm run build` validates legacy CSS, emits ESM and declarations, checks tour placement and scopes Contour CSS to its theme boundary. `npm run check:contour` checks every catalogue export, icon count and stylesheet boundary.

V1 remains available at the immutable v1 tags. Temporary `/legacy` and `/legacy/styles.css` entry points support staged application migration. New application work belongs in Contour; reusable additions must be showcased in the same release.

See MIGRATION-V2.md for beta limitations and remaining stable-release gates.
