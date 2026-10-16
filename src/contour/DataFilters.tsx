import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  Search,
} from "lucide-react";
import { Dropdown } from "./ui.js";
import { ScrollArea } from "./scroll-area.js";

export interface FilterColumn<Row> {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "right" | "center";
  filterable?: boolean;
  options?: { value: string; label: string }[];
  value?: (row: Row) => string | number;
  render?: (row: Row) => ReactNode;
}
export interface FilterableTableProps<Row extends Record<string, unknown>> {
  title?: string;
  columns: FilterColumn<Row>[];
  rows: Row[];
  rowKey: keyof Row | ((row: Row) => string | number);
  pageSize?: number;
  pageSizes?: number[];
  loading?: boolean;
  emptyMessage?: string;
}
function ColumnFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options?: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = useId(),
    panel = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false),
    [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    const p = panel.current;
    if (!p) return;
    p.setAttribute("popover", "auto");
    const change = (e: Event) =>
      setOpen((e as ToggleEvent).newState === "open");
    p.addEventListener("toggle", change);
    return () => p.removeEventListener("toggle", change);
  }, []);
  const close = () => {
    panel.current?.hidePopover();
    trigger.current?.focus();
  };
  return (
    <>
      <button
        type="button"
        ref={trigger}
        className="ct-column-filter"
        aria-label={`Filter ${label}`}
        aria-expanded={open}
        aria-controls={id}
        data-active={!!value || undefined}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          const r = trigger.current!.getBoundingClientRect();
          setPosition({
            left: Math.max(8, Math.min(r.right - 260, window.innerWidth - 268)),
            top:
              r.bottom + 300 > window.innerHeight
                ? Math.max(8, r.top - 300)
                : r.bottom + 8,
          });
          panel.current?.showPopover();
          requestAnimationFrame(() =>
            panel.current?.querySelector<HTMLElement>("input,button")?.focus(),
          );
        }}
      >
        <Filter size={13} />
        {value && <span className="ct-filter-dot" />}
      </button>
      <div
        id={id}
        ref={panel}
        role="dialog"
        aria-label={`Filter ${label}`}
        className="ct-column-popover"
        style={position}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            close();
          }
        }}
      >
        <header>
          <strong>{label}</strong>
          <button
            type="button"
            className="ct-filter-icon"
            aria-label={`Close ${label} filter`}
            onClick={close}
          >
            <X size={13} />
          </button>
        </header>
        {options ? (
          <ScrollArea label={`${label} choices`} maxHeight={220}>
            <div className="ct-column-options">
              <button
                type="button"
                aria-pressed={!value}
                onClick={() => onChange("")}
              >
                All values
              </button>
              {options.map((o) => (
                <button
                  type="button"
                  key={o.value}
                  aria-pressed={value === o.value}
                  onClick={() => onChange(value === o.value ? "" : o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <label className="ct-filter-field">
            <span>Contains</span>
            <input
              aria-label={`Search ${label}`}
              value={value}
              placeholder={`Filter ${label.toLowerCase()}…`}
              onChange={(e) => onChange(e.target.value)}
            />
          </label>
        )}
        <footer>
          <button type="button" disabled={!value} onClick={() => onChange("")}>
            Clear
          </button>
          <button type="button" onClick={close}>
            Done
          </button>
        </footer>
      </div>
    </>
  );
}
export function FilterableTable<Row extends Record<string, unknown>>({
  title = "Records",
  columns,
  rows,
  rowKey,
  pageSize = 10,
  pageSizes = [10, 25, 50],
  loading,
  emptyMessage = "No results match these filters.",
}: FilterableTableProps<Row>) {
  const [filters, setFilters] = useState<Record<string, string>>({}),
    [page, setPage] = useState(1),
    [size, setSize] = useState(pageSize);
  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        columns.every((column) => {
          const filter = filters[column.key];
          if (!filter) return true;
          const raw = String(
            column.value ? column.value(row) : (row[column.key] ?? ""),
          ).toLocaleLowerCase();
          return column.options
            ? raw === filter.toLocaleLowerCase()
            : raw.includes(filter.toLocaleLowerCase());
        }),
      ),
    [rows, columns, filters],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / size)),
    current = Math.min(page, pages),
    active = Object.values(filters).filter(Boolean).length,
    start = (current - 1) * size;
  const clear = () => {
    setFilters({});
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
          <h3>{title}</h3>
          <span role="status">
            {filtered.length} {filtered.length === 1 ? "record" : "records"}
            {active
              ? ` · ${active} active ${active === 1 ? "filter" : "filters"}`
              : ""}
          </span>
        </div>
        {active > 0 && (
          <button type="button" onClick={clear}>
            Reset filters
          </button>
        )}
      </header>
      <ScrollArea label={`${title} table`} axis="both" maxHeight={520}>
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  style={{
                    width: column.width,
                    textAlign: column.align || "left",
                  }}
                >
                  <div className="ct-table-heading">
                    <span>{column.label}</span>
                    {column.filterable !== false && (
                      <ColumnFilter
                        label={column.label}
                        value={filters[column.key] || ""}
                        options={column.options}
                        onChange={(value) => {
                          setFilters((prev) => ({
                            ...prev,
                            [column.key]: value,
                          }));
                          setPage(1);
                        }}
                      />
                    )}
                  </div>
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
            ) : filtered.length ? (
              filtered.slice(start, start + size).map((row) => (
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
                    {active > 0 && (
                      <button type="button" onClick={clear}>
                        Clear filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ScrollArea>
      <footer>
        <span>
          {filtered.length
            ? `${start + 1}–${Math.min(start + size, filtered.length)} of ${filtered.length}`
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
