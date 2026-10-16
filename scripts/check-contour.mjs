import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import * as ui from '../dist/contour/index.js';
const contract = JSON.parse(fs.readFileSync('docs/component-contract.json','utf8'));
const entries = Array.isArray(contract) ? contract : contract.components;
for (const entry of entries) assert.equal(typeof ui[entry.name], 'function', `${entry.name} exports`);
assert.equal(ui.iconRegistry.length, 145);
let count = 0;
postcss.parse(fs.readFileSync('dist/contour/styles.css','utf8')).walkRules(rule => {
  for (let parent = rule.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return;
  }
  for (const selector of rule.selectors) assert.ok(selector.includes('.arlab-contour'), `Unscoped CSS: ${selector}`);
  count++;
});
console.log(`Verified ${entries.length} component exports, 145 icons and ${count} scoped CSS rules.`);

for (const file of ['navigation.css', 'scroll-area.css']) {
  const standalone = fs.readFileSync(`dist/contour/${file}`, 'utf8');
  assert.ok(!standalone.includes('.themed-preview') && !standalone.includes('.arlab-contour'), `${file} has no provider dependency`);
  postcss.parse(standalone).walkRules(rule => {
    for (const selector of rule.selectors) assert.ok(selector.includes('.contour-'), `Unscoped standalone selector: ${selector}`);
  });
}
console.log('Standalone navigation and scrollbar styles are isolated from application globals.');
