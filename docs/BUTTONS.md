# Button sizing

All public `Button` variants share one geometry: 38px height, 13px horizontal padding, 12px medium text, 14px glyphs and the shared small radius. On phones and coarse pointers, the height is 44px. `IconButton` uses the same height and a square hit area. Tone changes do not change sizing. Component-specific compact classes no longer shrink public buttons.

Labels determine natural text-button width. Use `ActionGroup equalWidth` for paired actions that should have identical widths, keeping overflow icon menus outside that group.

```tsx
<ActionGroup label="App actions" equalWidth>
  <Button onClick={edit}>Edit app</Button>
  <Button variant="primary" onClick={issue}>Issue key</Button>
</ActionGroup>
```

The shared tokens are `--button-height`, `--button-padding-inline`, `--button-font-size` and `--button-line-height`. Navigation, tabs and fields retain their own component contracts.

For related page actions, AppHeader can reuse the same group with pageActionsEqualWidth. This matches the widths of Export and Add project without forcing icon controls or unrelated actions to become wider. Default pageActions preserves application-owned composition.

```tsx
<AppHeader context="Projects" pageActionsEqualWidth
  pageActions={<><Button>Export</Button><Button variant="primary">Add project</Button></>} />
```

AppHeader also accepts appName and appIcon to render the application identity using the shared heading face, 16px type and 600 weight. Context remains beside the name on desktop. On phones the application name stays visible and the secondary context is hidden when this identity mode is used.
