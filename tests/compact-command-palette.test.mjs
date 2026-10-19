import {test} from 'node:test';
import assert from 'node:assert/strict';
import React,{act,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {CommandPalette} from '../dist/contour/index.js';
test('compact command header retains keyboard selection, grouping and focus restoration',async()=>{
 const {Window}=await import(process.env.HAPPY_DOM_PATH||'happy-dom');const browser=new Window({url:'http://localhost/'}),saved=new Map();
 const expose=(key,value)=>{saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});};
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','ResizeObserver','MutationObserver'])expose(key,key==='window'?browser:browser[key]);
 for(const key of ['requestAnimationFrame','cancelAnimationFrame','getComputedStyle'])expose(key,browser[key].bind(browser));expose('IS_REACT_ACT_ENVIRONMENT',true);
 const choices=[];const items=[{id:'home',title:'Home',group:'Pages',onSelect:()=>choices.push('home')},{id:'project',title:'Projects',group:'Pages',onSelect:()=>choices.push('project')}];
 function Demo(){const[open,setOpen]=useState(false);return React.createElement('div',null,React.createElement('button',{onClick:()=>setOpen(true)},'Find anything'),React.createElement(CommandPalette,{open,onClose:()=>setOpen(false),items}));}
 const host=document.createElement('div');document.body.append(host);const root=createRoot(host);
 try{
  await act(async()=>root.render(React.createElement(Demo)));const trigger=host.querySelector('button');trigger.focus();await act(async()=>trigger.click());
  const input=host.querySelector('input[role="combobox"]');assert.ok(input.closest('.modal-head'),'Search and native Close share one header.');assert.equal(host.querySelectorAll('input[role="combobox"]').length,1);assert.equal(host.querySelector('.modal-body input'),null);assert.equal(host.querySelectorAll('[role="option"]').length,2);assert.equal(host.querySelector('[role="group"] h3').textContent,'Pages');
  await act(async()=>input.dispatchEvent(new browser.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true})));assert.equal(host.querySelector('[role="option"][aria-selected="true"] strong').textContent,'Projects');
  await act(async()=>input.dispatchEvent(new browser.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true})));assert.deepEqual(choices,['project']);assert.equal(document.activeElement,trigger);assert.equal(host.querySelector('dialog').hasAttribute('open'),false);
 }finally{await act(async()=>root.unmount());await browser.happyDOM.abort();for(const[key,descriptor]of saved)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
});
