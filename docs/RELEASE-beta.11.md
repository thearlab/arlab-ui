# Contour V2 beta.11

## 2.0.0-beta.11

- CollectionLayout accepts pills beside its title and an updated metadata slot alongside its description. Rich description content is supported.
- Heading and tabs now span the full collection width. The single 1px tab separator extends above the desktop filter sidebar; results and filters begin below it.
- Title pills, actions and update metadata wrap on phones without page overflow. Existing simple title/description calls remain supported.
- PageBar exposes updated and pillsPlacement. Its existing below-title pill placement remains the default outside CollectionLayout.
- Verified package/showcase builds, 57 interaction checks, 50 theme contrast pairs, and desktop/light/dark/phone geometry. Studio compatibility is checked separately.

```tsx
<CollectionLayout
  title="Projects"
  description="Work across the studio."
  pills={<><Pill>24 projects</Pill><Status tone="quiet">Internal</Status></>}
  updated={<time dateTime={updatedAt}>Updated {formattedUpdatedAt}</time>}
  actions={<Button onClick={createProject}>New project</Button>}
  tabs={<ProjectTabs/>}
  search={<ProjectSearch/>}
  sidebar={({mobile,close}) => <ProjectFilters mobile={mobile} onClose={close}/>}
  variant="flush"
>
  <ProjectTable/>
</CollectionLayout>
```

The heading, title pills, description/update metadata and tabs belong to the library. Tab state, timestamp formatting, record counts, routing and filter state remain application-owned. The desktop sidebar starts below the full-width heading and tab separator; phone filters still open in the shared sheet. Existing simple calls need no new props. PageBar retains its previous pill placement unless pillsPlacement="inline" is requested.

No backend, authentication or data changes. Studio deployment remains a separate review step. Previous tags remain immutable. Roll back by pinning beta.10 and rebuilding the consumer.
