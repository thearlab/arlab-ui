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
