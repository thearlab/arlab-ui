// Keyboard maths shared by every list-like control (menus, listboxes, tabs, radio groups, grids).
// Pure, so it is unit tested. RTL flips Left and Right for horizontal lists.

export type Orientation = 'horizontal' | 'vertical' | 'both';

export interface NextIndexOptions {
  orientation?: Orientation;
  loop?: boolean;
  rtl?: boolean;
  /** Indexes that cannot take focus (disabled items). */
  disabled?: (i: number) => boolean;
}

/** The index a key moves to in a list of `count` items, or null when the key is not a move key. */
export function nextIndex(current: number, key: string, count: number, o: NextIndexOptions = {}): number | null {
  const { orientation = 'vertical', loop = true, rtl = false, disabled = () => false } = o;
  if (count <= 0) return null;
  const horiz = orientation !== 'vertical', vert = orientation !== 'horizontal';
  let step: 1 | -1 | 0 = 0, jump: 'first' | 'last' | null = null;
  if (key === 'Home') jump = 'first';
  else if (key === 'End') jump = 'last';
  else if (vert && key === 'ArrowDown') step = 1;
  else if (vert && key === 'ArrowUp') step = -1;
  else if (horiz && key === 'ArrowRight') step = rtl ? -1 : 1;
  else if (horiz && key === 'ArrowLeft') step = rtl ? 1 : -1;
  else return null;
  if (jump) {
    const order = jump === 'first' ? range(count) : range(count).reverse();
    return order.find((i) => !disabled(i)) ?? null;
  }
  let i = current;
  for (let n = 0; n < count; n++) {
    i += step;
    if (i < 0 || i >= count) {
      if (!loop) return current < 0 ? null : current;
      i = (i + count) % count;
    }
    if (!disabled(i)) return i;
  }
  return null;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Type-ahead: the first label after `from` (wrapping) that starts with the typed text. */
export function typeahead(labels: string[], typed: string, from: number): number {
  const q = typed.toLocaleLowerCase();
  if (!q) return -1;
  // Repeating one letter cycles through the items that start with it.
  const same = q.split('').every((c) => c === q[0]);
  const needle = same ? q[0] : q;
  const start = same ? from + 1 : Math.max(from, 0);
  for (let n = 0; n < labels.length; n++) {
    const i = (start + n) % labels.length;
    if (labels[i].toLocaleLowerCase().startsWith(needle)) return i;
  }
  return -1;
}

/** Move an item inside a list (immutable). */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const out = list.slice();
  if (from < 0 || from >= out.length) return out;
  const [x] = out.splice(from, 1);
  out.splice(Math.max(0, Math.min(to, out.length)), 0, x);
  return out;
}

/** Shortcut text in the HIG order (⌃⌥⇧⌘), Mac symbols on Apple platforms, words elsewhere. */
export function shortcutLabel(keys: string, mac = isMac()): string {
  const parts = keys.split('+').map((k) => k.trim().toLowerCase());
  const order = ['ctrl', 'alt', 'shift', 'mod'];
  const mods = order.filter((m) => parts.includes(m));
  const rest = parts.filter((p) => !order.includes(p)).map((p) => (p.length === 1 ? p.toUpperCase() : p[0].toUpperCase() + p.slice(1)));
  const sym: Record<string, string> = mac ? { ctrl: '⌃', alt: '⌥', shift: '⇧', mod: '⌘' } : { ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift', mod: 'Ctrl' };
  return mac ? mods.map((m) => sym[m]).join('') + rest.join('') : [...mods.map((m) => sym[m]), ...rest].join('+');
}

export function isMac(): boolean {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}

/** Does a keyboard event match 'mod+k', 'shift+?', 'escape'? `mod` is ⌘ on Mac, Ctrl elsewhere. */
export function matchShortcut(e: { key: string; metaKey: boolean; ctrlKey: boolean; altKey: boolean; shiftKey: boolean }, keys: string, mac = isMac()): boolean {
  const parts = keys.toLowerCase().split('+');
  const key = parts[parts.length - 1];
  const want = { mod: parts.includes('mod'), ctrl: parts.includes('ctrl'), alt: parts.includes('alt'), shift: parts.includes('shift') };
  const mod = mac ? e.metaKey : e.ctrlKey;
  const ctrl = mac ? e.ctrlKey : false;
  if (want.mod !== mod || (mac && want.ctrl !== ctrl) || want.alt !== e.altKey) return false;
  if (key.length > 1 || /[a-z0-9]/.test(key)) { if (want.shift !== e.shiftKey) return false; }
  return e.key.toLowerCase() === key;
}

/** True when the event comes from a place that takes typing (so single-key shortcuts stay quiet). */
export function isTypingTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable;
}
