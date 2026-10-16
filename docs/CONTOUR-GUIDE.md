# Contour design system

ARLAB internal applications · Version 0.1 · October 2026

Contour is the selected design language for Workspace, Agents Studio and Knowledge. This repository contains an interactive React library and sample layouts. Application data, sign-in, uploads and agent runs are demonstrations; production services are not connected.

## Design principles

- Make location obvious. Keep app selection, page navigation and contextual navigation distinct.
- Use clear labels, consistent alignment and generous spacing before adding decoration.
- Use one primary action per decision. Secondary actions retain a visible border or underline.
- Use restrained corners: 3px details, 5px controls, 8px floating surfaces. Circles are reserved for meaningful symbols and avatars.
- Typography is Manrope. IBM Plex Mono is reserved for code, identifiers and compact time values. No Inter.
- Avoid gradients, glowing controls, oversized icon badges, decorative dashboards and em dashes in interface copy.

## Color and contrast

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | #F7F7FA | #201D25 |
| Raised surface | #FFFFFF | #29252F |
| Inset surface | #F0F0F5 | #19161F |
| Main text | #24212A | #F3EFF6 |
| Supporting text | #66616E | #B8AFBF |
| Quiet separator | #E1DEE7 | #49414F |
| Essential control outline | #908897 | #8D8297 |
| Brand pink | #E414DB | #F04EE8 |
| Text links and emphasis | #A80FA3 | #F47CEE |
| Primary button surface | #A80FA3 | #F04EE8 |
| Primary button label | #FFFFFF | #251123 |
| Primary hover | #8E0D89 | #F47CEE |
| Selection wash | Brand pink at 8–10% | Brand pink at 10–14% |
| Selection outline | Brand pink at 35% | Brand pink at 40% |
| Sparkline | #8D617D | #CAA1BB |

The light primary button deliberately uses deeper pink with a white label. White on the bright brand pink is insufficient for small text; the accepted deep-pink combination is 6.44:1. Bright pink remains appropriate for active markers and progress. Dark-mode primary labels use dark ink for contrast.

Department colors share a muted pink, plum and lavender family. Their meaning is organizational, not status. Creative, Engineering, Client services and Company have distinct tokens. Charts use a related six-color scale with labels and table alternatives. Success, warning, failure and information retain separate semantic colors and explicit labels.

Quiet separators group already-understandable content. Essential controls use the stronger outline token. Disabled controls are visibly disabled. Selection never depends on color alone: include a check, underline, shape, label or selected-state announcement.

`npm run check:colors` verifies 46 foreground/background pairs in both themes. This is a token audit, not a complete accessibility certification. The intentionally subtle scrollbar is supplementary to native wheel, touch and keyboard scrolling.

## Typography, spacing and geometry

| Use | Font / size | Weight / leading |
| --- | --- | --- |
| Page heading | Manrope, 28–34px | 500–600 / 1.2 |
| Section heading | Manrope, 18–22px | 500–600 / 1.35 |
| Body | Manrope, 14px | 400 / 1.5 |
| Reading content | Manrope, 14–16px | 400 / 1.75 |
| Form controls | Manrope, 13px | 400–500 / 1.5 |
| Supporting labels | Manrope, 11–12px | 400–500 / 1.5 |
| Compact metadata | Manrope, 10–11px | 400 / 1.6 |
| Code and timestamps | IBM Plex Mono | 400 / 1.6 |

Use tabular numbers for counts and metrics. Reading columns should remain approximately 64–72 characters wide. Never truncate essential instructions or errors. Single-line identity labels may truncate when the complete value is available through context or a title.

Spacing uses a 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48 and 64px. Related controls generally use 8px gaps, form fields 18–24px, page sections 28–32px. Desktop controls are 38px high; touch controls target 44px. Small contextual reset actions use a 28px visual height on fine pointers.

Use a 1px separator, a 1px essential control border, and elevation only for floating content. Regular input focus is a 1px deeper-pink border with a faint 2px wash. Buttons retain an explicit keyboard focus outline. Do not remove focus indicators to simplify the appearance.

## Actions and iconography

Primary, secondary, quiet, ghost and destructive actions share one Button implementation. In Contour, even the legacy ghost variant has a subtle border and surface. Cancel, Show a toast, reset and disclosure actions must be visually identifiable before hover. A text link keeps its 1px underline on hover; hover changes underline contrast, not thickness.

Button icons are 14px, with comfortable surrounding space. Compact reset icons are 11–12px. Navigation icons are normally 16px, section icons 24px. Icon-only actions have accessible names, tooltips and the same hit area as equivalent text actions. Keep the icon centered rather than enlarging it to fill the button.

The icon library contains a curated Lucide set, preserving the original ISC license. It is not a new custom-drawn icon family. The gallery supports search, category filtering, size previews and copyable usage. The exported ZIP includes standalone SVGs; the sprite and JSON manifest support other integrations.

```jsx
import { Icon } from './src/icons';
import { IconButton } from './src/library';

<IconButton label="Open settings" onClick={openSettings}>
  <Icon name="Settings2" size={14} />
</IconButton>
```

## Layout and navigation

### Application shell

The expanded sidebar is 210px wide and collapses to a 68px rail. Its collapse/expand button belongs inside its own header and remains available in the compact rail. The desktop preference persists locally. Applications, Workspace and Team spaces use named sections and clear separators. Account and help actions occupy a separate footer.

Between 760px and 1099px, a compact main rail remains visible next to contextual navigation; its internal control opens the full navigation drawer. Below 760px, the rail is hidden and a header control opens that drawer. Its close control is inside the drawer. Native dialog behavior supplies focus containment and Escape dismissal. Main and contextual navigation have independent state.

### Dual navigation

Agents Studio places a searchable agent list beside the inspector. Knowledge places a document tree beside the reading surface. Both contextual panels have their own internal toggle. At small widths, context moves above the detail rather than squeezing two sidebars next to narrow content. Collapsing the main navigation must never collapse or change the current agent/document selection.

### Dashboard

The summary is a shared surface with four equal metric columns. Each metric has a label, a large tabular value, and supporting text on separate aligned rows. At a content width of 680px or less, metrics become a balanced two-by-two grid. The priority action, project collection and secondary activity rail follow the same page spacing.

### Reusable page patterns

1. Overview: page heading, summary, next action, project list and activity.
2. Collection: search, filters, list/grid choice, visible count, empty state.
3. List and detail: contextual selector, selected object, actions and detail tabs.
4. Reading: document tree, readable column, contents rail and document actions.
5. Editing: labeled fields, hints, validation, dirty state, Save and Cancel.
6. Operations: timeline, chart/table alternative, calendar or board with keyboard actions.
7. Loading/access: explicit context, one status message and a clear next step.

## Dropdowns and scrolling

Dropdowns use a custom top-layer panel that matches the measured width of its trigger. The panel clamps to the viewport and opens above when there is insufficient space below. Use the same surface, corner, separator and selected-state tokens as the rest of the system.

- Arrow keys navigate enabled options; Home and End jump to the first and last.
- Enter commits; Escape closes and returns focus; Tab leaves the control.
- Search appears automatically with eight or more options, or when explicitly requested.
- Options can include descriptions, counts and a disabled state.
- `onChange` receives `{ target: { value, name }, currentTarget: { value, name } }`.
- `name` emits a hidden form value. Custom required-selection validation remains the consuming form's responsibility.

ScrollArea preserves native scrolling and adds a rectangular pink indicator at the right edge. The visible thumb is 2px wide, at most 28px long and 35% opaque, increasing to 60% on hover/drag. Its invisible drag target is wider. It appears only when content overflows. Horizontal scrolling follows the same treatment along the bottom edge. Wheel, touch and focused keyboard scrolling remain available.

