// WCAG contrast for the token pairs the components use, in light and dark. Fails (exit 1) under 4.5:1 for
// text, 3:1 for UI parts. Run: node scripts/contrast.mjs
import fs from 'fs';
const css = fs.readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const block = (start) => { const i = css.indexOf(start); return css.slice(i, css.indexOf('}', i)); };
const read = (src) => Object.fromEntries([...src.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const light = read(block(':root {')), dark = { ...light, ...read(block(':root[data-theme="dark"]')) };
const rgb = (v, bg) => {
  if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + [...v.slice(1)].map((c) => c + c).join('');
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  m = v.match(/rgba?\(([^)]+)\)/); if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(',').map(Number);
  return [r, g, b].map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
};
const lum = (c) => { const [r, g, b] = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const res = (t, v) => { while (t[v]?.startsWith('var(--')) v = t[v].slice(6, -1); return t[v]; };
const pairs = [
  ['ink', 'ground', 4.5], ['ink', 'raise', 4.5], ['ink-dim', 'ground', 4.5], ['ink-dim', 'raise', 4.5], ['ink-dim', 'sunken', 4.5],
  ['ink-faint', 'raise', 4.5], ['ink-faint', 'ground', 4.5], ['ink-faint', 'sunken', 4.5],
  ['action-ink', 'action', 4.5], ['action-ink', 'action-hover', 4.5], ['accent-deep', 'raise', 4.5], ['accent-deep', 'ground', 4.5],
  ['live', 'raise', 4.5], ['warn', 'raise', 4.5], ['crit', 'raise', 4.5], ['info', 'raise', 4.5],
  ['live', 'live-tint', 4.5], ['warn', 'warn-tint', 4.5], ['crit', 'crit-tint', 4.5], ['info', 'info-tint', 4.5], ['accent-deep', 'accent-tint', 4.5],
  ['accent', 'raise', 3], ['raise', 'backdrop', 1], ['ground', 'backdrop', 1],
];
let bad = 0;
for (const [name, t] of [['light', light], ['dark', dark]]) {
  for (const [fg, bg, min] of pairs) {
    const b = rgb(res(t, bg), [255, 255, 255]); const tint = res(t, bg).startsWith('rgba');
    const base = tint ? rgb(res(t, 'raise'), [0, 0, 0]) : b;
    const B = tint ? rgb(res(t, bg), base) : b, F = rgb(res(t, fg), B);
    const r = ratio(F, B); const ok = r >= min;
    if (!ok) bad++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(5)} ${fg.padEnd(12)} on ${bg.padEnd(11)} ${r.toFixed(2)}${min > 1 ? '' : ' (step)'}`);
  }
}
process.exit(bad ? 1 : 0);
