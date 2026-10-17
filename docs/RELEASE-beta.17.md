# Contour V2 beta.17

Implements the seven additional requests (6–12) in REQUESTS-BETA15-FROM-DASHBOARD.md.


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
