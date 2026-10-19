# ARLAB UI 2.0.0-beta.32

Pin `github:thearlab/arlab-ui#v2.0.0-beta.32`. Earlier tags remain unchanged.

Department navigation now uses its own colour: outlined icon at rest, subtle own-colour icon hover, then a filled icon when active. The surrounding row stays transparent without a background strip. Regular page links retain the shared selected-page treatment. `NavigationItem department` supports this identity in single-navigation compositions as well as the spaces rail.

The outer rail keeps its logo variants and labels mounted while its width changes. Crossfades and clipped label transitions avoid the previous reflow jump; reduced motion disables animation.

`Logo` renders the canonical ARLAB vector without an appended decorative dot. Apps should use `Logo` or `ArlabMark` directly rather than adding their own glyphs or decoration.

`DayTimeline` keeps the day-selector separator directly above its task rows and removes individual task borders. Entries remain independently scrollable. Pressed shared text buttons now retain their selected tint through the chrome styling cascade.

Fields now use shared `field-surface`, `field-gradient`, `field-shadow` and `field-hover-shadow` tokens for a recessed finish. Input, textarea, search, dropdown, tag entry and date triggers receive that paint through one shared mapping. Existing geometry, error borders, quiet focus and embedded-input behavior remain unchanged. Buttons retain the raised chrome.

`InfiniteTable stickyGroups` pins the current category beneath column headings without changing virtual row geometry. `SectionHeader sticky` supports card catalogues. `PageFrame` removes its outer footer padding when the native SaveBar owns that surface. The standard PageLoading no longer renders a logo; optional application-supplied marks remain supported.
