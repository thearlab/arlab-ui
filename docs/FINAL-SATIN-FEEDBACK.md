# Satin Lift feedback integration

This pass updates shared implementations in `@arlab/ui`. The showcase consumes the built package. Preview-only copies of the sidebar, account identity, chip action and milestone date treatment have been removed.

## Shared contracts

- SidebarShell: only the outer spaces rail folds. The inner tools panel stays open. Real full/square ARLAB marks follow the rail state. Footer actions share neutral icon tiles and outside labels. Account identity stays in the fixed tools-panel footer.
- AccountMenu: informational avatar, name and role; only Log out is interactive. `onLogout` is preferred; the former `onSelect('Log out')` callback remains a fallback. Former account menu items no longer render.
- Checkbox: checkbox and label share the first line; supporting text spans the line below. Optional trailing metadata keeps filter counts on the right. Label and hint retain accessible associations.
- ScrollArea: optional title, description, actions or custom header create a framed variant. The supplied height includes its fixed header. Internal unframed scrolling primitives retain their geometry.
- CollectionGroup: composes Panel, Rows and Row so hover, spacing and actions follow the same implementation as the workspace.
- EditorLayout: shared viewport controls, independent preview/inspector scrolling, fixed footer and a shared inspector sheet at narrow widths.
- CodeDisplay: application-supplied QR/Snapcode, high-contrast scan plate, shared destination Input and ActionGroup, copy recovery, image failure and asynchronous download feedback. It does not generate QR codes.
- Chip: optional action behavior supplies compact Reset tags without bespoke showcase styling. Timestamp supports date-only rendering and sizes to its contents. Department labels use compact pills.
- Stat and StatNoteRow: separate captions and aligned label, value, note and caption tracks. Numbers remain neutral.
- RankList and Row: full-width neutral hover with consistent content padding; trailing figures stay aligned.
- ActionGroup: optional overflow actions use the shared DropdownMenu. Public actions retain canonical control sizing.
- Calendar: square date controls, with 36px desktop dates and 44px touch targets. Embedded dates are semantic native buttons rather than full-sized public toolbar buttons.
- Dialog, Sheet and ConfirmDialog: no separator above footer actions; fixed footer and scrolling content remain independent.
- StateView and Loader: restrained shared state presentation and a circular loading outline. Content-preview loading is the selected default; centered message stays still while skeleton opacity pulses gently. Reduced motion disables animation.
- TabStrip: bottom border only. Selection options do not underline labels on hover.

## Foundation

Satin Lift uses 14px panel corners, 7px controls, neutral dark surfaces, shared pink action tokens and DM Mono for code. Satoshi replaces Urbanist for interface and headings, with heading weight 600.

The user-selected white text on bright pink and vivid department glyph colors include documented contrast exceptions. See the showcase color report; these combinations are not described as a full AA pass.

## Regression prevention

The CSS build guard now checks every active Contour stylesheet and rejects selectorless blocks. Previously, selector removal could leave declarations that the scoping build accidentally converted into `.arlab-contour` rules affecting every component. A regression test reproduces and rejects that failure.

Satoshi delivery uses the official Fontshare service. The review browser loaded the publisher stylesheet and passed its font check. Direct command-line downloads are blocked, so the font is served by its publisher rather than bundled. The tokens and showcase default are Satoshi; DM Mono remains locally packaged.

## Follow-up refinements

All accent roles and compatibility aliases now resolve to the main pink in their active mode, including icon, link, focus, navigation and primary hover states. No darker pink literal remains in library source. PageLoading animates only its content placeholders, without a central spinner. Refreshing centers the shared accessible Loader over existing content without a visible badge. DayTimeline empty content has shared 16px padding. KanbanBoard hides custom scrollbar controls through the reusable ScrollArea hideScrollbar option while retaining native scroll viewports and gestures.
