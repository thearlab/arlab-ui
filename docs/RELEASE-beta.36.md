# ARLAB UI 2.0.0-beta.36

Dark mode uses a role-specific pink: softer #D572CC for text/icons, deeper #BA29B0 for buttons and #C02EB5 on hover, retaining white labels. Department tiles use richer solid fills and lighter text/chart counterparts. All five solid department fills and both button colors exceed 4.5:1 with white. Neutral charcoal surfaces and the light palette stay unchanged. Subtle highlight gradients preserve the richer base.

Department selection uses a recessed metallic gradient, inner shadow and clean drop shadow, with no pink selection stroke. Resting/hovered icons remain raised and preserve their solid department identity.

SectionHeader adds inset="content". Put it outside ContentInset to keep its sticky separator edge to edge, while aligning its title/count to the padded grid below. Existing headers retain their default inset.

Includes beta.35 shared inner chrome, transparent favicon, centered rail logo, pressed department styling and clean sign-out artwork. Pin github:thearlab/arlab-ui#v2.0.0-beta.36.

AccountMenu sign-out inherits the standard IconButton chrome in both resting and hover states. There is no account-only transparent override.

Selected department icons use one 2px border in their own department color at 45% opacity. The fill clips to the padding box so the translucent border remains distinct; pressed finish and shadow stay in place.

Glass rim is the approved shared material: luminous inner edges, soft lift, reflective neutral rims and cohesive control/tag/field shadows. Department navigation is 82% opaque at rest, 96% on hover, 100% selected/focused. All outer rail actions use raised/recessed Glass rim icon containers and transparent row backgrounds. Flush Panel + FacetList no longer receives duplicate negative insets.

Department spaces now apply their identity as the interface accent. SidebarShell follows the active Space.dept automatically; department={null} opts out, and an explicit department scopes a single sidebar. Website/Admin spaces restore pink. ContourProvider department and tokensFor('contour', mode, {department}) support app roots and portalled content. Nested providers inherit mode and department. Semantic status colors and chart series stay independent. Bright department actions get readable labels; approved pink and white labels remain exact.

The approved sidebar finish is a fine reflective inner edge and soft neutral surface sheen. Removed projecting dark shadows and the heavy separator bands from the trial. Both sidebar formats and the top bar consume the same shared tokens.

Accent text roles use the readable link color while decorative accents keep the department hue. Department text contrast is checked on both raised and selected navigation surfaces.
