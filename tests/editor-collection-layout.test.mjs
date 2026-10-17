import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import postcss from 'postcss';
import {EditorLayout} from '../dist/contour/EditorComponents.js';
import {CollectionGroup} from '../dist/contour/WorkspaceComponents.js';
import {Panel,Rows,Row} from '../dist/contour/library.js';
const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
test('CollectionGroup composes the actual Panel Rows and Row primitives and preserves callbacks',()=>{
 let opened=0,all=0;
 const group=CollectionGroup({title:'Creative',meta:'Updated today',count:2,items:[{id:'one',label:'First',onOpen:()=>opened++},{id:'two',label:'Read only',description:'No action'}],onOpen:()=>all++,more:4});
 assert.equal(group.type,Panel);
 assert.equal(group.props.description,'Updated today');
 group.props.action.props.onClick();assert.equal(all,1);
 const children=React.Children.toArray(group.props.children);
 const rows=children.find(child=>child.type===Rows);
 assert.equal(rows.props.children[0].type,Row);
 rows.props.children[0].props.onClick();assert.equal(opened,1);
 assert.equal(rows.props.children[1].props.onClick,undefined);
 children.find(child=>child.props.className==='ct-collection-footer').props.children.props.onClick();assert.equal(all,2);
 const html=render(CollectionGroup,{title:'Creative',items:[],count:0});
 assert.match(html,/class="ct-surface lib-panel ct-panel ct-collection-group"/);assert.match(html,/aria-label="0 items"/);
});
test('editor keeps canvas and inspector in separate scroll regions with the save footer outside both',()=>{
 const html=render(EditorLayout,{title:'Campaign',description:'Edit the draft',children:'Canvas content',sidebar:React.createElement('label',null,'Settings'),footer:React.createElement('button',{type:'button'},'Save'),onExit:()=>{},viewport:'tablet'});
 assert.match(html,/aria-label="Campaign preview"/);assert.match(html,/aria-label="Properties settings"/);
 assert.match(html,/<\/aside><\/div><footer class="ct-editor-footer">/);
 assert.match(html,/data-viewport="tablet"/);
 for(const name of ['Desktop','Tablet','Phone','Close editor'])assert.match(html,new RegExp(`type="button"[^>]*aria-label="${name}"`));
 assert.match(html,/aria-label="Tablet"[^>]*aria-pressed="true"/);
 assert.match(html,/aria-label="Desktop"[^>]*aria-pressed="false"/);
});
test('existing custom editor toolbar can opt out of built-in viewport controls',()=>{
 const html=render(EditorLayout,{title:'Script',children:'Content',toolbar:React.createElement('button',{type:'button'},'Run'),showViewportControls:false});
 assert.match(html,/>Run<\/button>/);assert.doesNotMatch(html,/aria-label="Preview viewport"|aria-label="Phone"/);
 assert.doesNotMatch(html,/ct-editor-inspector|ct-editor-footer/);
});
test('collection hover inherits shared row geometry while editor surfaces stay bounded and token-typed',()=>{
 const css=fs.readFileSync(new URL('../src/contour/dashboard.css',import.meta.url),'utf8');
 assert.doesNotMatch(css,/\.ct-collection-group\s+(?:li\s+)?button/);
 const ast=postcss.parse(css);const values={};ast.walkRules(rule=>{if(rule.selector==='.ct-editor-workspace'||rule.selector==='.ct-editor-footer')rule.walkDecls(decl=>{values[`${rule.selector}:${decl.prop}`]=decl.value;});
 if(rule.selector.startsWith('.ct-editor'))rule.walkDecls('font-size',decl=>assert.match(decl.value,/var\(--text-/));});
 assert.equal(values['.ct-editor-workspace:min-height'],'0');assert.equal(values['.ct-editor-footer:flex'],'0 0 auto');
 const source=fs.readFileSync(new URL('../src/contour/EditorComponents.tsx',import.meta.url),'utf8');
 assert.match(source,/aria-haspopup="dialog"/);assert.ok(source.includes("title={propertiesLabel} sheet scrollable"));
});
