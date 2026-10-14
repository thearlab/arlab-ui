// Shows a scroll box's thumb while it scrolls: sets data-scrolling on whatever scrolls (the <html>
// for the page) and clears it 800ms after the last scroll. One passive capture listener for the whole
// document, attribute writes only, no React renders and no layout reads, so it never lags.
let installed = false;
export function initScrollbars(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  const timers = new WeakMap<Element, number>();
  document.addEventListener('scroll', (e) => {
    const el = (e.target === document ? document.documentElement : e.target) as Element;
    if (!el || !(el instanceof Element)) return;
    if (!el.hasAttribute('data-scrolling')) el.setAttribute('data-scrolling', '');
    window.clearTimeout(timers.get(el));
    timers.set(el, window.setTimeout(() => el.removeAttribute('data-scrolling'), 800));
  }, { capture: true, passive: true });
}
