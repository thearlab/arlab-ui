# Contour V2 beta.18

Supporting the Studio detail rework with shared layout corrections:

- `DetailSections layout="wide"` stretches to the full available content width, including inside flex stacks.
- Omit `RecordBody.labelledBy` and provide `label` for a non-tabbed record. The body is a named region; tabbed records retain their tabpanel association.
- Compact hidden-title headers keep their actions on one row when space allows instead of reserving a mandatory second row.
- SidebarShell displays the real ARLAB logo without a surrounding square, border or background. The link target and focus indicator remain accessible.

No component exports or existing tabbed contracts are removed. All 88 public component regressions, package build/type checks, consumer builds and 60 color contrast checks pass. Studio captures cover all Agent and Workflow tabs in desktop and phone light/dark modes. No live Studio mutation or production deployment is involved.
