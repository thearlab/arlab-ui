import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {SidebarShell,ArlabMark,DeptTile,NavigationItem} from '../dist/contour/index.js';
const props={brand:React.createElement(ArlabMark,{height:21}),toolName:'Studio',spaces:[{id:'creative',label:'Creative',dept:'creative'},{id:'website',label:'Website'}],activeSpace:'creative',navigation:'Tool navigation',children:'Workspace content',account:({collapsed})=>React.createElement('span',{'data-account-state':String(collapsed)},'Maya'),onHelp(){},onSettings(){}};
const render=extra=>renderToStaticMarkup(React.createElement(SidebarShell,{...props,...extra}));

test('spaces shell defaults to compact outer rail and keeps its inner navigation and account open',()=>{
 const html=render();assert.match(html,/data-rail-collapsed="true"/);assert.doesNotMatch(html,/data-panel-collapsed/);assert.doesNotMatch(html,/Collapse space navigation/);
 const rail=html.match(/<aside[^>]+class="contour-spaces-rail"[\s\S]*?<\/aside>/)[0];
 assert.match(rail,/viewBox="0 -48 842 842"/);assert.doesNotMatch(rail,/data-account-state/);
 assert.match(html,/<footer class="contour-space-panel-footer"><span data-account-state="false">Maya/);
 assert.doesNotMatch(rail,/aria-label="Help"/);assert.ok(rail.indexOf('aria-label="Settings"')<rail.indexOf('aria-label="Expand spaces rail"'));
});

test('expanded rail uses the supplied full wordmark and neutral glyph tiles separate from labels',()=>{
 const html=render({railCollapsed:false});assert.doesNotMatch(html,/data-rail-collapsed/);
 const rail=html.match(/<aside[^>]+class="contour-spaces-rail"[\s\S]*?<\/aside>/)[0];
 assert.match(rail,/viewBox="0 0 2003 630"/);assert.match(rail,/contour-dept-tile-compact/);assert.match(rail,/contour-rail-action-glyph/);assert.match(rail,/<span class="contour-space-name">Creative<\/span>/);
 assert.match(rail,/aria-label="Collapse spaces rail" aria-expanded="true"/);
});

test('explicit legacy visibility remains host-owned without reintroducing a fold control',()=>{
 const html=render({panelCollapsed:true});assert.match(html,/class="contour-space-panel"[^>]+hidden=""/);assert.doesNotMatch(html,/Expand space navigation/);assert.match(html,/Expand spaces rail/);
});

test('single shell stays expanded and has no collapse control, even with legacy collapsed props',()=>{
 for(const collapsed of [true,false]){
  const html=render({spaces:undefined,collapsed,defaultCollapsed:true});
  assert.doesNotMatch(html,/data-collapsed|Collapse navigation|Expand navigation|contour-navigation-toggle|contour-navigation-name/);
  const footer=html.slice(html.indexOf('<footer'));
  assert.doesNotMatch(footer,/aria-label="Help"/);assert.match(footer,/aria-label="Settings"/);assert.match(footer,/data-account-state="false"/);
 }
});


