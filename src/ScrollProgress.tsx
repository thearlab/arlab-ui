import { useEffect, useRef, type RefObject } from 'react';

export interface ScrollProgressProps {
  /**
   * The element that actually scrolls. Leave it out and the bar follows the page.
   *
   * Pass it whenever the page is pinned to the viewport and an inner column scrolls instead -
   * a document-level bar there never moves, because the document never scrolls.
   */
  target?: RefObject<HTMLElement | null>;
}

/**
 * theARLab's scroll indicator, as thelabs.group runs it: native scrollbars hidden, a 3px
 * magenta line down the right edge that fills as you scroll.
 *
 * Without `target` it is fixed to the viewport. With one, it pins to that element's right edge,
 * so put it inside a `position: relative` parent of the scroller (an `.arlab-scroll-host`).
 *
 * The scroll handler is batched to one requestAnimationFrame, so a fast scroll costs one layout
 * read per frame rather than one per event.
 */
export function ScrollProgress({ target }: ScrollProgressProps) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = target?.current ?? null;
    const source: HTMLElement | Window = el ?? window;
    let queued = false;

    const update = () => {
      queued = false;
      const b = bar.current;
      if (!b) return;
      const d = el ?? document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      const p = max > 0 ? d.scrollTop / max : 0;
      b.style.transform = `scaleY(${p})`;
      // Nothing to scroll: no line at all, rather than a stub that looks like a stuck bar.
      b.style.opacity = max > 0 ? '1' : '0';
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };

    source.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Content arriving later (a grid filling in, a filter changing the list) changes how far
    // there is to scroll without any scroll event, so watch the size of the content too.
    const ro = el && 'ResizeObserver' in window ? new ResizeObserver(onScroll) : null;
    if (ro && el) { ro.observe(el); if (el.firstElementChild) ro.observe(el.firstElementChild); }
    update();

    return () => {
      source.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro?.disconnect();
    };
  }, [target]);

  return (
    <div
      ref={bar}
      className={target ? 'arlab-scroll-progress arlab-scroll-progress-local' : 'arlab-scroll-progress'}
      aria-hidden="true"
    />
  );
}
