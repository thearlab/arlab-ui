import React, { useEffect, useId, useRef, useState } from "react";

// Keep the visible indicator short. Scrolling itself stays native.
export function scrollThumbMetrics(viewport, content, position) {
  const range = Math.max(0, content - viewport);
  const length = Math.min(
    28,
    Math.max(16, (viewport * viewport) / Math.max(content, 1)),
    viewport,
  );
  return {
    range,
    length,
    position: range
      ? (Math.max(0, Math.min(range, position)) / range) * (viewport - length)
      : 0,
    travel: Math.max(0, viewport - length),
    value: Math.max(0, Math.min(range, position)),
  };
}

/**
 * @param {{children: import('react').ReactNode, label?: string, height?: import('react').CSSProperties['height'], maxHeight?: import('react').CSSProperties['maxHeight'], axis?: 'vertical' | 'horizontal' | 'both', className?: string, contentClassName?: string, tabIndex?: number, hideScrollbar?: boolean, title?: import('react').ReactNode, description?: import('react').ReactNode, actions?: import('react').ReactNode, header?: import('react').ReactNode}} props
 */
export function ScrollArea({
  children,
  label,
  title,
  description,
  actions,
  header,
  height,
  maxHeight,
  axis = "vertical",
  className = "",
  contentClassName = "",
  tabIndex = 0,
  hideScrollbar = false,
}) {
  const framed = title != null || description != null || actions != null || header != null;
  const accessibleLabel = label ?? (typeof title === "string" ? title : "Scrollable content");
  const viewport = useRef(null),
    content = useRef(null),
    drag = useRef(null),
    id = useId();
  const [scrolling,setScrolling]=useState(false),[dragging,setDragging]=useState(false);
  const [metrics, setMetrics] = useState({
    vertical: scrollThumbMetrics(0, 0, 0),
    horizontal: scrollThumbMetrics(0, 0, 0),
  });
  useEffect(() => {
    const node = viewport.current;
    const measure = () =>
      setMetrics({
        vertical: scrollThumbMetrics(
          node.clientHeight,
          node.scrollHeight,
          node.scrollTop,
        ),
        horizontal: scrollThumbMetrics(
          node.clientWidth,
          node.scrollWidth,
          node.scrollLeft,
        ),
      });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(node);
    observer?.observe(content.current);
    let idle;
    const onScroll=()=>{
      measure();setScrolling(true);clearTimeout(idle);
      idle=setTimeout(()=>setScrolling(false),700);
    };
    node.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer?.disconnect();
      node.removeEventListener("scroll", onScroll);
      clearTimeout(idle);
      window.removeEventListener("resize", measure);
    };
  }, []);
  const thumb = (orientation) => {
    const m = metrics[orientation],
      vertical = orientation === "vertical";
    if (hideScrollbar || !m.range || (axis !== "both" && axis !== orientation)) return null;
    const property = vertical ? "scrollTop" : "scrollLeft";
    return (
      <button
        type="button"
        key={orientation}
        className={`scroll-thumb ${orientation}`}
        role="scrollbar"
        aria-label={`${accessibleLabel}: ${orientation} scroll`}
        aria-controls={id}
        aria-orientation={orientation}
        aria-valuemin={0}
        aria-valuemax={Math.round(m.range)}
        aria-valuenow={Math.round(m.value)}
        tabIndex={-1}
        style={
          vertical
            ? { height: m.length, top: m.position }
            : { width: m.length, left: m.position }
        }
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(true);
          drag.current = {
            start: vertical ? e.clientY : e.clientX,
            value: viewport.current[property],
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const delta = (vertical ? e.clientY : e.clientX) - drag.current.start;
          viewport.current[property] =
            drag.current.value + (delta * m.range) / Math.max(m.travel, 1);
        }}
        onPointerUp={(e) => {
          drag.current = null;setDragging(false);
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={()=>{drag.current=null;setDragging(false);}}
        onLostPointerCapture={() => {
          drag.current = null;setDragging(false);
        }}
        onKeyDown={(e) => {
          const amount =
            e.key === "Home"
              ? -m.range
              : e.key === "End"
                ? m.range
                : e.key === "PageDown"
                  ? vertical
                    ? viewport.current.clientHeight
                    : viewport.current.clientWidth
                  : e.key === "PageUp"
                    ? -(vertical
                        ? viewport.current.clientHeight
                        : viewport.current.clientWidth)
                    : ["ArrowDown", "ArrowRight"].includes(e.key)
                      ? 40
                      : ["ArrowUp", "ArrowLeft"].includes(e.key)
                        ? -40
                        : null;
          if (amount !== null) {
            e.preventDefault();
            e.stopPropagation();
            viewport.current[property] += amount;
          }
        }}
      />
    );
  };
  const scrollContent = <>
      <div className="scroll-viewport" ref={viewport} id={id} role="region" aria-label={accessibleLabel} tabIndex={tabIndex}>
        <div className={`scroll-content ${contentClassName}`} ref={content}>{children}</div>
      </div>
      {thumb("vertical")}
      {thumb("horizontal")}
    </>;
  return (
    <div
      className={`contour-scroll-area scroll-shell ${className}`}
      style={{ height, maxHeight }}
      data-axis={axis}
      data-scrolling={scrolling||undefined}
      data-dragging={dragging||undefined}
      data-framed={framed || undefined}
    >
      {framed && <header className="contour-scroll-header">
        {header ?? <div className="contour-scroll-heading">{title != null && <h3>{title}</h3>}{description != null && <p>{description}</p>}</div>}
        {actions != null && <div className="contour-scroll-actions">{actions}</div>}
      </header>}
      {framed ? <div className="contour-scroll-body">{scrollContent}</div> : scrollContent}
    </div>
  );
}
