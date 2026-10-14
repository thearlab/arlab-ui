'use client';
// Behaviour every interactive component shares. One implementation each, so a fix lands everywhere.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { place, type Placement, type Placed } from '../lib/place';

const isBrowser = typeof window !== 'undefined';
export const useIsoLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

/** Controlled when `value` is given, uncontrolled otherwise. `onChange` fires either way. */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void): [T, (v: T) => void] {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const cb = useRef(onChange); cb.current = onChange;
  const set = useCallback((v: T) => { if (!controlled) setInner(v); cb.current?.(v); }, [controlled]);
  return [controlled ? (value as T) : inner, set];
}

// ---- The overlay stack: Escape and outside clicks close only the topmost open layer. ----
const stack: symbol[] = [];
export function isTopLayer(id: symbol) { return stack[stack.length - 1] === id; }

/** Register an open layer. Escape and a press outside `refs` call `onDismiss` when it is on top. */
export function useDismiss(open: boolean, onDismiss: () => void, refs: Array<RefObject<HTMLElement | null>>, opts: { outside?: boolean; escape?: boolean } = {}) {
  const { outside = true, escape = true } = opts;
  const cb = useRef(onDismiss); cb.current = onDismiss;
  const refsRef = useRef(refs); refsRef.current = refs;
  useEffect(() => {
    if (!open) return;
    const id = Symbol('layer');
    stack.push(id);
    const onKey = (e: KeyboardEvent) => { if (escape && e.key === 'Escape' && isTopLayer(id)) { e.stopPropagation(); cb.current(); } };
    const onDown = (e: PointerEvent) => {
      if (!outside || !isTopLayer(id)) return;
      const t = e.target as Node;
      if (refsRef.current.some((r) => r.current?.contains(t))) return;
      cb.current();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown, true);
    return () => {
      const i = stack.indexOf(id); if (i >= 0) stack.splice(i, 1);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown, true);
    };
  }, [open, outside, escape]);
}

const FOCUSABLE = 'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
export function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hasAttribute('inert') && el.getClientRects().length > 0);
}

/** Keep Tab inside `ref` while active; focus the first field (or `initial`) on open and give focus
 * back to whatever had it on close. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, initial?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const root = ref.current; if (!root) return;
    const before = document.activeElement as HTMLElement | null;
    const first = initial?.current ?? root.querySelector<HTMLElement>('[data-autofocus]') ?? focusables(root)[0] ?? root;
    (first as HTMLElement).focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = focusables(root); if (!list.length) { e.preventDefault(); return; }
      const a = list[0], z = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === root)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    root.addEventListener('keydown', onKey);
    return () => { root.removeEventListener('keydown', onKey); if (before && document.contains(before)) before.focus({ preventScroll: true }); };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps
}

let locks = 0;
/** Stop the page scrolling behind a modal (nested modals count). */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const el = document.documentElement;
    if (locks++ === 0) { el.style.setProperty('--ar-scrollbar', `${window.innerWidth - el.clientWidth}px`); el.dataset.arLocked = ''; }
    return () => { if (--locks === 0) delete el.dataset.arLocked; };
  }, [active]);
}

/** Place `floating` next to `anchor` and keep it there on scroll and resize. */
export function useAnchored(anchor: RefObject<HTMLElement | null>, floating: RefObject<HTMLElement | null>, open: boolean, placement: Placement = 'bottom-start', offset = 6): Placed | null {
  const [pos, setPos] = useState<Placed | null>(null);
  const update = useCallback(() => {
    const a = anchor.current, f = floating.current; if (!a || !f) return;
    const r = a.getBoundingClientRect();
    const rtl = getComputedStyle(a).direction === 'rtl';
    setPos(place(r, f.scrollWidth, f.scrollHeight, window.innerWidth, window.innerHeight, placement, offset, 8, rtl));
  }, [anchor, floating, placement, offset]);
  useIsoLayoutEffect(() => {
    if (!open) { setPos(null); return; }
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (floating.current) ro?.observe(floating.current);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => { ro?.disconnect(); window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [open, update]);
  return pos;
}

export function useMediaQuery(q: string, initial = false): boolean {
  const [m, setM] = useState(() => (isBrowser && window.matchMedia ? window.matchMedia(q).matches : initial));
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(q); setM(mq.matches);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Keep a mounted element around for an exit transition: `mounted` stays true `ms` after open goes false. */
export function usePresence(open: boolean, ms: number): { mounted: boolean; state: 'open' | 'closed' } {
  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<'open' | 'closed'>(open ? 'open' : 'closed');
  useEffect(() => {
    if (open) { setMounted(true); const r = requestAnimationFrame(() => requestAnimationFrame(() => setState('open'))); return () => cancelAnimationFrame(r); }
    setState('closed');
    const t = window.setTimeout(() => setMounted(false), ms);
    return () => window.clearTimeout(t);
  }, [open, ms]);
  return { mounted, state };
}

/** A global keyboard shortcut ('mod+k'). Skipped while typing unless `allowInInputs`. */
export { matchShortcut } from '../lib/keys';
