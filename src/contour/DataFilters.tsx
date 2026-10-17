import { SortControl } from './SortControl.js';
import { type TableChromeOptions, TableHeader } from './TableChrome.js';
import { tableRowProps, type TableRowActivation } from './table-row.js';
import { useEffect, useMemo, useState, type ReactNode, type ChangeEvent, type CSSProperties } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Dropdown } from "./ui.js";
import { ScrollArea } from "./scroll-area.js";
import { FacetList } from './DataLists.js';
import { Input, Checkbox, Button, IconButton } from './library.js';

export interface FilterColumn<Row> {
  key: string;
  label: string;
  header?: ReactNode;
  /** Hide this column and its header below 600px; data remains available on wider screens. */
  hideOnPhone?: boolean;
  width?: CSSProperties['width'];
  minWidth?: CSSProperties['minWidth'];
  maxWidth?: CSSProperties['maxWidth'];
  align?: "left" | "right" | "center";
  /** Header controls sort. Use FilterSidebar for filtering. */
  filterable?: boolean;
  sortable?: boolean;
  sortValue?: (row: Row) => string | number | null | undefined;
  options?: { value: string; label: string }[];
  value?: (row: Row) => string | number;
  render?: (row: Row) => ReactNode;
}
export interface TableSort {key:string;direction:'ascending'|'descending'}
export function sortTableRows<Row extends Record<string,unknown>>(rows:Row[],columns:FilterColumn<Row>[],sort:TableSort|null):Row[] {
    if (!sort) return rows;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return rows;
    const get = (row: Row) =>
      column.sortValue
        ? column.sortValue(row)
        : column.value
          ? column.value(row)
          : row[column.key];
    return [...rows].sort((a, b) => {
      const left = get(a),
        right = get(b);
      const leftEmpty = left == null || left === "",
        rightEmpty = right == null || right === "";
      if (leftEmpty || rightEmpty)
        return leftEmpty === rightEmpty ? 0 : leftEmpty ? 1 : -1;
      const comparison =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right), undefined, {
              numeric: true,
              sensitivity: "base",
            });
      return sort.direction === "ascending" ? comparison : -comparison;
    });
  }

/** The shared header for paginated and virtualized tables. */
export function SharedTableHead<Row>({columns,sort,onSort,sortingDisabled=false,sortIndicators='all'}:{columns:FilterColumn<Row>[];sort:TableSort|null;onSort:(key:string)=>void;sortingDisabled?:boolean;sortIndicators?:'all'|'active'|'none'}) {
 return (<thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  data-phone-hidden={column.hideOnPhone || undefined}
                  scope="col"
                  aria-sort={
                    sort?.key === column.key ? sort.direction : undefined
                  }
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    textAlign: column.align || "left",
                  }}
                >
                  {column.sortable === false ? (
                    <span>{column.header ?? column.label}</span>
                  ) : (
                    <SortControl
                      disabled={sortingDisabled}
                      accessibleLabel={column.label}
                      label={column.header ?? column.label}
                      direction={sort?.key===column.key?sort.direction:'none'}
                      onSort={() => onSort(column.key)}
                      showIndicators={sortIndicators!=='none'&&(sortIndicators==='all'||sort?.key===column.key)}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>);
}

