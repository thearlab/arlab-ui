import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import postcss from 'postcss';
import {CollectionLayout,CollectionWorkspace} from '../dist/contour/index.js';
const h=React.createElement;
const html=(component,props)=>renderToStaticMarkup(h(component,props));
test('Collection content mode scrolls results without moving the destination heading or tabs into its viewport',()=>{
 const out=html(CollectionLayout,{title:'Services',scroll:'content',tabs:h('nav',null,'Service tabs'),search:h('input',{'aria-label':'Search services'}),sidebar:()=>h('aside',null,'Service filters'),children:h('article',null,'Service cards')});
 assert.match(out,/data-scroll="content"/);assert.match(out,/aria-label="Services results"/);
 const viewport=out.indexOf('class="scroll-viewport"');assert.ok(viewport>out.indexOf('Service tabs'));assert.ok(viewport>out.indexOf('Search services'));
 assert.ok(out.indexOf('Service cards')>viewport);
 assert.ok(out.indexOf('Service filters')>out.indexOf('ct-collection-sidebar'));
 assert.equal((out.match(/class="scroll-viewport"/g)||[]).length,1);
});
test('Default collection mode does not add a scroll viewport around a result child that already owns one',()=>{
 const out=html(CollectionLayout,{title:'Projects',children:h('div',{className:'child-scroll-owner'},'Table rows')});
 assert.match(out,/data-scroll="child"/);assert.match(out,/child-scroll-owner/);
 assert.doesNotMatch(out,/ct-collection-results-scroll|scroll-viewport/);
});
test('Render-function children receive their filter action once inside the content scroll boundary',()=>{
 let calls=0;
 const out=html(CollectionLayout,{title:'People',scroll:'content',filters:h('input',{'aria-label':'Department'}),children:({filterTrigger})=>{calls++;return h('div',null,filterTrigger,'People cards');}});
 assert.equal(calls,1);assert.match(out,/People cards/);assert.match(out,/aria-expanded="false"/);assert.match(out,/aria-label="People results"/);
});
test('Content scrolling is local to collection results and does not wrap the selected detail pane',()=>{
 const out=html(CollectionWorkspace,{collectionMode:'condense',collection:h(CollectionLayout,{title:'Clients',scroll:'content',children:h('article',null,'Client cards')}),detail:h('article',null,'Full client details')});
 assert.match(out,/data-condensed="true"/);assert.match(out,/aria-label="Clients results"/);
 const detail=out.indexOf('class="ct-workspace-detail"');assert.ok(detail>out.indexOf('Client cards'));assert.ok(out.indexOf('Full client details')>detail);
 assert.equal((out.match(/class="scroll-viewport"/g)||[]).length,1);
});
test('Content ScrollArea has a bounded grid track and viewport, scoped to the opt-in results mode',()=>{
 const css=postcss.parse(fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8'));
 const rules={};css.walkRules(rule=>{rules[rule.selector]??={};rule.nodes.filter(n=>n.type==='decl').forEach(d=>rules[rule.selector][d.prop]=d.value);});
 assert.equal(rules['.arlab-contour .ct-collection-layout[data-scroll="content"] .ct-collection-results'].overflow,'hidden');
 assert.equal(rules['.arlab-contour .ct-collection-results-scroll']['grid-template-rows'],'minmax(0,1fr)');
 assert.equal(rules['.arlab-contour .ct-collection-results-scroll > .scroll-viewport'].height,'100%');
});
