# v2 build plan (internal, for the people and agents building v2)

## Conventions (every component)
- Folder = group. One `.tsx` per component or close family, a group barrel `src/<group>/index.ts`, one
  stylesheet `src/<group>/<group>.css`, all rules inside `@layer ar-components { ... }`.
- Class names `ar-<component>[-part]`, variants as `ar-<component>--<variant>` or `data-*` attributes.
  Never style by tag outside the component root. Logical properties (`inset-inline-start`,
  `margin-inline`, `padding-inline`) so RTL works.
- Tokens only (`src/tokens/tokens.css`): colours, radius, space, type, motion, z, shadows. No hex in
  components except inside SVG art. Status colours only for state/data.
- `'use client';` first line of every .tsx with hooks or handlers. `forwardRef` for anything that renders
  a native focusable control. Spread `...rest` onto the root/native element. `className` merges via `cx`.
- Controlled + uncontrolled: `value`/`defaultValue`/`onChange` (or `open`/`defaultOpen`/`onOpenChange`)
  through `useControllable` from `src/hooks`.
- Accessibility (HIG baseline): semantic HTML first; every control named; full keyboard (see the WAI-ARIA
  APG pattern for the component); visible focus (the global `:focus-visible` ring, do not remove it);
  focus trapped in modals and returned on close (`useFocusTrap`); Esc and outside click through
  `useDismiss` (one overlay stack); live regions for async status; never colour alone; targets >= 24px
  (44px on coarse pointers via the `--h-*` tokens); text in rem tokens.
- States: hover, active (pressed), focus, disabled, loading, error, empty, where they apply. Each is a
  story state. Long text truncates with ellipsis or wraps, never overflows (`min-width: 0` on flex and
  grid children holding text). Phone width (390px) must not scroll sideways: wide things (tables, boards,
  grids) scroll inside their own box, marked `data-scroll-x` or class `ar-scroll-x`.
- Motion: only in answer to a person. `--dur-press` for press/hover, `--dur-small` for popovers, menus,
  tooltips, toasts, `--dur-panel` panels, `--dur-sheet` sheets and dialogs, easing `--ease-out` in,
  `--ease-in` out. Reduced motion is handled by the tokens (durations become a fade); do not add motion
  that ignores them. Numbers and data are never animated.
- Copy: sentence case, plain words, no em dashes, never "ChatGPT", buttons are verb + object.
- Floating things: `Portal` + `useAnchored` (from `src/hooks`) + `place` logic. z-index tokens.
- Do not edit shared files: `src/hooks/index.ts`, `src/lib/{cx,keys,place,search,format,color,dates}.ts`,
  `src/core/*`, `src/layout/*`, `src/tokens/*`, `src/index.ts`, `src/index.css`, `src/stories/index.ts`,
  `src/stories/types.ts`, `tools/*` (except your own test file). Need a helper? Add a NEW file
  (`src/lib/<yours>.ts`, or a local hook inside your folder). Need a shared change? Say so in your report.
- Pure logic goes in `src/lib/<name>.ts` with unit tests in `tools/test/<name>.test.ts` (vitest).
- Stories: fill `src/stories/<your file>.stories.tsx` (`export const stories: Story[]`), one story per
  component, every state, `covers` = the dashboard inventory names it replaces. Overlays and full-page
  things use `isolate: true` and render open by default (via `defaultOpen`), so each state is its own page.
- Check before you report: `npx tsc --noEmit -p tsconfig.json` (in arlab-ui; ignore errors in files
  you do not own), `cd tools && npx vitest run`, `cd tools && node visual.mjs <your story ids...>` until
  it passes (no console errors, no overflow, zero axe violations in light and dark). Look at a few of the
  screenshots in `tools/out/` (light, dark, phone) and fix what looks wrong. Do not commit; the lead does.

## Ownership and names (exports must not collide)
| Owner | Folders | Story file | Exports |
|---|---|---|---|
| lead | tokens, lib (shared), hooks, core, layout, shell, patterns | core, layout, shell, patterns | Button, ButtonLink, IconButton, Spinner, Tooltip, VisuallyHidden, Portal, Kbd, SkipLink, SegmentedControl, ThemeToggle, AccentToggle, ArlabMark, ArlabTile, icons; PageGrid, Col, CardGrid, Stack, Inline; AppShell, Rail, ContextNav, TopBar, PageHeader, PageBar, MobileBar; Inspector, FilterBar, BulkBar, QueueBar, SectionHead, AsyncState, ReviewChanges |
| forms | forms | forms | Field, Input, Textarea, NumberInput, SearchInput, Select, Combobox, MultiSelect, TagInput, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Slider, DatePicker, TimePicker, FileUploader, MediaGallery, FormSection, FormGrid, FormActions, SaveBar |
| data | data, charts | data | Card (+ CardHeader, CardBody, CardFooter), Panel, StatTile, Badge, Pill, Chip, StatusDot, Avatar, AvatarGroup, Progress, Meter, Facts, List, ListRow, Table, SortHead, DataTable, Heatmap, Timestamp, EmptyState, Skeleton, SkeletonText, ListSkeleton; BarChart, LineChart, Sparkline, Legend |
| board-time | board, time | board-time | Kanban (+ KanbanColumn, KanbanCard, useKanban if needed), Timeline, CalendarMonth, CalendarWeek, MiniCalendar |
| nav-feedback | navigation, feedback | nav-feedback | Tabs, Tab, TabPanel (pill and line variants), Breadcrumbs, Pagination, CommandMenu, Alert, ToastProvider, useToast, LoadingBar |
| overlays | overlays, disclosure, content | overlays | Popover, Menu, MenuButton, ContextMenu, Dialog, ConfirmDialog, Sheet, SheetSection, Drawer, Accordion, Disclosure, Stepper, Tour, HelpButton, useTour, ChatBubble, ChatThread, ChatComposer, CodeBlock, CopyButton, Markdown, ReadableData |

Prop types are exported as `<Name>Props`. Sub-types are prefixed with the component name.
