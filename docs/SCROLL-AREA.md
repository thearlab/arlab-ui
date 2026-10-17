# ScrollArea

ScrollArea keeps native scrolling and the thin translucent pink thumb. Existing instances remain plain primitives: no border, background, title bar or padding is added unless a header-related prop is supplied.

```tsx
<ScrollArea label="Results" height={240}>{results}</ScrollArea>
```

## Framed surface

Adding `title`, `description`, `actions` or `header` opts into the shared Satin Lift frame. It uses the same full-width title rail, background, pink heading marker and 14px corners as other titled panels. No extra Panel wrapper is needed.

```tsx
<ScrollArea
  title="Recent project activity"
  description="Updates from your workspace"
  actions={<IconButton label="Refresh" onClick={refresh}><Icon name="RefreshCw" /></IconButton>}
  height={300}
>
  <Rows>{activityRows}</Rows>
</ScrollArea>
```

The title and actions stay outside the scroll viewport. `height` and `maxHeight` bound the entire frame, including its title rail. The body takes the remaining space and its thumb is positioned relative to that body, so the indicator never slides over the title bar. Direct Rows content receives full-width row hover while preserving the text inset.

`header` accepts application-owned React content in place of the default title/description block. `actions` remains available beside it. For a custom header, supply `label` to name the content region. Otherwise a string title supplies the region name; without either, the existing `Scrollable content` default remains.

All existing props remain supported: `axis`, `className`, `contentClassName`, `tabIndex`, `height`, `maxHeight`, `label` and `children`. `tabIndex` applies to the named native scroll region, whose keyboard scrolling continues to work without requiring the decorative thumb to enter the tab sequence.
