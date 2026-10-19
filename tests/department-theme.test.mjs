import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ContourProvider,SidebarShell,tokensFor,departmentThemeTokens} from '../dist/contour/index.js';

const h=React.createElement;
const spaces=[{id:'people',label:'Client services',dept:'clients-servicing'},{id:'build',label:'Engineering',dept:'Engineering'},{id:'site',label:'Website'}];
function luminance(hex){return hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);}
const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);

test('all department themes derive identities and readable action labels from the shared foundation',()=>{
 for(const mode of ['light','dark']) {
  const base=tokensFor('contour',mode);
  for(const department of ['creative','engineering','client','company','strategy']) {
   const theme=tokensFor('contour',mode,{department});
   assert.equal(theme.actionInk,'#FFFFFF');
   assert.equal(theme.accent,base[`dept-${department}`]);
   if(department==='company'){assert.equal(theme.action,base.action);assert.equal(theme.actionInk,base.actionInk);}
   else {assert.ok(contrast(theme.action,theme.actionInk)>=4.5);assert.ok(contrast(theme.link,theme.raise)>=4.5);assert.ok(contrast(theme.link,theme['nav-active-surface'])>=4.5);}
   for(const key of Object.keys(base).filter(key=>/^(dept-|chart-|ok|bad|warn|info|planning)/.test(key)))assert.equal(theme[key],base[key],key);
   for(const key of ['font-sans','font-display','font-mono','radius-control','radius-panel','button-height'])assert.equal(theme[key],base[key]);
  }
  assert.equal(base['dept-company'],base.accent);
  assert.equal(base['dept-creative'],base['chart-4']);
  for(const department of [null,undefined,'unknown','website'])assert.equal(tokensFor('contour',mode,{department}).accent,base.accent);
  assert.equal(departmentThemeTokens(mode,'clients-servicing').accent,base['dept-client']);
  assert.equal(departmentThemeTokens(mode,'strategy-growth').accent,base['dept-strategy']);
 }
});

test('shell selection themes descendants and nested portal providers; app spaces and opt-out reset to brand',()=>{
 for(const mode of ['light','dark']) {
  const render=(activeSpace,department)=>renderToStaticMarkup(h(ContourProvider,{mode,department:'company'},h(SidebarShell,{brand:'ARLAB',toolName:'Test',navigation:'Pages',spaces,activeSpace,department},h(ContourProvider,{className:'portal-proof'},'Dialog'))));
  const themed=render('people');
  assert.match(themed,/contour-shell[^>]*data-department-theme="client"/);
  assert.match(themed,/portal-proof[^>]*data-department-theme="client"/);
  assert.match(themed,new RegExp(`--accent:${tokensFor('contour',mode)['dept-client']}`));
  const reset=render('site');
  assert.doesNotMatch(reset,/portal-proof[^>]*data-department-theme=/);
  assert.match(reset,new RegExp(`--accent:${tokensFor('contour',mode).accent}`));
  assert.doesNotMatch(render('build',null),/contour-shell[^>]*data-department-theme=/);
  assert.match(render('build','strategy-growth'),/contour-shell[^>]*data-department-theme="strategy"/);
 }
});

test('approved sidebar rim has a fine reflective edge with no projecting or dark inset band',()=>{
 for(const mode of ['light','dark']) {
  const theme=tokensFor('contour',mode);
  assert.match(theme['shell-edge-shadow'],/inset 1px 0 0/);
  assert.doesNotMatch(theme['shell-edge-shadow'],/#000000|3px|5px|10px/);
  assert.doesNotMatch(theme['shell-header-shadow'],/#000000|3px|5px/);
 }
});
