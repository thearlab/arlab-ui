# Contour V2 beta.23

Fix virtual scrolling in CollectionWorkspace's condensed collection pane. A shared internal presentation context makes InfiniteTable and FilterableTable render their first column alone, with no inherited percentage width. Virtual spacer and group rows span that one column. This avoids the browser allocating blank columns after scroll introduces a spacer.

The collection stays mounted. Original columns still drive sorting, and full-table presentation returns when the detail closes. No public API or foundation changes.

Consumption: `git+https://github.com/thearlab/arlab-ui.git#v2.0.0-beta.23`.

Validation: full build/public consumer type checks, 90 regression tests, and live scrolling at Studio's `/agents/sku-still-editor`. The condensed cell occupies all 279px of the compact table instead of approximately 70px. Previous immutable tags remain unchanged.
