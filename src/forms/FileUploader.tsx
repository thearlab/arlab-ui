'use client';
import { useEffect, useId, useRef, useState, type DragEvent } from 'react';
import { cx } from '../lib/cx';
import { bytes } from '../lib/format';
import { acceptWords, checkFiles } from '../lib/forms';
import { CheckCircleIcon, FileIcon, RefreshIcon, TrashIcon, UploadIcon } from '../core/icons';
import { IconButton } from '../core/IconButton';
import { Button } from '../core/Button';

export type UploadStatus = 'waiting' | 'uploading' | 'done' | 'error';
export interface UploadItem {
  id: string;
  name: string;
  size: number;
  type: string;
  /** 0 to 100 while uploading. */
  progress?: number;
  status: UploadStatus;
  error?: string;
  /** A preview or the uploaded file's address. */
  url?: string;
  file?: File;
}

export interface FileUploaderProps {
  /** "image/*,video/*,.pdf" */
  accept?: string;
  multiple?: boolean;
  /** Bytes. */
  maxSize?: number;
  maxFiles?: number;
  /** Uploads one file; call onProgress(0..100). Resolve with the stored URL, throw to fail (the
   * message is shown, with Retry). Without it the files are only listed (a form submits them). */
  upload?: (file: File, onProgress: (pct: number) => void) => Promise<string | void>;
  /** Controlled list. */
  items?: UploadItem[];
  /** Starting list when uncontrolled (files already attached). */
  defaultItems?: UploadItem[];
  onItemsChange?: (items: UploadItem[]) => void;
  /** What to drop, in words: "Drop images or videos here". */
  title?: string;
  /** Under the title: limits in plain words. Defaults to accept and size. */
  hint?: string;
  /** Show image and video previews (default true). */
  previews?: boolean;
  disabled?: boolean;
  /** Accessible name of the "Choose files" button's group. */
  label?: string;
  className?: string;
}

const isMedia = (t: string) => t.startsWith('image/') || t.startsWith('video/');

/** Drop files or choose them, with type, size and count checks in plain words, a list with sizes,
 * progress, remove and retry, and previews for pictures and videos. */
export function FileUploader({ accept, multiple = true, maxSize, maxFiles, upload, items, defaultItems, onItemsChange, title, hint, previews = true, disabled, label = 'Files', className }: FileUploaderProps) {
  const [inner, setInner] = useState<UploadItem[]>(defaultItems ?? []);
  const list = items ?? inner;
  const listRef = useRef(list); listRef.current = list;
  const setList = (fn: (l: UploadItem[]) => UploadItem[]) => { const next = fn(listRef.current); listRef.current = next; if (!items) setInner(next); onItemsChange?.(next); };
  const [errors, setErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const uid = useId();
  const urls = useRef<string[]>([]);
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const send = async (it: UploadItem) => {
    if (!upload || !it.file) return;
    const patch = (p: Partial<UploadItem>) => setList((l) => l.map((x) => (x.id === it.id ? { ...x, ...p } : x)));
    patch({ status: 'uploading', progress: 0, error: undefined });
    try { const url = await upload(it.file, (pct) => patch({ progress: Math.max(0, Math.min(100, pct)) })); patch({ status: 'done', progress: 100, ...(url ? { url } : {}) }); }
    catch (e) { patch({ status: 'error', error: (e as Error)?.message || 'The upload failed.' }); }
  };

  const take = (files: File[]) => {
    if (disabled) return;
    const r = checkFiles(multiple ? files : files.slice(0, 1), { accept, maxSize, maxFiles: multiple ? maxFiles : 1, current: multiple ? listRef.current.length : 0 });
    setErrors(r.errors);
    const added: UploadItem[] = r.ok.map((file, i) => {
      const url = previews && isMedia(file.type) ? URL.createObjectURL(file) : undefined;
      if (url) urls.current.push(url);
      return { id: `${uid}-${Date.now()}-${i}`, name: file.name, size: file.size, type: file.type, status: upload ? 'waiting' : 'done', url, file };
    });
    setList((l) => (multiple ? [...l, ...added] : added));
    added.forEach(send);
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); take(Array.from(e.dataTransfer.files)); };
  const limits = hint ?? [accept && `${acceptWords(accept)}`, maxSize && `up to ${bytes(maxSize)} each`, maxFiles && multiple && `${maxFiles} at most`].filter(Boolean).join(', ');

  return (
    <div className={cx('ar-upload', className)} role="group" aria-label={label}>
      <div
        className={cx('ar-drop', over && 'is-over', disabled && 'is-disabled')}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <span className="ar-drop-icon" aria-hidden="true"><UploadIcon size={22} /></span>
        <span className="ar-drop-title">{title ?? (multiple ? 'Drop files here' : 'Drop a file here')}</span>
        {limits && <span className="ar-drop-hint" id={`${uid}-hint`}>{limits[0]?.toUpperCase() + limits.slice(1)}.</span>}
        <Button size="sm" onClick={() => input.current?.click()} disabled={disabled} aria-describedby={limits ? `${uid}-hint` : undefined}>
          {multiple ? 'Choose files' : 'Choose a file'}
        </Button>
        <input ref={input} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => { take(Array.from(e.target.files ?? [])); e.target.value = ''; }} />
      </div>
      {!!errors.length && <ul className="ar-upload-errors" role="alert">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
      {!!list.length && (
        <ul className="ar-upload-list" aria-label="Chosen files">
          {list.map((it) => (
            <li key={it.id} className={cx('ar-upload-item', it.status === 'error' && 'is-error')}>
              <span className="ar-upload-thumb" aria-hidden="true">
                {it.url && it.type.startsWith('image/') ? <img src={it.url} alt="" /> : it.url && it.type.startsWith('video/') ? <video src={it.url} muted preload="metadata" /> : <FileIcon size={18} />}
              </span>
              <span className="ar-upload-info">
                <span className="ar-upload-name ar-truncate">{it.name}</span>
                <span className="ar-upload-meta">
                  {it.status === 'error' ? <span className="ar-upload-err">{it.error}</span>
                    : it.status === 'uploading' ? `Uploading, ${Math.round(it.progress ?? 0)}%`
                    : it.status === 'waiting' ? 'Waiting' : bytes(it.size)}
                </span>
                {it.status === 'uploading' && (
                  <span className="ar-upload-bar" role="progressbar" aria-label={`Uploading ${it.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(it.progress ?? 0)}>
                    <i style={{ width: `${it.progress ?? 0}%` }} />
                  </span>
                )}
              </span>
              {it.status === 'done' && upload && <CheckCircleIcon size={18} className="ar-upload-ok" role="img" aria-hidden={false} aria-label="Uploaded" />}
              {it.status === 'error' && upload && <IconButton size="sm" label={`Retry ${it.name}`} onClick={() => send(it)}><RefreshIcon size={16} /></IconButton>}
              <IconButton size="sm" label={`Remove ${it.name}`} disabled={disabled} onClick={() => setList((l) => l.filter((x) => x.id !== it.id))}><TrashIcon size={16} /></IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
