# Contour foundation: Satin Lift

Approved on 17 October 2026. This replaces the earlier Contour foundation in the local library build; it has not yet been published as a release.

Interface uses Satoshi 400 and 500. Headings use Satoshi 600 with normal letter spacing. Code uses self-hosted DM Mono 400. Satoshi is requested from the publisher's official variable-font stylesheet; consumers need access to api.fontshare.com and its font hosts. The review browser loaded the publisher stylesheet and passed its font check; direct command-line font downloads remain unavailable in this environment. Local DM Mono assets are copied into dist/contour/fonts.

Containers, panels, dialogs and tables use 14px corners. Controls, buttons, tags and menus use 7px corners. The radius-panel and radius-control tokens describe those roles; existing radius aliases remain available. Spacing, text sizes, control heights, component APIs and responsive layout sizes are unchanged.

Light surfaces: page #F7F5F9, raised #FFFDFF, inset #EDE8F1. Dark surfaces: page #202022, raised #29292C, inset #1B1B1E, primary text #F4F4F6, secondary text #BDBDC5, line #414146. Dark greys are neutral, with no purple page wash. Page and chrome background gradients are none; a subtle two-layer surface gradient supplies the satin rim. Quiet chrome edges and Soft Lift shadows are shared tokens.

Main pink is #E414DB in light mode and #F04EE8 in dark mode. Light primary actions use exact #E414DB with no gradient. Dark actions use #F04EE8 with the documented white-label contrast exception. Links, icons, focus and emphasis use that same main pink. Orange #FB923C supports charts and accents; accessible orange text uses #984414 light and #FDBA74 dark.

Department colors follow the chart hue system. Department solid tokens retain the vivid chart colors with white glyphs. The contrast report records their explicit exceptions.

## Explicit brand contrast choice

The user requested exact #E414DB with white button labels in light mode. This is 3.87:1, below the 4.5:1 normal-text target. It is an explicit approved brand exception, not a passing normal-text combination. Links use the main pink and their light-mode contrast exceptions are also recorded. Dark primary buttons, semantic notes, primary/secondary text and department tiles are checked independently.

## Verification

Run node --test tests/satin-foundation.test.mjs. It checks the approved colors and fonts, radius roles, unchanged geometry, local DM Mono WOFF2 assets and the publisher Satoshi stylesheet, 36 text/semantic/tile contrast pairs, and the explicit light-action exception. npm run build packages the fonts with the shared stylesheet. Browser verification of the combined component styling remains part of integration review.
