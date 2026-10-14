'use client';
import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { useAnchored, useIsoLayoutEffect } from '../hooks';
import type { Placement } from '../lib/place';
import { Portal } from './Primitives';

export interface TooltipProps {
  /** Short text, a few words. Never the only place important information lives. */
  label: ReactNode;
  /** One focusable element (a button). It keeps its own accessible name. */
  children: ReactElement;
  placement?: Placement;
  /** Delay before showing on hover, ms. Focus shows it at once. */
  delay?: number;
  /** Link the tip as a description (aria-describedby). Off when the label already names the control. */
  describe?: boolean;
  disabled?: boolean;
}

/** A small label that appears on hover and keyboard focus, dismissed by Escape (WCAG 1.4.13). */
export function Tooltip({ label, children, placement = 'top', delay = 400, describe = true, disabled }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLElement | null>(null);
  const tip = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  const pos = useAnchored(anchor, tip, open, placement, 8);
  const show = (now = false) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(true), now ? 0 : delay); };
  const hide = () => { window.clearTimeout(timer.current); setOpen(false); };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };
    document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k);
  }, [open]);
  useIsoLayoutEffect(() => { if (disabled) hide(); }, [disabled]);
  if (!isValidElement(children)) return children;
  const p = children.props as Record<string, any>;
  const child = cloneElement(children as ReactElement<any>, {
    ref: (el: HTMLElement | null) => { anchor.current = el; const r = (children as any).ref; if (typeof r === 'function') r(el); else if (r) r.current = el; },
    'aria-describedby': describe && open ? [p['aria-describedby'], id].filter(Boolean).join(' ') : p['aria-describedby'],
    onPointerEnter: (e: any) => { p.onPointerEnter?.(e); if (e.pointerType === 'mouse' && !disabled) show(); },
    onPointerLeave: (e: any) => { p.onPointerLeave?.(e); hide(); },
    onFocus: (e: any) => { p.onFocus?.(e); if (!disabled && (e.target as HTMLElement).matches?.(':focus-visible')) show(true); },
    onBlur: (e: any) => { p.onBlur?.(e); hide(); },
    onPointerDown: (e: any) => { p.onPointerDown?.(e); hide(); },
  });
  return (
    <>
      {child}
      {open && (
        <Portal>
          <div ref={tip} id={id} role="tooltip" className="ar-tooltip" data-side={pos?.side}
            style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }} onPointerEnter={() => show(true)} onPointerLeave={hide}>
            {label}
          </div>
        </Portal>
      )}
    </>
  );
}
