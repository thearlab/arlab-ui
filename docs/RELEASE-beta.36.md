# ARLAB UI 2.0.0-beta.36

Dark mode uses a role-specific pink: softer #D572CC for text/icons, deeper #BA29B0 for buttons and #C02EB5 on hover, retaining white labels. Department tiles use richer solid fills and lighter text/chart counterparts. All five solid department fills and both button colors exceed 4.5:1 with white. Neutral charcoal surfaces and the light palette stay unchanged. Subtle highlight gradients preserve the richer base.

Department selection now uses one 2px pink border, without an outer outline.

SectionHeader adds inset="content". Put it outside ContentInset to keep its sticky separator edge to edge, while aligning its title/count to the padded grid below. Existing headers retain their default inset.

Includes beta.35 shared inner chrome, transparent favicon, centered rail logo, single 2px selected border and clean sign-out artwork. Pin github:thearlab/arlab-ui#v2.0.0-beta.36.

AccountMenu sign-out inherits the standard IconButton chrome in both resting and hover states. There is no account-only transparent override.
