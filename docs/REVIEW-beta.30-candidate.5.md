# ARLAB UI 2.0.0-beta.30-candidate.5

Persistent, local, unpublished recovery candidate. Source is the immutable beta.29 commit bb6611d3428e5ec86c538ba6cc02bad876fe53fc plus the saved candidate.0 audit patch. The original source checkout is untouched.

Restored contracts:

- `PageLoading layout="container" | "viewport"` is optional and defaults to container. Container loading inherits a bounded parent's full width/height; viewport explicitly sets 100dvh for application boot. Content-preview and legacy signature variants both honor the mode. Centered copy, logo, animated placeholders, cancellation and one status announcement remain available. Reduced-motion styling remains in the shared library.
- `DayTimeline daySize="regular" | "compact"` is optional and defaults to regular. Compact reduces shared day-selector spacing and typography, preserving selection, disabled days, callbacks and schedule content.
- Generic TabStrip labels/counts keep their intrinsic width on one line. Standalone strips scroll horizontally; collection and board wrappers retain their existing outer scroll ownership, bottom separators and inset contract.

Candidate.0 contracts, including compact embedded loading, NavigationProgress, weekly chart labels, stacked facts and multiline table cells, are retained. This recovery does not claim every later temporary consumer edit survived. Consumer integration is tracked separately.

```json
"@arlab/ui": "file:vendor/arlab-ui-2.0.0-beta.30-candidate.5.tgz"
```

Validation covers the full library build/public types and rendered/CSS contracts. No publication, deployment, production API writes or new mobile review is performed. Tests do not claim browser geometry.
