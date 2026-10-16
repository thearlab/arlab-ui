# Contour beta.5

- Table headers now toggle ascending and descending sorting with paired arrows and aria-sort. Sorting runs across all rows before pagination and leaves the supplied array unchanged.
- Custom table header and headerActions slots, custom column header content and cell renderers. sortValue supports formatted dates, currencies and other domain content. sortable=false disables sorting for action columns.
- Rows-per-page and sidebar selects now match text-input focus: a single border, no outer ring or glow.
- Showcase includes Projects and People examples using the same reusable table.

Header filter popovers were replaced with sorting controls at the user's request. Use FilterSidebar or host filtering and pass the resulting rows. Existing beta.4 tags remain unchanged.
