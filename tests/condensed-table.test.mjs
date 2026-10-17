import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {CondensedCollectionContext} from '../dist/contour/CollectionViewContext.js';
import {InfiniteTable} from '../dist/contour/InfiniteTable.js';
import {FilterableTable} from '../dist/contour/DataFilters.js';
const columns=[{key:'name',label:'Name',width:'48%',minWidth:160},{key:'status',label:'Status'},{key:'access',label:'Access'},{key:'category',label:'Category'}];
const rows=Array.from({length:100},(_,id)=>({id,name:`Agent ${id}`,status:'Published',access:'Team',category:'Creative'}));
for(const Table of [InfiniteTable,FilterableTable]) test(`${Table.name} condenses actual columns and spacer spans, then restores the full table`,()=>{
 const render=condensed=>renderToStaticMarkup(React.createElement(CondensedCollectionContext.Provider,{value:condensed},React.createElement(Table,{columns,rows,rowKey:'id',mode:'local',chunkSize:100,height:200})));
 const compact=render(true);
 assert.doesNotMatch(compact,/>Status<|>Access<|>Category<|width:48%|min-width:160px/);
 assert.match(compact,/>Agent 0</);
 if(Table===InfiniteTable){assert.match(compact,/ct-infinite-spacer/);assert.match(compact,/colSpan="1"/i);assert.match(compact,/aria-colcount="1"/);}
 const full=render(false);assert.match(full,/>Status</);assert.match(full,/width:48%/);
 assert.equal(columns.length,4);assert.equal(columns[0].width,'48%');
});
