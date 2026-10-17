# Contour V2 beta.19

This release keeps the current Contour foundation: the existing light/dark palettes, Manrope interface typography, IBM Plex Mono and ARLAB pink. Platinum proposals remain local and are excluded from the deployed showcase.

- Correct public optional prop declarations for application consumers, with a strict compile-only consumer check. Fields and panels can omit optional hints, titles and supporting content without casting or runtime adapters.
- Add Sparkles, Presentation, ShoppingCart, Megaphone, Building2 and Handshake, plus twelve social/platform icons. All 164 registry icons share the existing Lucide rendering contract.
- Remove Switch’s inherited bottom margin and empty label spacer, keeping its track, label and adjacent controls aligned.
- Route navigation and scrollbar accents through theme roles instead of fixed pink rules. Current Contour remains the default.
- Unify public Button and IconButton geometry through shared tokens. Text buttons are 38px high with 12px labels; phone/touch targets are 44px. ActionGroup equalWidth gives paired actions identical widths.
- Hide the header row and page-size select when a CollectionWorkspace condenses its table; preserve the range and Previous/Next. Tables support showCount=false independently of pager totals.
- Add danger-quiet for secondary destructive actions.
- Keep a phone header's record name visible above a full search field.
- Prevent generic Disclosure definition-list styling from adding a grey surface to shared Facts.

The broader dashboard request backlog remains tracked separately. This release does not claim those unrelated feature requests are all implemented.

Dropdown/Picker callbacks receive the existing event-shaped value object (`event.target.value`), not a browser-generated React.ChangeEvent. The declarations now describe that real contract. Application adapters should normalize native-select-only handlers and menu icon nodes where needed.
