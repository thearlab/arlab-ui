'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ToastItem {
  id: number;
  message: string;
  action?: ToastAction;
}
/** One button on the toast, usually Undo. Clicking it runs onClick and dismisses the toast. */
export interface ToastAction { label: string; onClick: () => void }

interface ToastContextValue {
  toast: (message: string, durationMs?: number, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

/** Wrap your app once (usually right inside <App/>) to enable useToast(). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, durationMs = 3200, action?: ToastAction) => {
    const id = nextId++;
    setItems((prev) => [...prev, { id, message, action }]);
    // A toast with an action stays longer, so there is time to reach the button.
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), action ? Math.max(durationMs, 6000) : durationMs);
  }, []);
  const dismiss = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div className="arlab-toast-viewport" aria-live="polite" aria-atomic="true">
              {items.map((t) => (
                <div className="arlab-toast" key={t.id}>
                  <span>{t.message}</span>
                  {t.action && <button type="button" className="arlab-toast-act" onClick={() => { t.action!.onClick(); dismiss(t.id); }}>{t.action.label}</button>}
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast() must be called inside a <ToastProvider>');
  return ctx;
}