export interface FilterableTableProps<Row extends Record<string, unknown>> extends TableRowActivation<Row>, TableChromeOptions {
  title?: string;
  header?: ReactNode;
  headerActions?: ReactNode;
  search?: ReactNode;
  columns: FilterColumn<Row>[];
  rows: Row[];
  rowKey: keyof Row | ((row: Row) => string | number);
  pageSize?: number;
  pageSizes?: number[];
  loading?: boolean;
  emptyMessage?: string;
  /** Fill the bounded height supplied by a collection layout. */
  fill?: boolean;
  variant?: "contained" | "flush";
  /** Auto sizes columns from content and optional min/max constraints. Fixed preserves existing layouts. */
  tableLayout?: 'fixed' | 'auto';
  sortIndicators?: 'all' | 'active' | 'none';

}
export function FilterableTable<Row extends Record<string, unknown>>({
  title = "Records",
  header,
  headerActions,
  search, countLabel, formatCount, showCount, searchWidth,
  columns,
  rows,
  rowKey,
  pageSize = 10,
  pageSizes = [10, 25, 50],
  loading,
  emptyMessage = "No results match these filters.",
  fill = false,
  variant = "contained",
  tableLayout = 'fixed',
  sortIndicators = 'all',
  onRowClick,
  rowLabel,
  selectedRowKey,
}: FilterableTableProps<Row>) {
  const [sort, setSort] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [page, setPage] = useState(1),
    [size, setSize] = useState(pageSize);
  const ordered = useMemo(()=>sortTableRows(rows,columns,sort),[rows,columns,sort]);
  const pages = Math.max(1, Math.ceil(ordered.length / size)),
    current = Math.min(page, pages),
    start = (current - 1) * size;
  const toggleSort = (key: string) => {
    setSort((previous) => ({
      key,
      direction:
        previous?.key === key && previous.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
    setPage(1);
  };
  return (
    <section
      className="ct-data-table"
      data-fill={fill || undefined}
      data-variant={variant}
      aria-label={title}
      aria-busy={loading || undefined}
    >
      <TableHeader showCount={showCount} countLabel={countLabel} formatCount={formatCount} searchWidth={searchWidth} title={title} header={header} count={ordered.length} loading={loading} search={search} actions={headerActions}/>
      <ScrollArea label={`${title} table`} className="ct-table-scroll" axis="both" maxHeight={fill ? undefined : 520}>
        <table aria-label={title} style={{tableLayout}}>
          <SharedTableHead columns={columns} sort={sort} onSort={toggleSort} sortIndicators={sortIndicators}/>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="ct-table-empty" role="status">
                    Loading records…
                  </div>
                </td>
              </tr>
            ) : ordered.length ? (
              ordered.slice(start, start + size).map((row) => (
                <tr
                  {...tableRowProps(row,{onRowClick,rowLabel,selectedRowKey},typeof rowKey==='function'?rowKey(row):row[rowKey])}
                  key={String(
                    typeof rowKey === "function" ? rowKey(row) : row[rowKey],
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      data-phone-hidden={column.hideOnPhone || undefined}
                      style={{ textAlign: column.align || "left", width:column.width,minWidth:column.minWidth,maxWidth:column.maxWidth }}
                    >
                      {column.render
                        ? column.render(row)
                        : String(
                            column.value
                              ? column.value(row)
                              : (row[column.key] ?? "Not set"),
                          )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="ct-table-empty">
                    <Search size={20} />
                    <strong>No results</strong>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ScrollArea>
      <footer>
        <span>
          {ordered.length
            ? `${start + 1}–${Math.min(start + size, ordered.length)} of ${ordered.length}`
            : "0 records"}
        </span>
        <div className="ct-table-size">
          <span>Rows per page</span>
          <Dropdown
            children={undefined}
            defaultValue={undefined}
            searchable={false}
            name={undefined}
            aria-invalid={undefined}
            aria-describedby={undefined}
            aria-label="Rows per page"
            value={String(size)}
            options={[...new Set([pageSize, ...pageSizes])].map((n) => ({
              value: String(n),
              label: String(n),
            }))}
            onChange={(e: { target: { value: string } }) => {
              setSize(+e.target.value);
              setPage(1);
            }}
          />
        </div>
        <nav aria-label={`${title} pages`}>
          <IconButton

            label="Previous page"
            disabled={current === 1 || loading}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft size={14} />
          </IconButton>
          <span>
            Page {current} of {pages}
          </span>
          <IconButton

            label="Next page"
            disabled={current === pages || loading}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight size={14} />
          </IconButton>
        </nav>
      </footer>
    </section>
  );
}
export interface DataFilter {
  id: string;
  label: string;
  type: "search" | "select" | "multi" | "facet";
  options?: { value: string; label: string; count?: number }[];
  placeholder?: string;
}
export interface FilterSidebarProps {
  title?: string;
  filters: DataFilter[];
  value: Record<string, string | string[]>;
  onChange: (value: Record<string, string | string[]>) => void;
  variant?: "full" | "compact";
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  resultCount?: number;
  onClose?: () => void;
  showHeader?: boolean;
}
export function FilterSidebar({
  title = "Filters",
  filters,
  value,
  onChange,
  variant = "full",
  collapsed = false,
  onCollapsedChange,
  resultCount,
  onClose,
  showHeader = true,
}: FilterSidebarProps) {
  const active = Object.values(value).filter((v) =>
    Array.isArray(v) ? v.length : v,
  ).length;
  const update = (id: string, next: string | string[]) =>
    onChange({ ...value, [id]: next });
  if (collapsed)
    return (
      <aside className="ct-filter-rail" aria-label={title}>
        <IconButton

          className="ct-filter-icon"
          label="Expand filters"
          aria-expanded={false}
          onClick={() => onCollapsedChange?.(false)}
        >
          <PanelRightOpen size={15} />
        </IconButton>
        <span className="ct-filter-rail-label">Filters</span>
        {active > 0 && (
          <span
            className="ct-filter-count"
            aria-label={`${active} active filters`}
          >
            {active}
          </span>
        )}
      </aside>
    );
  return (
    <aside
      className="ct-filter-sidebar"
      data-variant={variant}
      aria-label={title}
    >
      {showHeader && <header>
        <h3>{title}</h3>
        {active > 0 && <span className="ct-filter-count">{active}</span>}
        <div>
          {onCollapsedChange && (
            <IconButton

              className="ct-filter-icon"
              label="Collapse filters"
              aria-expanded={true}
              onClick={() => onCollapsedChange(true)}
            >
              <PanelRightClose size={14} />
            </IconButton>
          )}
          {onClose && (
            <IconButton

              className="ct-filter-icon"
              label="Close filters"
              onClick={onClose}
            >
              <X size={14} />
            </IconButton>
          )}
        </div>
      </header>}
      <ScrollArea label="Filter options" className="ct-filter-sidebar-scroll">
        <div className="ct-filter-sections">
          {filters.map((filter) => (
            <section key={filter.id}>
              <h4>{filter.label}</h4>
              {filter.type === "facet" ? <FacetList label={filter.label} responsive={false} value={String(value[filter.id] || '')} items={(filter.options || []).map(option=>({id:option.value,label:option.label,count:option.count}))} onChange={id=>update(filter.id,id)}/> : filter.type === "search" ? (
                <Input
                  aria-label={filter.label}
                  value={String(value[filter.id] || "")}
                  placeholder={filter.placeholder || "Search…"}
                  onChange={(e) => update(filter.id, e.target.value)}
                />
              ) : filter.type === "select" ? (
                <Dropdown
                  children={undefined}
                  defaultValue={undefined}
                  searchable={false}
                  name={undefined}
                  aria-invalid={undefined}
                  aria-describedby={undefined}
                  aria-label={filter.label}
                  value={String(value[filter.id] || "")}
                  options={[
                    { value: "", label: "All" },
                    ...(filter.options || []),
                  ]}
                  onChange={(e: { target: { value: string } }) =>
                    update(filter.id, e.target.value)
                  }
                />
              ) : (
                <div className="ct-filter-checks">
                  {filter.options?.map((option) => {
                    const selected = Array.isArray(value[filter.id])
                      ? (value[filter.id] as string[])
                      : [];
                    return (
                      <Checkbox key={option.value}
                          checked={selected.includes(option.value)}
                          aria-label={option.count === undefined ? option.label : `${option.label}, ${option.count.toLocaleString()}`}
                          onChange={(e:ChangeEvent<HTMLInputElement>) =>
                            update(
                              filter.id,
                              e.target.checked
                                ? [...selected, option.value]
                                : selected.filter((v) => v !== option.value),
                            )
                          }
                        label={<span className="ct-filter-option-label" title={option.label}>{option.label}</span>}
                        trailing={option.count === undefined ? undefined : <span className="ct-filter-option-count" aria-hidden="true">{option.count.toLocaleString()}</span>}/>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      </ScrollArea>
      <footer>
        {resultCount !== undefined && (
          <span role="status">{resultCount.toLocaleString()} {resultCount === 1 ? 'result' : 'results'}</span>
        )}
        <Button disabled={!active} onClick={() => onChange({})}>
          Reset filters
        </Button>
      </footer>
    </aside>
  );
}
