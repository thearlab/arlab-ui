import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type Ref,
  type KeyboardEvent,
} from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Button, IconButton, PageBar } from "./library.js";
import { InfiniteTable } from './InfiniteTable.js';
import type { TableChromeOptions } from "./TableChrome.js";
import { FilterableTable } from "./DataFilters.js";
import { Modal, Status } from "./ui.js";
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
  variant = "contained",
  progressive = false, countLabel, formatCount, searchWidth, search, headerActions, footerActions, condensedHeaderActions, condensedFooterActions, filterKey, selectedId,
  emptyMessage = "No records match your filters.",
}: TableChromeOptions & {
  progressive?: boolean;
  selectedId?: string;
  filterKey?: string | number;
  search?: ReactNode;
  headerActions?: ReactNode;
  footerActions?: ReactNode;
  condensedHeaderActions?: ReactNode;
  condensedFooterActions?: ReactNode;
  records: CollectionRecord[];
  onOpen: (id: string) => void;
  loading?: boolean;
  label?: string;
  variant?: "contained" | "flush";
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
  const Table = progressive ? InfiniteTable : FilterableTable;
  return (
    <div data-progressive={progressive||undefined} className="ct-record-collection" data-variant={variant}>
      <div className="ct-record-collection-table">
        <Table
          countLabel={countLabel} formatCount={formatCount} searchWidth={searchWidth}
          selectedRowKey={selectedId}
          search={search}
          headerActions={headerActions}
          {...(progressive?{footerActions,filterKey,condensedHeaderActions,condensedFooterActions}:{})}
          fill
          variant={variant}
          title={label}
          rows={records}
          loading={loading}
          emptyMessage={emptyMessage}
          onRowClick={row=>onOpen(row.id)}
          rowLabel={row=>`Open ${row.title}`}
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
                    title={row.title}
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
      {!progressive&&<ScrollArea className="ct-record-collection-mobile" label={label}>
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
      </ScrollArea>}
    </div>
  );
}

