# ARLAB UI 2.0.0-beta.39

All enabled buttons share a recessed glass/chrome response while activated. The interaction layer changes gradient and shadow only; colors, dimensions, focus indicators and semantic behavior remain. Disabled/busy controls and scrollbar thumbs are excluded. Department and navigation rows press their inner glyph rather than adding a full-row strip. Button/IconButton and other actual pressed toggles retain this finish while selected. Tokens: `button-pressed-gradient` and `button-pressed-shadow`.

`EditorLayout previewLayout="fill"` bounds an iframe or caller-owned preview to the available stage. The default `scroll` mode retains document scrolling. Canvas and inspector remain independent, and the footer stays outside both. A direct `SaveBar` in the footer owns the one full-width separator and its own control inset, avoiding doubled padding.

`Facts separators={false}` removes row rules and outer list margins while preserving cell padding, accessible term/value markup and responsive rows. The default remains ruled for existing consumers.

Dark Engineering uses a saturated orange identity fill (#C6530B), a brighter text/chart/accent (#FFA65C), and the shared white-label action contrast derivation. Secondary orange/warning roles and standalone navigation fallback follow the same family. Other department identities and light-mode colors stay unchanged.

The showcase uses the shipped fill preview and SaveBar, and demonstrates unruled Facts. All changes are backward-compatible opt-ins except the approved visual foundation updates.
