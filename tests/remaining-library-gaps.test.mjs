import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import {TextAction,Timestamp,TabStrip,DayTimeline,WorkspaceGrid,EditorLayout,ShellPage,PreviewFrame,previewHeightBridgeScript} from '../dist/contour/index.js';

const html=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
test('TextAction is a native link when routed and a non-submit button otherwise',()=>{
  assert.match(html(TextAction,{href:'/knowledge',children:'Knowledge'}),/<a[^>]*href="\/knowledge"[^>]*>Knowledge/);
  assert.match(html(TextAction,{onClick:()=>{},children:'Refresh'}),/<button[^>]*type="button"[^>]*>Refresh/);
  assert.match(html(TextAction,{href:'https://example.com',external:true,children:'External'}),/rel="noopener noreferrer"/);
});
test('relative Timestamp retains an exact hover date and an ISO time value',()=>{
  const date=new Date(Date.now()-3*60*60*1000);
  const output=html(Timestamp,{date,relative:true});
  assert.match(output,/3 hours ago/);
  assert.match(output,/dateTime="/);
  assert.match(output,/title="/);
});
test('layout sizing and quiet controls are opt-in',()=>{
  assert.match(html(WorkspaceGrid,{layout:'sidebar',supportingWidth:380,children:'Calendar'}),/--ct-workspace-supporting-width:380px/);
  assert.match(html(EditorLayout,{title:'Builder',inspectorWidth:380,sidebar:'Fields',children:'Preview'}),/--ct-editor-inspector-width:380px/);
  assert.match(html(TabStrip,{options:['One'],value:'One',onChange:()=>{},inset:'flush'}),/data-inset="flush"/);
  assert.match(html(DayTimeline,{days:[{value:'1',label:'Monday'}],value:'1',dayVariant:'quiet'}),/data-variant="quiet"/);
});
test('shell pages state route-specific scroll ownership',()=>{
  assert.match(html(ShellPage,{scroll:'page',children:'Article'}),/data-scroll="page"/);
  assert.match(html(ShellPage,{scroll:'child',children:'Table'}),/data-scroll="child"/);
});
test('cross-document preview height bridge uses an explicit origin',()=>{
  assert.throws(()=>previewHeightBridgeScript('*'),/specific parent origin/);
  const script=previewHeightBridgeScript('https://studio.example');
  assert.match(script,/arlab:preview-height/);
  assert.match(script,/ResizeObserver/);
  assert.match(script,/MutationObserver/);
  assert.match(html(PreviewFrame,{title:'Signature',srcDoc:'<p>Sign</p>',autoHeight:true,heightMessageOrigin:'null'}),/data-auto-height="true"/);
});
test('shared layout CSS owns route scrolling, tile baseline, and Kanban scroll chaining',()=>{
  const css=fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8');
  assert.match(css,/\.contour-shell-content:has\(> \.ct-shell-page\[data-scroll="child"\]\)/);
  assert.match(css,/\.lib-link-tile \{align-items:flex-start;/);
  assert.match(css,/\.ct-kanban-column-scroll > \.scroll-viewport \{[^}]*overscroll-behavior-x:auto/);
});
