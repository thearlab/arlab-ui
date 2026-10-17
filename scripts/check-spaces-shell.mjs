// Optional isolated DOM check. Harness deps come from the sibling Studio checkout, not the UI runtime.
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const rootPath=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(new URL('../package.json',import.meta.url));
const harness=createRequire(process.env.ARLAB_TEST_HARNESS || fileURLToPath(new URL('../../agents-studio/package.json',import.meta.url)));
const {Window}=await import(harness.resolve('happy-dom')); 
const {createServer}=await import(new URL('./dist/node/index.js', 'file://' + harness.resolve('vite/package.json')));
const window=new Window({url:'http://localhost/'});
for(const key of ['window','document','navigator','HTMLElement','HTMLDialogElement','Element','Node','Event','MouseEvent','KeyboardEvent','ResizeObserver','MutationObserver','localStorage']) Object.defineProperty(globalThis,key,{value:key==='window'?window:window[key],configurable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
globalThis.requestAnimationFrame=window.requestAnimationFrame.bind(window);globalThis.cancelAnimationFrame=window.cancelAnimationFrame.bind(window);globalThis.getComputedStyle=window.getComputedStyle.bind(window);
window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};window.HTMLDialogElement.prototype.close=function(){this.open=false;};
window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
globalThis.fetch=window.fetch=async()=>{throw Error('Network forbidden');};
const React=require('react'),{act}=React,{createRoot}=require('react-dom/client'),e=React.createElement;
const vite=await createServer({root:rootPath,configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',logLevel:'error',optimizeDeps:{noDiscovery:true,include:[]},plugins:[{name:'source-jsx-extension',resolveId(source,importer){if(importer&&source.startsWith('.')&&source.endsWith('.js')){const path=resolve(dirname(importer),source.replace(/\.js$/,'.jsx'));if(existsSync(path))return path;}}}]});
const {SidebarShell}=await vite.ssrLoadModule('/src/contour/SidebarShell.tsx');
const {ArlabMark}=await vite.ssrLoadModule('/src/ArlabMark.tsx');
let root,chosen=[];
const spaces=[{id:'company',label:'Company',dept:'company'},{id:'blocked',label:'Disabled space',disabled:true},{id:'creative',label:'Creative team with a long space name',dept:'creative',count:8}];
const props={brand:e(ArlabMark),toolName:'Fixture',spaces,activeSpace:'company',onSpaceChange:id=>chosen.push(id),navigation:e('a',{href:'/tools'},'Tool route'),children:'Workspace',storageKey:'test:spaces'};
async function mount(extra={}){if(root)await act(()=>root.unmount());document.body.innerHTML='<div id="root"></div>';root=createRoot(document.getElementById('root'));await act(()=>root.render(e(SidebarShell,{...props,...extra})));}
const named=name=>[...document.querySelectorAll('button,a')].find(el=>el.getAttribute('aria-label')===name);
async function click(node){assert.ok(node);await act(()=>node.click());}
async function key(node,key,options={}){await act(()=>node.dispatchEvent(new window.KeyboardEvent('keydown',{key,bubbles:true,...options})));}
try {
 await mount();assert.equal(document.querySelector('nav[aria-label="Spaces"] [aria-current="page"]').getAttribute('aria-label'),'Company');assert.ok(document.querySelector('a[aria-label="Fixture home"] svg[aria-label="ARLAB"]'));
 await act(()=>named('Company').focus());await key(named('Company'),'ArrowDown');assert.equal(document.activeElement,named(spaces[2].label));assert.equal(chosen.length,0);assert.equal(document.querySelector('[role="tooltip"]').textContent,spaces[2].label);await click(named(spaces[2].label));assert.deepEqual(chosen,['creative']);
 console.log('PASS labelled rail, selected state, tooltip and disabled-skipping arrow navigation');
 await click(named('Collapse space navigation'));assert.equal(document.querySelector('.contour-space-panel').hidden,true);assert.equal(localStorage.getItem('test:spaces:panel'),'true');assert.ok(named('Expand space navigation'));
 await mount();assert.equal(document.querySelector('.contour-space-panel').hidden,true);await key(window,'\\',{ctrlKey:true});assert.equal(document.querySelector('.contour-space-panel').hidden,false);
 console.log('PASS fold persistence and desktop shortcut');
 await mount({panelCollapsed:false,onPanelCollapsedChange:undefined});await key(window,'\\',{metaKey:true});assert.equal(document.querySelector('.contour-space-panel').hidden,false);assert.equal(named('Collapse space navigation').disabled,true);
 console.log('PASS controlled fold without callback stays read-only');
 await mount();const trigger=named('Choose space: Company');await act(()=>trigger.focus());await click(trigger);assert.equal(document.querySelector('dialog').open,true);assert.equal(document.querySelector('dialog nav').getAttribute('aria-label'),'Spaces');await act(()=>document.querySelector('dialog').dispatchEvent(new window.Event('cancel')));assert.equal(document.querySelector('dialog').open,false);assert.equal(document.activeElement,trigger);
 await click(named('Open space navigation'));assert.equal(document.querySelector('dialog').open,true);assert.match(document.querySelector('dialog').textContent,/Tool route/);await click(named('Close navigation drawer'));assert.equal(document.querySelector('dialog').open,false);
 console.log('PASS separate spaces/tools native dialog content and focus restoration');
 await mount({spaces:undefined,defaultCollapsed:true,storageKey:undefined});assert.ok(document.querySelector('.contour-navigation-logo[data-compact] svg[aria-label="ARLAB"]'));assert.ok(named('Expand navigation'));
 console.log('PASS existing single navigation exposes compact mark when folded');
 console.log('All 5 spaces shell checks passed. No live services. CSS geometry requires browser review.');
}finally{if(root)await act(()=>root.unmount());await vite.close();await window.happyDOM.abort();}
