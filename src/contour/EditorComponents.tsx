import {Button, IconButton, Modal} from "./ui.js";
import {ActionGroup} from "./CollectionWorkspace.js";
import {GroupedReorderList, type GroupedReorderListProps} from "./GroupedReorderList.js";
import { Input } from "./BaseFields.js";
import { ScrollArea } from "./scroll-area.js";
import {
  useState,
  useId,
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
  Monitor,
  Tablet,
  Smartphone,
  SlidersHorizontal,
  FileText,
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
export type EditorViewport = "desktop" | "tablet" | "mobile";
export interface EditorLayoutProps {
  title: string;
  description?: ReactNode;
  toolbar?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onExit?: () => void;
  style?: CSSProperties;
  viewport?: EditorViewport;
  defaultViewport?: EditorViewport;
  onViewportChange?: (viewport: EditorViewport) => void;
  showViewportControls?: boolean;
  propertiesLabel?: string;
  previewLabel?: string;
}
export function EditorLayout({
  title, description, toolbar, sidebar, children, footer, onExit, style,
  viewport: controlledViewport, defaultViewport="desktop", onViewportChange,
  showViewportControls=true, propertiesLabel="Properties", previewLabel="Live preview",
}: EditorLayoutProps) {
  const root = useRef<HTMLElement>(null);
  const [localViewport,setLocalViewport] = useState<EditorViewport>(defaultViewport);
  const [compact,setCompact] = useState(false);
  const [propertiesOpen,setPropertiesOpen] = useState(false);
  const propertiesId=useId();
  const viewport=controlledViewport ?? localViewport;
  useEffect(()=>{
    const node=root.current;
    if(!node)return;
    const measure=()=>setCompact(node.getBoundingClientRect().width<760);
    const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(measure);
    observer?.observe(node);window.addEventListener('resize',measure);measure();
    return()=>{observer?.disconnect();window.removeEventListener('resize',measure);};
  },[]);
  useEffect(()=>{if(!compact)setPropertiesOpen(false);},[compact]);
  const selectViewport=(next:EditorViewport)=>{
    if(controlledViewport===undefined)setLocalViewport(next);
    onViewportChange?.(next);
  };
  const viewports=[{value:'desktop' as const,label:'Desktop',icon:Monitor},{value:'tablet' as const,label:'Tablet',icon:Tablet},{value:'mobile' as const,label:'Phone',icon:Smartphone}];
  return <section className="ct-editor" ref={root} aria-label={title} style={style} data-viewport={viewport} data-compact={compact||undefined}>
    <header className="ct-editor-header">
      <div className="ct-editor-document"><span className="ct-editor-document-mark" aria-hidden="true"><FileText size={16}/></span><div><h2>{title}</h2>{description && <p>{description}</p>}</div></div>
      <div className="ct-editor-header-actions">{toolbar && <div className="ct-editor-toolbar">{toolbar}</div>}
        {showViewportControls && <ActionGroup label="Preview viewport">{viewports.map(({value,label,icon:Mark})=><IconButton key={value} label={label} aria-pressed={viewport===value} onClick={()=>selectViewport(value)}><Mark size={14}/></IconButton>)}</ActionGroup>}
        {sidebar && compact && <IconButton label={`Open ${propertiesLabel.toLowerCase()}`} aria-haspopup="dialog" aria-expanded={propertiesOpen} aria-controls={propertiesId} onClick={()=>setPropertiesOpen(true)}><SlidersHorizontal size={14}/></IconButton>}
        {onExit && <IconButton label="Close editor" onClick={onExit}><X size={14}/></IconButton>}
      </div>
    </header>
    <div className="ct-editor-workspace">
      <div className="ct-editor-stage"><div className="ct-editor-stage-heading"><span>{previewLabel}</span><span>{viewports.find(item=>item.value===viewport)?.label}</span></div>
        <ScrollArea label={`${title} preview`} className="ct-editor-preview" contentClassName="ct-editor-preview-content"><div className="ct-editor-canvas">{children}</div></ScrollArea>
      </div>
      {sidebar && !compact && <aside className="ct-editor-inspector" aria-label={propertiesLabel}><header><h3>{propertiesLabel}</h3></header><ScrollArea label={`${propertiesLabel} settings`} className="ct-editor-inspector-scroll" contentClassName="ct-editor-inspector-content">{sidebar}</ScrollArea></aside>}
    </div>
    {footer && <footer className="ct-editor-footer">{footer}</footer>}
    {sidebar && compact && <Modal open={propertiesOpen} onClose={()=>setPropertiesOpen(false)} title={propertiesLabel} sheet scrollable contentLabel={`${propertiesLabel} settings`}><div id={propertiesId}>{sidebar}</div></Modal>}
  </section>;
}
export interface CodeDisplayProps {
 imageSrc:string; link:string; label:string; kind?:"QR code"|"Snapcode"; filename?:string; onDownload?:()=>void|Promise<void>;
}
export function CodeDisplay({imageSrc,link,label,kind="QR code",filename="code.png",onDownload}:CodeDisplayProps) {
 const [message,setMessage]=useState(''),[failed,setFailed]=useState(false),[busy,setBusy]=useState(false),[copied,setCopied]=useState(false);
 useEffect(()=>{setFailed(false);setMessage('');setCopied(false);},[imageSrc,link]);
 useEffect(()=>{if(!copied)return;const timer=setTimeout(()=>setCopied(false),2500);return()=>clearTimeout(timer);},[copied]);
 const copy=async()=>{try{await navigator.clipboard.writeText(link);setCopied(true);setMessage('Link copied.');}catch{setMessage('Could not copy. Select and copy the destination link.');}};
 const download=async()=>{setBusy(true);try{await onDownload?.();setMessage('Download requested.');}catch{setMessage('Download failed. Try again.');}finally{setBusy(false);}};
 return <figure className="ct-code">
  <figcaption><span className="ct-code-kind">{kind}</span><strong>{label}</strong><p>Scan the code or share its destination link.</p></figcaption>
  <div className="ct-code-body"><div className="ct-code-stage"><div className="ct-code-image">{failed?<span role="alert">Code image unavailable.</span>:<img key={imageSrc} src={imageSrc} alt={`${kind} for ${label}`} onLoad={()=>setFailed(false)} onError={()=>setFailed(true)}/>}</div><span className="ct-code-scan-note">Scan to open</span></div>
   <div className="ct-code-details"><div className="ct-code-copy-heading"><strong>Ready to share</strong><p>Keep the code visible, or send the link directly.</p></div><label className="ct-code-destination">Destination<Input aria-label={`${label} link`} readOnly value={link} onFocus={event=>event.target.select()}/></label>
    <ActionGroup equalWidth label="Share code"><Button onClick={()=>void copy()}>{copied?<Check size={14}/>:<Copy size={14}/>}Copy link</Button>{onDownload?<Button onClick={()=>void download()} disabled={busy||failed}><Download size={14}/>{busy?'Downloading…':'Download code'}</Button>:<Button href={failed?undefined:imageSrc} download={filename} disabled={failed} aria-label={`Download ${kind}`}><Download size={14}/>Download code</Button>}</ActionGroup>
    <span className="ct-code-feedback" role="status" aria-live="polite">{message}</span>
   </div>
  </div>
 </figure>;
}
