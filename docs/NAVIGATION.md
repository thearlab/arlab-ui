# Reusable Contour navigation (beta.2)

Beta.1's SidebarShell was a gallery demo. Beta.2 replaces it with a typed, router-independent application shell. It does not inject sample routes or manage your page selection.

## Adopt only navigation in an existing app

```tsx
import { SidebarShell, NavigationSection, NavigationItem } from '@arlab/ui/navigation';
import '@arlab/ui/navigation/styles.css';

<SidebarShell
  brand={<YourLogo />}
  toolName="Dashboard"
  navigation={
    <nav aria-label="Dashboard pages">
      <NavigationSection label="Workspace">
        <NavigationItem label="Projects" icon={<FolderIcon />} active={route === '/projects'} onSelect={() => navigate('/projects')} />
      </NavigationSection>
    </nav>
  }
  header={<YourPageHeader />}
  account={({ collapsed }) => <YourAccountMenu iconOnly={collapsed} />}
  help={({ collapsed }) => <YourHelpButton iconOnly={collapsed} />}
  storageKey="dashboard:sidebar-collapsed"
>
  <YourPage />
</SidebarShell>
```

No ContourProvider, global reset, `.themed-preview` class, copied source or full V2 stylesheet is required. Import the dedicated stylesheet once. It includes the shared scrollbar. Manrope is recommended; the component falls back to system UI if the app has not loaded it yet. Colors inherit Contour tokens when present, otherwise use built-in light/dark defaults. Supply `mode="dark"` or inherit an ancestor's `data-theme="dark"` / `data-mode="dark"`.

Existing V1 applications can adopt the navigation subpath while temporarily retaining their original primitives through `@arlab/ui/legacy` and `@arlab/ui/legacy/styles.css`. This is staged migration, not a claim that changing the package version migrates the whole app. Check your other root imports before upgrading.

## Keep your existing application frame

Use `AppNavigation` instead of SidebarShell when the app already owns its grid and content panes. Supply `brand`, `toolName`, `collapsed`, `onToggle`, navigation as children, and optional `help` / `footer` slots. Set a bounded height on its parent. The identity and footer are fixed flex regions; only the middle ScrollArea scrolls. Section and footer dividers run edge to edge. Slot callbacks receive `{collapsed}` so account/help controls can render proper compact icon buttons.

## Only need a scrollbar?

```tsx
import { ScrollArea } from '@arlab/ui/scroll-area';
import '@arlab/ui/scroll-area/styles.css';

<ScrollArea height={320} label="Project files">{files}</ScrollArea>
```

`height` and `maxHeight` accept CSS dimensions. `axis` is vertical (default), horizontal or both. Native wheel, touch and keyboard scrolling remain available; the overlay thumb is 2px wide, at most 28px tall, and uses translucent pink. The thumb has a larger drag hit area and keyboard support. There is no provider dependency. A flex layout can instead provide a bounded height with `min-height: 0`.

## State and routing

- `navigation` and `children` are application-owned React nodes. No built-in demo routes.
- `navigationKey={location.pathname}` closes mobile drawers when your custom router links navigate. The supplied NavigationItem closes them automatically.
- `NavigationItem`: use `href` for an ordinary link or `onSelect` for your router. `active` sets aria-current, `disabled` disables the control, and `count` is optional.
- `collapsed` + `onCollapsedChange` provide controlled main navigation. Omit both for internal state with `defaultCollapsed`. A controlled shell without a change callback disables its toggle.
- `storageKey` is optional and app-specific; no cross-app preference is imposed.
- `secondaryNavigation` and `secondaryLabel` add an independent context rail. `defaultSecondaryCollapsed` sets its initial state.
- Below 760px, main and secondary navigation open in separate native modal dialogs. Escape closes them and focus returns to the opener. Returning to desktop closes any mobile drawer without changing desktop collapse preferences.
- The shell fills 100dvh by default. Override `style={{height: '100%'}}` inside a bounded parent. Optional CSS properties `--cn-sidebar-width` and `--cn-secondary-width` set expanded rail widths.

## Live standalone example

https://arlab-ui-showcase.pages.dev/navigation.html

That entry imports only the navigation module, its stylesheet and fonts. It intentionally has no provider or showcase CSS. The full component catalogue also demonstrates SidebarShell.

## Optional spaces rail

Pass `spaces` to opt into a fixed outer department rail and foldable tool panel. Omit it to retain the existing single navigation shell. `secondaryNavigation` remains independent and can still be supplied. Selection and routing stay application-owned: update `activeSpace` and pass that space's sections through `navigation`.

