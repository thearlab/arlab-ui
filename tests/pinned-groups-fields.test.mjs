import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import postcss from 'postcss';
import {activeInfiniteTableGroup} from '../dist/contour/table-groups.js';
import {InfiniteTable,SectionHeader,PageLoading} from '../dist/contour/index.js';
import {satinLiftTokens} from '../dist/contour/satin-foundation.js';
test('pinned categories survive virtual windowing and hand over at exact group boundaries',()=>{
 const groups=[{index:0,label:'Client decks',count:3},{index:4,label:'Guides',count:80},{index:85,label:'Other',count:2}];
 assert.equal(activeInfiniteTableGroup([],400,88),null);
 assert.deepEqual(activeInfiniteTableGroup(groups,0,88),{...groups[0],offset:0});
 assert.equal(activeInfiniteTableGroup(groups,300,88).label,'Client decks');assert.equal(activeInfiniteTableGroup(groups,300,88).offset,-36);
 assert.equal(activeInfiniteTableGroup(groups,352,88).label,'Guides');assert.equal(activeInfiniteTableGroup(groups,5000,88).label,'Guides');
 assert.equal(activeInfiniteTableGroup(groups,7480,88).label,'Other');
 const html=renderToStaticMarkup(React.createElement(InfiniteTable,{rows:[{id:'one',category:'Guides',name:'Getting started'}],columns:[{key:'name',label:'Title'}],rowKey:'id',groupBy:'category',stickyGroups:true}));
 assert.match(html,/ct-infinite-pinned-group" aria-hidden="true"/);assert.match(html,/scope="rowgroup"/);assert.match(html,/data-sticky-groups="true"/);
 assert.match(renderToStaticMarkup(React.createElement(SectionHeader,{title:'Guides',sticky:true})),/data-sticky="true"/);
});
test('fields use inset-only shadows and one mapping without changing embedded fields or button paint',()=>{
 for(const mode of ['light','dark']){const t=satinLiftTokens(mode);for(const key of ['field-shadow','field-hover-shadow'])assert.ok(t[key].split(',').every(shadow=>shadow.trim().startsWith('inset ')));assert.notEqual(t['field-gradient'],t['chrome-control-gradient']);assert.notEqual(t['field-gradient'],t['button-chrome-gradient']);}
 const sheet=postcss.parse(fs.readFileSync('src/contour/fields.css','utf8'));let rule;
 sheet.walkRules(r=>rule=r);for(const selector of ['.lib-input:not(.ct-input-embedded)','.search-field','.dropdown-trigger','.tag-input','.ct-temporal-trigger'])assert.ok(rule.selector.includes(selector));
 assert.ok(!rule.selector.includes('.btn'));assert.ok(rule.nodes.every(node=>node.prop?.startsWith('--')),'Field paint must not change focus borders, geometry or typography.');
 const loading=renderToStaticMarkup(React.createElement(PageLoading));assert.doesNotMatch(loading,/ct-content-loading-mark|aria-label="ARLAB"/);assert.match(loading,/ct-content-loading-skeleton/);assert.match(loading,/Opening your workspace/);
});
