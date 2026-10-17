# Reading and document components

All components inherit the Contour foundation. Applications own data, parsing, sanitisation, uploads, permissions and persistence.

| Component | Contract |
| --- | --- |
| PageFrame | children, optional header/footer, label, padding default/none, scrollable (default true). Use scrollable=false when inner panes own scrolling. One bounded ScrollArea with persistent header/actions. Parent must have a bounded height. |
| ReadingLayout | children and optional outline. Single column in narrow panes; document and 200px outline columns when the containing PageFrame or RecordBody is at least 780px wide. |
| DocumentContent | html, label and article attributes. HTML must be sanitised by the application before passing it. Shared prose, tables, syntax classes, responsive media and keyboard image preview. Never pass untrusted raw HTML. |
| DocumentOutline | headings [{id,text,depth}], optional label. Requires matching heading IDs in the current document. Active heading tracking, reduced-motion-aware navigation, collapsible outline in narrow panes. Use one document instance per page to avoid duplicate IDs. |
| Inline | children and justify start/between/end. Wrapping horizontal composition on the shared spacing scale. |
| ContentInset | children and div attributes. Shared content padding. |
| Table | children, label and table attributes. Semantic table for caller-owned structures. Use FilterableTable or InfiniteTable for sorting, filtering and virtualisation. |
| FileDropzone | onFiles(File[]), accept, multiple, disabled, title, description. Picker/drop emits files only, never uploads. Caller validates types, catches asynchronous errors and renders progress/retry. Accept is a browser picker hint. |
| DropRegion | active, dragging, children and div attributes. Shared visual drag feedback; caller owns drag events and a keyboard alternative. |

```tsx
import {PageFrame, ReadingLayout, DocumentContent, DocumentOutline} from '@arlab/ui';
<PageFrame label="Knowledge document">
  <ReadingLayout outline={<DocumentOutline headings={headings}/> }>
    <DocumentContent html={sanitisedHtml}/>
  </ReadingLayout>
</PageFrame>
```

Image previews use the shared modal. Links remain navigation links. Headings must have stable IDs assigned by the application's parser. Do not rely on the presentation component to make HTML safe.
