import {
  useId,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Button, PageBar } from "./library.js";
import { FilterableTable } from "./DataFilters.js";
import { Status } from "./ui.js";
import { ScrollArea } from "./scroll-area.js";

export interface CollectionRecord extends Record<string, unknown> {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  tone?: string;
  meta?: string;
  href: string;
}
export function RecordCollection({
  records,
  onOpen,
  loading = false,
  label = "Records",
  emptyMessage = "No records match your filters.",
}: {
  records: CollectionRecord[];
  onOpen: (id: string) => void;
  loading?: boolean;
  label?: string;
  emptyMessage?: string;
}) {
  const [visible, setVisible] = useState(25);
  const open = (
    event: React.MouseEvent<HTMLAnchorElement>,
    row: CollectionRecord,
  ) => {
    if (
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      onOpen(row.id);
    }
  };
  return (
    <div className="ct-record-collection">
      <div className="ct-record-collection-table">
        <FilterableTable
          fill
          title={label}
          rows={records}
          loading={loading}
          emptyMessage={emptyMessage}
          rowKey="id"
          pageSize={25}
          pageSizes={[10, 25, 50]}
          columns={[
            {
              key: "title",
              label: "Name",
              width: "48%",
              render: (row) => (
                <>
                  <a
                    className="lib-text-link"
                    href={row.href}
                    onClick={(event) => open(event, row)}
                  >
                    {row.title}
                  </a>
                  {row.description && <small>{row.description}</small>}
                </>
              ),
            },
            { key: "category", label: "Intelligence", width: "22%" },
            {
              key: "status",
              label: "Status",
              width: "15%",
              render: (row) => (
                <Status tone={row.tone || "quiet"}>{row.status}</Status>
              ),
            },
            { key: "meta", label: "Access", width: "15%" },
          ]}
        />
      </div>
      <ScrollArea className="ct-record-collection-mobile" label={label}>
        <p className="ct-record-collection-count" role="status">
          {loading
            ? "Loading records…"
            : `${records.length} ${records.length === 1 ? "record" : "records"}`}
        </p>
        {!loading && !records.length && (
          <p className="ct-record-collection-empty">{emptyMessage}</p>
        )}
        <ul>
          {records.slice(0, visible).map((row) => (
            <li key={row.id}>
              <a href={row.href} onClick={(event) => open(event, row)}>
                <strong>{row.title}</strong>
                {row.description && <span>{row.description}</span>}
                <span className="ct-record-collection-meta">
                  {row.category}
                  <Status tone={row.tone || "quiet"}>{row.status}</Status>
                </span>
              </a>
            </li>
          ))}
        </ul>
        {records.length > visible && (
          <Button onClick={() => setVisible(visible + 25)}>Show more</Button>
        )}
      </ScrollArea>
    </div>
  );
}

/** A collection is a destination of its own, with one bounded results surface. */
export function CollectionLayout({
  title,
  description,
  actions,
  search,
  filters,
  activeFilters = 0,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  search: ReactNode;
  filters?: ReactNode;
  activeFilters?: number;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <section className="ct-collection-layout" aria-label={title}>
      <PageBar
        title={title}
        description={description}
        actions={actions}
        heading="h1"
      />
      <div className="ct-collection-toolbar">
        <div>{search}</div>
        {filters && (
          <Button
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            <SlidersHorizontal size={14} />
            Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
          </Button>
        )}
      </div>
      {filters && (
        <div id={id} className="ct-collection-filter-fields" hidden={!expanded}>
          {filters}
        </div>
      )}
      <div className="ct-collection-results">{children}</div>
    </section>
  );
}

export function RecordLayout({ children }: { children: ReactNode }) {
  return <section className="ct-record-layout">{children}</section>;
}
export function RecordBody({
  children,
  id,
  labelledBy,
}: {
  children: ReactNode;
  id: string;
  labelledBy: string;
}) {
  return (
    <div
      className="ct-record-body"
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      tabIndex={-1}
    >
      <ScrollArea
        label="Record content"
        className="ct-record-body-scroll"
        contentClassName="ct-record-body-content"
      >
        {children}
      </ScrollArea>
    </div>
  );
}

/** Reading, comparing and editing need different content proportions. */
export function DetailSections({
  layout = "reading",
  children,
}: {
  layout?: "reading" | "split" | "stacked";
  children: ReactNode;
}) {
  return (
    <div className="ct-detail-sections" data-layout={layout}>
      {children}
    </div>
  );
}

export interface RecordHeaderProps {
  title: ReactNode;
  badges?: ReactNode;
  actions?: ReactNode;
  backLabel: string;
  onBack: () => void;
  metadata?: ReactNode;
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  idPrefix: string;
  panelId: string;
}
export function RecordHeader({
  title,
  badges,
  actions,
  backLabel,
  onBack,
  metadata,
  tabs,
  value,
  onChange,
  idPrefix,
  panelId,
}: RecordHeaderProps) {
  const strip = useRef<HTMLDivElement>(null);
  const active = tabs.some((t) => t.id === value) ? value : tabs[0]?.id;
  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const at = tabs.findIndex((t) => t.id === active);
    const next =
      event.key === "ArrowRight"
        ? (at + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (at - 1 + tabs.length) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : -1;
    if (next < 0) return;
    event.preventDefault();
    onChange(tabs[next].id);
    const target =
      strip.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
    target?.focus();
    target?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };
  return (
    <header className="ct-record-header">
      <div className="ct-record-context">
        <Button onClick={onBack}>
          <ArrowLeft size={14} />
          {backLabel}
        </Button>
        {metadata && (
          <details className="ct-record-metadata">
            <summary>Record details</summary>
            <ScrollArea
              label="Record details"
              className="ct-record-metadata-panel"
              maxHeight="40dvh"
            >
              {metadata}
            </ScrollArea>
          </details>
        )}
      </div>
      <div className="ct-record-heading">
        <div>
          <h1>{title}</h1>
          {badges && <div className="ct-record-badges">{badges}</div>}
        </div>
        {actions && <div className="ct-record-actions">{actions}</div>}
      </div>
      <ScrollArea
        label="Record sections"
        axis="horizontal"
        className="ct-record-tabs-scroll"
      >
        <div
          className="ct-record-tabs"
          role="tablist"
          aria-label="Record sections"
          ref={strip}
          onKeyDown={move}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${idPrefix}-${tab.id}`}
              aria-controls={panelId}
              aria-selected={tab.id === active}
              tabIndex={tab.id === active ? 0 : -1}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </ScrollArea>
    </header>
  );
}
