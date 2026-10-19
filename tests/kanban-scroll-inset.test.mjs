import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
const css=postcss.parse(fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8'));
const props=selector=>{const result={};css.walkRules(rule=>{if(rule.parent.type==='root'&&rule.selectors.includes(`.arlab-contour ${selector}`))rule.walkDecls(decl=>result[decl.prop]=decl.value);});return result;};
test('Kanban gutters move with the columns and page bleed preserves the content inset',()=>{
  assert.equal(props('.ct-kanban-board').padding,'var(--ct-kanban-inset) 0');
  assert.equal(props('.ct-kanban-columns')['padding-inline'],'var(--ct-kanban-track-inset,var(--ct-kanban-inset))');
  assert.equal(props('.ct-kanban-board[data-inset="flush"]')['--ct-kanban-inset'],'0px');
  const bleed=props('.ct-kanban-board[data-bleed]');
  assert.equal(bleed['margin-inline'],'calc(-1 * var(--page-content-inset,0px))');
  assert.equal(bleed['max-width'],'none');
  assert.equal(bleed['--ct-kanban-track-inset'],'calc(var(--ct-kanban-inset) + var(--page-content-inset,0px))');
  assert.equal(props('.ct-page-padding-default')['--page-content-inset'],'var(--space-6)');
  assert.equal(props('.ct-page-padding-none')['--page-content-inset'],'0px');
});
