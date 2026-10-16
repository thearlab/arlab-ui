import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Filter,
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

export interface FilterColumn<Row> {
  key: string;
  label: string;
  header?: ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
  /** Header controls sort. Use FilterSidebar for filtering. */
  filterable?: boolean;
  sortable?: boolean;
  sortValue?: (row: Row) => string | number | null | undefined;
  options?: { value: string; label: string }[];
  value?: (row: Row) => string | number;
  render?: (row: Row) => ReactNode;
}
export interface FilterableTableProps<Row extends Record<string, unknown>> {
  title?: string;
  header?: ReactNode;
  headerActions?: ReactNode;
  columns: FilterColumn<Row>[];
  rows: Row[];
  rowKey: keyof Row | ((row: Row) => string | number);
  pageSize?: number;
  pageSizes?: number[];
  loading?: boolean;
  emptyMessage?: string;
}
export function FilterableTable<Row extends Record<string, unknown>>({
  title = "Records",
  header,
  headerActions,
  columns,
  rows,
  rowKey,
  pageSize = 10,
  pageSizes = [10, 25, 50],
  loading,
  emptyMessage = "No results match these filters.",
}: FilterableTableProps<Row>) {
  const [sort, setSort] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [page, setPage] = useState(1),
    [size, setSize] = useState(pageSize);
  const ordered = useMemo(() => {
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
  }, [rows, columns, sort]);
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
      aria-label={title}
      aria-busy={loading || undefined}
    >
      <header>
        <div>
          {header || <h3>{title}</h3>}
          <span role="status">
            {ordered.length} {ordered.length === 1 ? "record" : "records"}
          </span>
        </div>
        {headerActions && (
          <div className="ct-table-header-actions">{headerActions}</div>
        )}
      </header>
      <ScrollArea label={`${title} table`} className="ct-table-scroll" axis="both" maxHeight={520}>
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    sort?.key === column.key ? sort.direction : undefined
                  }
                  style={{
                    width: column.width,
                    textAlign: column.align || "left",
                  }}
                >
                  {column.sortable === false ? (
                    <span>{column.header ?? column.label}</span>
                  ) : (
                    <button
                      type="button"
                      className="ct-table-sort"
                      aria-label={`Sort ${column.label} ${sort?.key === column.key && sort.direction === "ascending" ? "descending" : "ascending"}`}
                      onClick={() => toggleSort(column.key)}
                    >
                      <span>{column.header ?? column.label}</span>
                      <span className="ct-sort-arrows" aria-hidden="true">
                        <ChevronUp
                          size={12}
                          data-active={
                            (sort?.key === column.key &&
                              sort.direction === "ascending") ||
                            undefined
                          }
                        />
                        <ChevronDown
                          size={12}
                          data-active={
                            (sort?.key === column.key &&
                              sort.direction === "descending") ||
                            undefined
                          }
                        />
                      </span>
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
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
                  key={String(
                    typeof rowKey === "function" ? rowKey(row) : row[rowKey],
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      style={{ textAlign: column.align || "left" }}
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
          <button
            type="button"
            aria-label="Previous page"
            disabled={current === 1 || loading}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft size={14} />
          </button>
          <span>
            Page {current} of {pages}
          </span>
          <button
            type="button"
            aria-label="Next page"
            disabled={current === pages || loading}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight size={14} />
          </button>
        </nav>
      </footer>
    </section>
  );
}
export interface DataFilter {
  id: string;
  label: string;
  type: "search" | "select" | "multi";
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
}: FilterSidebarProps) {
  const active = Object.values(value).filter((v) =>
    Array.isArray(v) ? v.length : v,
  ).length;
  const update = (id: string, next: string | string[]) =>
    onChange({ ...value, [id]: next });
  if (collapsed)
    return (
      <aside className="ct-filter-rail" aria-label={title}>
        <button
          type="button"
          className="ct-filter-icon"
          aria-label="Expand filters"
          aria-expanded={false}
          onClick={() => onCollapsedChange?.(false)}
        >
          <PanelRightOpen size={15} />
        </button>
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
      <header>
        <Filter size={14} />
        <h3>{title}</h3>
        {active > 0 && <span className="ct-filter-count">{active}</span>}
        <div>
          {onCollapsedChange && (
            <button
              type="button"
              className="ct-filter-icon"
              aria-label="Collapse filters"
              aria-expanded={true}
              onClick={() => onCollapsedChange(true)}
            >
              <PanelRightClose size={14} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="ct-filter-icon"
              aria-label="Close filters"
              onClick={onClose}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </header>
      <ScrollArea label="Filter options" className="ct-filter-sidebar-scroll">
        <div className="ct-filter-sections">
          {filters.map((filter) => (
            <section key={filter.id}>
              <h4>{filter.label}</h4>
              {filter.type === "search" ? (
                <input
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
                      <label key={option.value}>
                        <input
                          type="checkbox"
                          checked={selected.includes(option.value)}
                          onChange={(e) =>
                            update(
                              filter.id,
                              e.target.checked
                                ? [...selected, option.value]
                                : selected.filter((v) => v !== option.value),
                            )
                          }
                        />
                        <span>{option.label}</span>
                        {option.count !== undefined && (
                          <small>{option.count}</small>
                        )}
                      </label>
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
          <span role="status">{resultCount} results</span>
        )}
        <button type="button" disabled={!active} onClick={() => onChange({})}>
          Reset filters
        </button>
      </footer>
    </aside>
  );
}