```tsx
<SidebarShell
  brand={<ArlabMark />}
  toolName="Dashboard"
  brandHref="/"
  spaces={[
    { id: 'company', label: 'Company', dept: 'company' },
    { id: 'client', label: 'Client servicing', dept: 'client', count: 3 },
    { id: 'creative', label: 'Creative', dept: 'creative' },
  ]}
  activeSpace={currentSpace}
  onSpaceChange={id => navigate(`/spaces/${id}`)}
  navigationKey={pathname}
  navigation={<CurrentSpaceNavigation />}
  storageKey="dashboard:navigation"
  railFooter={({ collapsed }) => <><HelpButton /><AccountMenu collapsed={collapsed} /></>}
>
  <Page />
</SidebarShell>
```

### Contract

- `Space`: `{ id, label, dept?, icon?, color?, href?, count?, disabled? }`. Supported canonical departments are `company`, `client`, `creative`, `engineering`, `strategy`; legacy department display names also work. Custom icons/colors are optional. Department tokens inherit the host palette; standalone navigation has light/dark fallback colors.
- `activeSpace` is controlled; selection calls `onSpaceChange(id)`. With only `href`, a tile is a normal link. With both, ordinary clicks call the callback and prevent navigation while modified link clicks keep browser behavior. A disabled tile cannot activate or receive arrow navigation.
- `brandMark` overrides the square brand artwork; `brandHref` defaults to `/`. `panelLabel` overrides the selected space name. Long panel headings ellipsize with a native title; drawer space names wrap.
- `panelCollapsed`, `onPanelCollapsedChange`, `defaultPanelCollapsed` control the new tools panel. These are separate from existing `collapsed` props. Uncontrolled fold state reads `${storageKey}:panel`; single navigation continues reading `storageKey`. Toggle changes persist when a storage key is supplied. Controlled state remains authoritative, including when no callback is provided.
- `railFooter({collapsed:true})` supplies icon-only help/account controls. If omitted, existing `help` and `account` slots receive `{collapsed:true}`. Apps must supply accessible icon controls; the shell does not guess how to collapse arbitrary custom content.
- CSS width knobs: `--cn-rail-width:60px` and `--cn-panel-width:240px`. Rail spaces and tool sections scroll independently; identity and footer stay fixed. Folding removes the tools panel and exposes its reopen control in the persistent rail.

### Keyboard and phone

The rail is a named `nav` and each tile exposes its full name and `aria-current="page"` when selected. Arrow keys move focus, skip disabled spaces and wrap; Home/End move to first/last enabled space. Focus movement does not select or navigate. Enter/Space retain normal link/button behavior. A visible non-color indicator accompanies the department tint; hover/focus show a tooltip, dismissed by Escape.

Cmd/Ctrl+backslash folds the tools panel on desktop (the existing navigation in single mode). Below 760px, the top bar displays the square brand mark, a current-space button and a menu button. The space picker and tools menu open distinct content in a native modal dialog with Escape dismissal and focus restoration. Navigation-key or active-space changes dismiss an open drawer. Desktop breakpoint changes close drawers. No sliding animation is applied, including reduced-motion mode.

`ArlabMark` is exported from the V2 and navigation entries. Its default full wordmark stays unchanged; `compact` renders the canonical leading symbol in a square SVG, with `height` controlling both dimensions. Folded single navigation displays a square canonical brand area as well.

`PageLoading` accepts `mark?: ReactNode` and `workspaceName?: string`; its default mark is now compact ArlabMark. For example: `<PageLoading mark={<AppMark />} workspaceName="Studio" />`.

### Focused checks

`node scripts/check-spaces-shell.mjs` runs five isolated source-level DOM checks: selection/disabled arrow navigation and tooltip, fold persistence and shortcut, controlled read-only folding, native drawer content/focus restoration, and compact single-navigation identity. The optional harness uses Vite and happy-dom from a sibling `agents-studio` checkout; set `ARLAB_TEST_HARNESS` to another package.json with those test dependencies to relocate it. It does not add runtime dependencies or call live services. TypeScript also checks the public props. Actual responsive geometry, visual contrast and native browser focus trapping require browser/catalogue review.

The spaces shell displays the complete canonical ARLAB vector wordmark inside a square brand area. It does not redraw the logo or replace it with initials. Pass `brandMark` for another application mark. The full/compact `ArlabMark` variants remain available for explicit use. The panel fold control sits in the fixed panel footer; when folded, its expand control moves to the fixed rail footer. Neither moves with the scrollable navigation.
