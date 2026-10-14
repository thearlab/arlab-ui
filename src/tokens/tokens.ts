// The token values JavaScript needs (CSS media queries cannot read custom properties).
// Keep in step with tokens.css.

/** Viewport widths in CSS px. `phone` and below: one column, the rail becomes a bottom bar. */
export const BREAKPOINTS = { phone: 640, tablet: 820, laptop: 1180, wide: 1440 } as const;
export type Breakpoint = keyof typeof BREAKPOINTS;

/** Motion durations in ms (HIG motion doc, ARLAB values). */
export const DURATIONS = { press: 120, small: 180, panel: 320, sheet: 380, fade: 150 } as const;

/** The accents a product may pick. One per product. */
export const ACCENTS = ['magenta', 'violet'] as const;
export type Accent = (typeof ACCENTS)[number];

/** z-index ladder, same as the --z-* tokens. */
export const Z = { sticky: 10, rail: 20, dropdown: 40, overlay: 50, popover: 60, toast: 70, tooltip: 80, tour: 90 } as const;
