# ARLAB UI v2.0.0-beta.27

This release brings the reviewed component feedback into the shared package. Collection search now sits above tabs; table and collection headers no longer add a decorative pink dot. Record back controls use the shared icon button. Facet rows, actionable stats, collection rows and framed scroll lists reach their container edges with consistent insets. CollectionGroup and FieldRow no longer impose extra list spacing or a divider; Separator is available when a boundary is useful.

The first PageLoading view uses the real ARLAB wordmark while preserving centered copy and animated preview content. TimePicker uses compact two-digit controls without chevrons. ColorPicker opens a custom HSV panel with pointer selection, labeled keyboard sliders, hex entry and presets. EditorLayout shows desktop and phone controls; CodeDisplay and DetailHeader have simpler reading layouts. MediaGallery uses ImagePlus for replace actions. ReorderList and grouped reordering animate the settled position. GuidedTour uses the shared Surface and native top layer, with reduced-motion support. Skeleton uses the shared moving gradient. AppHeader and SidebarShell omit the requested decorative app icon and help button.

This beta also includes the beta.26 follow-up for Stat and StatNoteRow action padding, KanbanBoard inset, and collection search gutter. Existing component names and value callbacks remain available; app-specific CSS should be reviewed before replacing it. Publishing the library does not deploy Studio, Docs or the internal dashboard.

Install: `git+https://github.com/thearlab/arlab-ui.git#v2.0.0-beta.27`.
