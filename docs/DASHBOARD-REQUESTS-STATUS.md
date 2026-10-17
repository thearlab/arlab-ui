# Dashboard request status after beta.20

Feature changes are implemented and verified locally; they are not a new published release. This file tracks every item in `REQUESTS-BETA15-FROM-DASHBOARD.md`. The feature commits preserve the existing Contour foundation. The separate, active foundation migration is tracked independently below and needs its own final integrated visual/build review.

## Numbered requests

| Request | Status |
| --- | --- |
| 1. CommandPalette groups | Published in beta.16. |
| 2. Quiet status filters | Published in beta.16 through PillButton. |
| 3. Tabs with counts | Published in beta.16. |
| 4. AppHeader pageActions | Published in beta.16. |
| 5. Solid spaces rail tiles and grouping | Published in beta.16. |
| 6. Bounded filled table | Published in beta.17. |
| 7. Custom table header text scale | Published in beta.17. |
| 8. Count label / formatter | Published in beta.17. |
| 9. Search width | Published in beta.17. |
| 10. Consistent quiet toolbar buttons | Published in beta.17. |
| 11. RecordHeader without tabs | Published in beta.17. |
| 12. Condensed heading spacing | Published in beta.17. |
| 13 and 15. Condensed table chrome, hide count | Published in beta.19. |
| 14. danger-quiet | Published in beta.19. |
| 16. Optional declarations and Status native attributes | Optional declarations published in beta.19. Status native tooltip/role forwarding corrected in this review. |
| 17. Missing registry icons | Published in beta.19. |
| 18. Avatar size | Implemented in this review: positive numeric pixel sizes, proportional initials, native attributes. Also optional image source with initials fallback on image error. Default remains 28px. |
| 19. Dropdown option counts | Runtime already rendered counts, including zero. Published option type omitted count and description. This review adds both to the real public declaration contract. |

## Full v1 audit feature table

| Request | Status |
| --- | --- |
| Small Button size or one-size decision | Published decision: one text-button height, 38px desktop and 44px touch. |
| Button / LinkTile href or to | Implemented href links, safe external targets and disabled Button links in this review. No router dependency; apps can intercept normal link clicks through onClick. LinkTile also accepts meta/badge and registry icon names. |
| StateView custom action | Implemented in this review: actionLabel, onAction, and optional action content. Existing retry/create callbacks remain compatible. |
| Picker inline prefix and option counts | Option count runtime and declarations covered. Inline prefix implemented inside the shared Dropdown/Picker trigger. |
| SegmentedControl value / label options | Implemented in this review, preserving string options and adding disabled options, arrow/Home/End keyboard selection and explicit non-submit buttons. |
| Toast queue / provider | Implemented: ToastProvider/useToast queue. Integrated build, public declarations and service contract tests pass. |
| Missing icons | Published in beta.19. |
| Real optional prop types | Published in beta.19, guarded by fresh strict consumer compilation. |
| RecordHeader small label | Implemented in this review. |
| GuidedTour hook, arrow, spaces data-tour | Implemented: useGuidedTour, arrow styling and overridable data-tour targets on desktop spaces and phone drawer items. Integrated build, public declarations and service tests pass. |
| Gate / DayTimeline real data | Gate title/description/action/fine and agenda date/items/day-strip/empty content implemented. DayTimeline onSelect preserves the original title first argument and adds the full item second. Full timesheet week-grid drag/resize engine remains open. |
| Markdown bold / links; ReadableDoc structured values | Implemented: safe bold/links/code Markdown and structured ReadableDoc values. Integrated document contract tests and public declarations pass. |
| DailyVerdictStrip six states; compact PhaseBar | Implemented the six dashboard meanings: blocked, due-today, at-risk, delayed, on-track, no-update. Original attention/pending values remain supported. PhaseBar density=compact retains full labels and step semantics. |
| PreviewFrame ref, onLoad, auto-height, overlay hooks | Implemented: forwarded iframe ref, native onLoad options, auto-height and application-owned overlays. The export validator now accepts React.forwardRef. Integrated build, declarations and service tests pass. |
| MediaUploadField PDF/file and link mode | Implemented: PDF/file gallery kinds, MIME/extension accept validation, size limits, app-owned http/https link action using shared Input and Button. Targeted markup and DOM interaction checks pass. |
| Timeline tone, meta and actions | Implemented; targeted markup test passes. |
| ReorderList across groups; TagInput validation; typed ComboboxPicker | Implemented: controlled ReorderList groups/onGroupsChange, cross-group drag/drop, empty-group targets and keyboard group moves; immutable move helper preserves item data. Flat mode remains supported. Three grouped reorder regressions pass. TagInput normalize/validate retains rejected drafts with accessible errors; allowCustom reuses shared Dropdown and preserves typed choices. Integrated build and public declarations pass; targeted DOM checks cover the editable fields. |
| Avatar src; phone-hidden table columns | Implemented: Avatar source and fallback; shared FilterColumn.hideOnPhone hides headers and cells in both FilterableTable and InfiniteTable at 600px and below. Integrated runtime contracts and public declarations pass. |
| CollectionCard media/footer; InfiniteTable groups; second chart series; inline Skeleton | Implemented: card media/footer slots with sibling footer actions; contiguous InfiniteTable groupBy/renderGroup without reordering server records; category-aligned comparison chart series; inline Skeleton. Eight data regressions pass, including a bounded 10,000-record virtualized table and missing/zero comparison values. Selection indexes are memoized so scroll frames do not rescan the complete collection. |

