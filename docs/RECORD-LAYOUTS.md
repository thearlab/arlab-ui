# Collections and focused records

CollectionLayout is the browse destination. Its header and search stay fixed; RecordCollection owns the bounded results scroll and pagination. At phone widths the same records become readable links in a list, with Show more pagination. Use real href values so modifier-click and new tabs keep working. onOpen should navigate without writing data. Filters, query parameters and permissions belong to the host application.

RecordLayout is the detail destination. RecordHeader owns title, badges, actions, metadata disclosure and controlled section tabs. Give each instance a unique idPrefix, a panelId, and a back action that preserves the collection filters. RecordBody must receive that panelId as id and the selected tab ID as labelledBy. It supplies one shared ScrollArea. The host must guard unsaved navigation and retain server authorization.

Use DetailSections layout="reading" for primary content with secondary facts, layout="split" for request/result comparison, and layout="stacked" for wide editing. FormGrid columns={1|2} supplies field gaps and responsive columns. FormFieldGroup labels must reference the actual control ID with htmlFor; hint and error are contextual guidance. It never rewrites child values or event handlers.

Textarea variant="code" selects the shared mono role and a 220px minimum. size="short" uses a 96px minimum. Avoid app styles targeting .lib-input, .ct-facts, .ct-panel or their descendants. Use component props and extend the shared contract when a layout option is missing.

See the live CollectionLayout, RecordHeader, DetailSections and FormGrid catalogue examples for working compositions.
