// Theme and accent. The person's choice is stored per browser; 'system' follows the OS setting
// (no attribute on <html>, the CSS media query decides). Call initTheme() before first paint.
import type { Accent } from '../tokens/tokens';
import { initScrollbars } from './scrollbars';

export type Theme = 'light' | 'dark' | 'system';
export type { Accent };
const THEME_KEY = 'arlab-theme';
const ACCENT_KEY = 'arlab-accent';
const EVENT = 'arlab-theme-change';

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string | null) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* private mode */ } };
const root = () => (typeof document === 'undefined' ? null : document.documentElement);

function apply(theme: Theme, accent: Accent) {
  const el = root(); if (!el) return;
  if (theme === 'system') el.removeAttribute('data-theme'); else el.setAttribute('data-theme', theme);
  if (accent === 'magenta') el.removeAttribute('data-accent'); else el.setAttribute('data-accent', accent);
}

/** Apply the stored theme and accent (or the product default accent) to <html>, and turn on the
 * scrollbar behaviour (thumbs show while a box scrolls). Call once before first paint. */
export function initTheme(opts: { accent?: Accent } = {}): { theme: Theme; accent: Accent } {
  const t = read(THEME_KEY);
  const theme: Theme = t === 'light' || t === 'dark' ? t : 'system';
  const a = read(ACCENT_KEY);
  const accent: Accent = a === 'violet' || a === 'magenta' ? a : opts.accent ?? 'magenta';
  apply(theme, accent);
  initScrollbars();
  return { theme, accent };
}

export function getTheme(): Theme {
  const v = root()?.getAttribute('data-theme');
  return v === 'light' || v === 'dark' ? v : 'system';
}
/** The theme actually showing: 'system' resolved through the OS setting. */
export function getResolvedTheme(): 'light' | 'dark' {
  const t = getTheme();
  if (t !== 'system') return t;
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function getAccent(): Accent { return root()?.getAttribute('data-accent') === 'violet' ? 'violet' : 'magenta'; }

export function setTheme(theme: Theme) {
  apply(theme, getAccent()); write(THEME_KEY, theme === 'system' ? null : theme);
  window.dispatchEvent(new Event(EVENT));
}
export function setAccent(accent: Accent) {
  apply(getTheme(), accent); write(ACCENT_KEY, accent);
  window.dispatchEvent(new Event(EVENT));
}
/** Subscribe to theme or accent changes made through setTheme / setAccent (any component). */
export function onThemeChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
  mq?.addEventListener('change', cb);
  return () => { window.removeEventListener(EVENT, cb); mq?.removeEventListener('change', cb); };
}
