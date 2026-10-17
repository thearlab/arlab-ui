import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {AppHeader} from '../dist/contour/AppHeader.js';
import {Button,IconButton} from '../dist/contour/ui.js';
const actions=React.createElement(React.Fragment,null,
  React.createElement(Button,null,'Export'),React.createElement(Button,{variant:'primary'},'Add project'));

test('AppHeader equal-width page actions reuse the official ActionGroup and canonical Buttons',()=>{
 const result=renderToStaticMarkup(React.createElement(AppHeader,{context:'Projects',pageActions:actions,pageActionsEqualWidth:true,actions:React.createElement(IconButton,{label:'Account'},'A')}));
 assert.match(result,/aria-label="Page actions"/);assert.match(result,/ct-action-group[^>]*data-equal-width="true"/);
 assert.equal((result.match(/data-button="text"/g)||[]).length,2);
 assert.equal((result.match(/data-button="icon"/g)||[]).length,1);
 assert.doesNotMatch(result,/style="[^"]*(?:height|font-size|padding)/);
});
test('AppHeader retains natural-width custom page actions unless equal-width is selected',()=>{
 const result=renderToStaticMarkup(React.createElement(AppHeader,{context:'Projects',pageActions:actions}));
 assert.doesNotMatch(result,/data-equal-width/);assert.match(result,/Export/);assert.match(result,/Add project/);
});

import fs from 'node:fs';
import postcss from 'postcss';
test('Context styles cannot resize public Button or IconButton instances',()=>{
 const root=new URL('../src/contour/',import.meta.url);
 const metric=/^(?:font(?:-.+)?|height|min-height|max-height|padding(?:-.+)?|line-height|border-width)$/;
 let guarded=0;
 for(const file of fs.readdirSync(root).filter(name=>name.endsWith('.css')&&name!=='buttons.css')){
  postcss.parse(fs.readFileSync(new URL(file,root),'utf8')).walkRules(rule=>{
   const targets=rule.selectors?.filter(selector=>/\.(?:btn|icon-btn)\b/.test(selector))||[];
   if(!targets.length)return;
   const sizing=rule.nodes.some(node=>node.type==='decl'&&metric.test(node.prop));
   if(!sizing)return;
   for(const selector of targets){assert.match(selector,/\[data-button(?:=|\])/,`${file}: ${selector}`);if(selector.includes(':not([data-button])'))guarded++;}
  });
 }
 assert.ok(guarded>=40);
 const canonical=fs.readFileSync(new URL('../src/contour/buttons.css',import.meta.url),'utf8');
 assert.match(canonical,/height:var\(--button-height\)/);assert.match(canonical,/height:var\(--control-h-touch\)/);
 assert.match(canonical,/font-size:var\(--button-font-size\)/);assert.match(canonical,/padding:0 var\(--button-padding-inline\)/);
});

test('AppHeader owns application identity while preserving context and independent actions',()=>{
 const result=renderToStaticMarkup(React.createElement(AppHeader,{appName:'Agents Studio',appIcon:React.createElement('svg',{'data-glyph':'workflow'}),context:'Agents',pageActions:actions,pageActionsEqualWidth:true}));
 assert.match(result,/data-app-name="true"/);assert.match(result,/ct-app-header-brand/);
 assert.doesNotMatch(result,/ct-app-header-app-icon|data-glyph="workflow"/);assert.match(result,/<strong title="Agents Studio"><span>Agents Studio<\/span><\/strong>/);
 assert.match(result,/ct-app-header-context">Agents/);assert.match(result,/data-equal-width="true"/);
 const css=fs.readFileSync(new URL('../src/contour/app-header.css',import.meta.url),'utf8');
 assert.match(css,/font-size:var\(--text-md\)/);assert.match(css,/font-weight:var\(--weight-heading\)/);
 assert.match(css,/ct-app-header\[data-app-name\] \.ct-app-header-context \{display:none/);
});
