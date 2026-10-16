# Contour beta.4

- New FilterableTable with per-column filtering, aligned cells and in-container pagination.
- New FilterSidebar with full, compact and collapsed-rail variants.
- Custom date calendar and hour/minute selectors replace browser pickers. Icons inherit the theme. Date bounds and arrow-key navigation are supported.
- Input focus uses the existing thin border. No glow or oversized outer focus treatment.
- Sidebar active-item stripe removed. Background and text retain the selected state.
- Editor workspace uses shared ScrollArea and responds to container width.
- Reordering supports pointer capture for mouse/touch, lifted rows, insertion markers, settling feedback and keyboard move buttons.
- Media upload uses the established Dropzone structure and separates attached media.
- CodeDisplay has distinct identity, scan, destination and action sections.
- CollectionGroup uses a plain heading and compact rows rather than nested boxed buttons.
- Selected colour presets use a neutral border and a reserved checkmark slot without layout shifts.
- Tablet added to the shared icon set (146 total).

Existing exports remain available. DatePicker and TimePicker continue to emit YYYY-MM-DD and HH:mm strings respectively; consumers relying on native input elements inside these components must use their public callbacks instead. Earlier release tags remain immutable.
