import {test} from 'node:test';
import assert from 'node:assert/strict';
import React,{act,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {DailyVerdictStrip} from '../dist/contour/index.js';
test('daily date selection updates the report by click and keyboard without triggering project carousel arrows',async()=>{
 const {Window}=await import(process.env.HAPPY_DOM_PATH||'happy-dom');
 const browser=new Window({url:'http://localhost/'}),saved=new Map();
 const expose=(key,value)=>{saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});};
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','ResizeObserver','MutationObserver'])expose(key,key==='window'?browser:browser[key]);
 for(const key of ['requestAnimationFrame','cancelAnimationFrame','getComputedStyle'])expose(key,browser[key].bind(browser));
 expose('IS_REACT_ACT_ENVIRONMENT',true);
 const days=[{date:'2026-10-18',state:'attention',label:'At risk'},{date:'2026-10-19',state:'on-track',label:'On track'}];
 let carouselMoves=0;
 function Demo(){const[selected,setSelected]=useState(days[1]);return React.createElement('div',{onKeyDown:()=>carouselMoves++},React.createElement(DailyVerdictStrip,{days,layout:'row',selectedDate:selected.date,onSelect:setSelected}),React.createElement('p',{'aria-live':'polite'},selected.label));}
 const host=document.createElement('div');document.body.append(host);const root=createRoot(host);
 try{
  await act(async()=>root.render(React.createElement(Demo)));
  const controls=[...host.querySelectorAll('button')];assert.equal(controls.length,2);
  assert.equal(controls[1].getAttribute('aria-pressed'),'true');assert.equal(controls[0].dataset.button,'text');
  await act(async()=>controls[0].click());assert.equal(host.querySelector('[aria-live]').textContent,'At risk');assert.equal(controls[0].getAttribute('aria-pressed'),'true');
  await act(async()=>controls[0].dispatchEvent(new browser.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true})));
  assert.equal(document.activeElement,controls[1]);assert.equal(host.querySelector('[aria-live]').textContent,'On track');assert.equal(carouselMoves,0);
  await act(async()=>controls[1].dispatchEvent(new browser.KeyboardEvent('keydown',{key:'Home',bubbles:true,cancelable:true})));assert.equal(document.activeElement,controls[0]);assert.equal(carouselMoves,0);
 }finally{await act(async()=>root.unmount());await browser.happyDOM.abort();for(const[key,descriptor]of saved)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
});
