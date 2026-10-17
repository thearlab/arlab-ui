# Contour design system

ARLAB internal applications · Version 2.0.0-beta.27 · Satin Lift · October 2026

Contour is the selected design language for Workspace, Agents Studio and Knowledge. This repository contains an interactive React library and sample layouts. Application data, sign-in, uploads and agent runs are demonstrations; production services are not connected.

## Design principles

- Make location obvious. Keep app selection, page navigation and contextual navigation distinct.
- Use clear labels, consistent alignment and generous spacing before adding decoration.
- Use one primary action per decision. Secondary actions retain a visible border or underline.
- Use shared corners: 7px controls and details, 14px panels and floating surfaces. Circles are reserved for meaningful symbols and avatars.
- Typography is Satoshi: interface 400/500 and headings 600, with normal letter spacing. DM Mono 400 is reserved for code and identifiers.
- Keep the canvas neutral and free of gradients. Use faint satin surface rims, quiet chrome borders and restrained elevation. Avoid glowing controls, oversized icon badges and em dashes in interface copy.

## Color and contrast

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | #F7F5F9 | #202022 |
| Raised surface | #FFFDFF | #29292C |
| Inset surface | #EDE8F1 | #1B1B1E |
| Main text | #2C2532 | #F4F4F6 |
| Supporting text | #665C70 | #BDBDC5 |
| Quiet separator | #DDD4E5 | #414146 |
| Brand pink | #E414DB | #F04EE8 |
| Text links and emphasis | #E414DB | #F04EE8 |
| Primary button surface | #E414DB | #F04EE8 |
| Primary button label | #FFFFFF | #FFFFFF |
| Primary hover | #E414DB | #F04EE8 |
| Orange support | #FB923C | #FB923C |
| Orange text | #984414 | #FDBA74 |
| Selection wash | Brand pink at 8–10% | Brand pink at 10–14% |
| Selection outline | Brand pink at 35% | Brand pink at 40% |
| Sparkline | #198BC2 | #38BDF8 |

The light primary button uses the exact selected brand pink with white text. This requested combination is approximately 3.87:1 and does not meet the 4.5:1 normal-text target. Keep that exception explicit; do not describe the whole palette as passing every text contrast check. Dark-mode primary buttons also use white labels. The main pink is shared by icons, links, focus and emphasis. Light accent text on pale surfaces is also an explicit contrast exception.

Department and chart colors coordinate saturated pink, orange, violet, blue and teal. Organization colors do not imply status. Department tiles use the approved vivid hues with white glyphs and explicitly recorded contrast exceptions. Charts keep labels and table alternatives. Success, warning, failure and information retain separate semantic colors and explicit labels.

Quiet separators group already-understandable content. Essential controls use the stronger outline token. Disabled controls are visibly disabled. Selection never depends on color alone: include a check, underline, shape, label or selected-state announcement.

`npm run check:colors` verifies foreground/background pairs in both themes and reports the explicit light primary-button exception separately. This is a token audit, not a complete accessibility certification. The intentionally subtle scrollbar is supplementary to native wheel, touch and keyboard scrolling.

## Typography, spacing and geometry

| Use | Font / size | Weight / leading |
| --- | --- | --- |
| Page heading | Satoshi, 28–34px | 600 / 1.2 |
| Section heading | Satoshi, 18–22px | 600 / 1.2 |
| Body | Satoshi, 14px | 400 / 1.5 |
| Reading content | Satoshi, 14–16px | 400 / 1.75 |
| Form controls | Satoshi, 12px | 400 / 1.5 |
| Supporting labels | Satoshi, 11–12px | 400–500 / 1.5 |
| Compact metadata | Satoshi, 10–11px | 400 / 1.6 |
| Code and identifiers | DM Mono, 12px | 400 / 1.5 |

Use tabular numbers for counts and metrics. Reading columns should remain approximately 64–72 characters wide. Never truncate essential instructions or errors. Single-line identity labels may truncate when the complete value is available through context or a title.

Spacing uses a 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48 and 64px. Related controls generally use 8px gaps, form fields 18–24px, page sections 28–32px. Desktop controls are 38px high; touch controls target 44px. Small contextual reset actions use a 28px visual height on fine pointers.

Use 1px separators and quiet essential control borders. Panels have faint satin rims and restrained surface lift; floating content receives deeper elevation. Panel corners are 14px and controls 7px. Surface title rails run across the full panel width. Hover fills the available row width without side gaps. Regular input focus is a 1px deeper-pink border with a faint 2px wash. Buttons retain an explicit keyboard focus outline. Do not remove focus indicators to simplify the appearance.

## Actions and iconography

Primary, secondary, quiet, ghost and destructive actions share one Button implementation. Secondary and quiet actions retain a subtle border and surface. Ghost is transparent and borderless with a soft hover fill; use it only when its surrounding action group supplies clear context. A text link keeps its 1px underline on hover; hover changes underline contrast, not thickness.

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

Loader uses a fine traveling stroke around a circular outline. PageLoading provides workspace context, a clear title, explanatory text and one status announcement. It does not fabricate a completion percentage. Use LoadingBar only when actual progress is measurable. Use Skeleton for partial content, Refreshing to retain already-loaded data, and StateView for recoverable failures or empty collections.

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
- Timestamp defaults to a semantic plain-text date with tabular numbers. Time and a metadata chip are explicit options.
- DataTable provides selection, filtering, sorting, pagination and explicit row actions. SortHead stays a standard sort button with aria-sort; no drag interaction is introduced.
- Kanban has a move-to-column dropdown in addition to dragging. Essential actions cannot depend on dragging.
- Markdown is a deliberately limited renderer for headings, paragraphs, lists, bold, safe links and fenced code. It escapes content and does not support raw HTML. Use a maintained sanitized parser if production requires richer Markdown.

## Using the source

Import components from `src/library.jsx`, icons from `src/icons.jsx`, and tokens from `src/system.js`. Load styles in this order: `styles.css`, `contour.css`, `library.css`. The shared `@arlab/ui/styles.css` loads Satoshi from its official Fontshare service and includes self-hosted DM Mono 400. Do not import a second legacy font family. The live Foundations page and token downloads read the package’s `tokensFor` export directly, so labels and values follow the same source as components.

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

## Shared form typography

Form values, placeholders, dropdown options and embedded fields use `--text-field: 12px` at regular weight in both themes. Touch controls retain 44px minimum targets. A searchable dropdown uses a soft half-pixel separator, including on focus. All nested text controls compose Input or Textarea.

## Complete component contract

148 implemented entries, including compatibility aliases. All have live specimens in the catalogue.

### Actions

#### Button

A clear action with primary, secondary, quiet, ghost, or destructive emphasis.

Use one primary action per decision. Secondary keeps a border; ghost recedes with a transparent surface and a soft hover fill.

Import: `import { Button } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `variant` | primary  /  secondary (default)  /  quiet  /  ghost  /  danger. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `onClick` | Action callback. Use a link for navigation. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Button](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Button)

#### IconButton

A compact, named action for familiar symbols.

The accessible label describes the action. Touch targets expand to 44px.

Import: `import { IconButton } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `onClick` | Action callback. Use a link for navigation. |
| `children` | React content. Keep text concise and accessible. |

Live example: [IconButton](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=IconButton)

#### TextLink

An underlined destination within prose or supporting navigation.

Use a link for navigation and a button for an action. Links use the main ARLAB pink and a thin underline.

Import: `import { TextLink } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `href` | The actual destination URL or local anchor. |
| `children` | React content. Keep text concise and accessible. |
| `target` | Optional browsing context; use safe rel for external new windows. |

Live example: [TextLink](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=TextLink)

#### PillButton

A labeled toggle for a small filter or preference.

Uses aria-pressed. The default check and border show selection. The quiet variant uses a tone dot, label and count with soft selected fill, no border and no check.

Import: `import { PillButton } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `selected` | Boolean selected state, announced with aria-pressed. |
| `onClick` | Action callback. Use a link for navigation. |
| `children` | React content. Keep text concise and accessible. |
| `variant` | default retains border/check. quiet uses a tone dot, label, optional count and soft selected fill without border/check. |
| `tone` | quiet, ok, warn, bad or info controls the dot, not the text. |
| `count` | Optional numeric count, including zero. |
| `dot` | Quiet-variant tone dot, default true. |
| `disabled` | Native disabled state. Native button attributes and events are forwarded. |

Live example: [PillButton](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=PillButton)

### Inputs & choices

#### Field

A complete field: persistent label, control, hint, and error.

Label and helper IDs are connected to the control. Errors keep the original input.

Import: `import { Field } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `error` | An actionable validation message; sets aria-invalid. |
| `required` | Boolean. Marks the field required and adds visible text. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Field](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Field)

#### Input

A single-line input with a quiet, contained focus treatment.

Focus changes the existing 1px border without an outer halo or offset outline.

Import: `import { Input } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `type` | A supported native input type. |
| `placeholder` | A brief example; never a replacement for a visible label. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `variant` | default (bordered) or embedded (parent owns the surface). Both use 12px regular form text. |
| `inputRef` | Ref to the native input; standard input attributes and event behavior are preserved. |

Live example: [Input](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Input)

#### Textarea

A resizable multi-line field for longer content.

Preserve newlines and let the field grow vertically. Code variant uses DM Mono and a 220px minimum; short size uses 96px. Use a visible label.

Import: `import { Textarea } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `rows` | DataTable: project records. Textarea: visible line count. Skeleton: placeholder row count. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `variant` | default or code. Both use 12px regular text; code uses DM Mono. |
| `size` | default or short. Short sets a 96px minimum. |
| `textareaRef` | Ref to the native textarea. |

Live example: [Textarea](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Textarea)

#### Select

A polished single-choice control for short form lists.

Uses the shared custom dropdown. Selection changes only after the user commits an option.

Import: `import { Select } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `name` | Native form or radio-group name. |

Live example: [Select](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Select)

#### Dropdown

The shared dropdown surface, trigger, and keyboard interaction.

Options support descriptions, counts, and disabled states. The popup chooses available viewport space.

Import: `import { Dropdown } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `searchable` | Boolean. Dropdown enables search automatically at 8 options unless overridden. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `name` | Native form or radio-group name. |

Live example: [Dropdown](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Dropdown)

#### Picker

A dropdown for filters, with optional counts.

Use counts to explain a filter, and offer an explicit All option to reset it.

Import: `import { Picker } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `searchable` | Boolean. Dropdown enables search automatically at 8 options unless overridden. |

Live example: [Picker](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Picker)

#### ComboboxPicker

A searchable choice list for larger collections.

Search is local and case-insensitive. Empty results explain how to recover.

Import: `import { ComboboxPicker } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `searchable` | Boolean. Dropdown enables search automatically at 8 options unless overridden. |

Live example: [ComboboxPicker](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ComboboxPicker)

#### Checkbox

An independent on/off choice that can accompany helper text.

Uses a native checkbox. Clicking the label changes the value; Space toggles it.

Import: `import { Checkbox } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `checked` | Controlled boolean selection state. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [Checkbox](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Checkbox)

#### Radio

One choice within a mutually exclusive named group.

Use a fieldset and legend for a related group. Native arrow-key behavior stays intact.

Import: `import { Radio } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `name` | Native form or radio-group name. |
| `value` | Controlled value. Update it from onChange. |
| `checked` | Controlled boolean selection state. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |

Live example: [Radio](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Radio)

#### Switch

An immediate binary setting, with a label and optional hint.

The switch applies directly. Use a checkbox for a selection that waits for form submission.

Import: `import { Switch } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `checked` | Controlled boolean selection state. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [Switch](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Switch)

#### SwitchRow

A setting name and explanation aligned with its switch.

Keep the whole row large enough to click, without hiding the setting name.

Import: `import { SwitchRow } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `checked` | Controlled boolean selection state. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |

Live example: [SwitchRow](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=SwitchRow)

#### SearchField

A reusable search input with a visible clear action.

Clearing the field resets the results. It does not discard unrelated filters.

Import: `import { SearchField } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `label` | Visible or accessible name describing the control. |
| `placeholder` | A brief example; never a replacement for a visible label. |

Live example: [SearchField](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=SearchField)

#### TagInput

Editable tags with keyboard entry and removal.

