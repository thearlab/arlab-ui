# Contour V2 beta.16

This release implements all five requests in REQUESTS-BETA15-FROM-DASHBOARD.md, fixes compressed small headings and adds fixed record actions.

- CommandPalette items accept `group`, with accessible group headings and consistent keyboard/search order.
- PillButton adds `variant="quiet"`, a tone dot, count and borderless soft selection. Default button behavior remains available, with native attributes forwarded.
- TabStrip accepts strings and counted `{label,value?,id?,count?,disabled?}` options. Callbacks keep stable string values; counts include zero and keyboard navigation skips disabled tabs.
- AppHeader adds `pageActions` beside search and before global actions, with phone wrapping.
- SidebarShell restores solid department tiles, white icons, an accent selection square, ink app tiles and group dividers. It keeps the real ARLAB mark, account/help footer, counts, tooltips, keyboard movement and phone drawers. Dedicated solid-fill tokens retain white-icon contrast in dark mode without altering softer chart tones.
- Small h2/h3, RecordSection and Panel titles use normal letter spacing.
- RecordBody adds `footer` / `footerRef` outside its content scroll; empty targets occupy no space. Tab selection resets only the detail scroll position, preserving the collection's place.
- CopyBlock supports application clipboard/error callbacks and visible failure recovery.

Validation: package TypeScript/build and scoped CSS checks pass; 130 component exports and 146 icons remain. All 85 public component regressions and 60 theme contrast pairs pass. Browser review covered the spaces rail in light/dark/phone, grouped command search, phone header actions and quiet filters. Studio's full-width Agent/Workflow tabs and fixed action footer were reviewed on desktop and 390px phone, without live writes.

Install using the immutable tag `v2.0.0-beta.16`. Earlier tags and legacy entry points remain unchanged. See REQUESTS-BETA15-RESPONSE.md for the dashboard integration details.