Other native scroll regions use the same pink and transparent track. Browser-native thumb length follows the content ratio; use ScrollArea when the short fixed-cap indicator is required. Firefox's native fallback uses its own thin width.

```jsx
<ScrollArea label="Recent activity" height={240}>
  <Rows>{activity.map(item => <Row key={item.id} {...item} />)}</Rows>
</ScrollArea>
```

## Loading, feedback and motion

Loader uses a fine traveling stroke around a small geometric outline. PageLoading provides workspace context, a clear title, explanatory text and one status announcement. It does not fabricate a completion percentage. Use LoadingBar only when actual progress is measurable. Use Skeleton for partial content, Refreshing to retain already-loaded data, and StateView for recoverable failures or empty collections.

The dedicated Loading page includes manual completion/replay controls to review the transition. Production callers must replace loading with content or an actionable error when their request resolves. The optional Cancel callback must abort the real operation.

Default transitions are 120ms for immediate feedback, 180ms for controls and 240ms for larger surfaces. Honor reduced-motion preferences. The geometric loader becomes static when reduced motion is requested, while the text still explains the state.

## Content and interaction contracts

- Buttons use a verb describing the result. Links describe their destination.
- Native inputs retain normal keyboard behavior. Labels remain visible after typing.
- Field connects its label, hint and error IDs to the child control.
- FileUpload accepts one PDF, Markdown or text document up to 10 MB by default. It validates locally, exposes remove/replace controls, and never uploads by itself.
- Modal dialogs and sheets use the native dialog layer. Destructive confirmations initially focus the safe action.
- Toast confirmations do not steal focus. Persistent problems belong in an inline Notice.
- AccountMenu aligns its avatar, two-line identity and separate chevron on one centerline.
- Timestamp uses a semantic time element inside a quiet outlined metadata container.
- DataTable provides selection, filtering, sorting, pagination and explicit row actions. SortHead stays a standard sort button with aria-sort; no drag interaction is introduced.
- Kanban has a move-to-column dropdown in addition to dragging. Essential actions cannot depend on dragging.
- Markdown is a deliberately limited renderer for headings, paragraphs, lists and fenced code. It escapes content and does not support raw HTML. Use a maintained sanitized parser if production requires richer Markdown.

## Using the source

Import components from `src/library.jsx`, icons from `src/icons.jsx`, and tokens from `src/system.js`. Load styles in this order: `styles.css`, `contour.css`, `library.css`. Load Manrope 400/500/600/700 and IBM Plex Mono 400. The demo bundles fonts locally.

```jsx
const tokens = tokensFor('contour', mode);
<div data-direction="contour" data-mode={mode}
  style={Object.fromEntries(Object.entries(tokens).map(([key,value]) => [`--${key}`,value]))}>
  <Field label="Project name" hint="Use the name your team recognizes.">
    <Input value={name} onChange={e => setName(e.target.value)} />
  </Field>
  <Button variant="primary" onClick={save}>Save project</Button>
</div>
```

Prefer controlled values in production forms. Callback contracts do not imply a network operation. The demos intentionally keep changes local. Wire persistence, authentication, server-side validation and error recovery in the consuming application.

## Migration and verification

Use the explicit Layout examples selector to switch between Workspace and the Agents or Knowledge double-navigation examples. Both left panels are visible side by side from 760px upwards.

Migrate one vertical slice at a time: tokens and fonts, shared actions and fields, shell/navigation, collection/detail views, then specialized operations. Replace duplicated visual patterns with the shared component while retaining domain logic in each app. Compare the existing ARLAB design-system inventory against the generated component contract before removing legacy components.

Run `npm test`, `npm run check:colors`, `npm run docs`, and `npm run build`. Component tests use a DOM emulator and cover rendering, state and keyboard interactions. They do not prove visual alignment or native browser focus behavior. Final browser checks should cover both themes at 390, 768, 1024 and 1440px, zoom, keyboard-only operation, overlays, drawer dismissal, scroll dragging and reduced motion. The connected browser tool was unavailable during this implementation, so a complete visual browser audit remains outstanding.

The generated sections below are synchronized with the live catalogue and token source.

## Complete component contract

89 implemented entries, including compatibility aliases. All have live specimens in the catalogue.

### Actions

#### Button

A clear action with primary, secondary, quiet, ghost, or destructive emphasis.

Use one primary action per decision. Cancel always has a subtle border and surface.

Import: `import { Button } from './src/library';`

