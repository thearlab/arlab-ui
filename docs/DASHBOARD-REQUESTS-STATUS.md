# Dashboard request status after beta.20

Review changes are implemented locally and are not a new published release. This file tracks every item in `REQUESTS-BETA15-FROM-DASHBOARD.md`. Existing Contour foundation tokens are unchanged. The separate Platinum proposal is not part of these changes.

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
| Toast queue / provider | Parallel implementation complete: ToastProvider/useToast queue. Final integrated build and service tests are tracked by the parent. |
| Missing icons | Published in beta.19. |
| Real optional prop types | Published in beta.19, guarded by fresh strict consumer compilation. |
| RecordHeader small label | Implemented in this review. |
| GuidedTour hook, arrow, spaces data-tour | Parallel implementation complete. Final integrated verification pending. |
| Gate / DayTimeline real data | Gate title/description/action/fine and agenda date/items/day-strip/empty content implemented. DayTimeline onSelect preserves the original title first argument and adds the full item second. Full timesheet week-grid drag/resize engine remains open. |
| Markdown bold / links; ReadableDoc structured values | Parent implementation complete, with document contract tests. Final integrated verification pending. |
| DailyVerdictStrip six states; compact PhaseBar | Implemented the six dashboard meanings: blocked, due-today, at-risk, delayed, on-track, no-update. Original attention/pending values remain supported. PhaseBar density=compact retains full labels and step semantics. |
| PreviewFrame ref, onLoad, auto-height, overlay hooks | Parallel implementation complete. Export validation is being adapted to recognize a React forwardRef component; final integrated build pending. |
| MediaUploadField PDF/file and link mode | Implemented: PDF/file gallery kinds, MIME/extension accept validation, size limits, app-owned http/https link action using shared Input and Button. Targeted markup and DOM interaction checks pass. |
| Timeline tone, meta and actions | Implemented; targeted markup test passes. |
| ReorderList across groups; TagInput validation; typed ComboboxPicker | TagInput normalize/validate implemented, rejected drafts retained with accessible errors; allowCustom reuses the shared Dropdown and preserves typed choices. DOM tests pass. Grouped ReorderList implementation is underway with the parent; not yet signed off here. |
| Avatar src; phone-hidden table columns | Avatar source implemented. Parallel phone column visibility implementation complete, with targeted tests reported passing. Final integrated verification pending. |
| CollectionCard media/footer; InfiniteTable groups; second chart series; inline Skeleton | Parallel implementation complete, with seven focused regression tests reported passing. Final integrated verification pending. |

## Validation

- Full package build, stylesheet checks, 130 exports and 164 icon contract checks.
- Fresh generated public declarations checked through strict realistic consumer examples.
- Four permanent regressions: avatar sizing/source/native descriptions; Status tooltip/role; StateView action customization; segmented value/label, keyboard disabled skipping and non-submit semantics.
- DOM check of Dropdown counts (12 and 0) and Avatar image-error fallback.

Run `npm run build` then `node --test tests/dashboard-contracts.test.mjs` to check this review's additions. No new foundation or release tag has been published.

Additional validation: five layout/data contract tests pass, covering link safety/disabled navigation, Picker prefix, RecordHeader label, production verdict meanings, compact phases and application-owned Gate/DayTimeline content.

## Integration state

Twelve targeted contract tests pass for this agent's changes. Additional DOM interactions pass for tag normalization and rejection, custom combobox choices, unsafe-link rejection and a successful upload link callback. Fresh strict public declarations pass with the extended forms APIs.

The first tranche passed the full package build. The final combined build must run after all parallel edits finish. A later integration run exposed the export check's assumption that every component is a plain function; PreviewFrame now uses React.forwardRef. This is a validation adapter issue being corrected, not a completed final check.

This status covers the request file named above. The dashboard's much larger per-page audit contains extra APIs (for example a timesheet week-grid drag/resize engine). Those are not claimed complete by satisfying this summary table. Grouped reorder and the integrated checks remain outstanding at this point. No publication has been performed.
