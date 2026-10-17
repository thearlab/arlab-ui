import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import {PageFrame,ReadingLayout,DocumentContent,DocumentOutline,FileDropzone,DropRegion,Table} from '../dist/contour/ReadingLayouts.js';
import {tokensFor} from '../dist/contour/system.js';
const el=React.createElement;
const html=(component,props,...children)=>renderToStaticMarkup(el(component,props,...children));
test('Bounded page and reading layouts preserve header, content and footer semantics',()=>{
 const out=html(PageFrame,{header:'Document heading',footer:'Save changes',label:'Knowledge content'},el(ReadingLayout,{outline:el(DocumentOutline,{headings:[{id:'intro',text:'Introduction',depth:2},{id:'usage',text:'Usage',depth:3}]})},el(DocumentContent,{html:'<h2 id="intro">Introduction</h2><p>Trusted, sanitised HTML</p>'})));
 assert.match(out,/ct-page-frame-header/);assert.match(out,/ct-page-frame-footer/);assert.match(out,/aria-label="Knowledge content"/);assert.match(out,/href="#usage"/);assert.match(out,/<h2 id="intro">Introduction/);
 assert.equal(html(DocumentOutline,{headings:[]}), '');
});
test('File selection respects single-file and disabled picker semantics without uploading',()=>{
 const out=html(FileDropzone,{onFiles:()=>assert.fail('render must not upload'),multiple:false,disabled:true,accept:'.md',title:'Import notes'});
 assert.match(out,/type="file"/);assert.match(out,/accept=".md"/);assert.match(out,/disabled/);assert.doesNotMatch(out,/multiple=""/);assert.match(out,/Import notes/);
});
test('Drop feedback and semantic table are caller-owned compositions',()=>{
 assert.match(html(DropRegion,{active:true,dragging:true},'Card'),/data-active="true" data-dragging="true"/);
 const out=html(Table,{label:'Client records'},el('tbody',null,el('tr',null,el('td',null,'ARLAB'))));
 assert.match(out,/<table aria-label="Client records">/);assert.match(out,/<td>ARLAB<\/td>/);
});
test('Approved pink background is shared across both themes without orange canvas stops',()=>{
 for(const mode of ['light','dark']){
  const t=tokensFor('contour',mode);
  assert.match(t['page-gradient'],/^radial-gradient/);assert.match(t['page-gradient'],mode==='dark'?/240,78,232,.035/:/228,20,219,.025/);
  for(const key of ['surface-gradient','chrome-gradient','chrome-subtle-gradient','chrome-control-gradient']){assert.match(t[key],/^linear-gradient/);assert.doesNotMatch(t[key],/251,146,60|#FB923C/i);}
 }
 const css=fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8');
 assert.match(css,/background-image: var\(--page-gradient, none\)/);
 const nav=fs.readFileSync(new URL('../dist/contour/navigation.css',import.meta.url),'utf8');
 assert.match(nav,/contour-shell-topbar,.contour-shell-secondary,.contour-spaces-rail,.contour-space-panel \{background-image:var\(--chrome-gradient,none\)/);
});
