# Dashboard modules and compact feedback

Use the existing `Panel` for a complete dashboard module. It already composes `Surface` and `SectionHead`: the approved 14px satin frame, soft elevation, browser header with pink dot, title, description and action. `RecordSection` is a borderless detail-section pattern, not the dashboard card pattern. No application selectors or showcase stylesheet are required.

```tsx
<WorkspaceGrid layout="sidebar">
  <Stack>
    <Panel title="Waiting on you" action={<TextLink href="/ongoing">View projects</TextLink>}>
      <StateView size="compact" variant="embedded"
        title="You’re all caught up" description="There are no decisions waiting on you." />
    </Panel>
    <Panel title="Project status"><ProjectSummary /></Panel>
  </Stack>
  <Panel title="Your week"><ScheduleSummary /></Panel>
</WorkspaceGrid>
```

`Panel` owns the body inset and the gap between direct body children. Shared foundation roles `panel-inset`, `panel-inset-compact`, `panel-header-block`, `panel-header-gap` and `panel-body-gap` govern this rhythm centrally. `RecordSection` also separates direct body children using `panel-body-gap`, without adding a frame or inset. Its existing default remains unchanged. Avoid adding a second padded wrapper. `contentInset="flush"` is additive: edge-to-edge list dividers and row hover belong to the panel frame, while each shared Row retains its readable text inset. Use `Rows`/`Row`, `RankList` or a table's flush variant inside it. Plain paragraphs/forms normally keep the default inset. The header/body/footer rhythm belongs to the composition, not arbitrary margins on children.

`StateView` accepts `size="regular" | "compact"` and `variant="framed" | "embedded"`. Defaults preserve existing behavior. Compact feedback is a short leading icon, copy and optional action; its action wraps beneath the copy on phones. Embedded feedback removes its own frame, elevation, background and padding because its containing Panel owns them. Do not repeat the section title as the empty-state title. Supply a concise result and one useful next action. `state="loading"` still delegates to the standard full-container `PageLoading`; compact/embedded do not override the loading contract.

```tsx
<StatNoteRow mobileLayout="compact">
  <StatNote label="Waiting on you" value={5} caption="Decisions needed" />
  <StatNote label="Due this week" value={3} caption="Across your projects" />
  <StatNote label="Live projects" value={12} caption="Your workspace" />
  <StatNote label="Shipped this week" value={2} caption="Completed projects" />
</StatNoteRow>
```

`mobileLayout="compact"` opts into two equal columns at widths up to 640px with shorter vertical rhythm. Values remain neutral, labels and notes wrap, and shared subgrid tracks retain alignment. The default `mobileLayout="stack"` preserves the previous auto-fit behavior. Use short labels/captions; do not hide an error by passing zero values.

Clickable metrics own their complete click target and padding. Pass `href` for navigation or `onClick` for an action directly to `Stat` or `StatNote`; do not place a separate button around only the value. `Stat.actionLabel` optionally provides a more specific accessible name; otherwise the label, value and hint form the native button/link name.

```tsx
<StatRow>
  <Stat label="Active projects" value={5} hint="Across 4 clients" href="/projects" />
  <Stat label="Ready for review" value={2} hint="Your feedback matters" onClick={openReviews} />
  <Stat label="Available agents" value={4} hint="Ready when you are" href="/agents" />
</StatRow>
```

Interactive metrics use the same `space-4` block and `space-6` inline inset (16px/24px), reducing to `space-3`/`space-4` (12px/16px) on a phone. In a row containing an interactive metric, every sibling shares that inset, including passive metrics. Hover covers the full cell, consecutive cells have no empty horizontal gutter, the outer row clips to `radius-panel`, and keyboard focus uses a thin inset outline. Standalone passive `Stat` and all-passive rows retain their previous geometry. Do not add another padded wrapper around individual metrics to compensate for their interaction style.

`PageGrid` now aligns children at the top rather than stretching a schedule sidebar to the full height of a stacked main column. Prefer `WorkspaceGrid layout="sidebar"` when the secondary column should have the approved supporting width.

For one page scroll owner, use `SidebarShell contentLayout="fill"` and `WorkspaceContent`, or `PageFrame` with its own scrolling. Do not nest an unconstrained route scroller inside the default scrolling shell. Application data hooks must distinguish loading, failure, empty and populated states; these UI components do not infer backend health.

## Ordinary collections and table-owned scroll

`CollectionLayout scroll="content"` gives ordinary cards, grouped content and non-virtual lists one bounded shared `ScrollArea` within the results region. The collection heading, tabs, search/filter toolbar and right filter rail remain outside that scroll area. It works inside `CollectionWorkspace` without adding application CSS or wrapping the whole destination in another viewport.

```tsx
<CollectionWorkspace collection={
  <CollectionLayout title="Services" scroll="content">
    <CardGrid>{services.map(service => <Panel key={service.id} title={service.name}>{service.description}</Panel>)}</CardGrid>
  </CollectionLayout>
} />
```

The default `scroll="child"` preserves existing behavior for `InfiniteTable fill`, `RecordCollection` and other result children that own their bounded row scrolling. Do not set `scroll="content"` around a fill table: that would introduce a second scroll owner and move its table chrome with the results. This API does not scroll or resize the detail pane; keep its existing `RecordBody`/shared scrolling contract. As with every fill composition, bound the application shell/page height and use `min-height:0` along any application-owned flex wrappers.

Content-mode insets belong to the ScrollArea content, not around its viewport. This keeps the custom scroll thumb at the right edge and gives cards space for their shadows. The default content inset is 16px above, 32px at the sides and 24px below; phones use 16px. Flush results explicitly remove that inset. Do not add application padding around the same results again.

## Board and collection toolbar spacing

KanbanBoard owns a 16px outer inset (12px on phones), 12px column header/list insets and 12px card gaps. Compact density uses 8px list insets/gaps. `inset="flush"` removes only the board gutter when its parent already provides one. Column text/cards retain their inset. The board stays bounded and uses its existing native sideways/column scrolling with hidden indicators.

A CollectionLayout with tabs leaves 16px before/after its search toolbar, with 32px side insets (16px on phones). This keeps fields away from the tab separator and aligned with contained results. Full-width result content does not remove the toolbar's readable gutter.