Enter or comma adds a trimmed, unique tag. Backspace on an empty input removes the last tag.

Import: `import { TagInput } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `id` | Optional pattern-specific value. Use the live example as the reference. |
| `placeholder` | A brief example; never a replacement for a visible label. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `commitOnBlur` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [TagInput](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=TagInput)

#### FileUpload

A document card with browse, drag-and-drop, validation, and file details.

Accepts one PDF, Markdown, or text file up to 10 MB by default. This local component does not transmit files.

Import: `import { FileUpload } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `maxSize` | Maximum file size in bytes; default 10 × 1024 × 1024. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [FileUpload](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=FileUpload)

#### Dropzone

The shared file-upload pattern, replacing local dashed boxes.

This is the FileUpload implementation under the migration alias Dropzone.

Import: `import { Dropzone } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `maxSize` | Maximum file size in bytes; default 10 × 1024 × 1024. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [Dropzone](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Dropzone)

### Navigation

#### AppSwitcher

A stable, labeled entry to Workspace, Agents Studio, and Knowledge.

A keyboard-accessible application menu. Custom options keep stable values separate from labels; the selected app uses a soft tint.

Import: `import { AppSwitcher } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `options` | Application options with value, label, optional description/icon/disabled. |
| `label` | Accessible menu name. |
| `disabled` | Disables the application trigger. |

Live example: [AppSwitcher](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=AppSwitcher)

#### Breadcrumbs

A compact path showing the current location and its parents.

Only the final item is current. Parent items are actionable; separators are decorative.

Import: `import { Breadcrumbs } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `onNavigate` | Optional pattern-specific value. Use the live example as the reference. |
| `truncate` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [Breadcrumbs](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Breadcrumbs)

#### TabStrip

Keyboard-navigable tabs for sections of one object.

Left/Right, Home, and End move between tabs. Selection uses aria-selected and a clear underline.

Import: `import { TabStrip } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `options` | Strings remain supported. Objects accept label, optional value/id, count (including zero) and disabled. Selection emits value, id or label, in that order. Counts never become selection values. |
| `value` | Stable selected string, independent of counts. |
| `onChange` | Receives the selected value. Arrow keys and Home/End skip disabled tabs. |
| `label` | Accessible tablist name, default Sections. |

Live example: [TabStrip](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=TabStrip)

#### SegmentedControl

A compact switch between related views of the same content.

Uses a group of pressed buttons, not mixed tab semantics. Keep labels brief and meaningful.

Import: `import { SegmentedControl } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `options` | Choice array. Dropdown uses { value, label, description?, count?, disabled? }; tabs use strings. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `label` | Visible or accessible name describing the control. |
| `block` | False by default: the track hugs its segments. True fills available width. |

Live example: [SegmentedControl](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=SegmentedControl)

#### NavTree

Expandable document groups with a clear current page.

Uses native disclosure navigation. Each document remains a normal keyboard-reachable button.

Import: `import { NavTree } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |

Live example: [NavTree](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=NavTree)

#### AccountMenu

Static account identity with a separate sign-out action.

The avatar, name and role are informational. Only the small sign-out action is interactive.

Import: `import { AccountMenu } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `name` | Visible account name; defaults to Alex Morgan. |
| `initials` | One or two letters identifying the person. |
| `workspace` | Workspace name shown below the account identity. |
| `roleCaption` | Secondary account line, such as the actual user role. |
| `collapsed` | Show compact avatar and separate sign-out action without identity text. |
| `onLogout` | Application-owned sign-out action. The identity itself has no menu or button. |
| `onSelect` | Receives the selected date, event, or menu action. |

Live example: [AccountMenu](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=AccountMenu)

#### Toc

A reading rail with direct links to document headings.

Links move to actual anchors. Hide the rail only when the article retains its headings.

Import: `import { Toc } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |

Live example: [Toc](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Toc)

### Data & identity

#### Pill

A small labeled state with a semantic color and dot.

Use ok, warn, bad, info, or quiet. A color never replaces the written state.

Import: `import { Pill } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `tone` | ok  /  warn  /  bad  /  info  /  quiet. |
| `dot` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Pill](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Pill)

#### StatusPill

The project-state vocabulary on the shared Pill.

Planning, In progress, In review, and Completed map to one shared set of tones.

Import: `import { StatusPill } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `tone` | ok  /  warn  /  bad  /  info  /  quiet. |
| `dot` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |

Live example: [StatusPill](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=StatusPill)

#### Chip

A compact category or removable tag.

Removable tags have a named remove button. Passive tags never look like interactive buttons.

Import: `import { Chip } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `onRemove` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [Chip](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Chip)

#### Avatar

An initials marker supporting an identifiable person.

Use a visible name nearby. The avatar alone should not be the only identification.

Import: `import { Avatar } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `initials` | One or two letters identifying the person. |
| `name` | Native form or radio-group name. |
| `color` | Avatar color key or chart/legend CSS color. |

Live example: [Avatar](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Avatar)

#### DeptTile

A department label using the dedicated pink-harmonized color scale.

Department colors describe ownership. They never indicate success, warning, or failure.

Import: `import { DeptTile } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `department` | Creative  /  Engineering  /  Client services  /  Strategy  /  Company. |

Live example: [DeptTile](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DeptTile)

#### Timestamp

A plain human-readable date with an optional time or chip treatment.

The title contains the complete localized date. Timezone context belongs in the surrounding screen.

Import: `import { Timestamp } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `date` | A valid date or ISO 8601 date-time string. |
| `format` | date by default. datetime and time remain available. |
| `showTime` | Opt into date plus time when format is not supplied. |
| `variant` | plain by default. chip adds a soft container and date/time icon. |
| `locale` | Locale for human-readable date and time, default en-GB. |

Live example: [Timestamp](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Timestamp)

#### Kbd

A small keycap for a real, supported keyboard shortcut.

Only show shortcuts that actually work. Keep the keycap visually secondary.

Import: `import { Kbd } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [Kbd](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Kbd)

#### LegendDot

A labeled chart category with its matching color.

Place the label beside the color. Never ask users to distinguish unlabeled colors.

Import: `import { LegendDot } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `color` | Avatar color key or chart/legend CSS color. |
| `children` | React content. Keep text concise and accessible. |

Live example: [LegendDot](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=LegendDot)

#### Stat

A metric with its label and useful context.

Use tabular numerals. A number needs a unit or explanation when its meaning is not obvious.

Import: `import { Stat } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `hint` | Optional supporting text connected to the control. |
| `href` | Optional destination making the whole metric a native link. |
| `onClick` | Optional action making the whole metric a native button. Do not put a second button around the figure. |
| `actionLabel` | Optional accessible action name for the whole metric. |

Live example: [Stat](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Stat)

#### StatRow

A responsive row of related metrics separated by quiet rules.

Keep related metrics on one continuous surface, not a grid of identical floating cards.

Import: `import { StatRow } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [StatRow](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=StatRow)

#### Facts

Aligned labels and values for object properties.

Use a semantic definition list. Long values wrap instead of widening the page.

Import: `import { Facts } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |

Live example: [Facts](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Facts)

#### Meter

A measurable completion value with text and progress semantics.

Expose the value and its range to assistive technology. Unknown progress uses a loading state instead.

Import: `import { Meter } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `label` | Visible or accessible name describing the control. |

Live example: [Meter](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Meter)

#### DataTable

A complete collection table with search, filtering, sorting, selection, and pagination.

Selection, row actions, and sorting are explicit controls. The scroll container is keyboard accessible.

Import: `import { DataTable } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `rows` | DataTable: project records. Textarea: visible line count. Skeleton: placeholder row count. |
| `onOpen` | Receives the row record when its explicit action is activated. |

Live example: [DataTable](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DataTable)

#### FilterRow

A consistent search and status-filter arrangement with a reset.

The clear action only appears when a filter is applied. Mobile controls wrap rather than shrink.

Import: `import { FilterRow } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `query` | Controlled search string. |
| `onQueryChange` | Receives the next search string. |
| `status` | Current status value or object-state label. |
| `onStatusChange` | Receives the selected status filter. |

Live example: [FilterRow](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=FilterRow)

#### SortHead

A column heading button with a visible and announced sort direction.

Use aria-sort on the enclosing column header and a button inside it.

Import: `import { SortHead } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `direction` | ascending  /  descending  /  none. |
| `onSort` | Requests a sort change for this column. |

Live example: [SortHead](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=SortHead)

### Surfaces & layout

#### WorkspaceContent

The approved workspace scroll boundary and fixed footer.

The shared package owns all visual styling and responsive behaviour.

Import: `import { WorkspaceContent } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `footer` | Optional pattern-specific value. Use the live example as the reference. |
| `label` | Visible or accessible name describing the control. |

Live example: [WorkspaceContent](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=WorkspaceContent)

#### WorkspaceGrid

Responsive equal or main-and-sidebar workspace columns.

The shared package owns all visual styling and responsive behaviour.

Import: `import { WorkspaceGrid } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `layout` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |

Live example: [WorkspaceGrid](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=WorkspaceGrid)

#### WorkspaceIntro

Approved workspace greeting, summary and aligned actions.

The shared package owns all visual styling and responsive behaviour.

Import: `import { WorkspaceIntro } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `actions` | Primary and supporting actions for the current page. |

Live example: [WorkspaceIntro](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=WorkspaceIntro)

#### RecordCell

Shared table record name, metadata and optional leading mark.

The shared package owns all visual styling and responsive behaviour.

Import: `import { RecordCell } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `leading` | Optional leading icon or avatar. |

Live example: [RecordCell](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=RecordCell)

#### UsageValue

An aligned usage value with a discreet neutral share bar.

The shared package owns all visual styling and responsive behaviour.

Import: `import { UsageValue } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `max` | Optional pattern-specific value. Use the live example as the reference. |
| `display` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [UsageValue](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=UsageValue)

#### DateStatus

A legible date with its milestone status.

The shared package owns all visual styling and responsive behaviour.

Import: `import { DateStatus } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `date` | A valid date or ISO 8601 date-time string. |
| `status` | Current status value or object-state label. |
| `tone` | ok  /  warn  /  bad  /  info  /  quiet. |

Live example: [DateStatus](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DateStatus)

#### ProgressSummary

A separated label and progress meter.

The shared package owns all visual styling and responsive behaviour.

Import: `import { ProgressSummary } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |

Live example: [ProgressSummary](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ProgressSummary)

#### AppHeader

A responsive application header with context, search and actions.

Context shrinks before actions. Search becomes an icon button on phone; use Breadcrumbs truncate to keep long record titles on one line.

Import: `import { AppHeader } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `context` | Breadcrumbs or application-owned page context. |
| `search` | Existing search action or custom shared SearchField. |
| `pageActions` | Current page actions beside search, before global actions. React content remains application-owned; phones wrap this group onto a separate row. |
| `actions` | Global account/theme/notification controls. |

Live example: [AppHeader](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=AppHeader)

#### ScrollArea

Native scrolling with a short, transparent pink indicator flush to the container edge.

The 2px thumb is at most 28px long. Adding title or header opts into a framed surface with a fixed title rail; height bounds the entire frame. Plain instances remain unframed. hideScrollbar removes indicator controls while preserving native scrolling.

Import: `import { ScrollArea } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `height` | Optional scroll viewport height in pixels or a CSS length. |
| `maxHeight` | Maximum scroll viewport height; content may use less space. |
| `axis` | vertical  /  horizontal  /  both; default vertical. |
| `hideScrollbar` | Optional boolean. Hide custom indicator controls while preserving native scrolling and keyboard access. |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `actions` | Primary and supporting actions for the current page. |
| `header` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |

Live example: [ScrollArea](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ScrollArea)

#### Panel

A titled group of related content with an optional section action.

Use a surface when the content has a distinct purpose, not around every individual item.

Import: `import { Panel } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `action` | An optional section-level action. |
| `tone` | ok  /  warn  /  bad  /  info  /  quiet. |
| `contentInset` | default owns a readable body inset and shared child gaps. flush lets an embedded list or table meet the frame; shared rows retain their text padding. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Panel](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Panel)

#### Card

The same surface contract as Panel, with optional content.

Shares Panel geometry and spacing instead of introducing a second card family.

Import: `import { Card } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `action` | An optional section-level action. |
| `contentInset` | Same default and flush inset contract as Panel. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Card](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Card)

