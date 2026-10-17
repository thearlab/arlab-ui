import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
const build=fs.readFileSync(new URL('../scripts/build-contour.mjs',import.meta.url),'utf8');
const list=build.match(/const source = \[([^\]]+)\]/)[1];
const files=[...list.matchAll(/'([^']+\.css)'/g)].map(match=>match[1]);
const roots=files.map(file=>[file,postcss.parse(fs.readFileSync(new URL(`../src/contour/${file}`,import.meta.url),'utf8'))]);
const graphicShapes=new Set(['.swatches i','.meter','.space-dot','.agenda-line','.run-bars span','.semantic-swatch','.department-tokens i','.chart-token-strip > div','.switch-visual','.wireframe','.contour-title:before','.dept-tile > i','.lib-legend > i','.lib-skeleton > div > span:last-child','.lib-loading > div','.lib-columns > div > span','.lib-bar-list > div > span:nth-child(2)']);

test('every built Contour stylesheet uses the selected fonts and has no former purple foundation literals',()=>{
 assert.ok(files.length >= 16, "Audit follows the complete stylesheet build manifest");
 for(const[file,ast]of roots){
  assert.doesNotMatch(ast.toString(),/Manrope|IBM Plex|#201D25\b|#231F28\b|#29252F\b|#963b83\b|#e1dee7\b/i,file);
 }
});
test('component corners are semantic tokens; only explicit small graphics retain numeric rounding',()=>{
 for(const[file,ast]of roots)ast.walkDecls('border-radius',decl=>{
  if(!/^\d/.test(decl.value)||['0','50%','100%'].includes(decl.value))return;
  assert.ok(graphicShapes.has(decl.parent.selector),`${file} ${decl.parent.selector}: ${decl.value} must use a semantic corner token`);
 });
});
test('hover boundaries never fall back to the high-contrast strong color',()=>{
 for(const[file,ast]of roots)ast.walkDecls('border-color',decl=>{
  if(!decl.parent.selector?.includes(':hover'))return;
  assert.notEqual(decl.value,'var(--strong)',`${file} ${decl.parent.selector}`);
 });
});
test('remaining hard-coded dashboard foreground is the intentional neutral QR scanplate',()=>{
 const dashboard=roots.find(([file])=>file==='dashboard.css')[1];
 dashboard.walkDecls(decl=>{
  if(!['background','background-color','color','border-color'].includes(decl.prop)||!/#\w/.test(decl.value))return;
  assert.equal(decl.parent.selector,'.ct-code-image');assert.equal(decl.prop,'color');assert.equal(decl.value,'#1B1B1E');
 });
});
