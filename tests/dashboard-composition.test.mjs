import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import postcss from 'postcss';
import {Panel,Rows,Row,StateView,StatNote,StatNoteRow} from '../dist/contour/index.js';
const h=React.createElement;
const html=(component,props)=>renderToStaticMarkup(h(component,props));
const css=postcss.parse(fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8'));
function rule(selector){const out={};css.walkRules(node=>{if(node.selector===selector)node.walkDecls(d=>out[d.prop]=d.value);});return out;}
test('Dashboard Panel owns one shared browser header and one inset body, preserving semantic slots',()=>{
 const body=h(Rows,null,h(Row,{title:'Project One',description:'Planning'}));
 const out=html(Panel,{title:'Projects',description:'Current work',action:h('a',{href:'/projects'},'View all'),contentInset:'flush',children:body});
 assert.equal((out.match(/section-head/g)||[]).length,1);
 assert.equal((out.match(/ct-panel-content/g)||[]).length,1);
 assert.match(out,/data-content-inset="flush"/);assert.match(out,/href="\/projects"/);assert.match(out,/Project One/);
 assert.match(html(Panel,{title:'Default',children:'Body'}),/data-content-inset="default"/);
 assert.equal(rule('.arlab-contour .ct-panel[data-content-inset="flush"] > .section-head')['margin-bottom'],'0');
 assert.equal(rule('.arlab-contour .ct-panel[data-content-inset="flush"] > .ct-panel-content > :is(.lib-rows,.ct-ranked-list)')['margin-inline'],'0');
});
test('Compact embedded state preserves accessible error feedback and explicit actions without a nested frame',()=>{
 const out=html(StateView,{state:'error',size:'compact',variant:'embedded',title:'Projects unavailable',description:'Try again in a moment.',action:h('button',null,'Retry projects')});
 assert.match(out,/data-size="compact"/);assert.match(out,/data-variant="embedded"/);assert.match(out,/role="alert"/);
 assert.match(out,/aria-labelledby=/);assert.match(out,/aria-describedby=/);assert.match(out,/Retry projects/);
 assert.equal(rule('.arlab-contour .ct-state-view[data-variant="embedded"]')['box-shadow'],'none');
 assert.equal(rule('.arlab-contour .ct-state-view[data-size="compact"][data-variant="embedded"]')['padding'],'0');
 const regular=html(StateView,{});assert.match(regular,/data-size="regular"/);assert.match(regular,/data-variant="framed"/);
});
test('Compact loading still delegates to the single standard full-container loading component',()=>{
 const out=html(StateView,{state:'loading',size:'compact',variant:'embedded',title:'Loading projects'});
 assert.match(out,/Loading projects/);assert.match(out,/ct-content-loading-skeleton/);assert.doesNotMatch(out,/ct-state-view/);
});
test('StatNoteRow compact mobile mode is opt-in and retains every metric and status',()=>{
 const children=[1,2,3,4].map(n=>h(StatNote,{key:n,label:`Metric ${n}`,value:n,note:{tone:'warn',label:'Needs attention'},caption:'Your workspace'}));
 const out=html(StatNoteRow,{mobileLayout:'compact',children});assert.match(out,/data-mobile-layout="compact"/);
 for(let n=1;n<=4;n++)assert.match(out,new RegExp(`Metric ${n}`));
 assert.equal((out.match(/Needs attention/g)||[]).length,4);
 assert.match(html(StatNoteRow,{children}),/data-mobile-layout="stack"/);
 const selector='.arlab-contour .ct-stat-note-row[data-mobile-layout="compact"]';
 assert.equal(rule(selector)['grid-template-columns'],'repeat(2,minmax(0,1fr))');
 let media;css.walkRules(node=>{if(node.selector===selector)media=node.parent.params;});assert.equal(media,'(max-width:640px)');
});
test('Generic page grid does not stretch secondary modules to match the main stack',()=>{
 assert.equal(rule('.arlab-contour .lib-page-grid')['align-items'],'start');
});

test('Panel rhythm and borderless detail sections share semantic spacing roles',()=>{
 assert.equal(rule('.arlab-contour .lib-panel')['--panel-padding'],'var(--panel-inset-compact)');
 assert.equal(rule('.arlab-contour .ct-panel-content')['gap'],'var(--panel-body-gap)');
 const body=rule('.arlab-contour .ct-record-section-body');assert.equal(body.display,'flex');assert.equal(body.gap,'var(--panel-body-gap)');
 const header=rule('.arlab-contour .ct-panel.lib-panel > .section-head');assert.equal(header.padding,'var(--panel-header-block) var(--panel-padding)');
});
