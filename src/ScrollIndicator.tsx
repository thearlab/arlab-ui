'use client';

import { useEffect, useRef, useState } from 'react';

export interface ScrollIndicatorProps {
  /** How long the line stays after the last scroll, in ms. */
  idle?: number;
}

/** theARLab's scroll bar, for the whole app: mount it once. It follows whatever is scrolling (the page, a sidebar, a
 *  table, a sheet) and draws a 3px pink thumb stuck to that element's right edge, sized to what you can see and
 *  placed where you are, shown only while you scroll. Pair it with the `arlab-scroll-native-none` class on <html> to
 *  hide every native bar. Not interactive: the wheel, the trackpad and the keyboard scroll. */
/** Where the fading line is not drawn: lists, menus and pop-over panels, plus anything marked data-scroll-plain. */
export const PLAIN = '[role="listbox"], [role="menu"], .arlab-picker-panel, .arlab-popover-panel, .arlab-picker-list, [data-scroll-plain]';

export function ScrollIndicator({ idle = 900 }: ScrollIndicatorProps) {
  const [bar, setBar] = useState<{ left: number; top: number; height: number } | null>(null);
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    // Scroll events do not bubble, but they can be caught on the way down: one listener sees every scroller.
    const onScroll = (e: Event) => {
      const el = e.target === document || e.target === document.documentElement ? null : (e.target as HTMLElement);
      // Small pickers, menus and pop-overs keep a plain bar of their own (PLAIN below): no fading line there.
      if (el?.closest?.(PLAIN)) return;
      const r = el ? el.getBoundingClientRect() : { top: 0, right: window.innerWidth, height: window.innerHeight };
      const top = el ? el.scrollTop : window.scrollY, view = el ? el.clientHeight : window.innerHeight;
      const full = el ? el.scrollHeight : document.documentElement.scrollHeight;
      if (full - view < 4) return;                       // a sideways-only scroller: nothing to show vertically
      const size = Math.max(view / full, 0.06) * r.height;
      setBar({ left: r.right - 3, top: r.top + (top / (full - view)) * (r.height - size), height: size });
      setShown(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShown(false), idle);
    };
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => { document.removeEventListener('scroll', onScroll, { capture: true }); clearTimeout(timer.current); };
  }, [idle]);
  if (!bar) return null;
  return <div className={['arlab-scrollbar', shown ? 'on' : ''].filter(Boolean).join(' ')} aria-hidden="true" style={{ left: bar.left, top: bar.top, height: bar.height }} />;
}
