import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
function declarations(file,selector){
 const ast=postcss.parse(fs.readFileSync(new URL(`../src/contour/${file}`,import.meta.url),'utf8'));
 const values={};ast.walkRules(rule=>{if(rule.selector===selector && rule.parent.type!=='atrule')rule.walkDecls(decl=>values[decl.prop]=decl.value);});return values;
}
test('Satin Lift surfaces and menus use separate shared geometry and semantic elevation',()=>{
 for(const[file,selector]of [['library.css','.lib-panel'],['library.css','.lib-collection-card'],['dashboard.css','.ct-data-table'],['calendar.css','.ct-event-calendar'],['styles.css','.modal']]){
  const props=declarations(file,selector);
  assert.equal(props['border-radius'],'var(--radius-panel)');
  assert.equal(props['background-image'],'var(--surface-gradient)');
  assert.equal(props['border-color'],'var(--surface-border-color)');
  assert.match(props['box-shadow'],/var\(--shadow-(surface|pop)\)/);
 }
 assert.equal(declarations('contour.css','.dropdown-panel')['border-radius'],'var(--radius-control)');
 assert.equal(declarations('dashboard.css','.ct-calendar')['border-radius'],'var(--radius-control)');
});
test('fields share a finish while embedded inputs retain their parent surface and discreet focus',()=>{
 for(const[file,selector]of [['library.css','.lib-input'],['library.css','.tag-input'],['contour.css','.dropdown-trigger'],['dashboard.css','.ct-temporal-trigger'],['styles.css','.search-field']]){
  const props=declarations(file,selector);
  assert.equal(props['background-image'],'var(--chrome-control-gradient)');
  assert.equal(props['box-shadow'],'var(--chrome-control-shadow)');
  assert.equal(props['border-color'],'var(--chrome-line)');
 }
 const embedded=declarations('library.css','.lib-input.ct-input-embedded');
 assert.equal(embedded.background,'transparent');assert.equal(embedded.border,'0');assert.equal(embedded['box-shadow'],'none');
 assert.equal(declarations('library.css','.lib-input:focus')['box-shadow'],'var(--chrome-control-shadow)');
 assert.equal(declarations('styles.css','.switch-visual').background,'var(--switch-off-track)');
 assert.equal(declarations('styles.css','.switch-visual')['border-color'],'var(--switch-off-border)');
});
test('icon controls keep their quiet perimeter in both states and preserve standardized dimensions',()=>{
 const rest=declarations('buttons.css','.icon-btn[data-button="icon"]');
 const hover=declarations('buttons.css','.icon-btn[data-button="icon"]:hover:not(:disabled)');
 assert.equal(rest.border,'1px solid var(--icon-rest-border)');
 assert.equal(hover['border-color'],'var(--icon-hover-border)');
 assert.equal(rest.width,'var(--button-height)');
 assert.equal(rest['min-width'],'var(--button-height)');
 assert.equal(hover['box-shadow'],'var(--icon-hover-shadow)');
});
test('panel title rails and row highlights extend to their frame without changing row content alignment',()=>{
 const heading=declarations('library.css','.ct-panel.lib-panel > .section-head');
 assert.match(heading.margin,/calc\(-1 \* var\(--panel-padding\)\)/);
 assert.equal(heading['border-bottom'],'1px solid var(--chrome-divider)');
 assert.equal(declarations('library.css','.ct-panel-content > .lib-rows')['margin-inline'],'calc(-1 * var(--panel-padding))');
 assert.equal(declarations('library.css','.ct-panel-content > .lib-rows > .lib-row')['padding-inline'],'var(--panel-padding)');
 assert.equal(declarations('dashboard.css','.ct-data-table tbody tr:hover > td').background,'var(--chrome-row-hover)');
 const built=fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8');
 assert.doesNotMatch(built,/visual-lab|data-workspace-style|vd-panel-inset/);
});

test('standalone navigation shares Urbanist, neutral charcoal and solid department fallbacks',()=>{
 const css=fs.readFileSync(new URL('../src/contour/navigation.css',import.meta.url),'utf8');
 assert.match(css,/"Urbanist"/);assert.doesNotMatch(css,/Manrope|#201D25|#231F28|#29252F/);
 for(const department of ['creative','engineering','client','company','strategy'])assert.ok(css.includes(`--dept-${department}-solid`));
 assert.match(css,/--radius-control, 7px/);
 assert.doesNotMatch(css,/visual-lab|\.arlab-contour|\.themed-preview/);
});
