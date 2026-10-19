import {test} from 'node:test';
import assert from 'node:assert/strict';
import {setTimeout as delay} from 'node:timers/promises';
import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import {GuidedTour} from '../dist/contour/GuidedTour.js';

// Mounted desktop behavior only: no listening server, backend requests or geometry claims.
test('tour fades before repositioning, locks rapid navigation and cancels pending moves on close', async () => {
  const {Window} = await import(process.env.HAPPY_DOM_PATH || 'happy-dom');
  const browser = new Window({url:'http://localhost/',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
  const saved = new Map();
  const expose = (key,value) => {saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});};
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','getComputedStyle']) expose(key,key==='window'?browser:key==='getComputedStyle'?browser.getComputedStyle.bind(browser):browser[key]);
  expose('IS_REACT_ACT_ENVIRONMENT',true);
  let reduced = false, frameId = 0;
  const frames = new Map();
  expose('matchMedia',() => ({matches:reduced}));
  expose('requestAnimationFrame',callback => {const id=++frameId;frames.set(id,callback);return id;});
  expose('cancelAnimationFrame',id=>frames.delete(id));
  const frame = async () => act(async () => {const pending=[...frames.values()];frames.clear();pending.forEach(callback=>callback(performance.now()));});
  const targets = [40,480,900].map((left,index) => {
    const node=document.createElement('button');node.id=`stop-${index}`;node.textContent=`Target ${index+1}`;
    node.getBoundingClientRect=()=>({left,top:100,right:left+100,bottom:132,width:100,height:32});
    node.scrollIntoView=options=>{assert.equal(options.behavior,'instant');};
    document.body.append(node);return node;
  });
  const host=document.createElement('div');document.body.append(host);const root=createRoot(host);
  const ends=[];
  const steps=targets.map((node,index)=>({target:`#${node.id}`,title:`Step ${index+1}`,body:'Read this target.'}));
  const render = async open => act(async()=>root.render(React.createElement(GuidedTour,{steps,open,onClose:reason=>ends.push(reason)})));
  const button=label=>[...document.querySelectorAll('.arlab-tour button')].find(node=>node.textContent===label);
  const phase=()=>document.querySelector('.ct-tour-layer')?.dataset.phase;
  try {
    targets[0].focus();
    await render(true);assert.equal(phase(),'entering');
    await frame();await frame();assert.equal(phase(),'visible');
    const before=document.querySelector('.arlab-tour-ring').style.left;
    await act(async()=>button('Next').click());
    assert.equal(phase(),'leaving');assert.equal(button('Next').disabled,true);
    assert.equal(document.querySelector('.arlab-tour-title').textContent,'Step 1');
    assert.equal(document.querySelector('.arlab-tour-ring').style.left,before,'The old ring must stay still while fading out.');
    await act(async()=>document.dispatchEvent(new browser.KeyboardEvent('keydown',{key:'ArrowRight'})));
    await act(async()=>delay(110));
    assert.equal(phase(),'entering');assert.equal(document.querySelector('.arlab-tour-title').textContent,'Step 2');
    assert.notEqual(document.querySelector('.arlab-tour-ring').style.left,before,'Coordinates change only after the exit.');
    await frame();await frame();assert.equal(phase(),'visible');
    assert.equal(document.activeElement,document.querySelector('.arlab-tour'));
    await act(async()=>button('Back').click());await act(async()=>delay(110));await frame();await frame();
    assert.equal(document.querySelector('.arlab-tour-title').textContent,'Step 1');
    await act(async()=>button('Next').click());
    await act(async()=>button('Skip tour').click());
    await act(async()=>delay(110));
    assert.equal(document.querySelector('.ct-tour-layer'),null);assert.deepEqual(ends,['skip']);assert.equal(document.activeElement,targets[0]);
    await render(false);reduced=true;await render(true);await frame();await frame();
    await act(async()=>button('Next').click());
    assert.equal(document.querySelector('.arlab-tour-title').textContent,'Step 2','Reduced motion has no exit delay.');
    await frame();await frame();
    await act(async()=>button('Next').click());await frame();await frame();
    await act(async()=>button('Done').click());assert.deepEqual(ends,['skip','done']);
    await render(false);reduced=false;await render(true);await frame();await frame();
    await act(async()=>button('Next').click());await render(false);await act(async()=>delay(110));
    assert.equal(document.querySelector('.ct-tour-layer'),null,'External closure cancels the pending move.');
  } finally {
    await act(async()=>root.unmount());await browser.happyDOM.close();
    for (const [key,descriptor] of saved) {if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
  }
});
