'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ScrollIndicatorProps {
  /** The element that scrolls. Called after the first render, so it can be a query. Omit for the window. */
  target?: () => HTMLElement | null;
  /** Where the line is drawn. Omit to pin it to the window's right edge; pass a positioned box (a sidebar) to pin it
   *  to that box's right edge instead. */
  host?: () => HTMLElement | null;
  /** How long the line stays after the last scroll, in ms. */
  idle?: number;
}

/** theARLab's scroll bar: a 3px pink thumb stuck to the edge, sized to what you can see and placed where you are,
 *  shown only while you scroll. Hide the native bar on the same element with `.arlab-scroll-none`. Not interactive:
 *  the wheel, the trackpad and the keyboard scroll; the line only shows where you are. */
export function ScrollIndicator({ target, host, idle = 900 }: ScrollIndicatorProps) {
  const [geo, setGeo] = useState<{ top: number; size: number } | null>(null);
  const [shown, setShown] = useState(false);
  const [box, setBox] = useState<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const el = target ? target() : null;
    const scroller: HTMLElement | Window = el || window;
    setBox(host ? host() : document.body);
    const measure = () => {
      const top = el ? el.scrollTop : window.scrollY;
      const view = el ? el.clientHeight : window.innerHeight;
      const full = el ? el.scrollHeight : document.documentElement.scrollHeight;
      if (full - view < 4) { setGeo(null); return; }
      const size = Math.max(view / full, 0.06);
      setGeo({ size, top: (top / (full - view)) * (1 - size) });
    };
    const onScroll = () => { measure(); setShown(true); clearTimeout(timer.current); timer.current = setTimeout(() => setShown(false), idle); };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    return () => { scroller.removeEventListener('scroll', onScroll); window.removeEventListener('resize', measure); clearTimeout(timer.current); };
  }, []);
  if (!geo || !box) return null;
  return createPortal(
    <div className={['arlab-scrollbar', host ? 'in-box' : '', shown ? 'on' : ''].filter(Boolean).join(' ')} aria-hidden="true">
      <div style={{ top: `${geo.top * 100}%`, height: `${geo.size * 100}%` }} />
    </div>,
    box,
  );
}
