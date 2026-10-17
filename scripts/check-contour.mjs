import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import * as ui from '../dist/contour/index.js';
const contract = JSON.parse(fs.readFileSync('docs/component-contract.json','utf8'));
const entries = Array.isArray(contract) ? contract : contract.components;
for (const entry of entries) {
  const component = ui[entry.name];
  assert.ok(typeof component === 'function' || (component && typeof component === 'object' && [Symbol.for('react.forward_ref'), Symbol.for('react.memo')].includes(component.$$typeof)), `${entry.name} exports a React component`);
}
assert.equal(ui.iconRegistry.length, 164);
assert.equal(new Set(ui.iconRegistry.map(({ name }) => name)).size, 164, 'Icon names are unique');
for (const name of ['Sparkles', 'Presentation', 'ShoppingCart', 'Megaphone', 'Building2', 'Handshake']) {
  assert.ok(ui.iconRegistry.some(entry => entry.name === name && entry.icon), `${name} is registered`);
}
let count = 0;
postcss.parse(fs.readFileSync('dist/contour/styles.css','utf8')).walkRules(rule => {
  for (let parent = rule.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return;
  }
  for (const selector of rule.selectors) assert.ok(selector.includes('.arlab-contour'), `Unscoped CSS: ${selector}`);
  count++;
});
console.log(`Verified ${entries.length} component exports, 164 icons and ${count} scoped CSS rules.`);

for (const file of ['navigation.css', 'scroll-area.css']) {
  const standalone = fs.readFileSync(`dist/contour/${file}`, 'utf8');
  assert.ok(!standalone.includes('.themed-preview') && !standalone.includes('.arlab-contour'), `${file} has no provider dependency`);
  postcss.parse(standalone).walkRules(rule => {
    for (const selector of rule.selectors) assert.ok(selector.includes('.contour-'), `Unscoped standalone selector: ${selector}`);
  });
}
console.log('Standalone navigation and scrollbar styles are isolated from application globals.');

for (const file of ['dashboard.css','record-layouts.css','infinite-table.css']) {
 postcss.parse(fs.readFileSync(`src/contour/${file}`,'utf8')).walkRules(rule=>{
  if (!/\.ct-(?:data-table|record-collection|infinite|table-)/.test(rule.selector)) return;
  rule.walkDecls(/^(font|font-size|font-weight|font-family)$/,decl=>{
   assert.ok(!/\b\d+(?:\.\d+)?(?:px|rem|em)\b/.test(decl.value),`Hardcoded table typography: ${file} ${rule.selector} ${decl.toString()}`);
  });
 });
}
console.log('Table typography uses shared role tokens without hardcoded font sizes.');