#### CollectionCard

A selectable collection preview with a title, description, and metadata.

The full card is one action. Do not nest interactive buttons inside it.

Import: `import { CollectionCard } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `meta` | A short metadata summary for a collection. |
| `media` | Optional image or video content; displayed at 16:9 with cover cropping. Replaces the fallback icon. |
| `footer` | Optional React footer outside the primary button; may contain independent links or actions. |
| `onClick` | Action callback. Use a link for navigation. |

Live example: [CollectionCard](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=CollectionCard)

#### LinkTile

A compact shortcut with an icon, name, and explanation.

Use for a destination or tool. Keep the title specific enough to predict what opens.

Import: `import { LinkTile } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `icon` | A Lucide React icon component, using the shared stroke. |
| `onClick` | Action callback. Use a link for navigation. |

Live example: [LinkTile](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=LinkTile)

#### Rows

A continuous container for related row items.

Use dividers to separate items without giving every row its own card.

Import: `import { Rows } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [Rows](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Rows)

#### Row

A labeled content row with supporting text and optional action.

Passive rows are not buttons. Actionable rows show a chevron and have one clear target.

Import: `import { Row } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `leading` | Optional leading icon or avatar. |
| `trailing` | Optional supporting status or metadata. |
| `onClick` | Action callback. Use a link for navigation. |

Live example: [Row](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Row)

#### SectionHead

A section title, optional description, and one related action.

Keep the action aligned with its section rather than placing every action in the page header.

Import: `import { SectionHead } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `sub` | Optional supporting text under the section title. |
| `children` | React content. Keep text concise and accessible. |

Live example: [SectionHead](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=SectionHead)

#### SidebarShell

Application shell with optional department spaces rail, foldable tools and fixed account controls.

Import navigation/styles.css. Spaces are app-controlled; arrow keys move focus and Cmd/Ctrl+backslash folds. The real ARLAB wordmark sits in a square brand area; fold controls stay in fixed bottom footers. Phone space/tool pickers use native dialogs. Existing single/context layouts remain available.

Import: `import { SidebarShell } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `brand` | Optional pattern-specific value. Use the live example as the reference. |
| `toolName` | Optional pattern-specific value. Use the live example as the reference. |
| `navigation` | Optional pattern-specific value. Use the live example as the reference. |
| `navigationKey` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |
| `header` | Optional pattern-specific value. Use the live example as the reference. |
| `account` | Optional pattern-specific value. Use the live example as the reference. |
| `help` | Optional pattern-specific value. Use the live example as the reference. |
| `collapsed` | Optional pattern-specific value. Use the live example as the reference. |
| `defaultCollapsed` | Optional pattern-specific value. Use the live example as the reference. |
| `onCollapsedChange` | Optional pattern-specific value. Use the live example as the reference. |
| `storageKey` | Optional pattern-specific value. Use the live example as the reference. |
| `spaces` | Optional pattern-specific value. Use the live example as the reference. |
| `activeSpace` | Optional pattern-specific value. Use the live example as the reference. |
| `onSpaceChange` | Optional pattern-specific value. Use the live example as the reference. |
| `brandMark` | Optional pattern-specific value. Use the live example as the reference. |
| `brandHref` | Optional pattern-specific value. Use the live example as the reference. |
| `panelLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `panelCollapsed` | Optional pattern-specific value. Use the live example as the reference. |
| `onPanelCollapsedChange` | Optional pattern-specific value. Use the live example as the reference. |
| `defaultPanelCollapsed` | Optional pattern-specific value. Use the live example as the reference. |
| `railFooter` | Optional pattern-specific value. Use the live example as the reference. |
| `secondaryNavigation` | Optional pattern-specific value. Use the live example as the reference. |
| `secondaryLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `defaultSecondaryCollapsed` | Optional pattern-specific value. Use the live example as the reference. |
| `mode` | Optional pattern-specific value. Use the live example as the reference. |
| `className` | Optional pattern-specific value. Use the live example as the reference. |
| `style` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [SidebarShell](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=SidebarShell)

#### PageBar

The page title and its primary action in a shared layout.

The page should explain where the user is before presenting controls.

Import: `import { PageBar } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `showTitle` | Optional pattern-specific value. Use the live example as the reference. |
| `description` | Supporting explanation, kept separate from the heading. |
| `pills` | Optional pattern-specific value. Use the live example as the reference. |
| `updated` | Optional pattern-specific value. Use the live example as the reference. |
| `pillsPlacement` | Optional pattern-specific value. Use the live example as the reference. |
| `actions` | Primary and supporting actions for the current page. |
| `heading` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [PageBar](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=PageBar)

#### PageGrid

The shared main-content and context-rail composition.

The second column moves below the first when its minimum width is unavailable.

Import: `import { PageGrid } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [PageGrid](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=PageGrid)

#### CardGrid

A responsive grid of collection cards.

Cards use a consistent minimum width, never a screen-specific auto-fill rule.

Import: `import { CardGrid } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [CardGrid](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=CardGrid)

#### Stack

A vertical layout using a deliberate spacing value.

Choose gaps from the 4px spacing scale. Use Stack instead of repeated margin overrides.

Import: `import { Stack } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `gap` | Spacing in pixels from the shared 4px scale. |
| `id` | Optional pattern-specific value. Use the live example as the reference. |
| `className` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [Stack](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Stack)

#### Separator

An optional quiet dividing line between related content groups.

Add it only when a visible boundary improves scanning. FieldRow has no automatic divider.

Import: `import { Separator } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `orientation` | Optional pattern-specific value. Use the live example as the reference. |
| `decorative` | Suppresses a duplicate loading announcement when a parent already has role=status. |
| `label` | Visible or accessible name describing the control. |

Live example: [Separator](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Separator)

#### DetailHeader

An object title, state, explanation, and supporting facts.

Use the same order in project, agent, workflow, and document detail pages.

Import: `import { DetailHeader } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `status` | Current status value or object-state label. |
| `children` | React content. Keep text concise and accessible. |

Live example: [DetailHeader](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DetailHeader)

#### Inspector

A searchable list and its selected detail in one reusable component.

The current selection remains visible. On narrow screens the list moves above the detail.

Import: `import { Inspector } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |

Live example: [Inspector](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Inspector)

#### Gate

The shared access screen with one clear next action.

The demonstration never sends authentication requests. Production sign-in must state the workspace and provider.

Import: `import { Gate } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `onContinue` | Requests the next access step. The demo stays local. |

Live example: [Gate](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Gate)

### Feedback

#### Loader

A fine circular loader with a restrained moving arc.

Announces loading once. Uses no fabricated percentage. Reduced-motion preferences stop the animation.

Import: `import { Loader } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `size` | Icon or loader size in pixels; loader default 24. |
| `decorative` | Suppresses a duplicate loading announcement when a parent already has role=status. |

Live example: [Loader](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Loader)

#### PageLoading

A full-page loading state with clear context and a quiet animated loader.

Use while initial data is unavailable. Replace with the loaded view or a persistent error. Cancel is optional and must abort the real operation.

Import: `import { PageLoading } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `variant` | signature or content-preview. Content preview fills a bounded shell body with centered live copy and decorative placeholders. |
| `onCancel` | Callback for the safe cancellation action. |
| `mark` | Custom application mark. Defaults to canonical compact ArlabMark. |
| `workspaceName` | Application identity displayed beside the mark. |

Live example: [PageLoading](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=PageLoading)

#### Notice

A contained message with an icon, explanation, and semantic tone.

Explain what happened and what to do next. Persistent messages belong inline, not in temporary toasts.

Import: `import { Notice } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `tone` | ok  /  warn  /  bad  /  info  /  quiet. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Notice](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Notice)

#### Toast

A short confirmation announced without moving keyboard focus.

Use for successful actions. Critical failures stay inline until they are resolved.

Import: `import { Toast } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |

Live example: [Toast](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Toast)

#### Skeleton

Static placeholder rows matching the incoming content structure.

Reserves space without a spinner. Announce loading once, not on every placeholder.

Import: `import { Skeleton } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `rows` | DataTable: project records. Textarea: visible line count. Skeleton: placeholder row count. |

Live example: [Skeleton](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Skeleton)

#### LoadingBar

A determinate progress indicator with a visible value.

A real percentage is required. Do not invent progress when the amount of work is unknown.

Import: `import { LoadingBar } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Controlled value. Update it from onChange. |
| `label` | Visible or accessible name describing the control. |

Live example: [LoadingBar](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=LoadingBar)

#### Refreshing

A subtle busy treatment over the existing, readable content.

Keep previous data visible while refreshing. Use aria-busy and one status announcement.

Import: `import { Refreshing } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `busy` | Boolean refresh-in-progress state; preserves previous content. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Refreshing](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Refreshing)

#### StateView

A unified empty, error, or loading state with a useful next action.

Failed loads retain the user’s filters. Empty states invite a specific first action.

Import: `import { StateView } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `state` | empty  /  loading  /  error. |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `icon` | Optional React content replacing the generic mark. |
| `action` | An optional section-level action. |
| `actionLabel` | Application-specific next action. Never hard-coded to a project. |
| `onAction` | Application-owned action callback. |
| `onRetry` | Retries the failed operation without dropping the current context. |
| `onCreate` | Starts the first useful action from an empty state. |
| `size` | regular is the full state. compact is a short icon/copy/action composition for a dashboard module. |
| `variant` | framed owns a surface. embedded inherits its parent Panel with no second frame or inset. |

Live example: [StateView](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=StateView)

#### Tooltip

A brief explanation available on hover and keyboard focus.

Never place essential instructions only in a tooltip. Use aria-describedby.

Import: `import { Tooltip } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Tooltip](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Tooltip)

### Overlays & editing

#### Popover

An anchored top-layer surface for a small contextual task.

Escape and outside clicks close it. The surface stays within the viewport.

Import: `import { Popover } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `trigger` | A button element that opens the contextual surface. |
| `children` | React content. Keep text concise and accessible. |
| `label` | Visible or accessible name describing the control. |
| `open` | Controlled overlay visibility. |
| `onOpenChange` | Called with the next boolean open state. |

Live example: [Popover](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Popover)

#### DropdownMenu

A keyboard-navigable action menu with optional icons and shortcuts.

Arrow keys move through enabled items. Escape returns to the trigger.

Import: `import { DropdownMenu } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `label` | Visible or accessible name describing the control. |

Live example: [DropdownMenu](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DropdownMenu)

#### Dialog

A modal decision or focused form using the native dialog layer.

Focus stays inside. Escape closes; the opening control regains focus.

Import: `import { Dialog } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `open` | Controlled overlay visibility. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |
| `title` | A concise visible heading describing this context. |
| `label` | Visible or accessible name describing the control. |
| `description` | Optional supporting text before the modal content. |
| `children` | React content. Keep text concise and accessible. |
| `width` | Optional CSS length or number in pixels. Clamped to the viewport; sheets default to 460px. |
| `footer` | React actions fixed outside the content scroll when scrollable is enabled. |
| `scrollable` | Uses the shared ScrollArea, with the heading and footer kept fixed. |
| `contentLabel` | Accessible name of the shared content scroll region. |
| `dismissible` | Default true. False disables close, backdrop and Escape dismissal while an operation is pending. |

Live example: [Dialog](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Dialog)

#### Sheet

A side panel for editing without losing the parent context.

Shares Dialog focus behavior. It becomes full width on a phone.

Import: `import { Sheet } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `open` | Controlled overlay visibility. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |
| `title` | A concise visible heading describing this context. |
| `label` | Visible or accessible name describing the control. |
| `description` | Optional supporting text before the modal content. |
| `children` | React content. Keep text concise and accessible. |
| `width` | Optional CSS length or number in pixels. Clamped to the viewport; sheets default to 460px. |
| `footer` | React actions fixed outside the content scroll when scrollable is enabled. |
| `scrollable` | Uses the shared ScrollArea, with the heading and footer kept fixed. |
| `contentLabel` | Accessible name of the shared content scroll region. |
| `dismissible` | Default true. False disables close, backdrop and Escape dismissal while an operation is pending. |

Live example: [Sheet](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Sheet)

#### ConfirmDialog

An explicit confirmation for a consequential operation.

Initial focus starts on the safe Cancel action. Name the action instead of saying Yes.

Import: `import { ConfirmDialog } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `open` | Controlled overlay visibility. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |
| `onConfirm` | Callback for the explicitly named confirmation action. |
| `title` | A concise visible heading describing this context. |
| `label` | Visible or accessible name describing the control. |
| `description` | Supporting explanation, kept separate from the heading. |
| `confirmLabel` | Explicit action label, such as Archive project. |
| `pending` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [ConfirmDialog](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ConfirmDialog)

