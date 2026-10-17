import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import postcss from 'postcss';
import {ScrollArea} from '../dist/contour/scroll-area.js';
const render=props=>renderToStaticMarkup(React.createElement(ScrollArea,props));
test('plain ScrollArea preserves the unframed direct viewport primitive used by internal components',()=>{
 const html=render({height:240,label:'Records',children:'Rows'});
 assert.doesNotMatch(html,/data-framed|contour-scroll-header|contour-scroll-body/);
 assert.match(html,/<div class="contour-scroll-area scroll-shell "[^>]*><div class="scroll-viewport"/);
 assert.match(html,/role="region" aria-label="Records"/);
 assert.match(html,/height:240px/);
});
test('framed ScrollArea keeps its header outside the scrolling body and derives a usable region name',()=>{
 const html=render({title:'Activity',description:'Workspace updates',height:300,actions:React.createElement('button',{type:'button'},'Refresh'),children:'Rows'});
 assert.match(html,/data-framed="true"/);
 assert.match(html,/<h3>Activity<\/h3>/);
 assert.match(html,/<p>Workspace updates<\/p>/);
 assert.match(html,/<button type="button">Refresh<\/button>/);
 assert.match(html,/<\/header><div class="contour-scroll-body"><div class="scroll-viewport"/);
 assert.match(html,/role="region" aria-label="Activity"/);
 assert.match(html,/height:300px/);
});
test('custom header content and explicit region labels are application-owned',()=>{
 const html=render({header:React.createElement('strong',null,'Custom heading'),title:'Fallback title',label:'Recent projects',children:'Rows'});
 assert.match(html,/<strong>Custom heading<\/strong>/);
 assert.doesNotMatch(html,/<h3>Fallback title<\/h3>/);
 assert.match(html,/aria-label="Recent projects"/);
});
test('framed scroll geometry bounds the body while title rails share the selected panel finish',()=>{
 const ast=postcss.parse(fs.readFileSync(new URL('../src/contour/scroll-area.css',import.meta.url),'utf8'));
 function props(selector){const values={};ast.walkRules(rule=>{if(rule.selector===selector && rule.parent.type!=='atrule')rule.walkDecls(decl=>values[decl.prop]=decl.value);});return values;}
 const frame=props('.contour-scroll-area[data-framed]');assert.equal(frame.display,'flex');assert.equal(frame['flex-direction'],'column');assert.match(frame['border-radius'],/--radius-panel/);
 const body=props('.contour-scroll-body');assert.equal(body['min-height'],'0');assert.equal(body.flex,'1 1 auto');assert.equal(body['grid-template-rows'],'minmax(0,1fr)');
 const header=props('.contour-scroll-header');assert.equal(header.flex,'0 0 auto');assert.match(header['background-image'],/--chrome-subtle-gradient/);
 assert.equal(props('.contour-scroll-heading h3::before').background,'var(--accent,#E414DB)');
});
