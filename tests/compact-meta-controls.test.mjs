import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
const css=postcss.parse(fs.readFileSync(new URL('../src/contour/library.css',import.meta.url),'utf8'));
function props(selector){const values={};css.walkRules(rule=>{if(rule.selector===selector)rule.walkDecls(decl=>values[decl.prop]=decl.value);});return values;}
test('Timestamp keeps its intrinsic width inside both flex and grid layouts',()=>{
 const style=props('.lib-timestamp');
 assert.equal(style.display,'inline-flex');
 assert.equal(style.width,'max-content');
 assert.equal(style['max-width'],'100%');
 assert.equal(style['align-self'],'flex-start');
 assert.equal(style['justify-self'],'start');
 assert.equal(style.flex,'0 0 auto');
});
test('department labels are compact pills while department marks retain their own shape',()=>{
 const tile=props('.dept-tile');
 assert.equal(tile['min-height'],'26px');
 assert.equal(tile.padding,'3px 8px');
 assert.equal(tile['border-radius'],'var(--radius-control)');
 assert.equal(tile['font-size'],'var(--text-xs)');
 const mark=props('.dept-tile > i');assert.equal(mark.width,'6px');assert.equal(mark.flex,'0 0 6px');
});
test('embedded chip reset matches chip height without changing global button geometry',()=>{
 const reset=props('.ct-chip-reset');
 assert.equal(reset['min-height'],'28px');
 assert.equal(reset['border-radius'],'var(--radius-control)');
 assert.match(reset.font,/var\(--text-2xs\)/);
 assert.equal(reset['background-image'],'var(--chrome-control-gradient)');
 const buttons=fs.readFileSync(new URL('../src/contour/buttons.css',import.meta.url),'utf8');
 assert.match(buttons,/min-height:var\(--button-height\)/);
});