#### ConfirmStrip

A contained, in-place confirmation with two clear actions.

Use only when the action can be understood in the surrounding context.

Import: `import { ConfirmStrip } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `onConfirm` | Callback for the explicitly named confirmation action. |
| `onCancel` | Callback for the safe cancellation action. |

Live example: [ConfirmStrip](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ConfirmStrip)

#### Disclosure

The bordered information card with a clear header and expandable body.

Native details/summary handles Enter and Space. Icon, title, and chevron share one target.

Import: `import { Disclosure } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `children` | React content. Keep text concise and accessible. |
| `defaultOpen` | Whether a disclosure starts expanded. |

Live example: [Disclosure](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Disclosure)

#### SaveBar

A persistent editing summary with save and discard actions.

Save is unavailable when nothing changed. A failed save should preserve the dirty state and user input.

Import: `import { SaveBar } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `dirty` | Boolean indicating unsaved work. |
| `onSave` | Receives the edited object or triggers a save operation. |
| `onDiscard` | Restores the last saved value. |
| `saving` | Boolean save-in-progress state; disables duplicate actions. |
| `actions` | Primary and supporting actions for the current page. |
| `message` | Optional pattern-specific value. Use the live example as the reference. |
| `sticky` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [SaveBar](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=SaveBar)

#### FieldRow

A setting description aligned with its control.

The label column has a consistent measure. On mobile the control stacks below the label.

Import: `import { FieldRow } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `hint` | Optional supporting text connected to the control. |
| `children` | React content. Keep text concise and accessible. |

Live example: [FieldRow](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=FieldRow)

#### SheetSection

A reusable section within a sheet or detail panel.

Group a few related fields under a specific title. Avoid repeating a border around every field.

Import: `import { SheetSection } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `children` | React content. Keep text concise and accessible. |

Live example: [SheetSection](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=SheetSection)

#### CopyBlock

A readable code or value block with a copy action.

The control confirms a successful clipboard write. The text remains selectable when clipboard permission is unavailable.

Import: `import { CopyBlock } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `onCopy` | Optional async callback with the code text, for an application clipboard fallback. |
| `onCopyError` | Optional callback when copying fails. Recovery text remains visible and the original content is retained. |

Live example: [CopyBlock](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=CopyBlock)

### Documents & operations

#### Surface

The approved shared Satin Lift container used by Panel and framed surfaces.

Foundation tokens own the radius, satin rim and elevation. Applications reuse this component instead of local container CSS.

Import: `import { Surface } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `as` | Optional pattern-specific value. Use the live example as the reference. |
| `interactive` | Optional pattern-specific value. Use the live example as the reference. |
| `elevation` | Optional pattern-specific value. Use the live example as the reference. |
| `variant` | primary  /  secondary (default)  /  quiet  /  ghost  /  danger. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Surface](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Surface)

#### PageFrame

A bounded page with one content scroll area and fixed framing.

Application owns data, validation and persistence. DocumentContent requires caller-sanitised HTML.

Import: `import { PageFrame } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `header` | Optional pattern-specific value. Use the live example as the reference. |
| `footer` | Optional pattern-specific value. Use the live example as the reference. |
| `label` | Visible or accessible name describing the control. |
| `padding` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |

Live example: [PageFrame](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=PageFrame)

#### ReadingLayout

A document and responsive outline sharing a scroll boundary.

Application owns data, validation and persistence. DocumentContent requires caller-sanitised HTML.

Import: `import { ReadingLayout } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `outline` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |

Live example: [ReadingLayout](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ReadingLayout)

#### DocumentContent

Shared rich-document presentation and keyboard image preview.

Application owns data, validation and persistence. DocumentContent requires caller-sanitised HTML.

Import: `import { DocumentContent } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `html` | Optional pattern-specific value. Use the live example as the reference. |
| `label` | Visible or accessible name describing the control. |

Live example: [DocumentContent](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DocumentContent)

#### DocumentOutline

Collapsible heading links and active section tracking.

Application owns data, validation and persistence. DocumentContent requires caller-sanitised HTML.

Import: `import { DocumentOutline } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `headings` | Optional pattern-specific value. Use the live example as the reference. |
| `label` | Visible or accessible name describing the control. |

Live example: [DocumentOutline](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DocumentOutline)

#### Inline

A wrapping horizontal composition on shared spacing.

Application owns data, validation and persistence. DocumentContent requires caller-sanitised HTML.

Import: `import { Inline } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `justify` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Inline](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Inline)

#### ContentInset

Shared content padding for reusable compositions.

Application owns data, validation and persistence. DocumentContent requires caller-sanitised HTML.

Import: `import { ContentInset } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [ContentInset](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ContentInset)

#### Table

A semantic table for application-owned row structures.

Application owns data, validation and persistence. DocumentContent requires caller-sanitised HTML.

Import: `import { Table } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `children` | React content. Keep text concise and accessible. |

Live example: [Table](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Table)

#### FileDropzone

File selection and drag feedback without upload side effects.

Application owns data, validation and persistence. DocumentContent requires caller-sanitised HTML.

Import: `import { FileDropzone } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `onFiles` | Optional pattern-specific value. Use the live example as the reference. |
| `accept` | Optional pattern-specific value. Use the live example as the reference. |
| `multiple` | Optional pattern-specific value. Use the live example as the reference. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |

Live example: [FileDropzone](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=FileDropzone)

#### DropRegion

Shared drag and drop feedback for application-owned organising.

Application owns data, validation and persistence. DocumentContent requires caller-sanitised HTML.

Import: `import { DropRegion } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `active` | Optional pattern-specific value. Use the live example as the reference. |
| `dragging` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |

Live example: [DropRegion](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DropRegion)

#### ReadableDoc

A readable article with consistent headings and paragraph rhythm.

Keep prose within 64 to 72 characters and use 1.75 line height.

Import: `import { ReadableDoc } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `children` | React content. Keep text concise and accessible. |

Live example: [ReadableDoc](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ReadableDoc)

#### Markdown

An escaped renderer for headings, paragraphs, lists, and fenced code.

This implementation supports a documented Markdown subset and never renders raw HTML.

Import: `import { Markdown } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [Markdown](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Markdown)

#### Timeline

A sequence of updates with content and time labels.

The order is meaningful. Do not rely on the connecting line to communicate chronology.

Import: `import { Timeline } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |

Live example: [Timeline](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Timeline)

#### Steps

A visible sequence with current and completed states.

Current step uses aria-current. Completion has a check icon and text label.

Import: `import { Steps } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `steps` | Ordered array of step labels. |
| `current` | Zero-based index of the current step. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |

Live example: [Steps](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Steps)

#### ColumnChart

A labeled comparison of values with a data-table alternative.

Use a zero baseline. Values and category labels are visible; color is supplementary.

Import: `import { ColumnChart } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `data` | Array of { label: string, value: number }. |
| `secondaryData` | Optional pattern-specific value. Use the live example as the reference. |
| `primaryLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `secondaryLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `color` | One series uses this CSS colour, default var(--chart-1). |
| `highlight` | Optional datum label highlighted in the accent colour. |

Live example: [ColumnChart](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ColumnChart)

#### Sparkline

A small trend line with an accessible data summary.

Use it to support a metric, not as the only way to understand the numbers.

Import: `import { Sparkline } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `data` | Array of { label: string, value: number }. |

Live example: [Sparkline](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Sparkline)

#### StackedBar

A part-to-whole comparison with a labeled legend and data table.

One hue by default. Enable categorical colours only for meaningful groups. Values remain available as text.

Import: `import { StackedBar } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `data` | Array of { label: string, value: number }. |
| `categorical` | False by default. Enable separate colours for meaningful categorical parts. |
| `color` | Single-series CSS colour. |
| `highlight` | Optional datum label highlighted in the accent colour. |

Live example: [StackedBar](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=StackedBar)

#### BarList

A ranked or ordered set of values with horizontal bars.

Labels and values align consistently. The bar width is proportional to the maximum value.

Import: `import { BarList } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `data` | Array of { label: string, value: number }. |
| `categorical` | False by default. Enable one colour per category only when categories have distinct meanings. |
| `color` | Single-series CSS colour. |
| `highlight` | Optional datum label highlighted in the accent colour. |

Live example: [BarList](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=BarList)

#### Calendar

An application calendar with real dates, events and selectable periods.

Controlled month or rolling periods, including exactly five weeks. Month view expands to include every date. Arrow, Home/End and PageUp/PageDown preserve keyboard focus. Events come only from the application.

Import: `import { Calendar } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `value` | Selected local date as YYYY-MM-DD, or null. Update from onSelect; moving periods does not change selection. |
| `onSelect` | Receives the selected local date as YYYY-MM-DD. |
| `month` | Controlled month as YYYY-MM. Default is the selected month or current month. |
| `onMonthChange` | Receives the requested YYYY-MM after Previous, Today, Next or keyboard navigation. |
| `startDate` | Explicit rolling period start as YYYY-MM-DD; takes precedence over month. |
| `onStartDateChange` | Receives the requested rolling-period start date. |
| `weeks` | 1 to 12 rolling rows, default 5. Month mode always includes every date even when more rows are required. |
| `events` | Application-owned events: id, date, title, optional description, time, tone, color and disabled. The library contains no scheduled data. |
| `onEventSelect` | Receives the original event object when an enabled event is activated. |
| `maxEventsPerDay` | Visible desktop events per cell, default 3. Additional events open the complete day agenda. |
| `onDayDetails` | Optional callback with the date when an event count or overflow action opens its agenda. |
| `min` | Earliest selectable local date, YYYY-MM-DD. |
| `max` | Latest selectable local date, YYYY-MM-DD. |
| `weekStartsOn` | First weekday from 0 (Sunday) to 6 (Saturday), default 1 (Monday). |
| `locale` | Locale for human-readable dates and weekdays, default en-GB. |

Live example: [Calendar](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=Calendar)

#### DayTimeline

A time-based view of a day with selectable events.

Display the timezone. Event details remain available through normal buttons.

Import: `import { DayTimeline } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `onSelect` | Receives the selected date, event, or menu action. |

Live example: [DayTimeline](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DayTimeline)

#### KanbanBoard

A controlled board with independent column scrolling, collapse and phone column navigation.

The host owns cards and persistence. Move by pointer/touch handle, keyboard pickup/arrows/drop or Move to menu. Omit onMove for read-only. Destination index excludes the moved card. Phone supports tabs and swipe; loading, error, empty and limited columns have explicit states.

Import: `import { KanbanBoard } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `columns` | Optional pattern-specific value. Use the live example as the reference. |
| `cards` | Optional pattern-specific value. Use the live example as the reference. |
| `renderCard` | Optional pattern-specific value. Use the live example as the reference. |
| `onCardOpen` | Optional pattern-specific value. Use the live example as the reference. |
| `onMove` | Optional pattern-specific value. Use the live example as the reference. |
| `onColumnToggle` | Optional pattern-specific value. Use the live example as the reference. |
| `getCardLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `loading` | Optional pattern-specific value. Use the live example as the reference. |
| `error` | An actionable validation message; sets aria-invalid. |
| `columnWidth` | Optional pattern-specific value. Use the live example as the reference. |
| `density` | Optional pattern-specific value. Use the live example as the reference. |
| `height` | Optional scroll viewport height in pixels or a CSS length. |
| `fill` | Optional pattern-specific value. Use the live example as the reference. |
| `inset` | default owns a 16px board gutter, 12px on phones. flush removes only the outer gutter when the parent already supplies it. Column and card spacing remains intact. |

Live example: [KanbanBoard](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=KanbanBoard)

#### ProjectStatusSheet

The shared project-status editor for Workspace and Knowledge.

A single status vocabulary and shared sheet replace the duplicated project-status implementations.

