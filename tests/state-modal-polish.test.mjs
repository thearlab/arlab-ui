import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import postcss from 'postcss';
import {StateView,Dialog,ConfirmDialog} from '../dist/contour/library.js';
const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
function props(file,selector){const values={};postcss.parse(fs.readFileSync(new URL(`../src/contour/${file}`,import.meta.url),'utf8')).walkRules(rule=>{if(rule.selector===selector&&rule.parent.type!=='atrule')rule.walkDecls(decl=>values[decl.prop]=decl.value);});return values;}
test('loading StateView uses the standard animated content-preview page with one announcement',()=>{
 const html=render(StateView,{state:'loading',title:'Loading people',description:'Preparing your list.'});
 assert.equal((html.match(/role="status"/g)||[]).length,1);
 assert.match(html,/aria-busy="true"/);assert.match(html,/class="ct-content-loading-skeleton" aria-hidden="true"/);
 assert.doesNotMatch(html,/class="contour-loader"/);
 assert.doesNotMatch(html,/lib-skeleton/);assert.match(html,/>Loading people<span class="ct-loading-ellipsis"/);
});
test('empty and error states retain custom product actions and calm semantic feedback',()=>{
 const html=render(StateView,{state:'empty',title:'No agents',description:'Add your first agent.',actionLabel:'Add agent',onAction:()=>{}});
 assert.match(html,/class="ct-state-view"/);assert.match(html,/data-state="empty"/);assert.match(html,/>Add agent<\/button>/);assert.match(html,/data-button="text"/);
 assert.doesNotMatch(html,/Create project<\/button>/);
 assert.match(render(StateView,{state:'error',onRetry:()=>{}}),/role="alert"/);
 const custom=render(StateView,{action:React.createElement('a',{href:'/help'},'Read guide'),onCreate:()=>{}});assert.match(custom,/href="\/help"/);assert.doesNotMatch(custom,/Create project<\/button>/);
});
test('dialog and sheet action footers have spacing without an internal separator',()=>{
 assert.equal(props('styles.css','.modal-actions')['border-top'],'0');
 assert.equal(props('styles.css','.modal-actions')['padding-top'],'0');
 assert.equal(props('library.css','.ct-modal-footer')['border-top'],'0');
 assert.equal(props('styles.css','.modal-actions:only-child')['margin-top'],'0');
 assert.notEqual(props('dashboard.css','.ct-data-table > footer')['border-top'],'0');
 const html=render(Dialog,{open:true,title:'Edit person',scrollable:true,children:'Fields',footer:React.createElement('button',null,'Save')});
 assert.match(html,/ct-modal-scroll-layout/);assert.match(html,/ct-modal-footer/);
 const confirm=render(ConfirmDialog,{open:true,title:'Remove key',onClose:()=>{},onConfirm:()=>{}});assert.match(confirm,/modal-actions/);assert.match(confirm,/>Cancel<\/button>/);
});
