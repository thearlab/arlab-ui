# Approved Preview parity audit

Scope: the complete approved workspace composition, its shared dependencies, Loading page, Playground, component catalogue and dashboard requests through beta.24. The library foundation is canonical; the showcase has no component paint override.

## Implemented

- One Surface contract for the satin rim, 14px frame corners and soft elevation. Panel composes Surface. Keep embedded flush panes distinct from freestanding frames; avoid double frames on Kanban cards.
- Shared chrome on buttons and fields, lighter tag sheen, exact main brand pink and semantic status colours.
- Shared workspace composition, record cells, usage figures, milestone dates and progress summaries.
- Standard animated content-preview PageLoading and loading StateView. Centered copy, full container dimensions, animated gradients, trailing dots and reduced motion.
- Single navigation stays expanded without a collapse action/shortcut or visible app-name line. The outer spaces rail still folds. Phone drawers remain usable.
- Bounded and flush Calendar, bounded shell content and PageFrame inner-scroll option. Contain shell overscroll and left-align condensed headings.
- Padded responsive SaveBar outside the workspace scroller. Correct upload plus badge centering. Kbd follows DM Mono at the shared 11px micro scale.
- Delete the former Layouts page, font/theme comparisons and proposal/social sections. Preview has one workspace with a single/double sidebar selector. All showcase sections use full-screen focus view. Playground uses exported controls and has its own render/form test.

## Evidence

The isolated showcase /workspace.html entry imports only @arlab/ui/styles.css. It does not import the showcase stylesheet. Compare it with the same VisualWorkspace rendered inside Preview.

Browser review compared 931 matching rendered workspace elements across 25 computed paint/type/spacing properties. Normal light and dark desktop states matched without showcase-only component styling. Opened edit state was checked separately. SaveBar remains outside the content scroller, with 12px/24px desktop padding and matching bottom edges. At 390x844 it fills the 390px width, ends at y=844, has 12px/16px padding and two equal 175px-wide, 44px-high actions with no horizontal overflow.

The loader fills its immediate shell content area in width and height. Measured text-block center differs by less than 0.01px vertically and 0px horizontally. Shared gradient keyframes run at staggered positions. The three dots are decorative and do not repeat screen-reader announcements. FileUpload's plus badge center matches its icon center exactly.

Validation: full library build, public consumer types, 147 component export/CSS-boundary checks, 101 library tests and 101 showcase tests, including a render and form/dialog interaction test for Playground. A Facts caller mistake found during review is fixed: the public contract uses label/value tuples.

## Consuming dashboard findings

Port 5193 was inspected directly. Its installed beta.24 source contained the one-column condensed table fix, but the served Vite prebundle still rendered all columns and used their original colSpan. Restart that app with --force after upgrading; a changed package.json does not invalidate every already-running module. This explains why compact lists broke after virtual scrolling introduced a spacer.

Timesheets' timeline expanded to 5,617px because the application's focus frame was not bounded. Integrate SidebarShell contentLayout=fill for this surface and a bounded PageFrame/WorkspaceContent before its inner ScrollArea. Calendar month view can use fill or an explicit height with variant=flush. Do not hide overflow on an unbounded content tree or copy library CSS into the application.

This release updates ARLAB UI and its showcase. It does not claim the running dashboard's dependency, route frames or backend workflows were changed by this audit.