Import: `import { ProjectStatusSheet } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `open` | Controlled overlay visibility. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |
| `project` | Project object with name, client, status, owner, and due date. |
| `onSave` | Receives the edited object or triggers a save operation. |

Live example: [ProjectStatusSheet](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ProjectStatusSheet)

### Dashboard & editors

#### CommandPalette

Workspace search with the shared search field, native modal and bounded results.

Host owns shortcuts and routing. Items have id, title, summary, typeLabel, optional group and onSelect. Named groups render accessible headings and keep keyboard selection aligned. Arrow keys select; Enter opens; Escape dismisses and returns focus. Results remain bounded to the first 24; the footer reports all matches.

Import: `import { CommandPalette } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `open` | Controlled overlay visibility. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `title` | A concise visible heading describing this context. |
| `placeholder` | A brief example; never a replacement for a visible label. |
| `emptyLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `filter` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [CommandPalette](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=CommandPalette)

#### CollectionWorkspace

A full collection that becomes a compact navigator beside the selected record.

split keeps list and detail side by side; focus gives the record all the width; stacked places a bounded list above detail. Phone shows the selected record with application-owned collection navigation.

Import: `import { CollectionWorkspace } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `collection` | Full browse destination, kept mounted while a record is selected so search, sort and scroll survive. |
| `navigator` | Compact list React content. Use RecordNavigator for collection records. |
| `detail` | Selected record React content. Omit or pass null to show the full collection. |
| `layout` | split (default): list beside detail; focus: detail alone; stacked: bounded list above detail. Phone shows only the selected detail. |
| `collectionMode` | navigator (default) uses a separate compact navigator. condense keeps the same table visible and narrows it to its identity column beside the selected detail. |
| `sidebar` | Render callback {mobile,close} for a persistent right-side filter rail shared by browse and detail. Phones use a native sheet. |
| `sidebarLabel` | Label of the phone filter trigger and sheet, default Filters. |
| `navigatorLabel` | Accessible label for the compact list region, default Records. |
| `detailLabel` | Accessible label for the selected detail region, default Selected record. |
| `navigatorWidth` | Desktop CSS width, default 280px; tablet uses 240px. The library preserves a usable detail column. |

Live example: [CollectionWorkspace](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=CollectionWorkspace)

#### RecordNavigator

A compact searchable record list with real links and quiet selection.

Names truncate with full-title tooltips; arrow/Home/End keys move focus, Enter opens and modifier-click retains browser behavior. Shared ScrollArea owns the list.

Import: `import { RecordNavigator } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | Visible compact-list heading and accessible scroll-region name. |
| `records` | CollectionRecord objects with id, title, description, category, status, tone, meta and real href. |
| `selectedId` | ID of the selected record. Async loading and restored pane visibility reveal its full row. |
| `onOpen` | Called with the record ID for ordinary activation. Modified clicks retain native link behavior. |
| `search` | Optional shared SearchField or application-owned search control. |
| `actions` | Optional header actions. |
| `filters` | Optional compact filter controls beside search. |
| `notice` | Optional contextual notice, such as a selected record outside active filters. |
| `loading` | Shows the shared loading message instead of empty results. |
| `emptyMessage` | Application-specific empty result message. |
| `density` | comfortable (default) or compact. Compact hides the secondary description. |

Live example: [RecordNavigator](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=RecordNavigator)

#### RecordSection

A borderless section for readable details and focused forms.

Plain sections avoid nested card surfaces; divided adds a quiet bottom separator. Heading and actions wrap in narrow record panes.

Import: `import { RecordSection } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | Semantic section heading. |
| `description` | Supporting guidance below the heading. |
| `summary` | Optional metadata between heading and content. |
| `actions` | Optional wrapping heading actions. |
| `children` | Reading content or shared form controls. |
| `footer` | Optional section-level actions or explanation. |
| `variant` | plain (default) is borderless; divided adds a quiet bottom separator. |

Live example: [RecordSection](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=RecordSection)

#### ActionGroup

A compact wrapping group of related controls.

Optional label names the group. start/end alignment and token spacing remain shared.

Import: `import { ActionGroup } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | Related shared controls. |
| `label` | Optional accessible group name. |
| `align` | start (default) or end. |

Live example: [ActionGroup](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ActionGroup)

#### InfiniteTable

A virtualized sortable table that continues loading as you scroll.

Local mode sorts the full filtered array before loading windows. Remote mode delegates sorting and pagination to the host. One count pill and search share the fixed header; footerActions remain outside the scroll surface. fill consumes a bounded parent. Fixed row geometry bounds rendered DOM; headers stay fixed. Requests support cancellation, errors and explicit retry.

Import: `import { InfiniteTable } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `header` | Optional React content replacing the title. |
| `headerActions` | Optional pattern-specific value. Use the live example as the reference. |
| `countLabel` | Noun after the localized record total, such as projects or shown. |
| `formatCount` | Optional count-to-string callback overriding countLabel and the accessible count label. |
| `searchWidth` | Preferred minimum search width (CSS length or pixels), default 220; wraps within phone width. |
| `search` | Optional pattern-specific value. Use the live example as the reference. |
| `footerActions` | Optional pattern-specific value. Use the live example as the reference. |
| `condensedHeaderActions` | Compact header tools for a condensed CollectionWorkspace. The original table remains mounted. |
| `condensedFooterActions` | Essential footer actions for a condensed CollectionWorkspace. Loading errors retain Retry. |
| `fill` | Optional pattern-specific value. Use the live example as the reference. |
| `columns` | Optional pattern-specific value. Use the live example as the reference. |
| `rows` | Loaded records. Remote mode preserves their server-provided order. |
| `rowKey` | Optional pattern-specific value. Use the live example as the reference. |
| `mode` | local (default) sorts the full provided array; remote delegates ordering and fetching to the host. |
| `initialSort` | Local initial {key,direction} or null. |
| `sort` | Remote controlled {key,direction:ascending / descending} or null. |
| `onSortChange` | Optional pattern-specific value. Use the live example as the reference. |
| `hasMore` | Optional pattern-specific value. Use the live example as the reference. |
| `onLoadMore` | Remote callback (AbortSignal) => Promise<void>. Resolve after appending rows; reject to expose Retry loading. Ignore aborted requests in the host. |
| `loadingMore` | Optional pattern-specific value. Use the live example as the reference. |
| `error` | An actionable validation message; sets aria-invalid. |
| `totalCount` | Remote optional matching count. Unknown counts use aria-rowcount=-1. |
| `filterKey` | Change when the host query changes; retain when appending to the same query. |
| `rowHeight` | Fixed row height, default 64px, minimum 44px. Custom cells must fit within two lines. |
| `overscan` | Extra virtual rows around the viewport, default 6. |
| `chunkSize` | Local rows disclosed per load, default 50. |
| `height` | Optional scroll viewport height in pixels or a CSS length. |
| `variant` | contained (default) or flush. Dividers in flush touch the enclosing container edges. |
| `onRowClick` | Optional pattern-specific value. Use the live example as the reference. |
| `rowLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `selectedRowKey` | Optional pattern-specific value. Use the live example as the reference. |
| `sortIndicators` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [InfiniteTable](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=InfiniteTable)

#### FacetList

A vertical filter group with baseline counts and soft selection.

13px labels use 32px rows or compact 28px rows. Radio and checkbox semantics support arrow navigation. Phone filters open a shared side panel. Long names keep a tooltip.

Import: `import { FacetList } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `groups` | Grouped API: {id,label,items,limit?}[]. Each item has id,label,count?,mark?,tone?,dept?,avatar?,disabled?. |
| `items` | Flat API alternative to groups. Items use stable id, full label and optional count or mark. |
| `value` | Grouped API uses Record<groupId,string / string[]>; flat single mode uses a string. |
| `onChange` | Grouped: (groupId,nextStringOrArray). Flat single: (nextId). Values remain host-owned. |
| `multiple` | Grouped API: true for all groups, or an array of group IDs with checkbox selection. |
| `allLabel` | Optional reset-to-all row label within each group. |
| `mode` | Optional pattern-specific value. Use the live example as the reference. |
| `values` | Optional pattern-specific value. Use the live example as the reference. |
| `onValuesChange` | Optional pattern-specific value. Use the live example as the reference. |
| `label` | Visible or accessible name describing the control. |
| `showAllCount` | Optional pattern-specific value. Use the live example as the reference. |
| `density` | regular: 32px rows; compact: 28px rows. Labels remain 13px. |
| `compact` | Optional pattern-specific value. Use the live example as the reference. |
| `responsive` | Default true. Phone uses a Filters button opening one sheet; false keeps inline groups. |
| `height` | Optional scroll viewport height in pixels or a CSS length. |
| `maxHeight` | Maximum scroll viewport height; content may use less space. |
| `loading` | Optional pattern-specific value. Use the live example as the reference. |
| `emptyLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `emptyMessage` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [FacetList](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=FacetList)

#### RankList

A selectable ranked list with muted 4px share bars and right-aligned values.

Rows announce name, metadata, value and rank. Roving keyboard selection and shared scrolling support longer lists. Marks are decorative; numeric values determine bar geometry.

Import: `import { RankList } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `items` | {id,name,meta?,value,display?,subValue?,mark?,tone?,dept?,avatar?,status?}[]; value controls relative 4px share bars. |
| `selected` | Controlled selected ID. value is retained as an alias. |
| `value` | Controlled value. Update it from onChange. |
| `onSelect` | Receives the selected row ID. Omitting it gives a read-only list. |
| `label` | Visible or accessible name describing the control. |
| `format` | Optional numeric value-to-label callback; per-item display takes priority. |
| `limit` | Initial number of visible items. Show more expands without changing selection. |
| `showMoreLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `density` | regular or compact. |
| `header` | Optional pattern-specific value. Use the live example as the reference. |
| `barTone` | chart (default, muted), quiet or accent. |
| `max` | Optional pattern-specific value. Use the live example as the reference. |
| `height` | Optional scroll viewport height in pixels or a CSS length. |
| `maxHeight` | Maximum scroll viewport height; content may use less space. |
| `loading` | Optional pattern-specific value. Use the live example as the reference. |
| `emptyLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `emptyMessage` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [RankList](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=RankList)

#### StatNote

A neutral metric with a separate semantic status and supporting context.

The figure always stays neutral. Note is a pill or tone dot; trend direction and good/bad meaning are independent. View accepts a link or callback.

Import: `import { StatNote } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `note` | String or {tone,label,variant?:pill / dot}. The figure always stays neutral. |
| `caption` | Optional pattern-specific value. Use the live example as the reference. |
| `tone` | ok  /  warn  /  bad  /  info  /  quiet. |
| `presentation` | Optional pattern-specific value. Use the live example as the reference. |
| `format` | Optional number-to-label callback. |
| `size` | regular or large. |
| `trend` | {label,direction?:up / down / flat,good?:up / down,tone?:good / bad / neutral}. Meaning follows outcome, not arrow direction. |
| `view` | Optional pattern-specific value. Use the live example as the reference. |
| `href` | Makes the whole stat a navigation link. |
| `onClick` | Makes the whole stat one action button; no nested action is created. |
| `actionLabel` | Accessible and visible whole-stat action label. |
| `loading` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [StatNote](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=StatNote)

#### StatNoteRow

Aligned labels, figures, captions and actions across status metrics.

Shared grid rows align captions and figures even when another metric has a long note. Responsive columns preserve readable text.

Import: `import { StatNoteRow } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |
| `mobileLayout` | stack preserves the existing responsive layout. compact uses two columns and shorter spacing on phones. |

Live example: [StatNoteRow](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=StatNoteRow)

#### CollectionLayout

A full-width collection destination with search and optional filters.

Use scroll=content for ordinary cards or prose, and the default scroll=child for a table that owns its rows. Heading, search above tabs, and filters remain fixed. Results own the remaining height. Function children receive filterTrigger for placing phone filters inside the table header. Hidden empty headings and toolbars occupy no space. Filters expand on request; changing filters remains application-owned.

