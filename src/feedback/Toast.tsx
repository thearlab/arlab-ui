'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { IconButton } from '../core/IconButton';
import { Portal } from '../core/Primitives';
import { AlertTriangleIcon, CheckCircleIcon, CloseIcon, InfoCircleIcon, XCircleIcon } from '../core/icons';
import { cx } from '../lib/cx';

export type ToastTone = 'neutral' | 'ok' | 'warn' | 'bad' | 'info';
export interface ToastOptions {
  tone?: ToastTone;
  /** One action, usually Undo. Runs, then the toast closes. */
  action?: { label: string; onClick: () => void };
  /** ms before it goes; paused while hovered or focused. Default 5000, 8000 with an action, Infinity to stay. */
  duration?: number;
  /** Same id replaces the toast instead of stacking another. */
  id?: string;
}
interface Item extends ToastOptions { id: string; message: ReactNode }
export interface ToastApi {
  /** Show a toast; returns its id. */
  toast: (message: ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const Ctx = createContext<ToastApi | null>(null);
const ICON: Record<ToastTone, ReactNode> = { neutral: null, ok: <CheckCircleIcon />, warn: <AlertTriangleIcon />, bad: <XCircleIcon />, info: <InfoCircleIcon /> };
let seq = 0;

/** Wrap the app once. Toasts stack bottom right (bottom centre on phones), at most 3, announced
 * politely, paused while the pointer or focus is on them. */
export function ToastProvider({ children, max = 3 }: { children: ReactNode; max?: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [paused, setPaused] = useState(false);
  const dismiss = useCallback((id: string) => setItems((xs) => xs.filter((x) => x.id !== id)), []);
  const toast = useCallback((message: ReactNode, o: ToastOptions = {}) => {
    const id = o.id ?? `t${++seq}`;
    setItems((xs) => [...xs.filter((x) => x.id !== id), { ...o, id, message }].slice(-max));
    return id;
  }, [max]);
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  return (
    <Ctx.Provider value={api}>
      {children}
      <Portal>
        <section aria-label="Notifications" aria-live="polite" aria-relevant="additions text" className="ar-toasts"
          onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }}>
          <ol>
            {items.map((t) => <ToastRow key={t.id} t={t} paused={paused} onClose={() => dismiss(t.id)} />)}
          </ol>
        </section>
      </Portal>
    </Ctx.Provider>
  );
}

function ToastRow({ t, paused, onClose }: { t: Item; paused: boolean; onClose: () => void }) {
  const total = t.duration ?? (t.action ? 8000 : 5000);
  const left = useRef(total);
  useEffect(() => {
    if (paused || !Number.isFinite(total)) return;
    const start = Date.now();
    const timer = window.setTimeout(onClose, left.current);
    return () => { window.clearTimeout(timer); left.current -= Date.now() - start; };
  }, [paused, total, onClose]);
  const tone = t.tone ?? 'neutral';
  return (
    <li className={cx('ar-toast', `ar-toast--${tone}`)}>
      {ICON[tone] && <span className="ar-toast-icon" aria-hidden="true">{ICON[tone]}</span>}
      <span className="ar-toast-msg">{t.message}</span>
      {t.action && <button type="button" className="ar-toast-action" onClick={() => { t.action!.onClick(); onClose(); }}>{t.action.label}</button>}
      <IconButton size="sm" label="Dismiss notification" className="ar-toast-close" tip={false} onClick={onClose}><CloseIcon /></IconButton>
    </li>
  );
}

/** `const { toast } = useToast(); toast('Revoked the key', { action: { label: 'Undo', onClick: restore } })`.
 * Outside a provider it logs instead of throwing, so a missing provider never breaks a page. */
export function useToast(): ToastApi {
  return useContext(Ctx) ?? { toast: (m) => { console.warn('useToast: no ToastProvider', m); return ''; }, dismiss: () => {} };
}
