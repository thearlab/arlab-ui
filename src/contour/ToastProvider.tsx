import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import {IconButton} from './ui.js';
import {X, CheckCircle2, Info, AlertTriangle, CircleAlert} from 'lucide-react';

export interface ToastOptions {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  tone?: 'success' | 'info' | 'warning' | 'danger';
  /** Milliseconds of visible time. Zero keeps the notification until dismissed. */
  duration?: number;
  action?: {label: string; onClick: () => void};
}
export interface ToastRecord extends ToastOptions {id: string}
export interface ToastService {
  /** Returns the notification id. Passing an existing id updates it instead of duplicating it. */
  toast: (options: ToastOptions | string) => string;
  dismiss: (id: string) => void;
  clear: () => void;
  update: (id: string, options: Partial<ToastOptions>) => void;
}
const ToastContext = createContext<ToastService | null>(null);
export function useToast(): ToastService {
  const service = useContext(ToastContext);
  if (!service) throw new Error('useToast must be used within ToastProvider.');
  return service;
}
/** Pure FIFO update helper, also useful for testing application notification policies. */
export function enqueueToast(queue: ToastRecord[], item: ToastRecord): ToastRecord[] {
  return queue.some(existing => existing.id === item.id)
    ? queue.map(existing => existing.id === item.id ? {...existing,...item} : existing)
    : [...queue,item];
}
function Notification({item, dismiss, defaultDuration}: {item: ToastRecord; dismiss: (id: string) => void; defaultDuration: number}) {
  const [hovered,setHovered] = useState(false);
  const [focused,setFocused] = useState(false);
  const paused = hovered || focused;
  const [hidden,setHidden] = useState(false);
  const remaining = useRef(item.duration ?? defaultDuration);
  const duration = item.duration ?? defaultDuration;
  useEffect(() => {remaining.current = duration;}, [item, duration]);
  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener('visibilitychange',visibility);
    return () => document.removeEventListener('visibilitychange',visibility);
  },[]);
  useEffect(() => {
    if (paused || hidden || duration <= 0) return;
    const start = Date.now();
    const timer = setTimeout(() => dismiss(item.id),Math.max(0,remaining.current));
    return () => {clearTimeout(timer); remaining.current = Math.max(0,remaining.current-(Date.now()-start));};
  },[item,duration,paused,hidden,dismiss]);
  const Mark = {success:CheckCircle2,info:Info,warning:AlertTriangle,danger:CircleAlert}[item.tone ?? 'success'];
  return <div className="ct-queued-toast" data-tone={item.tone ?? 'success'} role={item.tone === 'danger' ? 'alert' : 'status'} aria-atomic="true"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={event => {if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);}}>
    <Mark size={16} aria-hidden="true"/><div className="ct-queued-toast-content">{item.title && <strong>{item.title}</strong>}{item.description && <span>{item.description}</span>}{item.action && <button type="button" className="ct-control-action" onClick={item.action.onClick}>{item.action.label}</button>}</div>
    <IconButton label="Dismiss notification" onClick={() => dismiss(item.id)}><X size={14}/></IconButton>
  </div>;
}
export interface ToastProviderProps {
  children: ReactNode;
  maxVisible?: number;
  duration?: number;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}
/** FIFO notifications. Waiting notifications start their timer only when displayed. */
export function ToastProvider({children,maxVisible=3,duration=5000,label='Notifications',position='bottom-right'}: ToastProviderProps) {
  const [queue,setQueue] = useState<ToastRecord[]>([]);
  const sequence = useRef(0);
  const prefix = useRef(`notification-${Math.random().toString(36).slice(2)}`);
  const toast = useCallback((options: ToastOptions | string) => {
    const item = typeof options === 'string' ? {title:options} : options;
    const id = item.id ?? `${prefix.current}-${++sequence.current}`;
    setQueue(queue => enqueueToast(queue,{...item,id}));
    return id;
  },[]);
  const dismiss = useCallback((id: string) => setQueue(queue => queue.filter(item => item.id !== id)),[]);
  const clear = useCallback(() => setQueue([]),[]);
  const update = useCallback((id: string, options: Partial<ToastOptions>) => setQueue(queue => queue.map(item => item.id === id ? {...item,...options,id} : item)),[]);
  const service = useMemo(() => ({toast,dismiss,clear,update}),[toast,dismiss,clear,update]);
  const limit = Number.isFinite(maxVisible) ? Math.max(1,Math.floor(maxVisible)) : 3;
  return <ToastContext.Provider value={service}>{children}<section className="ct-toast-viewport" data-position={position} aria-label={label}>
    {queue.slice(0,limit).map(item => <Notification key={item.id} item={item} dismiss={dismiss} defaultDuration={duration}/>)}
  </section></ToastContext.Provider>;
}
