import {GroupedReorderList, type GroupedReorderListProps} from "./GroupedReorderList.js";
import { Input } from "./BaseFields.js";
import { ScrollArea } from "./scroll-area.js";
import {
  useState,
  forwardRef,
  useCallback,
  type IframeHTMLAttributes,
  type SyntheticEvent,
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
          className="ct-control-action ct-edit-trigger"
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
          <Input
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
          <button className="ct-control-action"
            type="button"
            aria-label={`Save ${label}`}
            disabled={saving}
            onClick={() => void save()}
          >
            <Check size={13} />
          </button>
          <button className="ct-control-action"
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
export interface FlatReorderListProps {
  label: string;
  items: ReorderItem[];
  onChange: (items: ReorderItem[]) => void;
  disabled?: boolean;
}
export type ReorderListProps = FlatReorderListProps | GroupedReorderListProps;
export function ReorderList(props: ReorderListProps) {
  return "groups" in props ? <GroupedReorderList {...props}/> : <FlatReorderList {...props}/>;
}
function FlatReorderList({
  label,
  items,
  onChange,
  disabled,
}: FlatReorderListProps) {
  const list = useRef<HTMLOListElement>(null);
  const [drag, setDrag] = useState<{
    id: string;
    start: number;
    y: number;
    insert: number;
  } | null>(null);
  const [settled, setSettled] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const move = (id: string, to: number) => {
    const from = items.findIndex((item) => item.id === id);
    if (from < 0 || to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    setSettled(id);
    setAnnouncement(
      `${item.label} moved to position ${to + 1} of ${items.length}.`,
    );
  };
  useEffect(() => {
    if (!settled) return;
    const timer = setTimeout(() => setSettled(null), 220);
    return () => clearTimeout(timer);
  }, [settled]);
  useEffect(() => {
    if (disabled) setDrag(null);
  }, [disabled]);
  return (
    <div className="ct-reorder">
      <ol ref={list} aria-label={label} data-dragging={drag ? true : undefined}>
        {items.map((item, index) => (
          <li
            key={item.id}
            data-item-id={item.id}
            data-dragged={drag?.id === item.id || undefined}
            data-settled={settled === item.id || undefined}
            data-insertion={
              drag && drag.id !== item.id && drag.insert === index
                ? "before"
                : drag &&
                    drag.id !== item.id &&
                    drag.insert === items.length &&
                    index === items.length - 1
                  ? "after"
                  : undefined
            }
            style={
              drag?.id === item.id
                ? {
                    transform: `translateY(${drag.y - drag.start}px) scale(1.015)`,
                  }
                : undefined
            }
          >
            <button
              type="button"
              className="ct-control-action ct-drag-handle"
              aria-label={`Drag ${item.label}. Use the move buttons to reorder with a keyboard.`}
              disabled={disabled}
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                setDrag({
                  id: item.id,
                  start: event.clientY,
                  y: event.clientY,
                  insert: index,
                });
                setAnnouncement(
                  `Picked up ${item.label}. Drag to a new position.`,
                );
              }}
              onPointerMove={(event) => {
                if (!drag || drag.id !== item.id) return;
                const rows = Array.from(
                  list.current?.children || [],
                ) as HTMLElement[];
                let insert = items.length;
                for (let i = 0; i < rows.length; i++) {
                  if (items[i].id === item.id) continue;
                  const r = rows[i].getBoundingClientRect();
                  if (event.clientY < r.top + r.height / 2) {
                    insert = i;
                    break;
                  }
                }
                setDrag({ ...drag, y: event.clientY, insert });
              }}
              onPointerUp={(event) => {
                if (!drag) return;
                const from = items.findIndex((i) => i.id === drag.id);
                move(
                  drag.id,
                  Math.max(
                    0,
                    Math.min(
                      items.length - 1,
                      drag.insert > from ? drag.insert - 1 : drag.insert,
                    ),
                  ),
                );
                setDrag(null);
                if (event.currentTarget.hasPointerCapture(event.pointerId))
                  event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onPointerCancel={() => setDrag(null)}
              onLostPointerCapture={() => setDrag(null)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setDrag(null);
                  setAnnouncement("Reordering cancelled.");
                }
              }}
            >
              <GripVertical size={14} />
            </button>
            <span className="ct-reorder-position" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>{item.content ?? item.label}</div>
            <button className="ct-control-action"
              type="button"
              aria-label={`Move ${item.label} up`}
              disabled={disabled || index === 0}
              onClick={() => move(item.id, index - 1)}
            >
              <ArrowUp size={13} />
            </button>
            <button className="ct-control-action"
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
      {!items.length && <p>No items to arrange.</p>}
      <span className="ct-sr-only" role="status">
        {announcement}
      </span>
    </div>
  );
}

export interface PreviewOverlayState {
  loading: boolean;
  error?: string;
  viewport: "desktop" | "tablet" | "mobile";
}
export interface PreviewFrameProps extends Omit<IframeHTMLAttributes<HTMLIFrameElement>, 'title' | 'children' | 'loading'> {
  title: string;
  viewport?: "desktop" | "tablet" | "mobile";
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  /** Same-origin documents only. Cross-origin previews retain their normal height. */
  autoHeight?: boolean;
  onHeightChange?: (height: number) => void;
  /** App-owned overlay, rendered above the iframe and the built-in loading/error layer. */
  overlay?: ReactNode;
  renderOverlay?: (state: PreviewOverlayState) => ReactNode;
}
export const PreviewFrame = forwardRef<HTMLIFrameElement, PreviewFrameProps>(function PreviewFrame({
  title, src, srcDoc, viewport="desktop", loading=false, error, onRetry,
  sandbox="allow-scripts", autoHeight=false, onHeightChange, overlay, renderOverlay,
  onLoad, style, ...iframeProps
}, forwardedRef) {
  const frame = useRef<HTMLIFrameElement | null>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const [height,setHeight] = useState<number>();
  const heightCallback = useRef(onHeightChange);
  heightCallback.current = onHeightChange;
  const connect = useCallback((node: HTMLIFrameElement | null) => {
    if (!node) observer.current?.disconnect();
    frame.current=node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current=node;
  },[forwardedRef]);
  const measure = useCallback(() => {
    observer.current?.disconnect();
    if (!autoHeight) return;
    try {
      const doc = frame.current?.contentDocument;
      if (!doc?.documentElement || !doc.body) return;
      const resize = () => {
        const next = Math.max(doc.documentElement.scrollHeight,doc.body.scrollHeight,doc.body.offsetHeight);
        if (next <= 0) return;
        setHeight(previous => previous === next ? previous : next);
        heightCallback.current?.(next);
      };
      resize();
      if (typeof ResizeObserver !== 'undefined') {
        observer.current = new ResizeObserver(resize);
        observer.current.observe(doc.body);
        observer.current.observe(doc.documentElement);
      }
    } catch { /* Sandboxed and cross-origin documents cannot expose their height. */ }
  },[autoHeight]);
  useEffect(() => {
    setHeight(undefined);
    measure();
    return () => observer.current?.disconnect();
  },[src,srcDoc,autoHeight,error,measure]);
  const loaded = (event: SyntheticEvent<HTMLIFrameElement>) => {measure();onLoad?.(event);};
  return <div className="ct-preview" data-viewport={viewport} data-auto-height={autoHeight || undefined} aria-busy={loading || undefined}>
    {error ? <div role="alert"><p>{error}</p>{onRetry && <button className="ct-control-action" type="button" onClick={onRetry}>Retry preview</button>}</div> : <>
      <iframe {...iframeProps} ref={connect} title={title} src={srcDoc === undefined ? src : undefined} srcDoc={srcDoc} sandbox={sandbox} referrerPolicy={iframeProps.referrerPolicy ?? 'no-referrer'} onLoad={loaded} style={{...style,...(autoHeight && height ? {height} : {})}}/>
      {loading && <div className="ct-preview-loading" role="status">Loading preview…</div>}
    </>}
    {(overlay || renderOverlay) && <div className="ct-preview-overlay">{overlay}{renderOverlay?.({loading,error,viewport})}</div>}
  </div>;
});
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
          <button className="ct-control-action" type="button" aria-label="Close editor" onClick={onExit}>
            <X size={14} />
          </button>
        )}
      </header>
      <ScrollArea
        label="Editor workspace"
        className="ct-editor-workspace"
        contentClassName="ct-editor-columns"
      >
        <div className="ct-editor-preview">{children}</div>
        {sidebar && <aside aria-label="Editor properties">{sidebar}</aside>}
      </ScrollArea>
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
      <figcaption>
        <span>{kind}</span>
        <strong>{label}</strong>
        <p>Scan to open, or share the link below.</p>
      </figcaption>
      <div className="ct-code-stage">
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
      </div>
      <div className="ct-code-destination">
        <label>
          Destination
          <Input
            aria-label={`${label} link`}
            readOnly
            value={link}
            onFocus={(event) => event.target.select()}
          />
        </label>
      </div>
      <div className="ct-code-actions">
        <button className="ct-control-action" type="button" onClick={() => void copy()}>
          <Copy size={13} />
          Copy link
        </button>
        {onDownload ? (
          <button className="ct-control-action"
            type="button"
            onClick={() => void download()}
            disabled={busy || failed}
          >
            <Download size={13} />
            {busy ? "Downloading…" : "Download code"}
          </button>
        ) : failed ? (
          <button className="ct-control-action" type="button" disabled>
            <Download size={13} />
            Download code
          </button>
        ) : (
          <a className="ct-control-action"
            href={imageSrc}
            download={filename}
            aria-label={`Download ${kind}`}
          >
            <Download size={13} />
            Download code
          </a>
        )}
      </div>
      {message && <small role="status">{message}</small>}
    </figure>
  );
}
