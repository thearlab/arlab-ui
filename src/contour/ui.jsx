import React, {
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  X,
  ChevronRight,
  ChevronDown,
  Check,
  Circle,
  AlertTriangle,
  Clock3,
  Search,
  FileText,
  Upload,
  LockKeyhole,
} from "lucide-react";
import { ScrollArea } from "./scroll-area.js";

export function Button({ children, variant = "", className = "", ...props }) {
  return (
    <button type="button" className={`btn ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function IconButton({ label, children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`icon-btn ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      {children}
    </button>
  );
}
export function Logo({ small = false }) {
  return (
    <span className={`brand ${small ? "small" : ""}`}>
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M4 20 14 3l10 17M8 14h12M6 24h16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
        />
      </svg>
      <span>
        arlab<span className="brand-dot">.</span>
      </span>
    </span>
  );
}
export function Avatar({ initials = "AM", color = "lilac", name }) {
  return (
    <span className={`avatar ${color}`} aria-label={name}>
      {initials}
    </span>
  );
}
export function Status({ children, tone }) {
  const tones = {
    "In progress": "info",
    "In review": "warn",
    Planning: "quiet",
    Completed: "ok",
    Ready: "ok",
    Published: "ok",
    Failed: "bad",
    Running: "info",
  };
  const t = tone || tones[children] || "quiet";
  return (
    <span className={`status ${t}`}>
      <span className="status-dot" />
      {children}
    </span>
  );
}
export function SectionHead({ title, sub, children }) {
  return (
    <div className="section-head">
      <div>
        <h3>{title}</h3>
        {sub && <p>{sub}</p>}
      </div>
      {children}
    </div>
  );
}
export function TextAction({ children, ...props }) {
  return (
    <button className="text-action" {...props}>
      {children}
      <ChevronRight size={14} />
    </button>
  );
}
export function Meter({ value, label }) {
  return (
    <span className="meter-wrap">
      <span
        className="meter"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
      >
        <span style={{ width: `${value}%` }} />
      </span>
      <span>{value}%</span>
    </span>
  );
}
export function Modal({
  open,
  onClose,
  title,
  children,
  sheet = false,
  className = "",
}) {
  const ref = useRef(null),
    id = useId();
  useEffect(() => {
    const node = ref.current;
    if (open && !node.open) node.showModal();
    else if (!open && node.open) node.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`modal ${sheet ? "sheet" : ""} ${className}`}
      aria-labelledby={id}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="modal-head">
        <h2 id={id}>{title}</h2>
        <IconButton label="Close dialog" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </div>
      {open && <div className="modal-body">{children}</div>}
    </dialog>
  );
}
export function ProjectMark({ color = "sage", size = "" }) {
  return (
    <span className={`project-mark ${color} ${size}`} aria-hidden="true">
      <svg viewBox="0 0 44 44" fill="none">
        <path
          d="M10 32V20a12 12 0 0 1 24 0v12M16 32V20a6 6 0 0 1 12 0v12M10 25h24"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M22 8v27" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}
export function Notice({ tone = "info", children }) {
  return (
    <div className={`notice ${tone}`}>
      {tone === "warn" || tone === "bad" ? (
        <AlertTriangle size={17} />
      ) : tone === "ok" ? (
        <Check size={17} />
      ) : (
        <Circle size={16} />
      )}
      <div>{children}</div>
    </div>
  );
}
export function EmptyState({
  title = "Nothing here yet",
  description,
  children,
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Clock3 size={24} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}

export function FileUpload({
  onChange,
  maxSize = 10 * 1024 * 1024,
  disabled = false,
}) {
  const input = useRef(null),
    [file, setFile] = useState(null),
    [dragging, setDragging] = useState(false),
    [error, setError] = useState("");
  const accept = (f) => {
    setDragging(false);
    if (!f) return;
    if (!/\.(pdf|txt|md)$/i.test(f.name)) {
      setError("Choose a PDF, Markdown, or plain text document.");
      return;
    }
    if (f.size > maxSize) {
      setError(
        `This file is too large. Choose a document under ${Math.round(maxSize / 1024 / 1024)} MB.`,
      );
      return;
    }
    setFile(f);
    setError("");
    onChange?.(f);
    if (input.current) input.current.value = "";
  };
  return (
    <div
      className={`file-card ${dragging ? "dragging" : ""} ${disabled ? "disabled" : ""}`}
      role="group"
      aria-label="Document upload"
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (!disabled) {
          if (e.dataTransfer.files.length > 1) {
            setError("Add one document at a time.");
            setDragging(false);
          } else accept(e.dataTransfer.files[0]);
        }
      }}
    >
      <div className="file-card-head">
        <span className="file-card-icon">
          <FileText size={20} />
        </span>
        <div>
          <h4>Attach a document</h4>
          <p>A brief, a reference, or a little more context.</p>
        </div>
        <span className="quiet-tag">Optional</span>
      </div>
      <input
        ref={input}
        type="file"
        accept=".pdf,.md,.txt"
        hidden
        aria-label="Choose a document"
        disabled={disabled}
        onChange={(e) => accept(e.target.files?.[0])}
      />
      {file ? (
        <div className="selected-file">
          <span className="file-format">
            {file.name.split(".").at(-1).toUpperCase()}
          </span>
          <div>
            <strong>{file.name}</strong>
            <span>
              {file.size < 1024 * 1024
                ? `${Math.max(1, Math.round(file.size / 1024))} KB`
                : `${(file.size / 1024 / 1024).toFixed(1)} MB`}
              <i />
              Selected on this device
            </span>
          </div>
          <IconButton
            label="Remove document"
            disabled={disabled}
            onClick={() => {
              setFile(null);
              setError("");
              onChange?.(null);
            }}
          >
            <X size={16} />
          </IconButton>
        </div>
      ) : (
        <div className="file-drop-target">
          <div className="document-outline" aria-hidden="true">
            <FileText size={29} />
            <span>
              <PlusSymbol />
            </span>
          </div>
          <div>
            <strong>
              {dragging
                ? "Release to add your document"
                : "Drop your document here"}
            </strong>
            <span>
              PDF, Markdown, or text. Up to {Math.round(maxSize / 1024 / 1024)}{" "}
              MB.
            </span>
          </div>
          <Button disabled={disabled} onClick={() => input.current?.click()}>
            Browse files
          </Button>
        </div>
      )}
      {error && (
        <div className="file-error" role="alert">
          <AlertTriangle size={15} />
          {error}
        </div>
      )}
      <div className="file-card-foot">
        <LockKeyhole size={12} />
        <span>Files stay on this device in the preview.</span>
        {file && (
          <button disabled={disabled} onClick={() => input.current?.click()}>
            Replace file
          </button>
        )}
      </div>
    </div>
  );
}
function PlusSymbol() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
      <path d="M4.5 1v7M1 4.5h7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Dropdown({
  children,
  options: supplied,
  value: controlled,
  defaultValue,
  onChange,
  placeholder = "Choose an option",
  searchable,
  disabled = false,
  name,
  className = "",
  "aria-label": label,
  "aria-invalid": invalid,
  "aria-describedby": describedBy,
  ...rest
}) {
  const options =
    supplied ||
    React.Children.toArray(children).map((child) => ({
      value: child.props.value ?? child.props.children,
      label: child.props.children,
      disabled: child.props.disabled,
    }));
  const [internal, setInternal] = useState(
      defaultValue ?? options.find((o) => !o.disabled)?.value ?? "",
    ),
    [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [active, setActive] = useState(0);
  const trigger = useRef(null),
    panel = useRef(null),
    list = useRef(null),
    search = useRef(null),
    buffer = useRef(""),
    timer = useRef(null),
    id = useId();
  const value = controlled ?? internal,
    selected = options.find((o) => String(o.value) === String(value)),
    withSearch = searchable ?? options.length >= 8;
  const filtered = options.filter((o) =>
    String(o.label).toLowerCase().includes(query.toLowerCase()),
  );
  const close = (focus = false) => {
    setOpen(false);
    setQuery("");
    if (focus) trigger.current?.focus();
  };
  const commit = (option) => {
    if (option.disabled) return;
    setInternal(option.value);
    onChange?.({
      target: { value: option.value, name },
      currentTarget: { value: option.value, name },
    });
    close(true);
  };
  useLayoutEffect(() => {
    if (!open) return;
    const p = panel.current;
    const position = () => {
      const r = trigger.current.getBoundingClientRect(),
        below = window.innerHeight - r.bottom - 12,
        above = r.top - 12,
        up = below < 220 && above > below;
      const height = Math.max(100, Math.min(304, up ? above : below));
      const width = Math.min(r.width, window.innerWidth - 24);
      p.style.width = `${width}px`;
      p.style.left = `${Math.max(12, Math.min(r.left, window.innerWidth - width - 12))}px`;
      p.style.maxHeight = `${height}px`;
      p.style.setProperty("--dropdown-height", `${height - 2}px`);
      p.style.top = up ? "auto" : `${r.bottom + 6}px`;
      p.style.bottom = up ? `${window.innerHeight - r.top + 6}px` : "auto";
    };
    if (p.showPopover) p.showPopover();
    position();
    const found = options.findIndex((o) => String(o.value) === String(value));
    setActive(Math.max(0, found));
    (withSearch ? search.current : list.current)?.focus();
    const outside = (e) => {
      if (!p.contains(e.target) && !trigger.current.contains(e.target))
        close(false);
    };
    const onScroll = (e) => {
      if (!(e.target instanceof Node) || !p.contains(e.target)) position();
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", onScroll, true);
      try {
        p.hidePopover?.();
      } catch {}
    };
  }, [open]);
  useEffect(() => {
    if (open)
      document
        .getElementById(`${id}-option-${active}`)
        ?.scrollIntoView?.({ block: "nearest" });
  }, [active, open, id]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const keyboard = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close(true);
      return;
    }
    if (e.key === "Tab") {
      close(false);
      return;
    }
    if (e.key === "Enter" || (!withSearch && e.key === " ")) {
      e.preventDefault();
      if (filtered[active]) commit(filtered[active]);
      return;
    }
    const available = filtered
      .map((o, i) => (o.disabled ? -1 : i))
      .filter((i) => i !== -1);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      if (!available.length) return;
      const index = available.indexOf(active);
      setActive(
        e.key === "Home"
          ? available[0]
          : e.key === "End"
            ? available.at(-1)
            : available[
                (index + (e.key === "ArrowDown" ? 1 : available.length - 1)) %
                  available.length
              ],
      );
      return;
    }
    if (!withSearch && e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      buffer.current += e.key.toLowerCase();
      clearTimeout(timer.current);
      timer.current = setTimeout(() => (buffer.current = ""), 500);
      const i = filtered.findIndex(
        (o) =>
          !o.disabled &&
          String(o.label).toLowerCase().startsWith(buffer.current),
      );
      if (i >= 0) setActive(i);
    }
  };
  return (
    <div className={`dropdown ${className}`}>
      {name && (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      )}
      <button
        {...rest}
        ref={trigger}
        type="button"
        className="dropdown-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={() => {
          if (open) close(false);
          else setOpen(true);
        }}
        onKeyDown={(e) => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span>{selected?.label || placeholder}</span>
        <ChevronDown size={15} className={open ? "rotated" : ""} />
      </button>
      {open && (
        <div
          ref={panel}
          className="dropdown-panel"
          popover="manual"
          onKeyDown={keyboard}
        >
          <ScrollArea
            label={label || "Dropdown options"}
            maxHeight="var(--dropdown-height)"
            tabIndex={-1}
          >
            {withSearch && (
              <div className="dropdown-search">
                <Search size={15} />
                <input
                  ref={search}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  aria-label={`Search ${label || "options"}`}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={`${id}-list`}
                  aria-activedescendant={
                    filtered[active] ? `${id}-option-${active}` : undefined
                  }
                  autoComplete="off"
                  placeholder="Search options"
                />
              </div>
            )}
            <div
              ref={list}
              className="dropdown-options"
              role="listbox"
              id={`${id}-list`}
              aria-label={label || "Options"}
              tabIndex={withSearch ? undefined : -1}
              aria-activedescendant={
                filtered[active] ? `${id}-option-${active}` : undefined
              }
            >
              {filtered.map((o, i) => (
                <div
                  role="option"
                  id={`${id}-option-${i}`}
                  key={o.value}
                  aria-selected={String(o.value) === String(value)}
                  aria-disabled={o.disabled || undefined}
                  className={`dropdown-option ${active === i ? "highlighted" : ""}`}
                  onPointerMove={() => !o.disabled && setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    commit(o);
                  }}
                >
                  <span>
                    <strong>{o.label}</strong>
                    {o.description && <small>{o.description}</small>}
                  </span>
                  {o.count !== undefined && (
                    <span className="option-count">{o.count}</span>
                  )}
                  {String(o.value) === String(value) && <Check size={15} />}
                </div>
              ))}
              {!filtered.length && (
                <div className="dropdown-empty" role="status">
                  No options found.<span>Try a shorter search.</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
