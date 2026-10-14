// The visual and accessibility check. Starts the harness, then for every story (every state on its
// own page when the story is `isolate`) in light, dark and phone width:
//   - fails on a console error or an uncaught exception,
//   - fails on horizontal overflow of the page,
//   - runs axe (WCAG 2.2 A and AA) in light and dark and fails on any violation,
//   - saves a screenshot to tools/out/<story>[--<state>]--<mode>.png, plus a keyboard-focus shot.
// Writes tools/out/report.json and report.md. Usage: npm run test:visual [-- story-id ...]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, 'out');
const only = process.argv.slice(2);
// A full run starts clean; a run for some stories (parallel work) only replaces its own files.
if (!only.length) fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const reportName = only.length ? `report-${only[0]}` : 'report';
const axeSrc = fs.readFileSync(path.join(here, 'node_modules/axe-core/axe.min.js'), 'utf8');

const server = await createServer({ configFile: path.join(here, 'harness.vite.config.ts'), server: { port: 0, host: '127.0.0.1' }, logLevel: 'error' });
await server.listen();
const base = server.resolvedUrls.local[0].replace(/\/$/, '');
// Scrollbars are shown (classic, always-on) so the check sees them where a person with "always show
// scrollbars" would: headless Chrome hides them by default.
const browser = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const MODES = [
  { name: 'light', theme: 'light', viewport: { width: 1280, height: 860 } },
  { name: 'dark', theme: 'dark', viewport: { width: 1280, height: 860 } },
  { name: 'phone', theme: 'light', viewport: { width: 390, height: 844 }, mobile: true },
];

const ctxs = Object.fromEntries(await Promise.all(MODES.map(async (m) => [m.name, await browser.newContext({ viewport: m.viewport, deviceScaleFactor: 1, isMobile: !!m.mobile, hasTouch: !!m.mobile, reducedMotion: 'reduce' })])));
const first = await ctxs.light.newPage();
await first.goto(`${base}/#/`);
await first.waitForFunction(() => window.__STORIES__);
const all = await first.evaluate(() => window.__STORIES__);
await first.close();
const targets = all.filter((s) => !only.length || only.includes(s.id)).flatMap((s) => (s.isolate ? s.states.map((n, i) => ({ id: s.id, state: i, label: `${s.id}--${i}` })) : [{ id: s.id, label: s.id }]));

