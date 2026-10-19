// Run after tsc or npm run build. These exercise the compiled public runtime.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {CollectionCard, Skeleton, ColumnChart, Sparkline, FilterableTable, InfiniteTable, Button} from '../dist/contour/index.js';
import {infiniteTableEntries} from '../dist/contour/table-groups.js';
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
const rows = Array.from({length:10000}, (_,i) => ({id:String(i),name:`Record ${i}`,department:i<5000?'Creative':'Engineering',spend:i}));
const columns = [{key:'name',label:'Name'},{key:'spend',label:'Spend',hideOnPhone:true}];

test('responsive column hiding marks both header and cells without dropping desktop data', () => {
  for (const Table of [FilterableTable, InfiniteTable]) {
    const html = render(Table, {columns, rows:rows.slice(0,2), rowKey:'id'});
    assert.match(html, /<th[^>]+data-phone-hidden="true"/);
    assert.equal((html.match(/<td[^>]+data-phone-hidden="true"/g)||[]).length,2);
    assert.match(html, /Sort Spend ascending/);
  }
});

test('groups preserve server order and merge a contiguous append without duplicate headings', () => {
  const first = infiniteTableEntries(rows.slice(0,2),'department');
  assert.equal(first.length,3);assert.equal(first[0].count,2);
  const appended = infiniteTableEntries(rows.slice(0,3),'department');
  assert.equal(appended.filter(entry=>entry.kind==='group').length,1);
  assert.equal(appended[0].count,3);
  const noncontiguous = infiniteTableEntries([rows[0],rows[5000],rows[1]], row=>row.department);
  assert.deepEqual(noncontiguous.filter(entry=>entry.kind==='row').map(entry=>entry.row.id), ['0','5000','1']);
  assert.deepEqual(noncontiguous.filter(entry=>entry.kind==='group').map(entry=>entry.group),['Creative','Engineering','Creative']);
});

test('large grouped collections remain virtualized with correct spacer geometry and row counts', () => {
  const html = render(InfiniteTable,{columns,rows,rowKey:'id',groupBy:'department',chunkSize:10000,rowHeight:64,height:480,overscan:6});
  assert.ok((html.match(/class="ct-infinite-row"/g)||[]).length <= 14);
  assert.equal((html.match(/class="ct-infinite-group"/g)||[]).length,1);
  assert.match(html,/aria-rowcount="10003"/);
  assert.match(html,/aria-rowindex="2" class="ct-infinite-group"/);
  const rendered = (html.match(/class="ct-infinite-(?:row|group)"/g)||[]).length;
  assert.ok(html.includes(`height:${(10002-rendered)*64}px`));
});

test('grouped remote tables do not promise a known accessible total before future groups arrive', () => {
  const html=render(InfiniteTable,{columns,rows:rows.slice(0,2),rowKey:'id',groupBy:'department',mode:'remote',sort:null,onSortChange(){},hasMore:true,totalCount:200,loadingMore:false,onLoadMore:async()=>{}});
  assert.match(html,/aria-rowcount="-1"/);
});

test('card footer actions are siblings of the primary card button and media replaces decorative symbol',()=>{
  const html=render(CollectionCard,{title:'Project',media:React.createElement('img',{src:'/cover.png',alt:'Preview'}),footer:React.createElement(Button,null,'Settings'),onClick(){}});
  assert.match(html,/<article[^>]+lib-collection-card/);assert.match(html,/<\/button><footer><button/);
  assert.match(html,/lib-collection-card-media/);assert.doesNotMatch(html,/lib-card-symbol/);
});

test('inline skeleton can appear inside a text line and keeps its accessible status',()=>{
  const html=render(Skeleton,{inline:true,width:'6ch',height:'1em',label:'Loading amount'});
  assert.match(html,/^<span/);assert.doesNotMatch(html,/<div/);assert.match(html,/role="status" aria-label="Loading amount"/);assert.match(html,/width:6ch;height:1em/);
});

test('both chart types align comparison values by category and expose accessible alternative data',()=>{
  for (const Chart of [ColumnChart,Sparkline]) {
    const html=render(Chart,{data:[{label:'Mon',value:4},{label:'Tue',value:9}],secondaryData:[{label:'Tue',value:8},{label:'Mon',value:3}],primaryLabel:'Actual',secondaryLabel:'Budget'});
    assert.match(html,/Mon: Actual 4, Budget 3/);
    assert.match(html,/Tue: Actual 9, Budget 8/);
    assert.match(html,/<th scope="col">Actual<\/th><th scope="col">Budget<\/th>/);
    assert.match(html,/<th scope="row">Mon<\/th><td>4<\/td><td>3<\/td>/);
  }
});


test('chart comparison gaps stay gaps and zero remains a real value',()=>{
  const data=[{label:'Mon',value:4},{label:'Tue',value:9},{label:'Wed',value:2}];
  const secondaryData=[{label:'Mon',value:0},{label:'Wed',value:3},{label:'Other',value:999}];
  const html=render(Sparkline,{data,secondaryData});
  const comparison=html.match(/<path d="([^"]+)"[^>]+stroke-dasharray="4 3"/);
  assert.ok(comparison);assert.equal((comparison[1].match(/M/g)||[]).length,2);assert.doesNotMatch(comparison[1],/L/);
  assert.match(html,/<th scope="row">Mon<\/th><td>4<\/td><td>0<\/td>/);
  assert.match(html,/<th scope="row">Tue<\/th><td>9<\/td><td>Not available<\/td>/);
  assert.doesNotMatch(html,/999/);
});
