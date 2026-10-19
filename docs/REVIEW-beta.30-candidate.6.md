# ARLAB UI 2.0.0-beta.30-candidate.6

Local review candidate, unpublished. Includes all candidate.5 contracts.

- GuidedTour fades its card and spotlight out for 90ms, repositions while hidden and fades in using the shared fast motion duration. It no longer animates positional coordinates or smoothly scrolls across the page. Repeated navigation is guarded during a move, closure cancels pending transitions, focus follows the new step, and reduced motion skips the exit delay.
- SidebarShell's outer rail footer has no divider above its controls. Both department spaces and NavigationItem use the same normal, neutral-hover and pink-active treatment. Active styling persists during hover, fills the complete entry width and uses a stronger label without a left stripe. Department glyphs keep their original colors. Standalone navigation includes these states without requiring a provider.
- Shared foundation tokens `nav-hover-surface`, `nav-active-surface` and `nav-active-border` define the navigation states in both color modes.
- KanbanBoard places its horizontal gutters inside the scrolling track, so scrolling no longer clips cards at a stationary internal gutter. Optional `bleed` extends the viewport through PageFrame's horizontal content inset while retaining the initial card alignment. Leave it off beside an independently arranged filter panel. No content paints over the application's sidebar.
- PageFrame exposes its content gutter as `--page-content-inset`; padding="none" resets it to zero. Custom parents may provide the same variable for a bleeding board. Existing inset="flush" remains available.
- PageBar's existing pillsPlacement="below" aligns actions with the title. A PageFrame header avoids adding PageBar's standalone bottom padding a second time.

The dashboard uses the shared package. Its Ongoing projects page places the project-track tabs below its heading and enables the bleeding board when filters are closed. No application overrides of library navigation, tour or board CSS are required.

Validation includes mounted desktop tour transitions and cancellation, both navigation modes, shared CSS contracts, TypeScript/public declarations, component export checks and the consuming dashboard build. No publication or deployment is included.
