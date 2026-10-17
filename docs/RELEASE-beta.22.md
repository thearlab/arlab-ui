# Contour V2 beta.22

Shared data, navigation and semantic-state polish. See [the complete implementation report](UI-KIT-POLISH.md) for all 16 findings and verification evidence.

## Consumption

```json
{"@arlab/ui":"git+https://github.com/thearlab/arlab-ui.git#v2.0.0-beta.22"}
```

The private library is distributed through its immutable Git tag and release archive. No npm registry package is published.

## Intentional presentation changes

Timestamp defaults to plain date-only text; request `showTime` or `format="datetime"` and `variant="chip"` for the previous kind of metadata treatment. Chip is borderless and smaller. Calendar dates are unboxed, Planning has its own hue, charts default to a single hue, ghost buttons are transparent, and the single navigation toggle lives in its fixed footer. Existing APIs remain available, including explicit categorical chart colours and CollectionCard media/footer slots. `railFooter` receives the actual boolean rail state.

Satoshi, heading weight 600, DM Mono, bright ARLAB pink primary buttons and browser-header title dots remain unchanged. The pink-only canvas/nav/container experiment remains isolated to the development proposal; it is not a shared foundation change.

## Validation and rollback

Library build, public consumer types and 88 regression tests pass. Showcase build, 108 interaction checks and the colour audit are required before deployment. Old Git tags remain immutable. Consumers can roll back by restoring their prior exact tag and lockfile; the showcase can redeploy its prior verified build.
