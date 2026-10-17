# Contour V2 beta.24

The approved subtle ARLAB pink background treatment now lives in the shared foundation. It was previously a showcase-only override. Both light and dark modes use a low-opacity pink canvas wash, very slight pink chrome and container gradients, and the existing satin rim. Satoshi 600 headings, DM Mono, component dimensions, main pink and semantic colours remain unchanged.

Use ContourProvider and @arlab/ui/styles.css. Shared shells apply --page-gradient and --chrome-gradient; existing surfaces and controls consume --surface-gradient, --chrome-subtle-gradient and --chrome-control-gradient. No application stylesheet or token override is needed. Standalone navigation also consumes these variables when provided by its host.

Additive reading/upload components: PageFrame, ReadingLayout, DocumentContent, DocumentOutline, Inline, ContentInset, Table, FileDropzone and DropRegion. See READING-LAYOUTS.md. DocumentContent expects caller-sanitised HTML; it is not an HTML sanitiser or Markdown parser. ReadingLayout adapts to its containing pane. Existing application-owned payloads and permissions stay outside the library.

Compact collection composition now removes result gutters so full-width row dividers and hover surfaces reach the pane edges.

Install: `git+https://github.com/thearlab/arlab-ui.git#v2.0.0-beta.24`.

Validation: full package build, public consumer type checks, CSS boundaries and regression suite. Publishing this package does not deploy or certify consuming applications. Previous immutable tags are unchanged.
