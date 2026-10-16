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
