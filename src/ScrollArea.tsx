'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

/* The same component as @arlab/ui 2.0.0-beta.1 `scroll-area` (contour/scroll-area.jsx), typed: native scrolling with a
   short 2px indicator on the edge that can be dragged and keyboard-driven. Replace with the beta import when the
   consumer moves to the published v2 package. */

// Keep the visible indicator short. Scrolling itself stays native.
export function scrollThumbMetrics(viewport: number, content: number, position: number) {
  const range = Math.max(0, content - viewport);
  const length = Math.min(28, Math.max(16, (viewport * viewport) / Math.max(content, 1)), viewport);
  return {
    range,
    length,
    position: range ? (Math.max(0, Math.min(range, position)) / range) * (viewport - length) : 0,
    travel: Math.max(0, viewport - length),
    value: Math.max(0, Math.min(range, position)),
  };
}

export interface ScrollAreaProps {
  children: ReactNode;
  label?: string;
  height?: number | string;
  maxHeight?: number | string;
  axis?: 'vertical' | 'horizontal' | 'both';
  className?: string;
  contentClassName?: string;
  tabIndex?: number;
}

export function ScrollArea({ children, label = 'Scrollable content', height, maxHeight, axis = 'vertical', className = '', contentClassName = '', tabIndex = 0 }: ScrollAreaProps) {
  const viewport = useRef<HTMLDivElement>(null), content = useRef<HTMLDivElement>(null), drag = useRef<{ start: number; value: number } | null>(null), id = useId();
  const [metrics, setMetrics] = useState({ vertical: scrollThumbMetrics(0, 0, 0), horizontal: scrollThumbMetrics(0, 0, 0) });
  useEffect(() => {
    const node = viewport.current!;
    const measure = () => setMetrics({ vertical: scrollThumbMetrics(node.clientHeight, node.scrollHeight, node.scrollTop), horizontal: scrollThumbMetrics(node.clientWidth, node.scrollWidth, node.scrollLeft) });
    const observer = new ResizeObserver(measure);
    observer.observe(node); observer.observe(content.current!);
    node.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    return () => { observer.disconnect(); node.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); };
  }, []);
  const thumb = (orientation: 'vertical' | 'horizontal') => {
    const m = metrics[orientation], vertical = orientation === 'vertical';
    if (!m.range || (axis !== 'both' && axis !== orientation)) return null;
    const property = vertical ? 'scrollTop' : 'scrollLeft';
    return (
      <button
        type="button" key={orientation} className={`arlab-scroll-thumb ${orientation}`} role="scrollbar"
        aria-label={`${label}: ${orientation} scroll`} aria-controls={id} aria-orientation={orientation}
        aria-valuemin={0} aria-valuemax={Math.round(m.range)} aria-valuenow={Math.round(m.value)} tabIndex={-1}
        style={vertical ? { height: m.length, top: m.position } : { width: m.length, left: m.position }}
        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); drag.current = { start: vertical ? e.clientY : e.clientX, value: viewport.current![property] }; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { if (!drag.current) return; const delta = (vertical ? e.clientY : e.clientX) - drag.current.start; viewport.current![property] = drag.current.value + (delta * m.range) / Math.max(m.travel, 1); }}
        onPointerUp={(e) => { drag.current = null; e.currentTarget.releasePointerCapture(e.pointerId); }}
        onLostPointerCapture={() => { drag.current = null; }}
        onKeyDown={(e) => {
          const page = vertical ? viewport.current!.clientHeight : viewport.current!.clientWidth;
          const amount = e.key === 'Home' ? -m.range : e.key === 'End' ? m.range : e.key === 'PageDown' ? page : e.key === 'PageUp' ? -page : ['ArrowDown', 'ArrowRight'].includes(e.key) ? 40 : ['ArrowUp', 'ArrowLeft'].includes(e.key) ? -40 : null;
          if (amount !== null) { e.preventDefault(); e.stopPropagation(); viewport.current![property] += amount; }
        }}
      />
    );
  };
  return (
    <div className={`arlab-scroll-shell ${className}`} style={{ height, maxHeight }} data-axis={axis}>
      <div className="arlab-scroll-viewport" ref={viewport} id={id} role="region" aria-label={label} tabIndex={tabIndex}>
        <div className={`arlab-scroll-content ${contentClassName}`} ref={content}>{children}</div>
      </div>
      {thumb('vertical')}
      {thumb('horizontal')}
    </div>
  );
}
