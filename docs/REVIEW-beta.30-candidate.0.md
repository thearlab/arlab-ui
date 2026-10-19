# ARLAB UI 2.0.0-beta.30-candidate.0

Local review candidate based on immutable `v2.0.0-beta.29`. This candidate is not published or tagged and does not upgrade or deploy any consumer. Approved typography, colors, satin surfaces, 14px panels and 7px controls are preserved.

The dashboard audit fixes are additive contracts:

- `StateView state="loading"` preserves compact or embedded layout with a bounded shared skeleton and one status announcement. Regular framed loading retains PageLoading.
- `NavigationProgress active={pending} label="Opening projects"`, exported from the root and `/loading`, owns an indeterminate fixed 2px top strip and reduced-motion behavior.
- `ColumnChart labelInterval={7}` shows weekly ticks across daily bars. Every datum retains exact hover/focus values and the full accessible data table.
- InfiniteTable column `lineClamp?: number | false` defaults to two. False lets a composite cell own its title/metadata line limits while the outer cell stays bounded to `rowHeight - 16` pixels. Virtualization retains fixed row geometry.
- `Facts layout="stacked"` puts each label above its value for narrow rails; the default remains rows.
- Disabled primary buttons retain a quiet background after the chrome cascade.
- TagInput imports Chip from a leaf module, removing its re-export cycle.

Use the packed archive locally:

```json
"@arlab/ui": "file:vendor/arlab-ui-2.0.0-beta.30-candidate.0.tgz"
```

Commit the consumer's vendor archive and updated package/lock files together when a commit is authorized. A normal `npm ci` can then install the exact reviewed artifact without substituting an unpublished Git tag.

Validation: the complete library build, fresh public consumer type checks, CSS/export checks and all 138 contract tests passed. Application build and browser verification belong to the consuming dashboard's review; this candidate does not claim every consumer is certified.