| Prop | Contract |
| --- | --- |
| `variant` | primary  /  secondary (default)  /  quiet  /  ghost  /  danger. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `onClick` | Action callback. Use a link for navigation. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Button](http://127.0.0.1:5173/?view=catalogue&component=Button)

#### IconButton

A compact, named action for familiar symbols.

The accessible label describes the action. Touch targets expand to 44px.

Import: `import { IconButton } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `onClick` | Action callback. Use a link for navigation. |
| `children` | React content. Keep text concise and accessible. |

Live example: [IconButton](http://127.0.0.1:5173/?view=catalogue&component=IconButton)

#### TextLink

An underlined destination within prose or supporting navigation.

Use a link for navigation and a button for an action. Pink text uses the deeper accessible tone.

Import: `import { TextLink } from './src/library';`

| Prop | Contract |
| --- | --- |
| `href` | The actual destination URL or local anchor. |
| `children` | React content. Keep text concise and accessible. |
| `target` | Optional browsing context; use safe rel for external new windows. |

Live example: [TextLink](http://127.0.0.1:5173/?view=catalogue&component=TextLink)

#### PillButton

A labeled toggle for a small filter or preference.

Uses aria-pressed. The check and border make selection visible without relying on color.

Import: `import { PillButton } from './src/library';`

| Prop | Contract |
| --- | --- |
| `selected` | Boolean selected state, announced with aria-pressed. |
| `onClick` | Action callback. Use a link for navigation. |
| `children` | React content. Keep text concise and accessible. |

Live example: [PillButton](http://127.0.0.1:5173/?view=catalogue&component=PillButton)

### Inputs & choices

#### Field

A complete field: persistent label, control, hint, and error.

Label and helper IDs are connected to the control. Errors keep the original input.

Import: `import { Field } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `error` | An actionable validation message; sets aria-invalid. |
| `required` | Boolean. Marks the field required and adds visible text. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Field](http://127.0.0.1:5173/?view=catalogue&component=Field)

#### Input

A single-line input with a quiet, contained focus treatment.

A 1px focus border with a faint 2px halo replaces the large offset outline.

Import: `import { Input } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `type` | A supported native input type. |
| `placeholder` | A brief example; never a replacement for a visible label. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [Input](http://127.0.0.1:5173/?view=catalogue&component=Input)

#### Textarea

A resizable multi-line field for longer content.

Preserve newlines and let the field grow vertically. Do not use placeholder text as the label.

Import: `import { Textarea } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `rows` | DataTable: project records. Textarea: visible line count. Skeleton: placeholder row count. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [Textarea](http://127.0.0.1:5173/?view=catalogue&component=Textarea)

#### Select

A polished single-choice control for short form lists.

Uses the shared custom dropdown. Selection changes only after the user commits an option.

Import: `import { Select } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `name` | Native form or radio-group name. |

Live example: [Select](http://127.0.0.1:5173/?view=catalogue&component=Select)

#### Dropdown

The shared dropdown surface, trigger, and keyboard interaction.

Options support descriptions, counts, and disabled states. The popup chooses available viewport space.

Import: `import { Dropdown } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `searchable` | Boolean. Dropdown enables search automatically at 8 options unless overridden. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `name` | Native form or radio-group name. |

Live example: [Dropdown](http://127.0.0.1:5173/?view=catalogue&component=Dropdown)

#### Picker

A dropdown for filters, with optional counts.

Use counts to explain a filter, and offer an explicit All option to reset it.

Import: `import { Picker } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `searchable` | Boolean. Dropdown enables search automatically at 8 options unless overridden. |

Live example: [Picker](http://127.0.0.1:5173/?view=catalogue&component=Picker)

#### ComboboxPicker

A searchable choice list for larger collections.

Search is local and case-insensitive. Empty results explain how to recover.

Import: `import { ComboboxPicker } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `searchable` | Boolean. Dropdown enables search automatically at 8 options unless overridden. |

Live example: [ComboboxPicker](http://127.0.0.1:5173/?view=catalogue&component=ComboboxPicker)

#### Checkbox

An independent on/off choice that can accompany helper text.

Uses a native checkbox. Clicking the label changes the value; Space toggles it.

Import: `import { Checkbox } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `checked` | Controlled boolean selection state. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [Checkbox](http://127.0.0.1:5173/?view=catalogue&component=Checkbox)

#### Radio

One choice within a mutually exclusive named group.

Use a fieldset and legend for a related group. Native arrow-key behavior stays intact.

Import: `import { Radio } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `name` | Native form or radio-group name. |
| `value` | Controlled value. Update it from onChange. |
| `checked` | Controlled boolean selection state. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |

Live example: [Radio](http://127.0.0.1:5173/?view=catalogue&component=Radio)

#### Switch

An immediate binary setting, with a label and optional hint.

The switch applies directly. Use a checkbox for a selection that waits for form submission.

Import: `import { Switch } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `checked` | Controlled boolean selection state. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [Switch](http://127.0.0.1:5173/?view=catalogue&component=Switch)

#### SwitchRow

A setting name and explanation aligned with its switch.

Keep the whole row large enough to click, without hiding the setting name.

Import: `import { SwitchRow } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `checked` | Controlled boolean selection state. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |

Live example: [SwitchRow](http://127.0.0.1:5173/?view=catalogue&component=SwitchRow)

#### SearchField

A reusable search input with a visible clear action.

Clearing the field resets the results. It does not discard unrelated filters.

Import: `import { SearchField } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `label` | Visible or accessible name describing the control. |
| `placeholder` | A brief example; never a replacement for a visible label. |

Live example: [SearchField](http://127.0.0.1:5173/?view=catalogue&component=SearchField)

#### TagInput

Editable tags with keyboard entry and removal.

Enter or comma adds a trimmed, unique tag. Backspace on an empty input removes the last tag.

Import: `import { TagInput } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `label` | Visible or accessible name describing the control. |

Live example: [TagInput](http://127.0.0.1:5173/?view=catalogue&component=TagInput)

#### FileUpload

A document card with browse, drag-and-drop, validation, and file details.

Accepts one PDF, Markdown, or text file up to 10 MB by default. This local component does not transmit files.

Import: `import { FileUpload } from './src/library';`

| Prop | Contract |
| --- | --- |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `maxSize` | Maximum file size in bytes; default 10 × 1024 × 1024. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [FileUpload](http://127.0.0.1:5173/?view=catalogue&component=FileUpload)

#### Dropzone

The shared file-upload pattern, replacing local dashed boxes.

This is the FileUpload implementation under the migration alias Dropzone.

Import: `import { Dropzone } from './src/library';`

| Prop | Contract |
| --- | --- |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `maxSize` | Maximum file size in bytes; default 10 × 1024 × 1024. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [Dropzone](http://127.0.0.1:5173/?view=catalogue&component=Dropzone)

### Navigation

#### AppSwitcher

A stable, labeled entry to Workspace, Agents Studio, and Knowledge.

Changing apps preserves the surrounding navigation grammar.

Import: `import { AppSwitcher } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |

Live example: [AppSwitcher](http://127.0.0.1:5173/?view=catalogue&component=AppSwitcher)

#### Breadcrumbs

A compact path showing the current location and its parents.

Only the final item is current. Parent items are actionable; separators are decorative.

Import: `import { Breadcrumbs } from './src/library';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `onNavigate` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [Breadcrumbs](http://127.0.0.1:5173/?view=catalogue&component=Breadcrumbs)

#### TabStrip

Keyboard-navigable tabs for sections of one object.

Left/Right, Home, and End move between tabs. Selection uses aria-selected and a clear underline.

Import: `import { TabStrip } from './src/library';`

| Prop | Contract |
| --- | --- |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `label` | Visible or accessible name describing the control. |

Live example: [TabStrip](http://127.0.0.1:5173/?view=catalogue&component=TabStrip)

#### SegmentedControl

A compact switch between related views of the same content.

Uses a group of pressed buttons, not mixed tab semantics. Keep labels brief and meaningful.

Import: `import { SegmentedControl } from './src/library';`

| Prop | Contract |
| --- | --- |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `label` | Visible or accessible name describing the control. |

Live example: [SegmentedControl](http://127.0.0.1:5173/?view=catalogue&component=SegmentedControl)

#### NavTree

Expandable document groups with a clear current page.

Uses native disclosure navigation. Each document remains a normal keyboard-reachable button.

Import: `import { NavTree } from './src/library';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |

Live example: [NavTree](http://127.0.0.1:5173/?view=catalogue&component=NavTree)

#### AccountMenu

A predictable menu for profile, workspace, and support actions.

Keep account actions separate from project actions. The trigger includes a person’s name.

Import: `import { AccountMenu } from './src/library';`

| Prop | Contract |
| --- | --- |
| `onSelect` | Receives the selected date, event, or menu action. |
| `name` | Visible account name; defaults to Alex Morgan. |
| `initials` | One or two letters identifying the person. |
| `workspace` | Workspace name shown below the account identity. |

Live example: [AccountMenu](http://127.0.0.1:5173/?view=catalogue&component=AccountMenu)

#### Toc

A reading rail with direct links to document headings.

Links move to actual anchors. Hide the rail only when the article retains its headings.

Import: `import { Toc } from './src/library';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |

Live example: [Toc](http://127.0.0.1:5173/?view=catalogue&component=Toc)

### Data & identity

#### Pill

A small labeled state with a semantic color and dot.

Use ok, warn, bad, info, or quiet. A color never replaces the written state.

Import: `import { Pill } from './src/library';`

| Prop | Contract |
| --- | --- |
| `tone` | ok  /  warn  /  bad  /  info  /  quiet. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Pill](http://127.0.0.1:5173/?view=catalogue&component=Pill)

#### StatusPill

The project-state vocabulary on the shared Pill.

Planning, In progress, In review, and Completed map to one shared set of tones.

Import: `import { StatusPill } from './src/library';`

| Prop | Contract |
| --- | --- |
| `tone` | ok  /  warn  /  bad  /  info  /  quiet. |
| `children` | React content. Keep text concise and accessible. |

Live example: [StatusPill](http://127.0.0.1:5173/?view=catalogue&component=StatusPill)

#### Chip

A compact category or removable tag.

Removable tags have a named remove button. Passive tags never look like interactive buttons.

Import: `import { Chip } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `onRemove` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [Chip](http://127.0.0.1:5173/?view=catalogue&component=Chip)

#### Avatar

An initials marker supporting an identifiable person.

Use a visible name nearby. The avatar alone should not be the only identification.

Import: `import { Avatar } from './src/library';`

| Prop | Contract |
| --- | --- |
| `initials` | One or two letters identifying the person. |
| `name` | Native form or radio-group name. |
| `color` | Avatar color key or chart/legend CSS color. |

Live example: [Avatar](http://127.0.0.1:5173/?view=catalogue&component=Avatar)

#### DeptTile

A department label using the dedicated pink-harmonized color scale.

Department colors describe ownership. They never indicate success, warning, or failure.

Import: `import { DeptTile } from './src/library';`

| Prop | Contract |
| --- | --- |
| `department` | Creative  /  Engineering  /  Client services  /  Company. |

Live example: [DeptTile](http://127.0.0.1:5173/?view=catalogue&component=DeptTile)

#### Timestamp

A human-readable date with a machine-readable datetime value.

The title contains the complete localized date. Timezone context belongs in the surrounding screen.

Import: `import { Timestamp } from './src/library';`

| Prop | Contract |
| --- | --- |
| `date` | A valid date or ISO 8601 date-time string. |

Live example: [Timestamp](http://127.0.0.1:5173/?view=catalogue&component=Timestamp)

#### Kbd

A small keycap for a real, supported keyboard shortcut.

Only show shortcuts that actually work. Keep the keycap visually secondary.

Import: `import { Kbd } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [Kbd](http://127.0.0.1:5173/?view=catalogue&component=Kbd)

#### LegendDot

A labeled chart category with its matching color.

Place the label beside the color. Never ask users to distinguish unlabeled colors.

Import: `import { LegendDot } from './src/library';`

| Prop | Contract |
| --- | --- |
| `color` | Avatar color key or chart/legend CSS color. |
| `children` | React content. Keep text concise and accessible. |

Live example: [LegendDot](http://127.0.0.1:5173/?view=catalogue&component=LegendDot)

#### Stat

A metric with its label and useful context.

Use tabular numerals. A number needs a unit or explanation when its meaning is not obvious.

Import: `import { Stat } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `hint` | Optional supporting text connected to the control. |

Live example: [Stat](http://127.0.0.1:5173/?view=catalogue&component=Stat)

#### StatRow

A responsive row of related metrics separated by quiet rules.

Keep related metrics on one continuous surface, not a grid of identical floating cards.

Import: `import { StatRow } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [StatRow](http://127.0.0.1:5173/?view=catalogue&component=StatRow)

#### Facts

Aligned labels and values for object properties.

Use a semantic definition list. Long values wrap instead of widening the page.

Import: `import { Facts } from './src/library';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |

Live example: [Facts](http://127.0.0.1:5173/?view=catalogue&component=Facts)

#### Meter

A measurable completion value with text and progress semantics.

Expose the value and its range to assistive technology. Unknown progress uses a loading state instead.

Import: `import { Meter } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `label` | Visible or accessible name describing the control. |

Live example: [Meter](http://127.0.0.1:5173/?view=catalogue&component=Meter)

#### DataTable

A complete collection table with search, filtering, sorting, selection, and pagination.

Selection, row actions, and sorting are explicit controls. The scroll container is keyboard accessible.

Import: `import { DataTable } from './src/library';`

| Prop | Contract |
| --- | --- |
| `rows` | DataTable: project records. Textarea: visible line count. Skeleton: placeholder row count. |
| `onOpen` | Receives the row record when its explicit action is activated. |

Live example: [DataTable](http://127.0.0.1:5173/?view=catalogue&component=DataTable)

#### FilterRow

A consistent search and status-filter arrangement with a reset.

The clear action only appears when a filter is applied. Mobile controls wrap rather than shrink.

Import: `import { FilterRow } from './src/library';`

| Prop | Contract |
| --- | --- |
| `query` | Controlled search string. |
| `onQueryChange` | Receives the next search string. |
| `status` | Current status value or object-state label. |
| `onStatusChange` | Receives the selected status filter. |

Live example: [FilterRow](http://127.0.0.1:5173/?view=catalogue&component=FilterRow)

#### SortHead

A column heading button with a visible and announced sort direction.

Use aria-sort on the enclosing column header and a button inside it.

Import: `import { SortHead } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `direction` | ascending  /  descending  /  none. |
| `onSort` | Requests a sort change for this column. |

Live example: [SortHead](http://127.0.0.1:5173/?view=catalogue&component=SortHead)

### Surfaces & layout

#### ScrollArea

Native scrolling with a short, transparent pink indicator flush to the container edge.

The 2px rectangular thumb is at most 28px long. Wheel, touch, keyboard, and thumb dragging work together. No indicator appears when content fits.

Import: `import { ScrollArea } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `height` | Optional scroll viewport height in pixels or a CSS length. |
| `maxHeight` | Maximum scroll viewport height; content may use less space. |
| `axis` | vertical  /  horizontal  /  both; default vertical. |
| `children` | React content. Keep text concise and accessible. |

Live example: [ScrollArea](http://127.0.0.1:5173/?view=catalogue&component=ScrollArea)

#### Panel

A titled group of related content with an optional section action.

Use a surface when the content has a distinct purpose, not around every individual item.

Import: `import { Panel } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `action` | An optional section-level action. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Panel](http://127.0.0.1:5173/?view=catalogue&component=Panel)

#### Card

The same surface contract as Panel, with optional content.

Shares Panel geometry and spacing instead of introducing a second card family.

Import: `import { Card } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `action` | An optional section-level action. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Card](http://127.0.0.1:5173/?view=catalogue&component=Card)

#### CollectionCard

A selectable collection preview with a title, description, and metadata.

The full card is one action. Do not nest interactive buttons inside it.

Import: `import { CollectionCard } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `meta` | A short metadata summary for a collection. |
| `onClick` | Action callback. Use a link for navigation. |

Live example: [CollectionCard](http://127.0.0.1:5173/?view=catalogue&component=CollectionCard)

#### LinkTile

A compact shortcut with an icon, name, and explanation.

Use for a destination or tool. Keep the title specific enough to predict what opens.

Import: `import { LinkTile } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `icon` | A Lucide React icon component, using the shared stroke. |
| `onClick` | Action callback. Use a link for navigation. |

Live example: [LinkTile](http://127.0.0.1:5173/?view=catalogue&component=LinkTile)

#### Rows

A continuous container for related row items.

Use dividers to separate items without giving every row its own card.

Import: `import { Rows } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [Rows](http://127.0.0.1:5173/?view=catalogue&component=Rows)

#### Row

A labeled content row with supporting text and optional action.

Passive rows are not buttons. Actionable rows show a chevron and have one clear target.

Import: `import { Row } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `leading` | Optional leading icon or avatar. |
| `trailing` | Optional supporting status or metadata. |
| `onClick` | Action callback. Use a link for navigation. |

Live example: [Row](http://127.0.0.1:5173/?view=catalogue&component=Row)

#### SectionHead

A section title, optional description, and one related action.

Keep the action aligned with its section rather than placing every action in the page header.

Import: `import { SectionHead } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `sub` | Optional supporting text under the section title. |
| `children` | React content. Keep text concise and accessible. |

Live example: [SectionHead](http://127.0.0.1:5173/?view=catalogue&component=SectionHead)

#### SidebarShell

Reusable application shell with fixed identity and account areas.

Import navigation/styles.css. No provider or demo routes required. Main and secondary navigation collapse independently; mobile navigation uses a dialog.

Import: `import { SidebarShell } from './src/library';`

| Prop | Contract |
| --- | --- |
| `brand` | Optional pattern-specific value. Use the live example as the reference. |
| `toolName` | Optional pattern-specific value. Use the live example as the reference. |
| `navigation` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |
| `account` | Optional pattern-specific value. Use the live example as the reference. |
| `help` | Optional pattern-specific value. Use the live example as the reference. |
| `header` | Optional pattern-specific value. Use the live example as the reference. |
| `collapsed` | Optional pattern-specific value. Use the live example as the reference. |
| `onCollapsedChange` | Optional pattern-specific value. Use the live example as the reference. |
| `storageKey` | Optional pattern-specific value. Use the live example as the reference. |
| `secondaryNavigation` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [SidebarShell](http://127.0.0.1:5173/?view=catalogue&component=SidebarShell)

#### PageBar

The page title and its primary action in a shared layout.

The page should explain where the user is before presenting controls.

Import: `import { PageBar } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `actions` | Primary and supporting actions for the current page. |

Live example: [PageBar](http://127.0.0.1:5173/?view=catalogue&component=PageBar)

#### PageGrid

The shared main-content and context-rail composition.

The second column moves below the first when its minimum width is unavailable.

Import: `import { PageGrid } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [PageGrid](http://127.0.0.1:5173/?view=catalogue&component=PageGrid)

#### CardGrid

A responsive grid of collection cards.

Cards use a consistent minimum width, never a screen-specific auto-fill rule.

Import: `import { CardGrid } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [CardGrid](http://127.0.0.1:5173/?view=catalogue&component=CardGrid)

#### Stack

A vertical layout using a deliberate spacing value.

Choose gaps from the 4px spacing scale. Use Stack instead of repeated margin overrides.

Import: `import { Stack } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `gap` | Spacing in pixels from the shared 4px scale. |

Live example: [Stack](http://127.0.0.1:5173/?view=catalogue&component=Stack)

#### DetailHeader

An object title, state, explanation, and supporting facts.

Use the same order in project, agent, workflow, and document detail pages.

Import: `import { DetailHeader } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `status` | Current status value or object-state label. |
| `children` | React content. Keep text concise and accessible. |

Live example: [DetailHeader](http://127.0.0.1:5173/?view=catalogue&component=DetailHeader)

#### Inspector

A searchable list and its selected detail in one reusable component.

The current selection remains visible. On narrow screens the list moves above the detail.

Import: `import { Inspector } from './src/library';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |

Live example: [Inspector](http://127.0.0.1:5173/?view=catalogue&component=Inspector)

#### Gate

The shared access screen with one clear next action.

The demonstration never sends authentication requests. Production sign-in must state the workspace and provider.

Import: `import { Gate } from './src/library';`

| Prop | Contract |
| --- | --- |
| `onContinue` | Requests the next access step. The demo stays local. |

Live example: [Gate](http://127.0.0.1:5173/?view=catalogue&component=Gate)

### Feedback

#### Loader

A small geometric loader with a fine traveling stroke.

Announces loading once. Uses no fabricated percentage. Reduced-motion preferences stop the animation.

Import: `import { Loader } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `size` | Icon or loader size in pixels; loader default 24. |
| `decorative` | Suppresses a duplicate loading announcement when a parent already has role=status. |

Live example: [Loader](http://127.0.0.1:5173/?view=catalogue&component=Loader)

#### PageLoading

A full-page loading state with clear context and a quiet animated loader.

Use while initial data is unavailable. Replace with the loaded view or a persistent error. Cancel is optional and must abort the real operation.

Import: `import { PageLoading } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `onCancel` | Callback for the safe cancellation action. |

Live example: [PageLoading](http://127.0.0.1:5173/?view=catalogue&component=PageLoading)

#### Notice

A contained message with an icon, explanation, and semantic tone.

Explain what happened and what to do next. Persistent messages belong inline, not in temporary toasts.

Import: `import { Notice } from './src/library';`

| Prop | Contract |
| --- | --- |
| `tone` | ok  /  warn  /  bad  /  info  /  quiet. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Notice](http://127.0.0.1:5173/?view=catalogue&component=Notice)

#### Toast

A short confirmation announced without moving keyboard focus.

Use for successful actions. Critical failures stay inline until they are resolved.

Import: `import { Toast } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |

Live example: [Toast](http://127.0.0.1:5173/?view=catalogue&component=Toast)

#### Skeleton

Static placeholder rows matching the incoming content structure.

Reserves space without a spinner. Announce loading once, not on every placeholder.

Import: `import { Skeleton } from './src/library';`

| Prop | Contract |
| --- | --- |
| `rows` | DataTable: project records. Textarea: visible line count. Skeleton: placeholder row count. |

Live example: [Skeleton](http://127.0.0.1:5173/?view=catalogue&component=Skeleton)

#### LoadingBar

A determinate progress indicator with a visible value.

A real percentage is required. Do not invent progress when the amount of work is unknown.

Import: `import { LoadingBar } from './src/library';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `label` | Visible or accessible name describing the control. |

Live example: [LoadingBar](http://127.0.0.1:5173/?view=catalogue&component=LoadingBar)

#### Refreshing

A subtle busy treatment over the existing, readable content.

Keep previous data visible while refreshing. Use aria-busy and one status announcement.

Import: `import { Refreshing } from './src/library';`

| Prop | Contract |
| --- | --- |
| `busy` | Boolean refresh-in-progress state; preserves previous content. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Refreshing](http://127.0.0.1:5173/?view=catalogue&component=Refreshing)

#### StateView

A unified empty, error, or loading state with a useful next action.

Failed loads retain the user’s filters. Empty states invite a specific first action.

Import: `import { StateView } from './src/library';`

| Prop | Contract |
| --- | --- |
| `state` | empty  /  loading  /  error. |
| `onRetry` | Retries the failed operation without dropping the current context. |
| `onCreate` | Starts the first useful action from an empty state. |

Live example: [StateView](http://127.0.0.1:5173/?view=catalogue&component=StateView)

#### Tooltip

A brief explanation available on hover and keyboard focus.

Never place essential instructions only in a tooltip. Use aria-describedby.

Import: `import { Tooltip } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Tooltip](http://127.0.0.1:5173/?view=catalogue&component=Tooltip)

### Overlays & editing

#### Popover

An anchored top-layer surface for a small contextual task.

Escape and outside clicks close it. The surface stays within the viewport.

Import: `import { Popover } from './src/library';`

| Prop | Contract |
| --- | --- |
| `trigger` | A button element that opens the contextual surface. |
| `children` | React content. Keep text concise and accessible. |
| `label` | Visible or accessible name describing the control. |
| `open` | Controlled overlay visibility. |
| `onOpenChange` | Called with the next boolean open state. |

Live example: [Popover](http://127.0.0.1:5173/?view=catalogue&component=Popover)

#### DropdownMenu

A keyboard-navigable action menu with optional icons and shortcuts.

Arrow keys move through enabled items. Escape returns to the trigger.

Import: `import { DropdownMenu } from './src/library';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `label` | Visible or accessible name describing the control. |

Live example: [DropdownMenu](http://127.0.0.1:5173/?view=catalogue&component=DropdownMenu)

#### Dialog

A modal decision or focused form using the native dialog layer.

Focus stays inside. Escape closes; the opening control regains focus.

Import: `import { Dialog } from './src/library';`

| Prop | Contract |
| --- | --- |
| `open` | Controlled overlay visibility. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |
| `title` | A concise visible heading describing this context. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Dialog](http://127.0.0.1:5173/?view=catalogue&component=Dialog)

#### Sheet

A side panel for editing without losing the parent context.

Shares Dialog focus behavior. It becomes full width on a phone.

Import: `import { Sheet } from './src/library';`

| Prop | Contract |
| --- | --- |
| `open` | Controlled overlay visibility. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |
| `title` | A concise visible heading describing this context. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Sheet](http://127.0.0.1:5173/?view=catalogue&component=Sheet)

#### ConfirmDialog

An explicit confirmation for a consequential operation.

Initial focus starts on the safe Cancel action. Name the action instead of saying Yes.

Import: `import { ConfirmDialog } from './src/library';`

| Prop | Contract |
| --- | --- |
| `open` | Controlled overlay visibility. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |
| `onConfirm` | Callback for the explicitly named confirmation action. |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `confirmLabel` | Explicit action label, such as Archive project. |

Live example: [ConfirmDialog](http://127.0.0.1:5173/?view=catalogue&component=ConfirmDialog)

#### ConfirmStrip

A contained, in-place confirmation with two clear actions.

Use only when the action can be understood in the surrounding context.

Import: `import { ConfirmStrip } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `onConfirm` | Callback for the explicitly named confirmation action. |
| `onCancel` | Callback for the safe cancellation action. |

Live example: [ConfirmStrip](http://127.0.0.1:5173/?view=catalogue&component=ConfirmStrip)

#### Disclosure

The bordered information card with a clear header and expandable body.

Native details/summary handles Enter and Space. Icon, title, and chevron share one target.

Import: `import { Disclosure } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `children` | React content. Keep text concise and accessible. |
| `defaultOpen` | Whether a disclosure starts expanded. |

Live example: [Disclosure](http://127.0.0.1:5173/?view=catalogue&component=Disclosure)

#### SaveBar

A persistent editing summary with save and discard actions.

Save is unavailable when nothing changed. A failed save should preserve the dirty state and user input.

Import: `import { SaveBar } from './src/library';`

| Prop | Contract |
| --- | --- |
| `dirty` | Boolean indicating unsaved work. |
| `onSave` | Receives the edited object or triggers a save operation. |
| `onDiscard` | Restores the last saved value. |
| `saving` | Boolean save-in-progress state; disables duplicate actions. |

Live example: [SaveBar](http://127.0.0.1:5173/?view=catalogue&component=SaveBar)

#### FieldRow

A setting description aligned with its control.

The label column has a consistent measure. On mobile the control stacks below the label.

Import: `import { FieldRow } from './src/library';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `children` | React content. Keep text concise and accessible. |

Live example: [FieldRow](http://127.0.0.1:5173/?view=catalogue&component=FieldRow)

#### SheetSection

A reusable section within a sheet or detail panel.

Group a few related fields under a specific title. Avoid repeating a border around every field.

Import: `import { SheetSection } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `children` | React content. Keep text concise and accessible. |

Live example: [SheetSection](http://127.0.0.1:5173/?view=catalogue&component=SheetSection)

#### CopyBlock

A readable code or value block with a copy action.

The control confirms a successful clipboard write. The text remains selectable when clipboard permission is unavailable.

Import: `import { CopyBlock } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [CopyBlock](http://127.0.0.1:5173/?view=catalogue&component=CopyBlock)

### Documents & operations

#### ReadableDoc

A readable article with consistent headings and paragraph rhythm.

Keep prose within 64 to 72 characters and use 1.75 line height.

Import: `import { ReadableDoc } from './src/library';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `children` | React content. Keep text concise and accessible. |

Live example: [ReadableDoc](http://127.0.0.1:5173/?view=catalogue&component=ReadableDoc)

#### Markdown

An escaped renderer for headings, paragraphs, lists, and fenced code.

This implementation supports a documented Markdown subset and never renders raw HTML.

Import: `import { Markdown } from './src/library';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [Markdown](http://127.0.0.1:5173/?view=catalogue&component=Markdown)

#### Timeline

A sequence of updates with content and time labels.

The order is meaningful. Do not rely on the connecting line to communicate chronology.

Import: `import { Timeline } from './src/library';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |

Live example: [Timeline](http://127.0.0.1:5173/?view=catalogue&component=Timeline)

#### Steps

A visible sequence with current and completed states.

Current step uses aria-current. Completion has a check icon and text label.

Import: `import { Steps } from './src/library';`

| Prop | Contract |
| --- | --- |
| `steps` | Ordered array of step labels. |
| `current` | Zero-based index of the current step. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |

Live example: [Steps](http://127.0.0.1:5173/?view=catalogue&component=Steps)

#### ColumnChart

A labeled comparison of values with a data-table alternative.

Use a zero baseline. Values and category labels are visible; color is supplementary.

Import: `import { ColumnChart } from './src/library';`

| Prop | Contract |
| --- | --- |
| `data` | Array of { label: string, value: number }. |

Live example: [ColumnChart](http://127.0.0.1:5173/?view=catalogue&component=ColumnChart)

#### Sparkline

A small trend line with an accessible data summary.

Use it to support a metric, not as the only way to understand the numbers.

Import: `import { Sparkline } from './src/library';`

| Prop | Contract |
| --- | --- |
| `data` | Array of { label: string, value: number }. |

Live example: [Sparkline](http://127.0.0.1:5173/?view=catalogue&component=Sparkline)

#### StackedBar

A part-to-whole comparison with a labeled legend and data table.

Categories use the dedicated chart palette. Totals and category values remain available as text.

Import: `import { StackedBar } from './src/library';`

| Prop | Contract |
| --- | --- |
| `data` | Array of { label: string, value: number }. |

Live example: [StackedBar](http://127.0.0.1:5173/?view=catalogue&component=StackedBar)

#### BarList

A ranked or ordered set of values with horizontal bars.

Labels and values align consistently. The bar width is proportional to the maximum value.

Import: `import { BarList } from './src/library';`

| Prop | Contract |
| --- | --- |
| `data` | Array of { label: string, value: number }. |

Live example: [BarList](http://127.0.0.1:5173/?view=catalogue&component=BarList)

#### Calendar

A month grid with date selection and keyboard navigation.

Previous/next change the month. Arrow keys move by day or week and preserve focus.

Import: `import { Calendar } from './src/library';`

| Prop | Contract |
| --- | --- |
| `onSelect` | Receives the selected date, event, or menu action. |

Live example: [Calendar](http://127.0.0.1:5173/?view=catalogue&component=Calendar)

#### DayTimeline

A time-based view of a day with selectable events.

Display the timezone. Event details remain available through normal buttons.

Import: `import { DayTimeline } from './src/library';`

| Prop | Contract |
| --- | --- |
| `onSelect` | Receives the selected date, event, or menu action. |

Live example: [DayTimeline](http://127.0.0.1:5173/?view=catalogue&component=DayTimeline)

#### KanbanBoard

A task board supporting pointer drag and an explicit move control.

Every card can be moved with its dropdown, so drag-and-drop is never required.

Import: `import { KanbanBoard } from './src/library';`

| Prop | Contract |
| --- | --- |
| `none` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [KanbanBoard](http://127.0.0.1:5173/?view=catalogue&component=KanbanBoard)

#### ProjectStatusSheet

The shared project-status editor for Workspace and Knowledge.

A single status vocabulary and shared sheet replace the duplicated project-status implementations.

Import: `import { ProjectStatusSheet } from './src/library';`

| Prop | Contract |
| --- | --- |
| `open` | Controlled overlay visibility. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |
| `project` | Project object with name, client, status, owner, and due date. |
| `onSave` | Receives the edited object or triggers a save operation. |

Live example: [ProjectStatusSheet](http://127.0.0.1:5173/?view=catalogue&component=ProjectStatusSheet)

## Complete token reference

Names correspond exactly to exported CSS custom properties. Color values are theme-specific; geometry and spacing remain shared.

| Token | Light | Dark |
| --- | --- | --- |
| `--text-xs` | `12px` | `12px` |
| `--text-sm` | `13px` | `13px` |
| `--text-base` | `14px` | `14px` |
| `--text-md` | `16px` | `16px` |
| `--text-lg` | `18px` | `18px` |
| `--text-xl` | `22px` | `22px` |
| `--text-2xl` | `28px` | `28px` |
| `--space-1` | `4px` | `4px` |
| `--space-2` | `8px` | `8px` |
| `--space-3` | `12px` | `12px` |
| `--space-4` | `16px` | `16px` |
| `--space-5` | `20px` | `20px` |
| `--space-6` | `24px` | `24px` |
| `--space-8` | `32px` | `32px` |
| `--space-10` | `40px` | `40px` |
| `--space-12` | `48px` | `48px` |
| `--space-16` | `64px` | `64px` |
| `--leading-tight` | `1.2` | `1.2` |
| `--leading-normal` | `1.5` | `1.5` |
| `--leading-reading` | `1.75` | `1.75` |
| `--top-h` | `60px` | `60px` |
| `--list-w` | `280px` | `280px` |
| `--control-h-touch` | `44px` | `44px` |
| `--line-width` | `1px` | `1px` |
| `--z-sticky` | `10` | `10` |
| `--z-popover` | `40` | `40` |
| `--z-tooltip` | `60` | `60` |
| `--z-sheet` | `80` | `80` |
| `--z-dialog` | `100` | `100` |
| `--z-toast` | `110` | `110` |
| `--dur-fast` | `120ms` | `120ms` |
| `--dur` | `180ms` | `180ms` |
| `--dur-slow` | `240ms` | `240ms` |
| `--ease` | `cubic-bezier(.2,.8,.2,1)` | `cubic-bezier(.2,.8,.2,1)` |
| `--dept-creative` | `#B344A6` | `#E28DD4` |
| `--dept-engineering` | `#6C62A6` | `#ADA5E3` |
| `--dept-client` | `#8D617D` | `#CAA1BB` |
| `--dept-company` | `#676171` | `#B6ADBF` |
| `--chart-1` | `#B344A6` | `#E28DD4` |
| `--chart-2` | `#7563B2` | `#B0A0E0` |
| `--chart-3` | `#9476AD` | `#C1A5D6` |
| `--chart-4` | `#497B8F` | `#8AB7C8` |
| `--chart-5` | `#A46B87` | `#D6A0BC` |
| `--chart-6` | `#6E6878` | `#B6ADBF` |
| `--chart-trend` | `#8D617D` | `#CAA1BB` |
| `--icon-button-size` | `14px` | `14px` |
| `--scrollbar-size` | `2px` | `2px` |
| `--ground` | `#F7F7FA` | `#201D25` |
| `--raise` | `#FFFFFF` | `#29252F` |
| `--sunken` | `#F0F0F5` | `#19161F` |
| `--ink` | `#24212A` | `#F3EFF6` |
| `--dim` | `#66616E` | `#B8AFBF` |
| `--line` | `#E1DEE7` | `#49414F` |
| `--strong` | `#908897` | `#8D8297` |
| `--accent` | `#E414DB` | `#F04EE8` |
| `--tint` | `#FDECFC` | `#452B49` |
| `--action` | `#A80FA3` | `#F04EE8` |
| `--actionHover` | `#8E0D89` | `#F47CEE` |
| `--actionInk` | `#FFFFFF` | `#251123` |
| `--nav` | `#FCFBFD` | `#231F28` |
| `--navInk` | `#66616E` | `#B8AFBF` |
| `--navActive` | `#FDECFC` | `#452B49` |
| `--navSelected` | `#A80FA3` | `#F47CEE` |
| `--accent-deep` | `#A80FA3` | `#F47CEE` |
| `--accent-soft` | `rgba(228, 20, 219, 0.08)` | `rgba(240, 78, 232, 0.10)` |
| `--accent-tint` | `rgba(228, 20, 219, 0.10)` | `rgba(240, 78, 232, 0.14)` |
| `--accent-line` | `rgba(228, 20, 219, 0.35)` | `rgba(240, 78, 232, 0.40)` |
| `--link` | `#A80FA3` | `#F47CEE` |
| `--focus` | `#A80FA3` | `#F47CEE` |
| `--ok` | `#226A4B` | `#98D7B4` |
| `--okTint` | `#EAF4ED` | `#223F34` |
| `--warn` | `#835713` | `#F0CA83` |
| `--warnTint` | `#FCF3DF` | `#493B24` |
| `--bad` | `#AF333C` | `#FFABB0` |
| `--badTint` | `#FBECEF` | `#4B2B33` |
| `--info` | `#285B9B` | `#A7CAFF` |
| `--infoTint` | `#EAF1FB` | `#263D58` |
| `--font-sans` | `'Manrope', sans-serif` | `'Manrope', sans-serif` |
| `--scrollbar-thumb` | `rgba(228, 20, 219, 0.35)` | `rgba(240, 78, 232, 0.35)` |
| `--scrollbar-hover` | `rgba(228, 20, 219, 0.60)` | `rgba(240, 78, 232, 0.60)` |
| `--scrollbar-track` | `transparent` | `transparent` |
| `--font-display` | `'Manrope', sans-serif` | `'Manrope', sans-serif` |
| `--font-mono` | `'IBM Plex Mono', monospace` | `'IBM Plex Mono', monospace` |
| `--radius-xs` | `3px` | `3px` |
| `--radius-sm` | `5px` | `5px` |
| `--radius-lg` | `8px` | `8px` |
| `--side-w` | `210px` | `210px` |
| `--page-pad` | `32px` | `32px` |
| `--control-h` | `38px` | `38px` |
| `--text-3xl` | `34px` | `34px` |
| `--shadow-pop` | `0 12px 40px #25242c18` | `0 16px 48px #00000055` |
| `--scrim` | `#20222e55` | `#00000080` |

## Icon reference

| Icon | Category | SVG |
| --- | --- | --- |
| Home | Navigation | [Download](icons/Home.svg) |
| LayoutDashboard | Navigation | [Download](icons/LayoutDashboard.svg) |
| Menu | Navigation | [Download](icons/Menu.svg) |
| ChevronDown | Navigation | [Download](icons/ChevronDown.svg) |
| ChevronUp | Navigation | [Download](icons/ChevronUp.svg) |
| ChevronLeft | Navigation | [Download](icons/ChevronLeft.svg) |
| ChevronRight | Navigation | [Download](icons/ChevronRight.svg) |
| ArrowLeft | Navigation | [Download](icons/ArrowLeft.svg) |
| ArrowRight | Navigation | [Download](icons/ArrowRight.svg) |
| ArrowUp | Navigation | [Download](icons/ArrowUp.svg) |
| ArrowDown | Navigation | [Download](icons/ArrowDown.svg) |
| ArrowUpRight | Navigation | [Download](icons/ArrowUpRight.svg) |
| ArrowDownLeft | Navigation | [Download](icons/ArrowDownLeft.svg) |
| ExternalLink | Navigation | [Download](icons/ExternalLink.svg) |
| PanelLeftClose | Navigation | [Download](icons/PanelLeftClose.svg) |
| PanelLeftOpen | Navigation | [Download](icons/PanelLeftOpen.svg) |
| PanelRightClose | Navigation | [Download](icons/PanelRightClose.svg) |
| PanelRightOpen | Navigation | [Download](icons/PanelRightOpen.svg) |
| Maximize2 | Navigation | [Download](icons/Maximize2.svg) |
| Minimize2 | Navigation | [Download](icons/Minimize2.svg) |
| Search | Actions | [Download](icons/Search.svg) |
| X | Actions | [Download](icons/X.svg) |
| Plus | Actions | [Download](icons/Plus.svg) |
| Minus | Actions | [Download](icons/Minus.svg) |
| Check | Actions | [Download](icons/Check.svg) |
| CheckCheck | Actions | [Download](icons/CheckCheck.svg) |
| MoreHorizontal | Actions | [Download](icons/MoreHorizontal.svg) |
| MoreVertical | Actions | [Download](icons/MoreVertical.svg) |
| Copy | Actions | [Download](icons/Copy.svg) |
| Clipboard | Actions | [Download](icons/Clipboard.svg) |
| Save | Actions | [Download](icons/Save.svg) |
| Pencil | Actions | [Download](icons/Pencil.svg) |
| PenLine | Actions | [Download](icons/PenLine.svg) |
| Undo2 | Actions | [Download](icons/Undo2.svg) |
| Redo2 | Actions | [Download](icons/Redo2.svg) |
| RotateCcw | Actions | [Download](icons/RotateCcw.svg) |
| RefreshCw | Actions | [Download](icons/RefreshCw.svg) |
| Settings2 | Actions | [Download](icons/Settings2.svg) |
| SlidersHorizontal | Actions | [Download](icons/SlidersHorizontal.svg) |
| Filter | Actions | [Download](icons/Filter.svg) |
| SortAsc | Actions | [Download](icons/SortAsc.svg) |
| SortDesc | Actions | [Download](icons/SortDesc.svg) |
| ArrowUpDown | Actions | [Download](icons/ArrowUpDown.svg) |
| Download | Actions | [Download](icons/Download.svg) |
| Upload | Actions | [Download](icons/Upload.svg) |
| Trash2 | Actions | [Download](icons/Trash2.svg) |
| Archive | Actions | [Download](icons/Archive.svg) |
| Link | Actions | [Download](icons/Link.svg) |
| Unlink | Actions | [Download](icons/Unlink.svg) |
| Grid2X2 | Workspace | [Download](icons/Grid2X2.svg) |
| List | Workspace | [Download](icons/List.svg) |
| Columns3 | Workspace | [Download](icons/Columns3.svg) |
| Rows3 | Workspace | [Download](icons/Rows3.svg) |
| Folder | Workspace | [Download](icons/Folder.svg) |
| FolderOpen | Workspace | [Download](icons/FolderOpen.svg) |
| FolderPlus | Workspace | [Download](icons/FolderPlus.svg) |
| File | Workspace | [Download](icons/File.svg) |
| FileText | Workspace | [Download](icons/FileText.svg) |
| FilePlus | Workspace | [Download](icons/FilePlus.svg) |
| Files | Workspace | [Download](icons/Files.svg) |
| Bookmark | Workspace | [Download](icons/Bookmark.svg) |
| BookOpen | Workspace | [Download](icons/BookOpen.svg) |
| Library | Workspace | [Download](icons/Library.svg) |
| Tag | Workspace | [Download](icons/Tag.svg) |
| Tags | Workspace | [Download](icons/Tags.svg) |
| Paperclip | Workspace | [Download](icons/Paperclip.svg) |
| Package | Workspace | [Download](icons/Package.svg) |
| Layers | Workspace | [Download](icons/Layers.svg) |
| Component | Workspace | [Download](icons/Component.svg) |
| Palette | Workspace | [Download](icons/Palette.svg) |
| Type | Workspace | [Download](icons/Type.svg) |
| Ruler | Workspace | [Download](icons/Ruler.svg) |
| User | People & communication | [Download](icons/User.svg) |
| Users | People & communication | [Download](icons/Users.svg) |
| UserPlus | People & communication | [Download](icons/UserPlus.svg) |
| Contact | People & communication | [Download](icons/Contact.svg) |
| Mail | People & communication | [Download](icons/Mail.svg) |
| MessageSquare | People & communication | [Download](icons/MessageSquare.svg) |
| MessagesSquare | People & communication | [Download](icons/MessagesSquare.svg) |
| Send | People & communication | [Download](icons/Send.svg) |
| Bell | People & communication | [Download](icons/Bell.svg) |
| BellOff | People & communication | [Download](icons/BellOff.svg) |
| Heart | People & communication | [Download](icons/Heart.svg) |
| Star | People & communication | [Download](icons/Star.svg) |
| MapPin | People & communication | [Download](icons/MapPin.svg) |
| CalendarDays | Time & data | [Download](icons/CalendarDays.svg) |
| CalendarCheck | Time & data | [Download](icons/CalendarCheck.svg) |
| Clock3 | Time & data | [Download](icons/Clock3.svg) |
| Timer | Time & data | [Download](icons/Timer.svg) |
| History | Time & data | [Download](icons/History.svg) |
| Activity | Time & data | [Download](icons/Activity.svg) |
| ChartColumn | Time & data | [Download](icons/ChartColumn.svg) |
| ChartLine | Time & data | [Download](icons/ChartLine.svg) |
| ChartPie | Time & data | [Download](icons/ChartPie.svg) |
| TrendingUp | Time & data | [Download](icons/TrendingUp.svg) |
| TrendingDown | Time & data | [Download](icons/TrendingDown.svg) |
| Target | Time & data | [Download](icons/Target.svg) |
| Flag | Time & data | [Download](icons/Flag.svg) |
| CheckSquare | States & access | [Download](icons/CheckSquare.svg) |
| Square | States & access | [Download](icons/Square.svg) |
| Circle | States & access | [Download](icons/Circle.svg) |
| Info | States & access | [Download](icons/Info.svg) |
| AlertTriangle | States & access | [Download](icons/AlertTriangle.svg) |
| CircleAlert | States & access | [Download](icons/CircleAlert.svg) |
| CircleCheck | States & access | [Download](icons/CircleCheck.svg) |
| CircleHelp | States & access | [Download](icons/CircleHelp.svg) |
| Eye | States & access | [Download](icons/Eye.svg) |
| EyeOff | States & access | [Download](icons/EyeOff.svg) |
| LockKeyhole | States & access | [Download](icons/LockKeyhole.svg) |
| Unlock | States & access | [Download](icons/Unlock.svg) |
| ShieldCheck | States & access | [Download](icons/ShieldCheck.svg) |
| ShieldAlert | States & access | [Download](icons/ShieldAlert.svg) |
| KeyRound | States & access | [Download](icons/KeyRound.svg) |
| LogIn | States & access | [Download](icons/LogIn.svg) |
| LogOut | States & access | [Download](icons/LogOut.svg) |
| Accessibility | States & access | [Download](icons/Accessibility.svg) |
| Workflow | Studio & media | [Download](icons/Workflow.svg) |
| Cpu | Studio & media | [Download](icons/Cpu.svg) |
| Code2 | Studio & media | [Download](icons/Code2.svg) |
| Terminal | Studio & media | [Download](icons/Terminal.svg) |
| Braces | Studio & media | [Download](icons/Braces.svg) |
| Database | Studio & media | [Download](icons/Database.svg) |
| Globe | Studio & media | [Download](icons/Globe.svg) |
| Camera | Studio & media | [Download](icons/Camera.svg) |
| Image | Studio & media | [Download](icons/Image.svg) |
| Video | Studio & media | [Download](icons/Video.svg) |
| Mic | Studio & media | [Download](icons/Mic.svg) |
| Play | Studio & media | [Download](icons/Play.svg) |
| Pause | Studio & media | [Download](icons/Pause.svg) |
| CircleStop | Studio & media | [Download](icons/CircleStop.svg) |
| Volume2 | Studio & media | [Download](icons/Volume2.svg) |
| VolumeX | Studio & media | [Download](icons/VolumeX.svg) |
| Lightbulb | Studio & media | [Download](icons/Lightbulb.svg) |
| Zap | Studio & media | [Download](icons/Zap.svg) |
| Sun | Interface | [Download](icons/Sun.svg) |
| Moon | Interface | [Download](icons/Moon.svg) |
| Monitor | Interface | [Download](icons/Monitor.svg) |
| Smartphone | Interface | [Download](icons/Smartphone.svg) |
| Laptop | Interface | [Download](icons/Laptop.svg) |
| GripVertical | Interface | [Download](icons/GripVertical.svg) |
| GripHorizontal | Interface | [Download](icons/GripHorizontal.svg) |
| Move | Interface | [Download](icons/Move.svg) |
| Command | Interface | [Download](icons/Command.svg) |
| Keyboard | Interface | [Download](icons/Keyboard.svg) |
| MousePointer2 | Interface | [Download](icons/MousePointer2.svg) |