## Integrated feature validation (17 Oct 2026)

The final combined feature code, including integration commit `f91dab9` and grouped reorder commit `9ab3d46`, passed:

- `npm run build`: stylesheet parsing, fresh generated public declarations, TypeScript emission, tour placement checks, 130 component exports, 164 icons, scoped styles and token-only table typography.
- `node --test scripts/*contracts.test.mjs tests/*.test.mjs`: all feature suites pass. There are 29 feature contract tests after adding the chart-gap regression. The later run also picked up four foundation tests written concurrently, for 33 passing tests in that working tree.
- Feature coverage: eight data contracts; four avatar/status/state/segmented contracts; three editable-field contracts; five layout contracts; two document contracts; three grouped reorder contracts; four service contracts.
- Fresh public declarations compile all `scripts/type-tests/*.tsx` examples, including realistic optional settings, native attributes, grouped reorder, responsive columns, comparison charts, inline skeletons and service APIs. Negative fixtures continue to enforce required contracts.
- Prior targeted DOM interaction checks cover dropdown counts including zero, Avatar image fallback, tag normalization/rejection, custom combobox choices, rejected unsafe links and successful upload-link callbacks. The permanent contract suite is primarily server-rendered and pure-function testing; it does not replace real-browser dragging, scrolling or visual review.

To reproduce the integrated feature check:

```sh
npm run build
node --test scripts/*contracts.test.mjs tests/*.test.mjs
```

## Foundation migration and publication

The active foundation work changes styling separately from these component contracts. Its four initial token/font/contrast checks passed in the later 33-test run, but that does not sign off all in-progress CSS or browser appearance. Run a final package build and visual checks after those parallel styling edits finish. No new package version, release tag or publication has been performed for the changes described here.

## Remaining scope

All summary feature rows above have concrete implementations. The dashboard's larger per-page audit can require further APIs, such as a timesheet week-grid drag/resize engine. DayTimeline currently supplies a real-data agenda and day strip; a full scheduling engine is not claimed complete by this summary. App-specific integration and a final real-browser check remain separate from these passing library contract checks.

## Satin Lift integration verification

The approved shared foundation is now implemented, including Satoshi from Fontshare and self-hosted DM Mono, 14px surface corners, 7px controls, softened neutral dark mode, satin surface treatments and full-width panel title rails. AppSwitcher and the sign-out glyph were refined. PageLoading adds `variant="content-preview"`, a reusable shell-body loading state with centered live copy and decorative content placeholders.

The final package build and all 47 package contract/foundation tests pass. Current-theme CSS and runtime audits are recorded in `SATIN-LIFT-COMPONENT-AUDIT.md` and `ACTIVE-FOUNDATION-AUDIT.md`. Exact vivid department fills with white icons and exact pink buttons are retained as explicit brand contrast exceptions; they are not represented as blanket WCAG contrast passes.

This work remains local and unreleased. The preview-only double-sidebar prototype is still separate from the package shell API, pending the user's layout feedback.
