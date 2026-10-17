import { useRef, useState, useId, type ReactNode } from "react";
import { Upload, X, RefreshCw, Plus, Image as ImageIcon, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import {Input} from './BaseFields.js';
import {Button} from './ui.js';
export interface ElementProgressProps {
  value?: number;
  label: string;
  children: ReactNode;
  state?: "idle" | "loading" | "success" | "error";
  error?: string;
}
export function ElementProgress({
  value,
  label,
  children,
  state = "loading",
  error,
}: ElementProgressProps) {
  const progress =
    value === undefined
      ? undefined
      : Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div
      className="ct-element-progress"
      data-state={state}
      aria-busy={state === "loading" || undefined}
    >
      {children}
      {state === "loading" && (
        <div
          className="ct-element-progress-track"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span
            style={
              progress === undefined ? undefined : { width: `${progress}%` }
            }
            data-indeterminate={progress === undefined || undefined}
          />
        </div>
      )}
      {error && <small role="alert">{error}</small>}
    </div>
  );
}
export const InlineProgress = ElementProgress;
export interface MediaItem {
  id: string;
  name: string;
  src: string;
  type: "image" | "video" | "pdf" | "file";
  poster?: string;
  progress?: number;
  status?: "ready" | "uploading" | "error";
  error?: string;
}
export interface MediaGalleryProps {
  accept?: string;
  items: MediaItem[];
  onRemove?: (id: string) => void;
  /** Controlled ordering; first-item meaning remains application-owned. */
  onReorder?: (items:MediaItem[])=>void;
  caption?: (item:MediaItem,index:number)=>ReactNode;
  onReplace?: (id: string, file: File) => void;
  onRetry?: (id: string) => void;
  onOpen?: (item: MediaItem) => void;
  disabled?: boolean;
  emptyLabel?: string;
}
export function MediaGallery({
  items,
  onRemove,
  onReorder,
  caption,
  onReplace,
  onRetry,
  onOpen,
  disabled,
  emptyLabel = "No media added yet.",
  accept = "image/*,video/*",
}: MediaGalleryProps) {
  const replacement = useRef<HTMLInputElement>(null);
  const replacing = useRef<string | null>(null);
  const move=(from:number,to:number)=>{if(disabled||to<0||to>=items.length)return;const next=[...items];const [item]=next.splice(from,1);next.splice(to,0,item);onReorder?.(next);};
  return (
    <div className="ct-media-gallery">
      <input
        ref={replacement}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file && replacing.current) onReplace?.(replacing.current, file);
          event.target.value = "";
        }}
      />
      {!items.length && (
        <div className="ct-media-empty">
          <ImageIcon size={20} />
          <p>{emptyLabel}</p>
        </div>
      )}
      {items.map((item,index) => (
        <ElementProgress
          key={item.id}
          label={`Upload ${item.name}`}
          value={item.progress}
          state={
            item.status === "uploading"
              ? "loading"
              : item.status === "error"
                ? "error"
                : "idle"
          }
          error={item.error}
        >
          <figure className="ct-media-card">
            <div className="ct-media-thumbnail">
              {item.type === 'pdf' || item.type === 'file' ? (
                onOpen ? <button type="button" className="ct-control-action ct-media-document" disabled={disabled} onClick={()=>onOpen(item)} aria-label={`Open ${item.name}`}><FileText size={28}/><span>{item.type === 'pdf' ? 'PDF document' : 'File'}</span></button>
                  : <div className="ct-media-document"><FileText size={28}/><span>{item.type === 'pdf' ? 'PDF document' : 'File'}</span></div>
              ) : item.type === "video" ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  controls
                  preload="metadata"
                  aria-label={item.name}
                />
              ) : onOpen ? (
                <button
                  type="button"
                  className="ct-control-action ct-media-open"
                  disabled={disabled}
                  onClick={() => onOpen(item)}
                  aria-label={`Preview ${item.name}`}
                >
                  <img src={item.src} alt={item.name} />
                </button>
              ) : (
                <img src={item.src} alt={item.name} />
              )}
            </div>
            <figcaption>
              <span title={item.name}>{item.name}</span>
              {caption&&<small className="ct-media-caption">{caption(item,index)}</small>}
              {item.status === "uploading" && (
                <small>
                  {item.progress === undefined
                    ? "Uploading"
                    : `${Math.round(Math.max(0, Math.min(100, Number.isFinite(item.progress) ? item.progress : 0)))}%`}
                </small>
              )}
              <div>
                {onReorder&&<><button className="ct-control-action" type="button" disabled={disabled||index===0||items.some(entry=>entry.status==='uploading')} aria-label={`Move ${item.name} earlier`} onClick={()=>move(index,index-1)}><ChevronLeft size={13}/></button><button className="ct-control-action" type="button" disabled={disabled||index===items.length-1||items.some(entry=>entry.status==='uploading')} aria-label={`Move ${item.name} later`} onClick={()=>move(index,index+1)}><ChevronRight size={13}/></button></>}
                {item.status === "error" && onRetry && (
                  <button className="ct-control-action"
                    type="button"
                    disabled={disabled}
                    aria-label={`Retry ${item.name}`}
                    onClick={() => onRetry(item.id)}
                  >
                    <RefreshCw size={13} />
                  </button>
                )}
                {onReplace && (
                  <button className="ct-control-action"
                    type="button"
                    disabled={disabled || item.status === "uploading"}
                    aria-label={`Replace ${item.name}`}
                    onClick={() => {
                      replacing.current = item.id;
                      replacement.current?.click();
                    }}
                  >
                    <Upload size={13} />
                  </button>
                )}
                {onRemove && (
                  <button className="ct-control-action"
                    type="button"
                    disabled={disabled}
                    aria-label={`Remove ${item.name}`}
                    onClick={() => onRemove(item.id)}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </figcaption>
          </figure>
        </ElementProgress>
      ))}
    </div>
  );
}
export interface MediaUploadFieldProps extends MediaGalleryProps {
  kinds?: ('image'|'video'|'pdf'|'file')[];
  onLink?: (url: string) => void | Promise<void>;
  label: string;
  onFiles: (files: File[]) => void | Promise<void>;
  multiple?: boolean;
  maxSize?: number;
  hint?: string;
  error?: string;
}
export function MediaUploadField({
  label,
  onFiles,
  multiple = true,
  maxSize = 20 * 1024 * 1024,
  hint,
  error,
  disabled,
  kinds = ['image','video'],
  accept: suppliedAccept,
  onLink,
  ...gallery
}: MediaUploadFieldProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [dragging, setDragging] = useState(false);
  const [linkOpen,setLinkOpen] = useState(false), [link,setLink] = useState('');
  const accept = suppliedAccept ?? (kinds.includes('file') ? '' : kinds.map(kind=>kind==='pdf' ? 'application/pdf,.pdf' : `${kind}/*`).join(','));
  const fileLabel = kinds.includes('file') ? 'files' : kinds.map(kind=>kind==='pdf' ? 'PDF documents' : `${kind}s`).join(' or ');
  const accepts = (file: File) => !accept || accept.split(',').some(rule=>{
    const pattern=rule.trim().toLowerCase();
    return pattern.startsWith('.') ? file.name.toLowerCase().endsWith(pattern)
      : pattern.endsWith('/*') ? file.type.toLowerCase().startsWith(pattern.slice(0,-1))
      : file.type.toLowerCase() === pattern;
  });
  const receiveLink = async () => {
    if(disabled || busy || !onLink)return;
    let url: URL;
    try {url=new URL(link.trim());if(!['http:','https:'].includes(url.protocol))throw new Error();}
    catch {setMessage('Enter a valid http or https link.');return;}
    setMessage('');setBusy(true);
    try {await onLink(url.href);setLink('');setLinkOpen(false);}
    catch(reason) {setMessage(reason instanceof Error ? reason.message : 'Could not add this link. Please retry.');}
    finally {setBusy(false);}
  };
  const receive = async (files: File[]) => {
    if (disabled || busy) return;
    setMessage("");
    const allowed = multiple ? files : files.slice(0, 1);
    const invalid = allowed.filter(
      (file) => !accepts(file) || file.size > maxSize,
    );
    const accepted = allowed.filter((file) => !invalid.includes(file));
    if (invalid.length)
      setMessage(
        `${invalid.map((file) => file.name).join(", ")}: choose ${fileLabel} up to ${Math.round(maxSize / 1024 / 1024)} MB.`,
      );
    if (!accepted.length) return;
    setBusy(true);
    try {
      await onFiles(accepted);
    } catch (reason) {
      setMessage(
        reason instanceof Error
          ? reason.message
          : "Upload failed. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="ct-media-field">
      <div
        className={`file-card ${dragging ? "dragging" : ""} ${disabled ? "disabled" : ""}`}
      >
        <div className="file-card-head">
          <span className="file-card-icon">
            <ImageIcon size={20} />
          </span>
          <div>
            <h4>
              <label htmlFor={id}>{label}</label>
            </h4>
            <p>Add {fileLabel} to your project.</p>
          </div>
          <span className="quiet-tag">Media</span>
        </div>
        <input
          id={id}
          ref={input}
          type="file"
          accept={accept || undefined}
          multiple={multiple}
          disabled={disabled || busy}
          className="ct-sr-only"
          onChange={(event) => {
            void receive(Array.from(event.target.files || []));
            event.target.value = "";
          }}
        />
        <div
          className="file-drop-target ct-media-drop"
          data-dragging={dragging || undefined}
          aria-disabled={disabled || busy}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled && !busy) setDragging(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void receive(Array.from(event.dataTransfer.files));
          }}
        >
          <div className="document-outline" aria-hidden="true">
            <ImageIcon size={29} />
            <span>
              <Plus size={10} />
            </span>
          </div>
          <div>
            <strong>
              {busy
                ? "Adding your media…"
                : dragging
                  ? "Release to add your media"
                  : `Drop ${fileLabel} here`}
            </strong>
            <small>
              {hint || `Up to ${Math.round(maxSize / 1024 / 1024)} MB per file`}
            </small>
          </div>
          <Button
            disabled={disabled || busy}
            onClick={() => input.current?.click()}
          >
            Browse files
          </Button>
        </div>
        {onLink && <div className="ct-media-link">
          {!linkOpen ? <Button disabled={disabled || busy} onClick={()=>setLinkOpen(true)}>Add a link</Button>
            : <><label htmlFor={`${id}-link`}>File link</label><div><Input id={`${id}-link`} type="url" value={link} disabled={disabled||busy} placeholder="https://" onChange={event=>setLink(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();void receiveLink();}}}/><Button disabled={disabled||busy||!link.trim()} onClick={()=>void receiveLink()}>Add link</Button><Button disabled={busy} onClick={()=>{setLinkOpen(false);setLink('');setMessage('');}}>Cancel</Button></div></>}
        </div>}
        {(error || message) && (
          <div className="file-error" role="alert">
            {error || message}
          </div>
        )}
        <div className="file-card-foot">
          <span>
            {multiple ? "Multiple files supported" : "One file at a time"} ·
            {fileLabel} · Up to {Math.round(maxSize / 1024 / 1024)} MB
            each
          </span>
        </div>
      </div>
      {gallery.items.length > 0 && (
        <div className="ct-media-attached">
          <div className="ct-media-attached-heading">
            <strong>Attached media</strong>
            <span>
              {gallery.items.length}{" "}
              {gallery.items.length === 1 ? "file" : "files"}
            </span>
          </div>
          <MediaGallery {...gallery} accept={accept} disabled={disabled || busy} />
        </div>
      )}
    </div>
  );
}
