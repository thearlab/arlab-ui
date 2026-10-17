import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Timestamp,ColumnChart,BarList,StackedBar,Field,StateView,DetailHeader,DataTable} from '../dist/contour/library.js';
import {DeadlineCountdown,FormFieldGroup,KanbanBoard,InfiniteTable,Input} from '../dist/contour/index.js';
const html=(C,props)=>renderToStaticMarkup(React.createElement(C,props));
test('Timestamp defaults to a plain date; time and chip chrome are explicit',()=>{
 const date='2026-10-21T12:00:00Z';
 const plain=html(Timestamp,{date});assert.match(plain,/21 Oct 2026/);assert.doesNotMatch(plain,/<svg|timestamp-time|lib-timestamp-chip/);
 const chip=html(Timestamp,{date,variant:'chip',showTime:true});assert.match(chip,/lib-timestamp-chip/);assert.match(chip,/timestamp-time/);assert.match(chip,/<svg/);
});
test('single-series charts use one hue; categorical charts and a selected datum are explicit',()=>{
 const data=[{label:'Monday',value:2},{label:'Tuesday',value:3}];
 for(const Chart of [ColumnChart,BarList,StackedBar]) {
  const plain=html(Chart,{data});assert.doesNotMatch(plain,/var\(--chart-2\)/);
  assert.match(html(Chart,{data,highlight:'Tuesday'}),/var\(--accent\)/);
 }
 assert.match(html(StackedBar,{data,categorical:true}),/var\(--chart-2\)/);
});
test('required fields communicate their requirement on the actual control',()=>{
 const output=html(Field,{label:'Name',required:true,children:React.createElement(Input)});
 assert.match(output,/aria-required="true"/);assert.doesNotMatch(output,/>Required</);
 const group=html(FormFieldGroup,{label:'Name',htmlFor:'name',required:true,children:React.createElement(Input,{id:'name'})});assert.match(group,/aria-required="true"/);
});
test('inline deadlines omit empty hour values and carry meaning in text',()=>{
 const now=Date.UTC(2026,9,17,12);
 assert.match(html(DeadlineCountdown,{now,deadline:now-26*86400000,variant:'inline'}),/26d late/);
 assert.match(html(DeadlineCountdown,{now,deadline:now+3*86400000,variant:'inline'}),/in 3d/);
 assert.match(html(DeadlineCountdown,{now,deadline:now+3600000,variant:'inline'}),/Due today/);
 assert.doesNotMatch(html(DeadlineCountdown,{now,deadline:now+3*86400000}),/0h/);
});
test('empty-state content and icon are application-owned; detail status follows its title',()=>{
 const output=html(StateView,{title:'No brief yet',icon:React.createElement('span',null,'Custom mark'),actionLabel:'Ask Client servicing',onAction(){}});
 assert.match(output,/Custom mark/);assert.match(output,/Ask Client servicing/);assert.doesNotMatch(output,/Create project/);
 const header=html(DetailHeader,{title:'A record',status:'Ready'});assert.ok(header.indexOf('<h2>')<header.indexOf('class="status'));
});
test('DataTable rows open as a whole and preserve separate selection controls',()=>{
 const output=html(DataTable,{rows:[{id:'one',name:'Brief',client:'ARLAB',status:'Planning',progress:10}],onOpen(){}});
 assert.match(output,/<tr[^>]*tabindex="0"[^>]*aria-label="Open Brief"/i);assert.match(output,/ct-table-row-chevron/);assert.doesNotMatch(output,/<button[^>]*aria-label="Open Brief"/);
});
test('read-only kanban cards expose no move or open furniture',()=>{
 const output=html(KanbanBoard,{columns:[{id:'planned',title:'Planned'}],cards:[{id:'brief',columnId:'planned'}],renderCard:()=>React.createElement('strong',null,'Brief'),onCardOpen(){}});
 assert.match(output,/data-card-primary="true"/);assert.match(output,/aria-label="Open brief"/);assert.doesNotMatch(output,/ct-kanban-card-actions|ct-kanban-drag-handle|Move to…|>Open</);
});
test('infinite table loads silently on scroll and exposes retry only after failure',()=>{
 const props={columns:[{key:'name',label:'Name'}],rows:[{id:'one',name:'One'}],rowKey:'id',mode:'remote',sort:null,onSortChange(){},hasMore:true,loadingMore:false,onLoadMore:async()=>{}};
 assert.doesNotMatch(html(InfiniteTable,props),/>Load more<|Scroll for more/);
 assert.match(html(InfiniteTable,{...props,error:'Connection lost'}),/>Retry loading</);
});
