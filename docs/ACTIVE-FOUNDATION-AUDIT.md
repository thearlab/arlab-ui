# Active Contour runtime foundation audit

Scope: the 37 JavaScript, JSX, TypeScript and TSX component/runtime files in src/contour, excluding the foundation modules themselves. CSS is audited separately. Legacy v1 source and the retained Edition/Instrument exports are compatibility surfaces, not active Contour styling.

## Corrected

- PhaseBar no longer embeds the old #8d617d fallback. Each phase inherits its chart token and then the active accent; explicit application phase colors remain supported.
- ColorPicker no longer forces a fixed pink for an invalid value. Its native swatch fallback and validation example read the active Contour mode's accent from tokensFor. Valid application colors remain unchanged.
- DeptTile fallback color follows shared department, navigation and accent tokens. The explicit white foreground fallback is retained because the user requires white department icons.
- The root agent is updating the shared Icon stroke fallback from the previous 1.65 to the approved 1.5.

## Reviewed and preserved

- Inline chart widths/heights, virtual table spacers, picker placement, drag transforms and progress widths encode data or geometry rather than old palette styling.
- Avatar sizing scales initials with the requested avatar size. Image corners inherit the parent, and no inline font family overrides the new type foundation.
- ColorPicker swatches, calendar item colors, phase colors and Kanban column colors are application-owned data. They remain customizable.
- Logo and document SVG paths retain their own drawing geometry. They do not set old font families or background colors.
- Editor fields reuse Input, including inline editing. Their focus and chrome treatment comes from the shared stylesheet rather than inline outlines or shadows.

The active runtime scan now finds no Manrope, IBM Plex Mono or Inter font-family literals. Outside the foundation modules, the only remaining hexadecimal visual literal is DeptTile's intentional white icon fallback. This is a source finding, not a claim that every rendered component state has been visually reviewed.

## Validation

Full package build, fresh strict consumer declarations and export/style checks pass. Three regressions verify the source-family invariant, both modes' ColorPicker fallback without changing valid values, and theme-aware phase colors with application overrides preserved. Run node --test tests/active-foundation-source.test.mjs.
