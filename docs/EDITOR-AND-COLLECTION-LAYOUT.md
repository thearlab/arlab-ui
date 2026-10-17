# Shared editor and collection layouts

Local review changes, not a new published version.

## EditorLayout

`EditorLayout` keeps the document header and save footer fixed. Its preview canvas and properties inspector use separate shared ScrollAreas, so a long form does not push the save action off-screen.

Existing `title`, `toolbar`, `sidebar`, `children`, `footer`, `onExit` and `style` props remain supported. Additional props are:

- `description`: optional supporting document context.
- `viewport`: controlled `desktop`, `tablet` or `mobile` preview size.
- `defaultViewport`: initial uncontrolled size, default desktop.
- `onViewportChange(viewport)`: preview size selection callback.
- `showViewportControls`: defaults true. Set false if an existing application toolbar already provides these controls.
- `propertiesLabel`: the inspector and narrow-layout sheet label, default Properties.
- `previewLabel`: the canvas rail label, default Live preview.

The three shared IconButtons are labelled Desktop, Tablet and Phone, expose their pressed state and retain standard keyboard activation and touch targets. The layout measures its own container, rather than assuming the entire browser is available. Below 760px the inspector becomes a shared Sheet opened from the document toolbar. Sidebar content is rendered once at a time. Keep form values controlled by the application when they must survive a change between the wide inspector and narrow sheet.

The preview size constrains the canvas; it does not change the application layout or create a second editor instance. Save, discard, validation and publication remain application-owned through the existing slots.

## CollectionGroup

CollectionGroup now composes the actual shared Panel, Rows and Row components. It inherits their title rail, container inset, full-width hover and typography rather than maintaining a parallel card style.

Existing `title`, `count`, `meta`, `items`, `onOpen` and `more` props remain supported. Items retain stable `id` and `label` and now optionally accept `description`, `leading` and `trailing` content matching Row. An item with `onOpen` is actionable; an item without it remains informational. Group View all and View more actions call the existing group `onOpen` callback. The whole group itself is not a button.

## Dialog footers and states

Dialog, Sheet and ConfirmDialog action areas retain their existing placement and spacing without the separator line above the buttons. Table pager, save bar and sidebar section dividers are unchanged.

StateView uses the shared Loader for loading, one live loading announcement and compact semantic icons for empty/error states. Its action slot, custom labels and retry/create callbacks remain supported. State copy is product-neutral unless the caller supplies more specific title and description text.
