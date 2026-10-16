import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  Check,
  X,
  Pencil,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Copy,
  Download,
} from "lucide-react";
export interface InlineEditProps {
  label: string;
  value: string;
  onSave: (value: string) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
}
export function InlineEdit({
  label,
  value,
  onSave,
  placeholder = "Add a value",
  disabled,
  required,
  maxLength,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false),
    [draft, setDraft] = useState(value),
    [saving, setSaving] = useState(false),
    [error, setError] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => {
    setEditing(false);
    requestAnimationFrame(() => trigger.current?.focus());
  };
  const save = async () => {
    if (required && !draft.trim()) {
      setError("This value is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(draft);
      close();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not save. Try again.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="ct-inline-edit">
      {!editing ? (
        <button
          type="button"
          ref={trigger}
          className="ct-edit-trigger"
          disabled={disabled}
          aria-label={`Edit ${label}`}
          onClick={() => {
            setDraft(value);
            setError("");
            setEditing(true);
          }}
        >
          <span>{value || placeholder}</span>
          <Pencil size={13} />
        </button>
      ) : (
        <div className="ct-edit-controls">
          <input
            aria-label={label}
            value={draft}
            autoFocus
            disabled={saving}
            maxLength={maxLength}
            aria-invalid={!!error}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void save();
              }
              if (event.key === "Escape" && !saving) close();
            }}
          />
          <button
            type="button"
            aria-label={`Save ${label}`}
            disabled={saving}
            onClick={() => void save()}
          >
            <Check size={13} />
          </button>
          <button
            type="button"
            aria-label={`Cancel editing ${label}`}
            disabled={saving}
            onClick={close}
          >
            <X size={13} />
          </button>
        </div>
      )}
      {saving && <small role="status">Saving…</small>}
      {error && <small role="alert">{error}</small>}
    </div>
  );
}
export interface ReorderItem {
  id: string;
  label: string;
  content?: ReactNode;
}
export interface ReorderListProps {
  label: string;
  items: ReorderItem[];
  onChange: (items: ReorderItem[]) => void;
  disabled?: boolean;
}
export function ReorderList({
  label,
  items,
  onChange,
  disabled,
}: ReorderListProps) {
  const dragging = useRef<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const move = (id: string, to: number) => {
    const from = items.findIndex((item) => item.id === id);
    if (from < 0 || to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    setAnnouncement(
      `${item.label} moved to position ${to + 1} of ${items.length}.`,
    );
  };
  return (
    <div className="ct-reorder">
      <ol aria-label={label}>
        {items.map((item, index) => (
          <li
            key={item.id}
            onDragOver={(event) => {
              if (!disabled && dragging.current) event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (!disabled && dragging.current) move(dragging.current, index);
              dragging.current = null;
            }}
          >
            <button
              type="button"
              className="ct-drag-handle"
              aria-label={`Drag ${item.label}. Use the move buttons to reorder with a keyboard.`}
              disabled={disabled}
              draggable={!disabled}
              onDragStart={(event) => {
                dragging.current = item.id;
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", item.id);
              }}
              onDragEnd={() => (dragging.current = null)}
            >
              <GripVertical size={14} />
            </button>
            <div>{item.content ?? item.label}</div>
            <button
              type="button"
              aria-label={`Move ${item.label} up`}
              disabled={disabled || index === 0}
              onClick={() => move(item.id, index - 1)}
            >
              <ArrowUp size={13} />
            </button>
            <button
              type="button"
              aria-label={`Move ${item.label} down`}
              disabled={disabled || index === items.length - 1}
              onClick={() => move(item.id, index + 1)}
            >
              <ArrowDown size={13} />
            </button>
          </li>
        ))}
      </ol>
      {items.length === 0 && <p>No items to arrange.</p>}
      <span className="ct-sr-only" role="status">
        {announcement}
      </span>
    </div>
  );
}
export interface PreviewFrameProps {
  title: string;
  src?: string;
  srcDoc?: string;
  viewport?: "desktop" | "tablet" | "mobile";
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  sandbox?: string;
}
export function PreviewFrame({
  title,
  src,
  srcDoc,
  viewport = "desktop",
  loading,
  error,
  onRetry,
  sandbox = "allow-scripts",
}: PreviewFrameProps) {
  return (
    <div
      className="ct-preview"
      data-viewport={viewport}
      aria-busy={loading || undefined}
    >
      {error ? (
        <div role="alert">
          <p>{error}</p>
          {onRetry && (
            <button type="button" onClick={onRetry}>
              Retry preview
            </button>
          )}
        </div>
      ) : (
        <>
          <iframe
            title={title}
            src={srcDoc === undefined ? src : undefined}
            srcDoc={srcDoc}
            sandbox={sandbox}
            referrerPolicy="no-referrer"
          />
          {loading && (
            <div className="ct-preview-loading" role="status">
              Loading preview…
            </div>
          )}
        </>
      )}
    </div>
  );
}
export interface EditorLayoutProps {
  title: string;
  toolbar?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onExit?: () => void;
  style?: CSSProperties;
}
export function EditorLayout({
  title,
  toolbar,
  sidebar,
  children,
  footer,
  onExit,
  style,
}: EditorLayoutProps) {
  return (
    <section className="ct-editor" aria-label={title} style={style}>
      <header>
        <strong>{title}</strong>
        <div>{toolbar}</div>
        {onExit && (
          <button type="button" aria-label="Close editor" onClick={onExit}>
            <X size={14} />
          </button>
        )}
      </header>
      <div className="ct-editor-workspace">
        <div className="ct-editor-preview">{children}</div>
        {sidebar && <aside aria-label="Editor properties">{sidebar}</aside>}
      </div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}
export interface CodeDisplayProps {
  imageSrc: string;
  link: string;
  label: string;
  kind?: "QR code" | "Snapcode";
  filename?: string;
  onDownload?: () => void | Promise<void>;
}
export function CodeDisplay({
  imageSrc,
  link,
  label,
  kind = "QR code",
  filename = "code.png",
  onDownload,
}: CodeDisplayProps) {
  const [message, setMessage] = useState(""),
    [failed, setFailed] = useState(false),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    setFailed(false);
    setMessage("");
  }, [imageSrc]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setMessage("Link copied.");
    } catch {
      setMessage("Could not copy. Select and copy the link below.");
    }
  };
  const download = async () => {
    setBusy(true);
    try {
      await onDownload?.();
      setMessage("Download requested.");
    } catch {
      setMessage("Download failed. Try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <figure className="ct-code">
      <div className="ct-code-image">
        {failed ? (
          <span role="alert">Code image unavailable.</span>
        ) : (
          <img
            key={imageSrc}
            src={imageSrc}
            alt={`${kind} for ${label}`}
            onLoad={() => setFailed(false)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <figcaption>
        <strong>{label}</strong>
        <span>{kind}</span>
      </figcaption>
      <div className="ct-code-actions">
        {onDownload ? (
          <button
            type="button"
            onClick={() => void download()}
            disabled={busy || failed}
          >
            <Download size={13} />
            Download
          </button>
        ) : (
          <a
            href={imageSrc}
            download={filename}
            aria-label={`Download ${kind}`}
          >
            <Download size={13} />
            Download
          </a>
        )}
        <button type="button" onClick={() => void copy()}>
          <Copy size={13} />
          Copy link
        </button>
      </div>
      <input
        aria-label={`${label} link`}
        readOnly
        value={link}
        onFocus={(event) => event.target.select()}
      />
      <small role="status">{message}</small>
    </figure>
  );
}
