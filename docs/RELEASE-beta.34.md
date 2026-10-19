# ARLAB UI 2.0.0-beta.34

Department icons retain their solid identity color in every state. A reserved 2px border and discreet outer pink edge mark the selected icon without tinting the row. Hover strengthens the metallic finish in both themes, including on selected departments. Geometry and keyboard behavior stay unchanged.

TextAction now defaults to neutral text for buttons and links. Use tone="accent" explicitly for accent actions. This fixes ordinary section links such as Open Knowledge at the shared source.

WorkspaceGrid adds layout="navigator": a supporting-width column on the left and flexible content on the right. supportingWidth defaults to 320px in this mode; the layout stacks below 1200px. Use native Panel and RankList for the list and Stack for detail sections. Existing equal/sidebar layouts remain unchanged.

Pin github:thearlab/arlab-ui#v2.0.0-beta.34. Previous tags remain immutable.
