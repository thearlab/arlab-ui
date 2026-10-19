# ARLAB UI 2.0.0-beta.36

Dark mode uses a role-specific pink: softer #D572CC for text/icons, deeper #BA29B0 for buttons and #C02EB5 on hover, retaining white labels. Department tiles use richer solid fills and lighter text/chart counterparts. All five solid department fills and both button colors exceed 4.5:1 with white. Neutral charcoal surfaces and the light palette stay unchanged. Subtle highlight gradients preserve the richer base.

Department selection uses a recessed metallic gradient, inner shadow and clean drop shadow, with no pink selection stroke. Resting/hovered icons remain raised and preserve their solid department identity.

SectionHeader adds inset="content". Put it outside ContentInset to keep its sticky separator edge to edge, while aligning its title/count to the padded grid below. Existing headers retain their default inset.

Includes beta.35 shared inner chrome, transparent favicon, centered rail logo, pressed department styling and clean sign-out artwork. Pin github:thearlab/arlab-ui#v2.0.0-beta.36.

AccountMenu sign-out inherits the standard IconButton chrome in both resting and hover states. There is no account-only transparent override.

Selected department icons use one 2px border in their own department color at 45% opacity. The fill clips to the padding box so the translucent border remains distinct; pressed finish and shadow stay in place.

Glass rim is the approved shared material: luminous inner edges, soft lift, reflective neutral rims and cohesive control/tag/field shadows. Department navigation is 82% opaque at rest, 96% on hover, 100% selected/focused. All outer rail actions use raised/recessed Glass rim icon containers and transparent row backgrounds. Flush Panel + FacetList no longer receives duplicate negative insets.
