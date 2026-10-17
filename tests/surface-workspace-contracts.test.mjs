import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import postcss from 'postcss';
import {Surface,Panel,Kbd,Calendar,SidebarShell,PageFrame} from '../dist/contour/index.js';
const html=(c,p)=>renderToStaticMarkup(React.createElement(c,p));
const read=name=>fs.readFileSync(new URL('../src/contour/'+name,import.meta.url),'utf8');
test('Surface preserves semantic elements and every Panel uses the same primitive',()=>{
 assert.match(html(Surface,{as:'a',href:'/docs',interactive:true,children:'Knowledge'}),/<a href="\/docs"[^>]*data-surface-interactive="true"/);
 assert.match(html(Surface,{as:'button',children:'Open'}),/type="button"/);
 assert.match(html(Panel,{title:'Team',children:'People'}),/class="ct-surface lib-panel ct-panel/);
 assert.match(html(Surface,{variant:'flush'}),/data-surface-variant="flush"/);
});
test('All approved framed surfaces share one paint declaration and foundation settings',()=>{
 const ast=postcss.parse(read('surfaces.css'));let frame;
 ast.walkRules(r=>{if(r.selector.includes('.lib-panel.ct-panel'))frame=r;});
 const p=Object.fromEntries(frame.nodes.filter(n=>n.type==='decl').map(n=>[n.prop,n.value]));
 assert.equal(p['border-radius'],'var(--surface-radius)');assert.equal(p['background-image'],'var(--surface-gradient)');assert.equal(p['background-clip'],'padding-box,border-box');assert.equal(p['box-shadow'],'var(--surface-elevation)');
 for(const name of ['.knowledge-glance','.ct-data-table','.ct-editor','.ct-code','.ct-event-calendar','.file-card','.modal','.ct-kanban-column'])assert.ok(frame.selector.includes(name),name);
 assert.match(read('surfaces.css'),/ct-data-table\[data-variant="flush"\]/);
});
test('Calendar has an optional bounded scroll area and flush surface without changing day selection',()=>{
 const out=html(Calendar,{month:'2026-10',height:400,fill:true,variant:'flush',value:'2026-10-17'});
 assert.match(out,/data-variant="flush"/);assert.match(out,/data-bounded="true"/);assert.match(out,/height:400px/);assert.match(out,/aria-label="Calendar dates and agenda"/);assert.match(out,/data-calendar-date="2026-10-17"[^>]*aria-pressed="true"/);
 assert.doesNotMatch(html(Calendar,{month:'2026-10'}),/data-bounded=/);
});
test('Bounded shell and non-scrolling PageFrame let inner panels own scrolling',()=>{
 const out=html(SidebarShell,{brand:'ARLAB',toolName:'Timesheets',navigation:'Tools',contentLayout:'fill',children:'Workspace'});
 assert.match(out,/data-content-layout="fill"/);
 assert.match(read('navigation.css'),/contour-shell-content,.contour-shell-secondary-content \{overscroll-behavior:contain/);
 const page=html(PageFrame,{scrollable:false,children:'Timeline'});assert.match(page,/ct-page-frame-fill/);assert.doesNotMatch(page,/scroll-viewport/);
});
test('Kbd uses the dedicated font role instead of hard-coded text sizing',()=>{
 assert.match(html(Kbd,{children:'Esc'}),/class="ct-kbd"/);
 const css=read('surfaces.css');assert.match(css,/font-size:var\(--text-kbd\)/);assert.match(css,/font-family:var\(--font-mono\)/);
});
test('Loading UI gradients animate independently while copy and reduced-motion mode remain stable',()=>{
 const css=read('library.css');
 assert.match(css,/@keyframes ct-loading-surface-sheen/);assert.match(css,/background-position:-180% 0,0 0,0 0/);
 assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/ct-loading-ellipsis/);
 assert.doesNotMatch(css,/ct-loading-placeholder-drift/);
});
test('Workspace save footer has its own padded, responsive layout rather than toolbar geometry',()=>{
 const css=read('library.css');
 assert.match(css,/\.ct-save-bar \{box-sizing:border-box;width:100%;min-width:0;flex-shrink:0;display:grid/);
 assert.match(css,/padding:var\(--space-3\) var\(--space-6\)/);assert.match(css,/\.ct-save-bar-actions > \.btn \{width:100%/);
 const source=read('library.jsx');assert.match(source,/ct-save-bar-actions/);
});