Import: `import { CollectionLayout } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `showTitle` | Default true. False retains the semantic heading without a large visible title; empty metadata bars disappear. |
| `description` | Supporting explanation, kept separate from the heading. |
| `pills` | React content beside the title, such as record counts and status pills. Wraps naturally on narrow screens. |
| `updated` | Application-owned metadata beside the description. Use a time element with dateTime for an update timestamp. |
| `actions` | Primary and supporting actions for the current page. |
| `tabs` | Tabs below the shared heading and search. Their 1px separator spans the entire collection width, including above desktop filters. |
| `search` | Shared search field above the tabs at the left side of the collection header. |
| `filters` | Optional pattern-specific value. Use the live example as the reference. |
| `activeFilters` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | Results content or ({filterTrigger}) => content. Place filterTrigger in the table headerActions for phone filters. |
| `variant` | contained (default) or flush. Flush results extend to the container edges. |
| `sidebar` | Optional render callback receiving {mobile, close}. Desktop sits on the right; phone opens a Filters sheet. |
| `sidebarLabel` | Accessible phone filter-sheet title, default Filters. |
| `scroll` | child preserves a filling table’s own scroll. content creates one bounded shared ScrollArea for ordinary card or list results. Search sits above the tabs, with heading and filters fixed. |

Live example: [CollectionLayout](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=CollectionLayout)

#### RecordCollection

A responsive collection with sortable desktop results and readable phone rows.

Records carry id, title, description, category, status, tone, meta and real href. Modifier-click preserves browser navigation.

Import: `import { RecordCollection } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `records` | Optional pattern-specific value. Use the live example as the reference. |
| `onOpen` | Receives the row record when its explicit action is activated. |
| `loading` | Optional pattern-specific value. Use the live example as the reference. |
| `label` | Visible or accessible name describing the control. |
| `emptyMessage` | Optional pattern-specific value. Use the live example as the reference. |
| `variant` | contained or flush. Flush header, row and footer lines meet the container edges. |
| `progressive` | Opt in to continuous virtualized rows with a fixed table header and footer, without pagination controls. |
| `countLabel` | Noun after the localized record total, such as projects or shown. |
| `formatCount` | Optional count-to-string callback overriding countLabel and the accessible count label. |
| `searchWidth` | Preferred minimum search width (CSS length or pixels), default 220; wraps within phone width. |
| `search` | Shared search field inside the table header. |
| `headerActions` | Header filter or view controls. |
| `footerActions` | Persistent collection creation and management controls. |
| `condensedHeaderActions` | Compact header tools when a CollectionWorkspace narrows the progressive table, such as an icon refresh. |
| `condensedFooterActions` | Essential footer controls for the narrowed progressive table. Full footer actions and progress copy are hidden. |
| `filterKey` | Stable search/filter identity. Exclude selected records and detail tabs to retain scroll. |
| `selectedId` | Selected record ID. Highlights the same table row and reveals its virtual window. |

Live example: [RecordCollection](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=RecordCollection)

#### RecordLayout

A focused workspace for one selected record.

Keeps the record header fixed and the content scrollable without a competing browse rail.

Import: `import { RecordLayout } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | React content. Keep text concise and accessible. |

Live example: [RecordLayout](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=RecordLayout)

#### RecordHeader

A record title, publication state, actions and accessible sections.

Tabs and their control props are optional together; omitted or empty tabs render no tab strip. Supplied tabs support arrow/Home/End navigation. Secondary details open in a labelled side sheet with fixed heading and footer, shared scrolling and a clear Done action. Back behavior belongs to the host. showTitle and showBack can hide redundant chrome when the app header already provides record identity and breadcrumb navigation.

Import: `import { RecordHeader } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `showTitle` | Default true. False keeps the semantic heading for apps that expose the record name in breadcrumbs. |
| `showBack` | Default true. False removes the Back button when the app provides collection breadcrumb navigation. |
| `badges` | Optional pattern-specific value. Use the live example as the reference. |
| `description` | Supporting explanation, kept separate from the heading. |
| `contextActions` | Optional pattern-specific value. Use the live example as the reference. |
| `actions` | Primary and supporting actions for the current page. |
| `backLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `onBack` | Optional pattern-specific value. Use the live example as the reference. |
| `metadata` | React content presented in a shared side sheet with fixed heading, record context, scrolling content and Done action. |
| `tabs` | Optional with value/onChange/idPrefix/panelId. Omit the entire group for a record without sections; no empty tab surface is rendered. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `idPrefix` | Optional pattern-specific value. Use the live example as the reference. |
| `panelId` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [RecordHeader](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=RecordHeader)

#### RecordBody

One labelled scrolling surface below a record header.

Footer actions remain outside the content scroll; an empty footer target takes no space. Connects the active tab to its panel and delegates scrolling to the shared ScrollArea.

Import: `import { RecordBody } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `children` | Full tab content in the shared ScrollArea. |
| `id` | The tabpanel ID linked from its tabs. |
| `label` | Accessible region name for a record without tabs. |
| `labelledBy` | Optional selected tab ID. Omit for a labelled region instead of a tabpanel. |
| `footer` | Persistent record actions outside the scrolling content. The footer spans the selected pane and stays visible while content scrolls. |
| `footerRef` | Optional React ref for application-owned action portals. Empty footer targets occupy no space. |

Live example: [RecordBody](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=RecordBody)

#### DetailSections

Content proportions for reading, comparing and editing.

reading reserves a secondary column; split balances two tasks; stacked gives editors a focused column; editor reserves a settings rail; wide uses the full content width. Columns adapt to their record container.

Import: `import { DetailSections } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `layout` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |

Live example: [DetailSections](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DetailSections)

#### FormGrid

Responsive form columns with safe minimum widths.

One or two columns; shared responsive rules collapse paired fields on narrow screens.

Import: `import { FormGrid } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `columns` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |

Live example: [FormGrid](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=FormGrid)

#### FormFieldGroup

A field label, control and contextual guidance.

Link htmlFor to the real control ID. Child state and attributes remain owned by the caller.

Import: `import { FormFieldGroup } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `htmlFor` | Optional pattern-specific value. Use the live example as the reference. |
| `hint` | Optional supporting text connected to the control. |
| `error` | An actionable validation message; sets aria-invalid. |
| `required` | Boolean. Marks the field required and adds visible text. |
| `children` | React content. Keep text concise and accessible. |

Live example: [FormFieldGroup](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=FormFieldGroup)

#### FilterableTable

Reusable full-width table with sortable headers, custom cells and built-in pagination.

Column arrows toggle ascending and descending order before pagination. Headers and cells accept custom content; sortValue supports formatted values. Use FilterSidebar to filter data. fill bounds the row scroll between the fixed header and pager. countLabel appends a noun; formatCount overrides the visible/accessibility label. searchWidth defaults to 220px and adapts to phones.

Import: `import { FilterableTable } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `header` | Optional React content replacing the default table title. |
| `headerActions` | Optional React content in the trailing header area. |
| `countLabel` | Optional noun after the localized count, such as projects or shown. |
| `formatCount` | Optional (count) => string, taking precedence over countLabel. Loading and unknown totals keep their status labels. |
| `searchWidth` | Preferred minimum search width as a CSS length or number in pixels; default 220, constrained on small screens. |
| `search` | Shared search field rendered inside the fixed table header. The table owns one numeric count pill. |
| `columns` | Column definitions: key, accessible label, optional header content, width/minWidth/maxWidth (CSS lengths or percentages), align, sortable, sortValue accessor, value accessor and render callback. |
| `rows` | Record array, sorted before pagination. Supply filtered records from your sidebar or host. |
| `rowKey` | Unique record property or callback returning a stable string/number ID. |
| `pageSize` | Initial number of visible rows, default 10. |
| `pageSizes` | Available rows-per-page choices, default 10, 25 and 50. |
| `loading` | Replaces rows with a loading state and announces aria-busy. |
| `emptyMessage` | Message shown when no rows match. |
| `variant` | contained (default) or flush. Flush dividers reach container edges with cell padding retained. |
| `fill` | Allows the bounded results scroll to occupy the available layout height. |
| `onRowClick` | Optional row activation on click, Enter or Space. Nested controls remain independent. |
| `rowLabel` | Accessible row label callback. |
| `selectedRowKey` | Optional pattern-specific value. Use the live example as the reference. |
| `tableLayout` | fixed (default, compatible) or auto for content-driven sizing. |
| `sortIndicators` | all (default), active, or none. sortable:false removes sorting for individual columns. |

Live example: [FilterableTable](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=FilterableTable)

#### FilterSidebar

A reusable right-side filter panel, compact version and collapsed vertical rail.

Controlled filters support search, single selection and multiple selection. Active counts, reset and results stay visible while filter sections scroll.

Import: `import { FilterSidebar } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `filters` | Definitions with id, label and type: search, select, multi or facet; choice filters accept options. |
| `value` | Controlled map from filter IDs to strings or arrays of selected strings. |
| `onChange` | Receives the complete next filter-value map. |
| `variant` | full (280px) or compact (212px). |
| `collapsed` | Shows a 52px vertical rail with active-filter count. |
| `onCollapsedChange` | Receives true to collapse or false to expand. |
| `resultCount` | Optional matching-result count in the fixed footer. |
| `onClose` | Optional close action callback. |
| `showHeader` | Default true; false avoids a duplicate title when placed in a phone sheet. |

Live example: [FilterSidebar](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=FilterSidebar)

#### DatePicker

A custom calendar with themed controls.

Stores YYYY-MM-DD; arrow keys navigate dates, Escape closes, and date limits disable unavailable days.

Import: `import { DatePicker } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `min` | Optional pattern-specific value. Use the live example as the reference. |
| `max` | Optional pattern-specific value. Use the live example as the reference. |
| `required` | Boolean. Marks the field required and adds visible text. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `hint` | Optional supporting text connected to the control. |
| `error` | An actionable validation message; sets aria-invalid. |

Live example: [DatePicker](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DatePicker)

#### TimePicker

Custom hour and minute selection.

Stores local HH:mm; themed dropdowns support keyboard selection. The application owns timezone conversion.

Import: `import { TimePicker } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `min` | Optional pattern-specific value. Use the live example as the reference. |
| `max` | Optional pattern-specific value. Use the live example as the reference. |
| `step` | Optional pattern-specific value. Use the live example as the reference. |
| `required` | Boolean. Marks the field required and adds visible text. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `error` | An actionable validation message; sets aria-invalid. |

Live example: [TimePicker](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=TimePicker)

#### DateRangePicker

Related start and end dates.

An end before the start is marked invalid; existing values are never silently changed.

Import: `import { DateRangePicker } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `min` | Optional pattern-specific value. Use the live example as the reference. |
| `max` | Optional pattern-specific value. Use the live example as the reference. |
| `required` | Boolean. Marks the field required and adds visible text. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `hint` | Optional supporting text connected to the control. |
| `error` | An actionable validation message; sets aria-invalid. |

Live example: [DateRangePicker](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DateRangePicker)

#### NumberInput

A numeric field with discreet stepper controls.

null is empty. Steppers respect limits; typed out-of-range values show an error.

Import: `import { NumberInput } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `min` | Optional pattern-specific value. Use the live example as the reference. |
| `max` | Optional pattern-specific value. Use the live example as the reference. |
| `step` | Optional pattern-specific value. Use the live example as the reference. |
| `required` | Boolean. Marks the field required and adds visible text. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `readOnly` | Optional pattern-specific value. Use the live example as the reference. |
| `error` | An actionable validation message; sets aria-invalid. |

Live example: [NumberInput](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=NumberInput)

#### ColorPicker

Colour chooser, hex entry and presets.

Only complete six-digit hex values are emitted; invalid drafts stay editable.

Import: `import { ColorPicker } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `swatches` | Optional pattern-specific value. Use the live example as the reference. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `hint` | Optional supporting text connected to the control. |
| `error` | An actionable validation message; sets aria-invalid. |

Live example: [ColorPicker](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ColorPicker)

#### MediaGallery

Images and videos with replacement and removal.

Application owns URLs and upload lifecycle; video has native playback controls.

