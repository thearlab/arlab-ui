# ARLAB UI 2.0.0-beta.38

Custom ScrollArea indicators stay hidden while idle. They appear when their own scroll area is hovered or scrolled, remain visible while dragging or when a thumb has keyboard focus, and fade after scrolling stops. The existing thin rectangular appearance, accent color, geometry, native scrolling, axis behavior, hidden-scrollbar option and drag/keyboard controls remain. Hovering an outer scroller does not reveal nested indicators. Timers are cancelled on unmount; reduced-motion users get an immediate state change.