/** A collection is a destination of its own, with one bounded results surface. */
export function CollectionLayout({title,description,pills,updated,actions,tabs,search,filters,showTitle=true,sidebar,sidebarLabel='Filters',variant='contained',scroll='child',activeFilters=0,children}:{
 title:string;showTitle?:boolean;description?:ReactNode;pills?:ReactNode;updated?:ReactNode;actions?:ReactNode;tabs?:ReactNode;search?:ReactNode;filters?:ReactNode;
 sidebar?:(context:{mobile:boolean;close:()=>void})=>ReactNode;sidebarLabel?:string;
 /** 'content' scrolls ordinary results; 'child' preserves a table's own scroll owner. */
 scroll?:'child'|'content';
 variant?:'contained'|'flush';activeFilters?:number;children:ReactNode|((context:{filterTrigger:ReactNode})=>ReactNode);
}) {
 const [expanded,setExpanded]=useState(false);
 const [mobile,setMobile]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(max-width:760px)').matches);
 const id=useId();
 useEffect(()=>{const media=window.matchMedia('(max-width:760px)');const update=()=>{setMobile(media.matches);setExpanded(false);};media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 const close=()=>setExpanded(false);
 const filterTrigger=(filters||sidebar&&mobile)?<Button aria-expanded={expanded} aria-controls={id} onClick={()=>setExpanded(!expanded)}>Filters{activeFilters>0?` (${activeFilters})`:''}</Button>:null;
 const renderChildren=typeof children==='function';
 const results=renderChildren?children({filterTrigger}):children;
 return <section className="ct-collection-layout" data-scroll={scroll} data-variant={variant} data-tabs={!!tabs||undefined} data-sidebar={!!sidebar&&!mobile||undefined} aria-label={title}>
  {(showTitle||description||pills||updated||actions)?<PageBar title={title} showTitle={showTitle} description={description} pills={pills} updated={updated} pillsPlacement="inline" actions={actions} heading="h1"/>:<h1 className="sr-only">{title}</h1>}
  {(search||!renderChildren&&filterTrigger)&&<div className="ct-collection-toolbar" data-position="header"><div>{search}</div>{!renderChildren&&filterTrigger}</div>}
  {tabs&&<div className="ct-collection-tabs">{tabs}</div>}
  <div className="ct-collection-body">
  <div className="ct-collection-main">
   {filters&&!sidebar&&<div id={id} className="ct-collection-filter-fields" hidden={!expanded}>{filters}</div>}
   <div className="ct-collection-results">{scroll==='content'?<ScrollArea label={`${title} results`} className="ct-collection-results-scroll" contentClassName="ct-collection-results-content">{results}</ScrollArea>:results}</div>
  </div>
  {sidebar&&!mobile&&<div className="ct-collection-sidebar">{sidebar({mobile:false,close})}</div>}
  </div>
  {sidebar&&mobile&&<Modal open={expanded} onClose={close} title={sidebarLabel} sheet className="ct-collection-filter-sheet"><div id={id} className="ct-collection-filter-content">{sidebar({mobile:true,close})}</div></Modal>}
 </section>;
}

export function RecordLayout({ children }: { children: ReactNode }) {
  return <section className="ct-record-layout">{children}</section>;
}
export function RecordBody({
  children,
  id,
  labelledBy,
  label = "Record content",
  footer,
  footerRef,
}: {
  children: ReactNode;
  id: string;
  labelledBy?: string;
  /** Accessible region name for records without tabs. */
  label?: string;
  /** Persistent record actions, outside the content scroll area. */
  footer?: ReactNode;
  /** Optional target for application-owned action portals. Empty targets occupy no space. */
  footerRef?: Ref<HTMLDivElement>;
}) {
  const body=useRef<HTMLDivElement>(null);
  useEffect(()=>{const viewport=body.current?.querySelector<HTMLElement>('.ct-record-body-scroll > .scroll-viewport');if(viewport){viewport.scrollTop=0;viewport.scrollLeft=0;}},[labelledBy]);
  return (
    <div
      ref={body}
      className="ct-record-body"
      id={id}
      role={labelledBy?"tabpanel":"region"}
      aria-label={labelledBy?undefined:label}
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
      {(footer!==undefined||footerRef)&&<div ref={footerRef} className="ct-record-body-footer">{footer}</div>}
    </div>
  );
}

/** Reading, comparing and editing need different content proportions. */
export function DetailSections({
  layout = "reading",
  children,
}: {
  layout?: "reading" | "split" | "stacked" | "editor" | "wide";
  children: ReactNode;
}) {
  return (
    <div className="ct-detail-sections" data-layout={layout}>
      {children}
    </div>
  );
}

interface RecordHeaderBaseProps {
  title: ReactNode;
  label?: ReactNode;
  showTitle?: boolean;
  showBack?: boolean;
  badges?: ReactNode;
  description?: ReactNode;
  contextActions?: ReactNode;
  actions?: ReactNode;
  backLabel: string;
  onBack: () => void;
  metadata?: ReactNode;
}
/** Omit the entire tab contract for records without sections. */
export type RecordHeaderProps = RecordHeaderBaseProps & (
 {tabs?: undefined; value?: undefined; onChange?: undefined; idPrefix?: undefined; panelId?: undefined} |
 {tabs: {id:string;label:string}[]; value:string; onChange:(id:string)=>void; idPrefix:string; panelId:string}
);
export function RecordHeader({
  title,
  label,
  showTitle = true,
  showBack = true,
  badges,
  description,
  contextActions,
  actions,
  backLabel,
  onBack,
  metadata,
  tabs = [],
  value,
  onChange,
  idPrefix,
  panelId,
}: RecordHeaderProps) {
  const strip = useRef<HTMLDivElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
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
    onChange?.(tabs[next].id);
    const target =
      strip.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
    target?.focus();
    target?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };
  return (
    <header className="ct-record-header" data-title-hidden={!showTitle||undefined}>
      <div className="ct-record-header-main">
        {showBack&&<IconButton label={backLabel} onClick={onBack}><ArrowLeft size={14}/></IconButton>}
        <div className="ct-record-header-identity">
          {label && <span className="ct-record-header-label">{label}</span>}
          <h1 className={showTitle?'ct-record-header-title':'sr-only'}>{title}</h1>
          {badges&&<div className="ct-record-header-badges">{badges}</div>}
          {description&&<p className="ct-record-header-description">{description}</p>}
        </div>
        {(contextActions||metadata||actions)&&<div className="ct-record-header-tools">
          {(contextActions||metadata)&&<div className="ct-record-header-context-tools" data-separated={!!actions||undefined}>
            {contextActions}
            {metadata&&<IconButton label="Record details" aria-haspopup="dialog" aria-expanded={detailsOpen} onClick={()=>setDetailsOpen(true)}><Info size={14}/></IconButton>}
          </div>}
          {actions&&<div className="ct-record-header-primary-actions">{actions}</div>}
        </div>}
      </div>
      {tabs.length > 0 && <ScrollArea
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
              onClick={() => onChange?.(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </ScrollArea>}
      {metadata&&<Modal open={detailsOpen} onClose={()=>setDetailsOpen(false)} title="Record details" sheet className="ct-record-details-sheet">
        <div className="ct-record-details-context"><span>About this record</span><h3>{title}</h3></div>
        <ScrollArea label="Record information" className="ct-record-details-content">{metadata}</ScrollArea>
        <div className="ct-record-details-footer"><Button onClick={()=>setDetailsOpen(false)}>Done</Button></div>
      </Modal>}
    </header>
  );
}
