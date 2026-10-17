import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import {ToastProvider,enqueueToast,useToast} from '../dist/contour/ToastProvider.js';
import {SidebarShell} from '../dist/contour/SidebarShell.js';
import {PreviewFrame} from '../dist/contour/EditorComponents.js';
import {GuidedTour,useGuidedTour} from '../dist/contour/GuidedTour.js';
const render = (component,props) => renderToStaticMarkup(React.createElement(component,props));

test('toast queue preserves FIFO order and updates existing notifications without duplicate ids', () => {
  const first={id:'one',title:'Saved',duration:0};
  const original=[first,{id:'two',title:'Uploaded'}];
  const updated=enqueueToast(original,{id:'one',title:'Saved again'});
  assert.deepEqual(updated.map(item=>item.id),['one','two']);
  assert.equal(updated[0].title,'Saved again');
  assert.equal(updated[0].duration,0);
  assert.equal(original[0],first);
  assert.equal(original[0].title,'Saved');
  assert.deepEqual(enqueueToast(updated,{id:'three'}).map(item=>item.id),['one','two','three']);
});
test('toast service is scoped, server-safe and keeps the existing presentational Toast independent', () => {
  assert.match(render(ToastProvider,{children:React.createElement('main',null,'App'),position:'top-left'}),/data-position="top-left"/);
  function Outside(){useToast();return null;}
  assert.throws(()=>render(Outside,{}),/within ToastProvider/);
});
test('tour targets cover both desktop rail and phone drawer with application overrides', () => {
  const markup=render(SidebarShell,{brand:'ARLAB',toolName:'Studio',navigation:null,children:'Page',spaces:[{id:'creative',label:'Creative'},{id:'admin',label:'Admin','data-tour':'admin-space'}]});
  assert.match(markup,/data-tour="space-creative"/);
  assert.match(markup,/data-tour="admin-space"/);
  assert.equal(typeof useGuidedTour,'function');
  assert.equal(render(GuidedTour,{steps:[],open:false,onClose:()=>{}}),'');
  const css=fs.readFileSync(new URL('../src/contour/services.css',import.meta.url),'utf8');
  for(const side of ['top','bottom','left','right','dock'])assert.ok(css.includes(`[data-side="${side}"]`));
});
test('preview frame forwards native iframe options and exposes application-owned overlays', () => {
  const markup=render(PreviewFrame,{title:'Preview',src:'/preview',onLoad:()=>{},allow:'fullscreen',autoHeight:true,overlay:React.createElement('button',null,'Inspect'),renderOverlay:({viewport})=>React.createElement('span',null,viewport)});
  assert.match(markup,/src="\/preview"/);
  assert.match(markup,/allow="fullscreen"/);
  assert.match(markup,/data-auto-height="true"/);
  assert.match(markup,/<button>Inspect<\/button>/);
  assert.match(markup,/>desktop<\/span>/);
  assert.match(render(PreviewFrame,{title:'Document',src:'/ignored',srcDoc:'<p>Ready</p>'}),/srcDoc="&lt;p&gt;Ready&lt;\/p&gt;"/i);
  assert.doesNotMatch(render(PreviewFrame,{title:'Document',src:'/ignored',srcDoc:'<p>Ready</p>'}),/src="\/ignored"/);
});
