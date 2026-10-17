# Dashboard follow-up for beta.15

Implemented for beta.16:

1. CommandItem accepts `group`. CommandPalette renders named result groups, keeps search/keyboard indices aligned and retains its 24-result DOM cap. Searching also matches group names.
2. PillButton accepts `variant="quiet"`, `tone`, `count` and `dot`, and forwards native button attributes. Quiet filters use a dot, label, count and soft selected fill, without a border or check. Existing default appearance remains available.
3. TabStrip accepts strings or `{label,value?,id?,count?,disabled?}`. Changes emit a stable value/id/label string, never the count or option object. Counts include zero; arrow/Home/End navigation skips disabled tabs.
4. AppHeader accepts `pageActions` beside search, before global actions. Page controls wrap on phones without portals.
5. The spaces rail defaults to solid 28px department tiles with white icons, a 46px soft accent selection square, ink-filled application tiles and a separator at group boundaries. The previous indicator and dark tile border are removed. Logo, footers, phone drawers, tooltips, counts and keyboard behavior remain. Dedicated `--dept-*-solid` tokens keep white icon contrast in both modes while existing softer chart/department tones remain available elsewhere.

Additional fixes requested in the same session:

- Small h2/h3 and record/panel headings use normal letter spacing.
- RecordBody accepts `footer` and `footerRef` outside the scrolling content. Empty footer targets take no space. This supports fixed per-record Save/Publish actions.
- CopyBlock accepts app-owned clipboard/error callbacks and displays copy-recovery text.

Validation: shared TypeScript/build, 85 public interaction cases and 60 contrast pairs pass. Studio regression fixtures verify the same table/filter rail and fixed editor footer while retaining edit guards. The showcase includes quiet chips, counted tabs, grouped search, page actions, department/application spaces and the fixed-footer collection example.


## Additional dashboard requests 6–12: beta.17

6. **Bounded paginated tables:** `FilterableTable fill` is a flex column with a shrinking row viewport and fixed header/pager. It works directly inside CollectionWorkspace, without relying on CollectionLayout CSS. Unfilled tables keep their natural content height, capped at 520px.
7. **Header typography:** the 11px count rule targets `.ct-table-count`, not arbitrary header spans. Custom headers inherit the 13px table role; pills retain their own component scale.
8. **Count copy:** `countLabel="projects"` produces “574 projects”; `formatCount={n => `${n} shown`}` overrides it. The accessible label uses the same copy. Loading/unknown states retain their status labels. Supported by FilterableTable, InfiniteTable and RecordCollection.
9. **Search sizing:** `searchWidth` accepts a number in pixels or CSS width, defaults to 220px, and wraps/caps at available width on phones. Header content yields before search shrinks.
10. **Quiet toolbar buttons:** the shared quiet Button keeps the same subtle 1px border, neutral fill and hover treatment inside a table header and outside it. Quiet PillButton filters remain a distinct, intentionally borderless component.
11. **Records without tabs:** omit the whole tabs/value/onChange/idPrefix/panelId contract. No empty tab strip or scroll region is rendered. Existing tabbed records retain their controlled contract and keyboard behavior.
12. **Condensed heading rhythm:** narrow collection headers use the same spacing tokens and minimum height as the RecordHeader identity band: 16px block, 24px inline and 64px minimum height.

Integration example:

```tsx
<FilterableTable fill countLabel="projects" searchWidth={240}
  title="Projects" columns={columns} rows={projects} rowKey="id" />
<RecordHeader title="Client" showBack={false}
  backLabel="Clients" onBack={closeRecord} />
```

Validation: 87 public component tests, shared package TypeScript/build, 60 theme contrast pairs and consumer builds. Browser review verifies a 480px filled paginated table with 1,914px of row content and the pager inside its bounds, 13px custom header spans, identical quiet toolbar buttons, phone search without page overflow, and condensed/header spacing. Existing immutable releases remain unchanged.
