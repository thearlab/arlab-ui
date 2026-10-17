# SidebarShell spaces navigation

The agreed shared layout has two independent navigation areas. Only the outer spaces rail folds. The inner tool navigation and its fixed identity footer remain visible on desktop.

```tsx
<SidebarShell
  brand={<ArlabMark height={21} />}
  toolName="Agents Studio"
  spaces={[
    {id:'creative', label:'Creative', dept:'creative'},
    {id:'engineering', label:'Engineering', dept:'engineering'},
    {id:'website', label:'Website', icon:<Icon name="Globe" size={14} />},
  ]}
  activeSpace={space}
  onSpaceChange={setSpace}
  railCollapsed={railCollapsed}
  onRailCollapsedChange={setRailCollapsed}
  onHelp={openHelp}
  onSettings={openSettings}
  navigation={navigation}
  account={({collapsed}) => <AccountMenu collapsed={collapsed} name="Maya Khalil" />}
>
  {content}
</SidebarShell>
```

## Outer rail

- Compact width: 60px. Expanded width: 172px. `defaultRailCollapsed` defaults to true. The controlled API is `railCollapsed` with `onRailCollapsedChange`.
- Compact identity is the canonical square ARLAB symbol, supplied by `brandMark` or the shared default. Expanded identity uses the provided full `brand` exactly, with no additional ARLAB text or container background. There is no separator underneath the logo area.
- Department icons sit in 30px solid department tiles with readable white foregrounds. Names sit outside the tile. Website/Admin use neutral chrome glyph tiles, as do footer actions.
- The selected entry fills the complete rail width with the neutral raised surface. It has no black tile outline or left stripe. Long names keep their complete accessible label and title, with visual ellipsis where necessary.
- Footer order: Help, Settings, rail toggle. `onHelp` and `onSettings` produce the shared neutral tile/label treatment. The existing `help` slot and new `settings` slot can provide custom content when the corresponding callback is absent.
- The rail toggle lives in its footer. Cmd/Ctrl+backslash toggles the outer rail on desktop. Arrow keys and Home/End move focus between enabled spaces without selecting them. Native activation selects a space.
- With `storageKey`, single-navigation collapse uses the existing key, and spaces-rail collapse uses `${storageKey}:rail`. Old `${storageKey}:panel` preferences are not restored automatically.

## Inner navigation

The inner panel has a fixed title area, one scrolling tool navigation region and a fixed account footer. The existing `account` slot is rendered here with `{collapsed:false}`. Help is in the outer rail. No inner-panel toggle is rendered.

Use the shared static AccountMenu identity mode and an explicit logout action when an account is informational. AccountMenu behavior is independent of the shell; the shell does not invent user actions or authentication behavior.

The old `panelCollapsed`, `defaultPanelCollapsed` and `onPanelCollapsedChange` props remain accepted for source compatibility. Explicit host-controlled visibility is respected, but the old panel-fold button and its persisted preference are removed. Migrate old folding controls to the new rail props. `railFooter` remains a legacy custom utility override and still receives `{collapsed:true}` for declaration compatibility; prefer the named callbacks/slots for the agreed layout.

## Phone and single-navigation behavior

Below 760px, spaces and tools use separate native dialog drawers. Both show complete accessible labels. Selecting a route dismisses its drawer; Escape restores focus to the opening control. Help and Settings are available in the spaces drawer, and the account remains with the tools drawer.

Applications without `spaces` retain their existing single-navigation collapse API and optional secondary panel. The spaces rail API does not alter that state.

## Verification

`npm run build` checks the real public declarations and standalone styles. Run the isolated interaction harness with a checkout containing Vite and happy-dom:

```sh
ARLAB_TEST_HARNESS=/path/to/showcase/package.json node scripts/check-spaces-shell.mjs
```

Five checks cover labels/selection/disabled-skipping keyboard navigation, real brand variants and persisted rail-only folding, controlled/read-only state, both phone drawers with focus restoration, and unchanged single-navigation compact identity. Browser geometry and theme appearance still require the final integration review.