Import: `import { MediaGallery } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `onOpen` | Receives the row record when its explicit action is activated. |
| `onRemove` | Optional pattern-specific value. Use the live example as the reference. |
| `onReplace` | Optional pattern-specific value. Use the live example as the reference. |
| `onRetry` | Retries the failed operation without dropping the current context. |
| `onReorder` | Optional pattern-specific value. Use the live example as the reference. |
| `caption` | Optional pattern-specific value. Use the live example as the reference. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `emptyLabel` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [MediaGallery](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=MediaGallery)

#### MediaUploadField

A bordered media field with drag-and-drop and browsing.

Validates media MIME type and size. Async failures are announced; uploading remains application controlled.

Import: `import { MediaUploadField } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `onFiles` | Optional pattern-specific value. Use the live example as the reference. |
| `multiple` | Optional pattern-specific value. Use the live example as the reference. |
| `maxSize` | Maximum file size in bytes; default 10 × 1024 × 1024. |
| `onRemove` | Optional pattern-specific value. Use the live example as the reference. |
| `onReplace` | Optional pattern-specific value. Use the live example as the reference. |
| `onRetry` | Retries the failed operation without dropping the current context. |
| `onReorder` | Optional pattern-specific value. Use the live example as the reference. |
| `caption` | Optional pattern-specific value. Use the live example as the reference. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `hint` | Optional supporting text connected to the control. |
| `error` | An actionable validation message; sets aria-invalid. |

Live example: [MediaUploadField](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=MediaUploadField)

#### PreviewFrame

A contained live page preview.

Defaults to a sandboxed iframe; viewport supports desktop, tablet and mobile.

Import: `import { PreviewFrame } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `src` | Optional pattern-specific value. Use the live example as the reference. |
| `srcDoc` | Optional pattern-specific value. Use the live example as the reference. |
| `viewport` | Optional pattern-specific value. Use the live example as the reference. |
| `loading` | Optional pattern-specific value. Use the live example as the reference. |
| `error` | An actionable validation message; sets aria-invalid. |
| `onRetry` | Retries the failed operation without dropping the current context. |
| `sandbox` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [PreviewFrame](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=PreviewFrame)

#### EditorLayout

A full-height editing workspace.

Independent canvas and inspector scroll regions, a fixed save footer and shared desktop/tablet/phone controls. Properties open in a shared side sheet when the editor becomes narrow.

Import: `import { EditorLayout } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `description` | Supporting explanation, kept separate from the heading. |
| `toolbar` | Optional pattern-specific value. Use the live example as the reference. |
| `sidebar` | Optional pattern-specific value. Use the live example as the reference. |
| `children` | React content. Keep text concise and accessible. |
| `footer` | Optional pattern-specific value. Use the live example as the reference. |
| `onExit` | Optional pattern-specific value. Use the live example as the reference. |
| `style` | Optional pattern-specific value. Use the live example as the reference. |
| `viewport` | Optional pattern-specific value. Use the live example as the reference. |
| `defaultViewport` | Optional pattern-specific value. Use the live example as the reference. |
| `onViewportChange` | Optional pattern-specific value. Use the live example as the reference. |
| `showViewportControls` | Optional pattern-specific value. Use the live example as the reference. |
| `propertiesLabel` | Optional pattern-specific value. Use the live example as the reference. |
| `previewLabel` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [EditorLayout](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=EditorLayout)

#### ReorderList

Direct dragging with insertion feedback and keyboard move controls.

Stable IDs retain item identity. Move results are announced; the keyboard never requires dragging.

Import: `import { ReorderList } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [ReorderList](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ReorderList)

#### InlineEdit

Edit a value in place, then explicitly save or cancel.

Enter saves, Escape cancels. Pending saves disable controls; rejected saves preserve the draft.

Import: `import { InlineEdit } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `onSave` | Receives the edited object or triggers a save operation. |
| `placeholder` | A brief example; never a replacement for a visible label. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |
| `required` | Boolean. Marks the field required and adds visible text. |
| `maxLength` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [InlineEdit](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=InlineEdit)

#### CodeDisplay

QR or Snapcode image with download and copy link.

Displays an application-provided code, never generates one. Copy failure leaves a selectable URL.

Import: `import { CodeDisplay } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `imageSrc` | Optional pattern-specific value. Use the live example as the reference. |
| `link` | Optional pattern-specific value. Use the live example as the reference. |
| `label` | Visible or accessible name describing the control. |
| `kind` | Optional pattern-specific value. Use the live example as the reference. |
| `filename` | Optional pattern-specific value. Use the live example as the reference. |
| `onDownload` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [CodeDisplay](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=CodeDisplay)

#### GuidedTour

An opt-in tour launched by a help action.

Highlights visible targets, skips missing ones, supports Escape and arrows, returns focus to its opener.

Import: `import { GuidedTour } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `steps` | Ordered array of step labels. |
| `open` | Controlled overlay visibility. |
| `onClose` | Called on Escape, close action, or backdrop dismissal. |

Live example: [GuidedTour](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=GuidedTour)

#### DeadlineCountdown

A time remaining or overdue indicator.

Invalid dates have a fallback. The timer stops on unmount; now can freeze previews and tests.

Import: `import { DeadlineCountdown } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `deadline` | Optional pattern-specific value. Use the live example as the reference. |
| `label` | Visible or accessible name describing the control. |
| `showSeconds` | Optional pattern-specific value. Use the live example as the reference. |
| `now` | Optional pattern-specific value. Use the live example as the reference. |
| `variant` | card by default. inline renders compact in 3d, Due today, or 26d late text. |

Live example: [DeadlineCountdown](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DeadlineCountdown)

#### PhaseBar

Seven labelled project phases with distinct muted colours.

Completion and current step use text and aria-current, not colour alone.

Import: `import { PhaseBar } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `phases` | Optional pattern-specific value. Use the live example as the reference. |
| `current` | Zero-based index of the current step. |
| `onChange` | Change handler. Native fields and Dropdown receive an event-shaped value; other controls receive the next value. |
| `label` | Visible or accessible name describing the control. |
| `disabled` | Boolean. Prevents interaction and shows a muted state. |

Live example: [PhaseBar](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=PhaseBar)

#### DailyVerdictStrip

Compact daily status history.

Use row with plain dates for a single quiet line without boxed cards. Cards remain available. Full dates and written verdicts accompany semantic colour.

Import: `import { DailyVerdictStrip } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `days` | Optional pattern-specific value. Use the live example as the reference. |
| `label` | Visible or accessible name describing the control. |
| `onSelect` | Receives the selected date, event, or menu action. |
| `layout` | Optional pattern-specific value. Use the live example as the reference. |
| `dateStyle` | Optional pattern-specific value. Use the live example as the reference. |
| `locale` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [DailyVerdictStrip](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=DailyVerdictStrip)

#### ElementProgress

Progress along the bottom edge of its content.

Undefined is indeterminate; finite percentages clamp to 0–100; idle removes the progress bar.

Import: `import { ElementProgress } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `state` | empty  /  loading  /  error. |
| `children` | React content. Keep text concise and accessible. |
| `error` | An actionable validation message; sets aria-invalid. |

Live example: [ElementProgress](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=ElementProgress)

#### InlineProgress

Alias for embedded element progress.

Uses the same accessible progress contract as ElementProgress.

Import: `import { InlineProgress } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `label` | Visible or accessible name describing the control. |
| `value` | Controlled value. Update it from onChange. |
| `state` | empty  /  loading  /  error. |
| `children` | React content. Keep text concise and accessible. |
| `error` | An actionable validation message; sets aria-invalid. |

Live example: [InlineProgress](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=InlineProgress)

#### SectionHeader

A restrained section heading and trailing action.

Uses shared 13px semibold typography; optional count is secondary.

Import: `import { SectionHeader } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `count` | Optional pattern-specific value. Use the live example as the reference. |
| `action` | An optional section-level action. |

Live example: [SectionHeader](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=SectionHeader)

#### CollectionGroup

A collection with individual, clearly actionable items.

Composes the shared Panel, Rows and Row components, including full-width hover. Items without onOpen stay informational; group and more actions remain separate.

Import: `import { CollectionGroup } from '@arlab/ui';`

| Prop | Contract |
| --- | --- |
| `title` | A concise visible heading describing this context. |
| `count` | Optional pattern-specific value. Use the live example as the reference. |
| `meta` | A short metadata summary for a collection. |
| `items` | Structured items appropriate to the pattern; see the working example. |
| `onOpen` | Receives the row record when its explicit action is activated. |
| `more` | Optional pattern-specific value. Use the live example as the reference. |