const results = [];
async function run(t, mode) {
  const page = await ctxs[mode.name].newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const url = `${base}/?theme=${mode.theme}#/${t.id}${t.state !== undefined ? '/' + t.state : ''}?theme=${mode.theme}`;
  await page.goto(url);
  await page.waitForSelector('.h-page');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const layout = await page.evaluate(() => {
    const out = [];
    const vw = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > vw + 1) out.push('the page scrolls sideways');
    const name = (el) => (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : el.tagName.toLowerCase()) + (el.textContent ? ` "${el.textContent.trim().slice(0, 30)}"` : '');
    const scrolls = (cs) => /(auto|scroll)/.test(cs.overflowX) || /(auto|scroll)/.test(cs.overflowY);
    const clips = (cs) => cs.overflowX !== 'visible' || cs.overflowY !== 'visible';
    const hiddenish = (el, cs) => cs.position === 'fixed' || cs.clipPath?.includes('inset(50%') || el.closest('.ar-visually-hidden, .ar-sr-only, .ar-skip-link, [data-clip-ok], [aria-hidden="true"]');
    const inFixed = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).position === 'fixed') return true; return false; };
    for (const el of document.querySelectorAll('.h-page *')) {
      if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.display === 'contents') continue;
      if (hiddenish(el, cs)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      // nearest clipping ancestor
      let p = el.parentElement, clip = null;
      while (p && p !== document.body) { const pcs = getComputedStyle(p); if (clips(pcs)) { clip = { el: p, cs: pcs }; break; } p = p.parentElement; }
      if (!clip && (r.right > vw + 1 || r.left < -1)) out.push(`past the window: ${name(el)}`);
      if (clip && !scrolls(clip.cs) && clip.cs.textOverflow !== 'ellipsis' && !inFixed(el)) {
        const c = clip.el.getBoundingClientRect();
        if (r.right > c.right + 2 || r.left < c.left - 2) out.push(`cut off by ${name(clip.el)}: ${name(el)}`);
      }
      // clipped text without an ellipsis
      if (!scrolls(cs) && el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1 && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
        if (cs.textOverflow !== 'ellipsis') out.push(`text does not fit: ${name(el)}`);
      }
      if (el.classList.contains('ar-scroll') && el.scrollWidth > el.clientWidth + 1) out.push(`a vertical scroll box scrolls sideways (its content is too wide): ${name(el)}`);
      // a scroller's bar must stay inside its rounded box
      const canScrollY = /(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1;
      const canScrollX = /(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1;
      if (canScrollY || canScrollX) {
        const rad = Math.max(...['borderTopRightRadius', 'borderBottomRightRadius', 'borderTopLeftRadius', 'borderBottomLeftRadius'].map((k) => parseFloat(cs[k]) || 0));
        if (rad > 8) out.push(`a rounded box scrolls itself (radius ${rad}px): scroll an inner viewport instead: ${name(el)}`);
        if (clip) {
          const c = clip.el.getBoundingClientRect(), cr = parseFloat(clip.cs.borderTopRightRadius) || 0;
          if (canScrollY && cr > 8 && r.right > c.right - 2 && (r.top < c.top + cr - 8 || r.bottom > c.bottom - cr + 8)) out.push(`the scrollbar reaches a rounded corner of ${name(clip.el)}: ${name(el)}`);
        }
      }
    }
    return [...new Set(out)].slice(0, 12);
  });
  const overflow = layout.length ? layout.join('; ') : null;
  let axe = [];
  if (mode.name !== 'phone') {
    await page.addScriptTag({ content: axeSrc });
    axe = await page.evaluate(async () => {
      const r = await window.axe.run(document.querySelector('.h-page'), {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
        rules: { region: { enabled: false }, 'page-has-heading-one': { enabled: false }, 'landmark-one-main': { enabled: false }, 'heading-order': { enabled: false }, 'landmark-unique': { enabled: false }, 'landmark-complementary-is-top-level': { enabled: false }, 'landmark-main-is-top-level': { enabled: false }, 'landmark-no-duplicate-main': { enabled: false } },
      });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n')[1]) }));
    });
  }
  await page.screenshot({ path: path.join(out, `${t.label}--${mode.name}.png`), fullPage: true });
  if (mode.name === 'light') {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(80);
    await page.screenshot({ path: path.join(out, `${t.label}--focus.png`), fullPage: true });
  }
  await page.close();
  results.push({ story: t.label, mode: mode.name, errors, overflow, axe });
}

// A small pool: 6 pages at a time.
const jobs = targets.flatMap((t) => MODES.map((m) => () => run(t, m)));
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => { while (next < jobs.length) { const j = jobs[next++]; try { await j(); } catch (e) { results.push({ story: '?', mode: '?', errors: [String(e)], overflow: null, axe: [] }); } } }));
await browser.close(); await server.close();

const failed = results.filter((r) => r.errors.length || r.overflow || r.axe.length);
fs.writeFileSync(path.join(out, reportName + '.json'), JSON.stringify(results, null, 1));
const md = ['# Visual and accessibility check', '', `${targets.length} pages x ${MODES.length} modes = ${results.length} runs, ${results.filter((r) => r.axe !== undefined && r.mode !== 'phone').length} axe runs. ${failed.length} failed.`, ''];
for (const r of failed) {
  md.push(`## ${r.story} (${r.mode})`);
  for (const e of r.errors) md.push(`- console: ${e.slice(0, 300)}`);
  if (r.overflow) md.push(`- horizontal overflow: ${r.overflow}`);
  for (const v of r.axe) md.push(`- axe ${v.id} (${v.impact}): ${v.help}\n  - ${v.nodes.join('\n  - ')}`);
}
fs.writeFileSync(path.join(out, reportName + '.md'), md.join('\n'));
console.log(md.slice(0, 3).join('\n'));
if (failed.length) { console.log(md.slice(4).join('\n').slice(0, 6000)); process.exit(1); }
