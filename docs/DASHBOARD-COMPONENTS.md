# Dashboard components in Contour V2

The components requested by the internal dashboard are application-controlled exports from `@arlab/ui`. They use `ContourProvider` and `@arlab/ui/styles.css`, including Manrope, IBM Plex Mono, light/dark colours, restrained borders and focus outlines. Import fonts once in the host app.

```tsx
import { ContourProvider, DateRangePicker, NumberInput, MediaUploadField } from '@arlab/ui';
import '@arlab/ui/styles.css';

<ContourProvider mode={mode}>
  <DateRangePicker label="Project dates" value={dates} onChange={setDates}/>
  <NumberInput label="Hours" value={hours} onChange={setHours} min={0} max={40} step={0.5}/>
  <MediaUploadField label="Campaign media" items={media} onFiles={uploadFiles}
    onRemove={removeMedia} onReplace={replaceMedia} onRetry={retryUpload}/>
</ContourProvider>
```

## Field contracts

- `DatePicker` uses a custom Contour calendar with month navigation, arrow-key day navigation, date bounds and Escape dismissal. `TimePicker` uses custom hour/minute dropdowns. Icons inherit the theme and focus uses a thin border. Values remain local date/time strings. The host chooses timezone semantics.
- `DateRangePicker` receives `{start, end}` and reports invalid ranges without discarding either value.
- `NumberInput` uses `number | null`, finite step increments, bounded stepper actions, and visible validation for typed values outside limits. Null means empty, not zero.
- `ColorPicker` accepts six-digit hex colours. A partial draft stays editable; only valid complete values reach `onChange`. It includes optional labelled preset swatches.

## Media and previews

`MediaGallery` renders image/video items with stable IDs, native video playback, upload percentages, replacement/removal actions and retry actions. Item status is `ready`, `uploading` or `error`. `progress` is a percentage. The host owns upload requests, cancellation, object URLs and their cleanup. `MediaUploadField` validates image/video MIME types and file size before invoking `onFiles`; the default limit is 20 MB. Browsing and dropping work, and rejected/failed requests show an accessible message. This is not server-side validation: validate uploads again on the server. The generic gallery's replacement callback must also validate the selected file.

`PreviewFrame` accepts `src` or `srcDoc`, an accessible `title`, desktop/tablet/mobile sizing, loading, error and retry. Its default sandbox allows scripts but not same-origin privileges. Only relax it when your application has a concrete requirement. `EditorLayout` fills its available viewport height with a toolbar, preview, optional properties panel and footer. It can be embedded by providing a shorter `style.height`. The properties panel stacks below the preview on small screens.

`CodeDisplay` displays an existing QR code or Snapcode image. It does not generate or validate codes. Provide an application-generated image and its matching destination link. Copy failures leave the URL selectable. Use `onDownload` for authenticated/cross-origin downloads; browser download attributes generally work for same-origin or blob URLs. The showcase's QR is generated from its actual destination URL.

## Editing and navigation

`ReorderList` emits reordered items with the same IDs. Mouse and touch users drag the handle with a lifted row and insertion marker; keyboard users have explicit move-up/down actions. Escape cancels a drag. Reordering announces the new position. Persist changes in the host and report failures there.

`InlineEdit` does not save on blur. Enter or Save invokes `onSave`, including async saves. Escape or Cancel discards the draft. A rejected save keeps the editor and draft open; pending saves disable both actions. Focus returns to the edit trigger after closing.

`GuidedTour` is opt-in through a help button. It takes `steps`, `open`, and `onClose('done'|'skip'|'empty')`. Each step has a CSS `target`, `title`, `body` and optional `placement`. Missing/invisible targets are skipped. The nonmodal popup follows scroll/resize and docks on phones. Escape closes it; left/right move between steps. Focus returns to the actual opening control. Theme follows the provider, including when the popup is portaled.

`SectionHeader` and `CollectionGroup` are application-facing layout components used in Studio. Individual collection items remain directly actionable, with readable borders and restrained 13px/600 section headings.

## Project indicators

- `DeadlineCountdown`: remaining or overdue time with an absolute timestamp. Invalid input has a fallback. `showSeconds` opts into one-second updates; otherwise it updates once per minute. `now` freezes time for a specimen or deterministic test.
- `PhaseBar`: accepts phase definitions and a current ID, with seven muted default chart colours. Text, checkmarks and `aria-current="step"` complement colour. An `onChange` callback makes phases actionable; otherwise the bar is read-only.
- `DailyVerdictStrip`: dated `on-track`, `attention`, `blocked` or `pending` entries, with optional `onSelect` and an empty state.
- `ElementProgress` / `InlineProgress`: progress along the bottom edge of any child element. Values clamp to 0–100; omitted values are indeterminate. Idle/success hide the bar; errors are announced. Respect reduced motion.

## Typography

Shared tokens: `text-micro` 10px, `text-2xs` 11px, `text-xs` 12px, `text-sm` 13px, `text-base` 14px, `text-md` 16px, `text-lg` 18px, `text-xl` 22px, `text-2xl` 28px. Weights: regular 400, medium 500, semibold 600, bold 700. Line heights: tight 1.2, normal 1.5, reading 1.75. Use role-based sizes; do not introduce fractional local sizes.

## Integration boundary

This release adds components and preserves the V2 navigation and existing V1 compatibility entry point. The dashboard's `window.confirm` calls still need to be replaced in the dashboard repository using the existing `ConfirmDialog`; publishing this library cannot change those call sites automatically. Studio uses shared navigation, fields, dropdowns, switches, dialogs, action menus, tour, overview statistics, collection groups and scrolling regions. Remaining legacy-specific screens can migrate incrementally through `@arlab/ui/legacy` without copying these components locally.

## Filterable tables and right-side filters

`FilterableTable` owns client-side sorting and pagination. Pass `columns`, filtered `rows` and a stable `rowKey`. Headers toggle ascending/descending order with paired arrows, and `aria-sort` announces the active direction. Sorting resets to page one and runs before pagination. A column defines `key`, accessible `label`, optional React `header`, `render(row)`, `value(row)`, a separate `sortValue(row)` for dates or formatted content, `sortable`, `width` and `align`. Missing values stay last in both directions. The table accepts custom React `header` and `headerActions`. Footer includes result range, rows per page and previous/next controls. Use FilterSidebar or the host to filter rows. Large remote datasets should use server-side sorting/pagination instead of this client-side component.

`FilterSidebar` is controlled independently of the list it filters. Definitions support search, select and multi-select inputs; `value` maps IDs to strings or arrays and `onChange` emits the complete new map. `variant="full"` is 280px, `variant="compact"` is 212px, and `collapsed` renders a 52px rail. Provide `onCollapsedChange` to toggle. Header and reset/results footer are fixed while options use the shared ScrollArea. Place it in a bounded-height parent; on small screens the host may stack the panel or put it in a dialog.
