// CardGrid has no holes and equal row heights: cols 2, 3, 4 x 1 to 9 cards, at a wide and a medium width.
// Needs Playwright (not a dependency): `npm i --no-save playwright && npx playwright install chromium`, then
// `node scripts/check-grid.mjs` after `npm run build`. Skips with a note when Playwright is missing.
import { readFileSync } from 'node:fs';
let chromium; try { ({ chromium } = await import('playwright')); } catch { console.log('skip  grid: Playwright not installed'); process.exit(0); }
const css = readFileSync(new URL('../dist/styles.css', import.meta.url), 'utf8');
const html = (w) => `<style>${css}</style>` + [2, 3, 4].flatMap((cols) => Array.from({ length: 9 }, (_, k) => `<div class="arlab-cgrid" data-cols="${cols}" data-last="stretch" data-n="${k + 1}" style="width:${w}px;margin:8px"><div class="arlab-cgrid-in">${Array.from({ length: k + 1 }, (_, i) => `<div>${'x<br>'.repeat(1 + (i % 3))}</div>`).join('')}</div></div>`)).join('');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1300, height: 900 } }); let fail = 0;
for (const w of [1100, 700]) {
  await p.setContent(html(w));
  const bad = await p.evaluate(() => [...document.querySelectorAll('.arlab-cgrid')].filter((g) => { const inn = g.firstChild, box = inn.getBoundingClientRect(), rows = {};
    for (const c of inn.children) { const r = c.getBoundingClientRect(); (rows[Math.round(r.top)] ||= []).push(r); }
    return Object.values(rows).some((row) => Math.abs(Math.max(...row.map((r) => r.right)) - box.right) > 1 || new Set(row.map((r) => Math.round(r.height))).size > 1); }).map((g) => `cols ${g.dataset.cols} x ${g.dataset.n}`));
  if (bad.length) { fail = 1; console.error(`FAIL  grid at ${w}px: ${bad.join(', ')}`); }
}
await b.close();
if (fail) process.exit(1); console.log('ok    grid: no holes, equal heights (cols 2-4 x 1-9, wide and medium)');
