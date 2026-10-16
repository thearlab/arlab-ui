# ARLAB UI V2

Contour is the target system for all internal tools. Read README.md and MIGRATION-V2.md first.

- Root exports and styles are Contour; v1 source remains for the temporary legacy entry.
- Source: src/contour. Build with npm run build; preserve all existing validation gates.
- Add shared components here and update arlab-ui-showcase in the same release.
- Pin application consumers to an immutable version tag, never a branch.
- Keep all Contour rules scoped to .arlab-contour. Manrope and IBM Plex Mono are loaded by consumers.
- Keep existing v1 tags, remote v2 WIP and other local branches untouched.
- Studio is the first application migration. Test actual workflows before deployment.
- This integration beta still has demo defaults in some compositions; do not claim all apps are migrated or production-ready merely because the package builds.

Historical v1 guidance is documented in docs/V1-README.md.
