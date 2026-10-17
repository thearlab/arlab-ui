# Contour V2 beta.9

Studio integration refinements, packaged as additive shared component APIs.

- AppHeader keeps context, search and actions on one responsive row. Breadcrumbs supports one-line truncation with complete title tooltips.
- TagInput supports externally labelled forms, native attributes, disabled state and batch commit on blur.
- Dialog/Sheet/Modal accept a configured width, description, fixed footer, shared scrolling and guarded dismissal. Escape respects application-owned open state and pending guards.
- FilterSidebar selects fill their section and result labels pluralize correctly.

Verification: package TypeScript/build and CSS isolation checks; 125 catalogue exports and real specimens; 146 icons; 49 interaction checks; 46 theme contrast pairs. Studio's typecheck/build and 9 isolated Admin regression cases pass against the candidate. Browser checks cover the responsive header, field typography, full-width filters and access-sheet sizing/fixed actions.

Existing tags remain immutable. No backend or schema changes. These checks do not certify every physical touch device or every application's integration. Studio production deployment remains separate from the design-system release.

Rollback: pin the previous immutable tag and lockfile commit, rebuild and redeploy the previous consumer artifact. Never move a published tag.
