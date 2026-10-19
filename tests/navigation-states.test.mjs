import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import {satinLiftTokens} from '../dist/contour/satin-foundation.js';

const css=postcss.parse(fs.readFileSync(new URL('../dist/contour/navigation.css',import.meta.url),'utf8'));
const props=selector=>{const result={};css.walkRules(rule=>{if(rule.selectors.includes(selector))rule.walkDecls(decl=>result[decl.prop]=decl.value);});return result;};
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
  assert.equal(props('.contour-dept-tile-compact').color,'var(--on-dept-solid,#fff)');
});
test('the tour stylesheet fades opacity only, leaving no positional travel in V2',()=>{
  const sheet=postcss.parse(fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8'));
  const relevant=[];sheet.walkRules(rule=>{if(rule.selector.includes('ct-guided-tour'))relevant.push(rule.toString());});
  const text=relevant.join('\n');
  assert.match(text,/transition:opacity/);assert.match(text,/data-phase="leaving"/);assert.match(text,/data-phase="entering"/);
  assert.doesNotMatch(text,/transition:(?:top|left|width|height)|translateY|ct-tour-appear/);
  assert.match(text,/prefers-reduced-motion|transition:none/);
});
