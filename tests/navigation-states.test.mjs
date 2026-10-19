import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import {satinLiftTokens} from '../dist/contour/satin-foundation.js';

const css=postcss.parse(fs.readFileSync(new URL('../dist/contour/navigation.css',import.meta.url),'utf8'));
const props=selector=>{const result={};css.walkRules(rule=>{if(rule.selectors.includes(selector)&&rule.parent.type!=='atrule')rule.walkDecls(decl=>result[decl.prop]=decl.value);});return result;};
test('both navigation columns share distinct rest, hover and persistent active fills in light and dark',()=>{
  for(const mode of ['light','dark']) {
    const tokens=satinLiftTokens(mode);
    const colors=[tokens.ground,tokens.nav,tokens['nav-hover-surface'],tokens['nav-active-surface']];
    assert.equal(new Set(colors).size,colors.length);
    assert.notEqual(tokens['nav-active-border'],tokens.line);
  }
  for(const item of ['.contour-navigation-item','.contour-space-control']) {
    const rest=props(item),hover=props(`${item}:hover:not(:disabled):not([aria-current="page"])`),active=props(`${item}[aria-current="page"]`);
    assert.equal(rest.background,'transparent');assert.equal(hover.background,'var(--cn-hover-surface)');
    assert.equal(active.background,'var(--cn-active-surface)');assert.equal(active.color,'var(--cn-accent)');
    assert.match(active['box-shadow'],/var\(--cn-active-edge\)/);
    assert.equal(props(`${item}:focus-visible`).outline,'1px solid var(--cn-accent)');
  }
  assert.equal(props('.contour-spaces-rail > footer')['border-top'],'0');
  assert.equal(props('.contour-dept-tile-compact').color,'var(--dept-tile-ink)');
});
test('departments retain solid identity at rest, metallic hover and a pink selected icon border',()=>{
 const tile=props('.contour-dept-tile-compact');assert.equal(tile.background,'var(--dept-tile-color)');assert.equal(tile.border,'1px solid var(--dept-tile-color)');
 for(const control of ['.contour-space-control[data-department]','.contour-navigation-item[data-department]']){
  const rest=props(`${control} .contour-dept-tile-compact`),hover=props(`${control}:hover:not(:disabled) .contour-dept-tile-compact`),active=props(`${control}[aria-current="page"]`),selected=props(`${control}[aria-current="page"] .contour-dept-tile-compact`);
  assert.equal(rest.color,'var(--department-ink)');assert.equal(rest['background-color'],'var(--department-color)');
  assert.equal(active.background,'transparent');assert.equal(active['box-shadow'],'none');
  assert.equal(selected['border-color'],'var(--cn-accent)');assert.equal(selected.outline,undefined);assert.match(hover['background-image'],/dept-solid-hover-gradient/);
  assert.equal(props(`${control}:focus-visible`)['outline-color'],'var(--cn-accent)');
 }
});
test('rail geometry, brands and labels share one transition without changing icon alignment',()=>{
 const rail=props('.contour-spaces-rail'),closed=props('.contour-shell[data-rail-collapsed] .contour-spaces-rail');
 assert.match(rail.transition,/flex-basis var\(--cn-rail-duration\) var\(--cn-rail-easing\),width var\(--cn-rail-duration\) var\(--cn-rail-easing\)/);
 assert.equal(closed.width,'var(--cn-rail-width)');assert.equal(closed['flex-basis'],'var(--cn-rail-width)');assert.equal(rail.overflow,'hidden');
 for(const label of ['.contour-space-name','.contour-rail-action-label'])assert.match(props(label).transition,/var\(--cn-rail-duration\) var\(--cn-rail-easing\)/);
 assert.match(props('.contour-rail-brand-variant').transition,/var\(--cn-rail-duration\) var\(--cn-rail-easing\)/);
 assert.equal(props('.contour-space-control').padding,'6px 11px');assert.equal(props('.contour-rail-action').padding,'6px 11px');
 assert.equal(props('.contour-rail-action[data-compact]')['justify-content'],undefined);
 const compactLabel=props('.contour-shell[data-rail-collapsed] .contour-spaces-list:not([data-mobile]) .contour-space-name');assert.equal(compactLabel.opacity,'0');assert.equal(compactLabel.display,undefined);
 const reduced=[];css.walkAtRules('media',rule=>{if(rule.params==='prefers-reduced-motion:reduce'||rule.params==='(prefers-reduced-motion:reduce)')reduced.push(rule.toString());});
 assert.match(reduced.join(''),/contour-rail-brand-variant/);assert.match(reduced.join(''),/contour-space-name/);assert.match(reduced.join(''),/transition:none/);
});
test('the tour stylesheet fades opacity only, leaving no positional travel in V2',()=>{
  const sheet=postcss.parse(fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8'));
  const relevant=[];sheet.walkRules(rule=>{if(rule.selector.includes('ct-guided-tour'))relevant.push(rule.toString());});
  const text=relevant.join('\n');
  assert.match(text,/transition:opacity/);assert.match(text,/data-phase="leaving"/);assert.match(text,/data-phase="entering"/);
  assert.doesNotMatch(text,/transition:(?:top|left|width|height)|translateY|ct-tour-appear/);
  assert.match(text,/prefers-reduced-motion|transition:none/);
});
