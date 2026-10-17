import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {moveGroupedItem} from '../dist/contour/GroupedReorderList.js';
import {ReorderList} from '../dist/contour/EditorComponents.js';
const fixture=()=>[{id:'brief',label:'Brief',items:[{id:'a',label:'A'},{id:'b',label:'B'}]},{id:'ready',label:'Ready',items:[]}];
test('grouped reorder moves into empty groups without mutation or losing item data',()=>{
 const groups=fixture();groups[0].items[0].content='Details';
 const next=moveGroupedItem(groups,'a','ready',0);
 assert.deepEqual(next.map(group=>group.items.map(item=>item.id)),[['b'],['a']]);
 assert.equal(next[1].items[0].content,'Details');
 assert.deepEqual(groups.map(group=>group.items.map(item=>item.id)),[['a','b'],[]]);
});
test('grouped reorder supports both directions, same-group order and bounded insertion',()=>{
 const groups=fixture();
 const across=moveGroupedItem(groups,'b','ready',500);
 assert.deepEqual(moveGroupedItem(across,'b','brief',0)[0].items.map(item=>item.id),['b','a']);
 assert.deepEqual(moveGroupedItem(groups,'a','brief',1)[0].items.map(item=>item.id),['b','a']);
 assert.deepEqual(moveGroupedItem(groups,'b','brief',-10)[0].items.map(item=>item.id),['b','a']);
 assert.equal(moveGroupedItem(groups,'a','brief',0),groups);
 for(const [id,group,index] of [['missing','ready',0],['a','missing',0],['a','ready',NaN]])assert.equal(moveGroupedItem(groups,id,group,index),groups);
});
test('same ReorderList contract retains flat mode and offers accessible keyboard group moves',()=>{
 const flat=renderToStaticMarkup(React.createElement(ReorderList,{label:'Items',items:[{id:'a',label:'A'}],onChange:()=>{}}));
 assert.match(flat,/aria-label="Items"/);
 assert.match(flat,/Move A up/);
 const grouped=renderToStaticMarkup(React.createElement(ReorderList,{label:'Stages',groups:fixture(),onGroupsChange:()=>{}}));
 assert.match(grouped,/aria-label="Stages"/);
 assert.match(grouped,/data-reorder-group="ready"/);
 assert.match(grouped,/Move A to group/);
 assert.match(grouped,/Drop an item here/);
 const disabled=renderToStaticMarkup(React.createElement(ReorderList,{label:'Stages',groups:fixture(),onGroupsChange:()=>{},disabled:true}));
 assert.match(disabled,/disabled=""/);
});