test('department aliases and custom colors are inherited by both controls without inline white glyphs',()=>{
 const html=render({spaces:[{id:'client',label:'Client servicing',dept:'client-servicing',color:'#7850C8'},{id:'website',label:'Website'}],activeSpace:'client'});
 assert.match(html,/data-department="client" style="--department-color:#7850C8;--department-ink:var\(--dept-client-ink/);
 const tile=html.match(/<span class="contour-dept-tile-compact"[^>]*>/)[0];assert.match(tile,/--dept-tile-color:#7850C8/);assert.doesNotMatch(tile,/(?:style="|;)color:/);
 const single=render({spaces:undefined,navigation:React.createElement(NavigationItem,{label:'Engineering',department:'Engineering',active:true,href:'/engineering'})});
 assert.match(single,/class="contour-navigation-item" data-department="engineering"/);assert.match(single,/--department-color:var\(--dept-engineering-solid/);assert.match(single,/aria-current="page"/);assert.doesNotMatch(single,/contour-navigation-item-icon/);
 const page=renderToStaticMarkup(React.createElement(NavigationItem,{label:'Projects',active:true,color:'#7850C8',href:'/projects'}));assert.doesNotMatch(page,/data-department|--department-color/);assert.match(page,/contour-navigation-item-icon/);
 const alone=renderToStaticMarkup(React.createElement(DeptTile,{compact:true,department:'Strategy'}));assert.match(alone,/--dept-tile-color:var\(--dept-strategy-solid/);assert.doesNotMatch(alone,/(?:style="|;)color:/);
});

test('both rail brand variants remain mounted with only the current variant accessible',()=>{
 for(const railCollapsed of [true,false]){
  const html=render({railCollapsed});const rail=html.match(/<aside[^>]+class="contour-spaces-rail"[\s\S]*?<\/aside>/)[0];
  assert.match(rail,new RegExp(`data-brand="full" aria-hidden="${railCollapsed}"`));assert.match(rail,new RegExp(`data-brand="compact" aria-hidden="${!railCollapsed}"`));
  assert.equal((rail.match(/contour-rail-brand-variant/g)||[]).length,2);assert.match(rail,/viewBox="0 0 2003 630"/);assert.match(rail,/viewBox="0 -48 842 842"/);
 }
});


test('desktop rail toggles preserve mounted brands, glyphs, labels and focus targets',async()=>{
 const {Window}=await import(process.env.HAPPY_DOM_PATH || 'happy-dom');
 const browser=new Window({url:'http://localhost/',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}}), saved=new Map();
 const expose=(key,value)=>{saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});};
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','ResizeObserver','MutationObserver'])expose(key,key==='window'?browser:browser[key]);
 expose('getComputedStyle',browser.getComputedStyle.bind(browser));expose('requestAnimationFrame',browser.requestAnimationFrame.bind(browser));expose('cancelAnimationFrame',browser.cancelAnimationFrame.bind(browser));expose('IS_REACT_ACT_ENVIRONMENT',true);
 const {act}=React, {createRoot}=await import('react-dom/client');
 const host=document.createElement('div');document.body.append(host);const root=createRoot(host),mounted=[],unmounted=[];
 function Brand({variant}){React.useEffect(()=>{mounted.push(variant);return()=>unmounted.push(variant);},[]);return React.createElement('span',null,variant);}
 try{
  await act(async()=>root.render(React.createElement(SidebarShell,{...props,defaultRailCollapsed:false,brand:React.createElement(Brand,{variant:'full'}),brandMark:React.createElement(Brand,{variant:'compact'})})));
  const full=host.querySelector('[data-brand="full"]'),compact=host.querySelector('[data-brand="compact"]'),department=host.querySelector('[data-space-control]'),glyph=department.querySelector('.contour-dept-tile-compact'),name=department.querySelector('.contour-space-name'),settings=host.querySelector('button[aria-label="Settings"]');
  assert.equal(full.getAttribute('aria-hidden'),'false');assert.equal(compact.getAttribute('aria-hidden'),'true');
  const initialMounts=[...mounted];assert.ok(initialMounts.includes('full'));assert.ok(initialMounts.includes('compact'));
  for(const closed of [true,false,true,false]){
   const toggle=host.querySelector('.contour-rail-toggle');await act(async()=>toggle.click());
   assert.equal(host.querySelector('.contour-shell').hasAttribute('data-rail-collapsed'),closed);
   assert.ok(full===host.querySelector('[data-brand="full"]'));assert.ok(compact===host.querySelector('[data-brand="compact"]'));assert.ok(glyph===department.querySelector('.contour-dept-tile-compact'));assert.ok(name===department.querySelector('.contour-space-name'));assert.ok(settings===host.querySelector('button[aria-label="Settings"]'));
   assert.equal(full.getAttribute('aria-hidden'),String(closed));assert.equal(compact.getAttribute('aria-hidden'),String(!closed));assert.equal(department.getAttribute('aria-label'),'Creative');
  }
  assert.deepEqual(mounted,initialMounts);assert.deepEqual(unmounted,[],'A collapse never remounts brand content.');
  await act(async()=>department.focus());assert.ok(document.activeElement===department);
  await act(async()=>department.dispatchEvent(new browser.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true})));assert.equal(document.activeElement.getAttribute('aria-label'),'Website');
 }finally{
  await act(async()=>root.unmount());await browser.happyDOM.close();for(const [key,descriptor]of saved){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
 }
});