Live example: [CollectionGroup](https://arlab-ui-showcase.pages.dev/?view=catalogue&component=CollectionGroup)

## Complete token reference

Names correspond exactly to exported CSS custom properties. Color values are theme-specific; geometry and spacing remain shared.

| Token | Light | Dark |
| --- | --- | --- |
| `--text-micro` | `10px` | `10px` |
| `--text-2xs` | `11px` | `11px` |
| `--weight-regular` | `400` | `400` |
| `--weight-medium` | `500` | `500` |
| `--weight-semibold` | `600` | `600` |
| `--weight-bold` | `700` | `700` |
| `--text-xs` | `12px` | `12px` |
| `--text-sm` | `13px` | `13px` |
| `--text-field` | `12px` | `12px` |
| `--icon-stroke` | `1.5` | `1.5` |
| `--shadow-surface` | `inset 0 1px 0 #FFFFFF,0 1px 2px #20283808,0 10px 26px -16px #20283830` | `inset 0 1px 0 #FFFFFF04,0 1px 2px #00000025,0 10px 26px -16px #00000080` |
| `--shadow-control` | `0 1px 2px #20283809` | `inset 0 1px 0 #FFFFFF05` |
| `--shadow-control-hover` | `inset 0 1px 0 #FFFFFF,0 3px 10px #20283812` | `inset 0 1px 0 #FFFFFF0A,0 3px 10px #00000025` |
| `--shadow-primary` | `inset 0 1px 0 #FFFFFF20` | `inset 0 1px 0 #FFFFFF14` |
| `--shadow-primary-hover` | `inset 0 1px 0 #FFFFFF30,0 4px 12px rgba(228,20,219,.14)` | `inset 0 1px 0 #FFFFFF20,0 4px 12px #00000040` |
| `--surface-gradient` | `linear-gradient(150deg,#fffaff,#fffdff),linear-gradient(135deg,#E3DCE9,#D2C9DB 32%,#F4EFF7 65%,#D8CEDE)` | `linear-gradient(150deg,#2d2a2f,#2a292d),linear-gradient(135deg,#48484E,#38383D 32%,#414146 65%,#46464B)` |
| `--surface-border-color` | `transparent` | `transparent` |
| `--page-gradient` | `radial-gradient(ellipse at 10% 0%,rgba(228,20,219,.025),transparent 65%)` | `radial-gradient(ellipse at 10% 0%,rgba(240,78,232,.035),transparent 65%)` |
| `--chrome-gradient` | `linear-gradient(135deg,#fff9fe,#FFFDFF 75%)` | `linear-gradient(135deg,#2e2a31,#29292C 75%)` |
| `--shadow-chrome` | `0 2px 10px #20283808` | `0 2px 10px #00000020` |
| `--action-gradient` | `linear-gradient(180deg,#FFFFFF24,transparent 62%)` | `linear-gradient(180deg,#FFFFFF1F,transparent 62%)` |
| `--icon-hover-color` | `#2C2532` | `#F4F4F6` |
| `--icon-hover-surface` | `#f9f6fa` | `#242427` |
| `--hover-duration` | `140ms` | `140ms` |
| `--button-height` | `38px` | `38px` |
| `--button-padding-inline` | `13px` | `13px` |
| `--button-font-size` | `var(--text-xs)` | `var(--text-xs)` |
| `--button-line-height` | `1.3` | `1.3` |
| `--text-table` | `var(--text-sm)` | `var(--text-sm)` |
| `--text-table-meta` | `var(--text-xs)` | `var(--text-xs)` |
| `--text-table-heading` | `var(--text-xs)` | `var(--text-xs)` |
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
| `--on-dept-solid` | `#FFFFFF` | `#FFFFFF` |
| `--dept-creative-solid` | `#E414DB` | `#F04EE8` |
| `--dept-engineering-solid` | `#FB923C` | `#FB923C` |
| `--dept-client-solid` | `#8058D6` | `#A78BFA` |
| `--dept-company-solid` | `#198BC2` | `#38BDF8` |
| `--dept-strategy-solid` | `#128D83` | `#2DD4BF` |
| `--dept-creative` | `#E414DB` | `#F04EE8` |
| `--dept-engineering` | `#FB923C` | `#FB923C` |
| `--dept-client` | `#8058D6` | `#A78BFA` |
| `--dept-company` | `#198BC2` | `#38BDF8` |
| `--dept-strategy` | `#128D83` | `#2DD4BF` |
| `--chart-1` | `#E414DB` | `#F04EE8` |
| `--chart-2` | `#FB923C` | `#FB923C` |
| `--chart-3` | `#8058D6` | `#A78BFA` |
| `--chart-4` | `#198BC2` | `#38BDF8` |
| `--chart-5` | `#128D83` | `#2DD4BF` |
| `--chart-6` | `#9560C7` | `#C4B5FD` |
| `--chart-7` | `#BF870D` | `#FBBF24` |
| `--chart-trend` | `#198BC2` | `#38BDF8` |
| `--icon-button-size` | `14px` | `14px` |
| `--scrollbar-size` | `2px` | `2px` |
| `--ground` | `#F7F5F9` | `#202022` |
| `--raise` | `#FFFDFF` | `#29292C` |
| `--sunken` | `#EDE8F1` | `#1B1B1E` |
| `--ink` | `#2C2532` | `#F4F4F6` |
| `--dim` | `#665C70` | `#BDBDC5` |
| `--line` | `#DDD4E5` | `#414146` |
| `--strong` | `#665C70` | `#BDBDC5` |
| `--nav` | `#FFFDFF` | `#29292C` |
| `--navInk` | `#665C70` | `#BDBDC5` |
| `--navActive` | `#fdeafc` | `#452e46` |
| `--navSelected` | `#E414DB` | `#F04EE8` |
| `--accent` | `#E414DB` | `#F04EE8` |
| `--tint` | `#fdeafc` | `#452e46` |
| `--action` | `#E414DB` | `#F04EE8` |
| `--actionHover` | `#E414DB` | `#F04EE8` |
| `--actionInk` | `#FFFFFF` | `#FFFFFF` |
| `--link` | `#E414DB` | `#F04EE8` |
| `--focus` | `#E414DB` | `#F04EE8` |
| `--accent-deep` | `#E414DB` | `#F04EE8` |
| `--accent-soft` | `rgba(228,20,219,.08)` | `rgba(240,78,232,.10)` |
| `--accent-tint` | `rgba(228,20,219,.10)` | `rgba(240,78,232,.14)` |
| `--accent-line` | `rgba(228,20,219,.35)` | `rgba(240,78,232,.40)` |
| `--secondary-accent` | `#FB923C` | `#FB923C` |
| `--secondary-accent-text` | `#984414` | `#FDBA74` |
| `--secondary-accent-soft` | `#FDF0E4` | `#503826` |
| `--scrollbar-thumb` | `rgba(228,20,219,.35)` | `rgba(240,78,232,.35)` |
| `--scrollbar-hover` | `rgba(228,20,219,.60)` | `rgba(240,78,232,.60)` |
| `--scrollbar-track` | `transparent` | `transparent` |
| `--ok` | `#356A5A` | `#75D6A6` |
| `--okTint` | `#f0f2f3` | `#233D32` |
| `--bad` | `#AD4053` | `#FF94A3` |
| `--badTint` | `#f9eff2` | `#4B2630` |
| `--info` | `#4B619D` | `#8DBBFF` |
| `--infoTint` | `#f2f1f8` | `#253B58` |
| `--planning` | `#7053A1` | `#C3AAFF` |
| `--planningTint` | `#f4f0f8` | `#3B2D54` |
| `--warn` | `#984414` | `#FDBA74` |
| `--warnTint` | `#FDF0E4` | `#503826` |
| `--dept-creative-ink` | `#FFFFFF` | `#FFFFFF` |
| `--dept-engineering-ink` | `#FFFFFF` | `#FFFFFF` |
| `--dept-client-ink` | `#FFFFFF` | `#FFFFFF` |
| `--dept-company-ink` | `#FFFFFF` | `#FFFFFF` |
| `--dept-strategy-ink` | `#FFFFFF` | `#FFFFFF` |
| `--font-sans` | `'Satoshi', sans-serif` | `'Satoshi', sans-serif` |
| `--font-display` | `'Satoshi', sans-serif` | `'Satoshi', sans-serif` |
| `--font-mono` | `'DM Mono', monospace` | `'DM Mono', monospace` |
| `--weight-heading` | `600` | `600` |
| `--font-weight-heading` | `600` | `600` |
| `--radius-tag` | `5px` | `5px` |
| `--radius-xs` | `7px` | `7px` |
| `--radius-sm` | `7px` | `7px` |
| `--radius-lg` | `14px` | `14px` |
| `--radius-md` | `14px` | `14px` |
| `--radius-panel` | `14px` | `14px` |
| `--radius-control` | `7px` | `7px` |
| `--surface-border-width` | `1px` | `1px` |
| `--surface-radius` | `var(--radius-panel)` | `var(--radius-panel)` |
| `--surface-elevation` | `var(--shadow-surface)` | `var(--shadow-surface)` |
| `--surface-overlay-elevation` | `var(--shadow-pop)` | `var(--shadow-pop)` |
| `--surface-hover-elevation` | `inset 0 1px 0 #FFFFFF,0 2px 4px #2028380C,0 14px 30px -16px #20283840` | `inset 0 1px 0 #FFFFFF08,0 2px 4px #00000030,0 14px 30px -16px #00000099` |
| `--text-kbd` | `var(--text-2xs)` | `var(--text-2xs)` |
| `--radius-bar` | `1px` | `1px` |
| `--z-tour` | `2200` | `2200` |
| `--panel-inset` | `22px` | `22px` |
| `--panel-inset-compact` | `17px` | `17px` |
| `--panel-header-block` | `var(--space-4)` | `var(--space-4)` |
| `--panel-header-gap` | `18px` | `18px` |
| `--panel-body-gap` | `var(--space-4)` | `var(--space-4)` |
| `--workspace-padding` | `28px` | `28px` |
| `--text-workspace-heading` | `26px` | `26px` |
| `--loading-sheen` | `#FFFFFFCC` | `#FFFFFF0D` |
| `--loading-sheen-duration` | `6.4s` | `6.4s` |
| `--shadow-card` | `inset 0 1px 0 #FFFFFF,0 1px 2px #20283808,0 10px 26px -16px #20283830` | `inset 0 1px 0 #FFFFFF04,0 1px 2px #00000025,0 10px 26px -16px #00000080` |
| `--shadow-pop` | `0 4px 8px #2028380A,0 20px 48px -12px #20283830` | `0 4px 8px #00000035,0 20px 48px -12px #00000090` |
| `--button-chrome-gradient` | `linear-gradient(180deg,#FFFFFFCC,transparent 62%,#00000004)` | `linear-gradient(180deg,#FFFFFF0D,transparent 52%,#00000008)` |
| `--button-chrome-hover-gradient` | `linear-gradient(180deg,#FFFFFFF2,transparent 62%,#00000003)` | `linear-gradient(180deg,#FFFFFF14,transparent 56%,#00000005)` |
| `--icon-rest-border` | `#e4e1e4` | `#525254` |
| `--icon-hover-border` | `#d9d6da` | `#626265` |
| `--icon-rest-surface` | `#fdfafd` | `#27272a` |
| `--icon-rest-gradient` | `linear-gradient(180deg,rgba(255,255,255,.6),transparent 65%)` | `linear-gradient(180deg,rgba(255,255,255,.025),transparent 65%)` |
| `--icon-hover-gradient` | `linear-gradient(180deg,rgba(255,255,255,.8),transparent 70%)` | `linear-gradient(180deg,rgba(255,255,255,.045),transparent 70%)` |
| `--icon-rest-shadow` | `inset 0 1px 0 #FFFFFFB0,0 1px 1px #20283804` | `inset 0 1px 0 #FFFFFF04` |
| `--icon-hover-shadow` | `inset 0 1px 0 #FFFFFFD0,0 1px 3px #2028380A` | `inset 0 1px 0 #FFFFFF08,0 1px 3px #00000015` |
| `--chrome-line` | `#e4e1e4` | `#525254` |
| `--chrome-line-hover` | `#d9d6da` | `#606063` |
| `--chrome-control-surface` | `#FFFDFF` | `#29292C` |
| `--chrome-control-gradient` | `linear-gradient(180deg,#fffeff,#fffcff 56%,#fdfafd)` | `linear-gradient(180deg,#333335,#2b292e 56%,#27272a)` |
| `--tag-gradient` | `linear-gradient(180deg,#FFFFFF66,transparent 72%)` | `linear-gradient(180deg,#FFFFFF0A,transparent 72%)` |
| `--tag-shadow` | `inset 0 1px 0 #FFFFFF55` | `inset 0 1px 0 #FFFFFF05` |
| `--control-gradient` | `var(--chrome-control-gradient)` | `var(--chrome-control-gradient)` |
| `--chrome-control-shadow` | `inset 0 1px 0 #FFFFFFC0,0 1px 2px #20283805` | `inset 0 1px 0 #FFFFFF04` |
| `--chrome-control-hover-shadow` | `inset 0 1px 0 #FFFFFF,0 1px 3px #2028380A` | `inset 0 1px 0 #FFFFFF06,0 1px 3px #00000018` |
| `--chrome-divider` | `#edebee` | `#434346` |
| `--chrome-row-hover` | `#faf8fa` | `#303033` |
| `--chrome-subtle-gradient` | `linear-gradient(145deg,#fffaff,#FFFDFF 80%)` | `linear-gradient(145deg,#2d2a2f,#29292C 80%)` |
| `--toggle-shadow` | `0 1px 2px #20283808` | `0 1px 2px #00000018` |
| `--toggle-hover-shadow` | `0 1px 3px #2028380C` | `0 1px 3px #00000020` |
| `--switch-off-track` | `#e4e1e4` | `#49494c` |
| `--switch-off-border` | `#b5b1b7` | `#767679` |
| `--switch-thumb` | `#665C70` | `#EBEBEF` |
| `--side-w` | `210px` | `210px` |
| `--page-pad` | `32px` | `32px` |
| `--control-h` | `38px` | `38px` |
| `--text-3xl` | `34px` | `34px` |
| `--scrim` | `#20222e55` | `#00000080` |

## Icon reference

| Icon | Category | SVG |
| --- | --- | --- |
| Github | Social & platforms | [Download](icons/Github.svg) |
| Gitlab | Social & platforms | [Download](icons/Gitlab.svg) |
| Instagram | Social & platforms | [Download](icons/Instagram.svg) |
| Linkedin | Social & platforms | [Download](icons/Linkedin.svg) |
| Youtube | Social & platforms | [Download](icons/Youtube.svg) |
| Facebook | Social & platforms | [Download](icons/Facebook.svg) |
| Twitter | Social & platforms | [Download](icons/Twitter.svg) |
| Slack | Social & platforms | [Download](icons/Slack.svg) |
| Figma | Social & platforms | [Download](icons/Figma.svg) |
| Dribbble | Social & platforms | [Download](icons/Dribbble.svg) |
| Twitch | Social & platforms | [Download](icons/Twitch.svg) |
| Chrome | Social & platforms | [Download](icons/Chrome.svg) |
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
| Presentation | Workspace | [Download](icons/Presentation.svg) |
| ShoppingCart | Workspace | [Download](icons/ShoppingCart.svg) |
| Building2 | Workspace | [Download](icons/Building2.svg) |
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
| Megaphone | People & communication | [Download](icons/Megaphone.svg) |
| Handshake | People & communication | [Download](icons/Handshake.svg) |
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
| Sparkles | Studio & media | [Download](icons/Sparkles.svg) |
| Sun | Interface | [Download](icons/Sun.svg) |
| Moon | Interface | [Download](icons/Moon.svg) |
| Monitor | Interface | [Download](icons/Monitor.svg) |
| Tablet | Interface | [Download](icons/Tablet.svg) |
| Smartphone | Interface | [Download](icons/Smartphone.svg) |
| Laptop | Interface | [Download](icons/Laptop.svg) |
| GripVertical | Interface | [Download](icons/GripVertical.svg) |
| GripHorizontal | Interface | [Download](icons/GripHorizontal.svg) |
| Move | Interface | [Download](icons/Move.svg) |
| Command | Interface | [Download](icons/Command.svg) |
| Keyboard | Interface | [Download](icons/Keyboard.svg) |
| MousePointer2 | Interface | [Download](icons/MousePointer2.svg) |
