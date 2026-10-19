import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ColumnChart,Facts,InfiniteTable,NavigationProgress,SaveBar,StateView,TagInput,Chip} from '../dist/contour/index.js';
import {NavigationProgress as LoadingEntryProgress} from '../dist/contour/loading.js';

const h=React.createElement;
const html=(component,props)=>renderToStaticMarkup(h(component,props));
const css=postcss.parse(fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8'));
function declarations(selector){const out={};css.walkRules(rule=>{if(rule.selector===selector)rule.walkDecls(d=>out[d.prop]=d.value);});return out;}

test('compact or embedded loading keeps one announcement and an inert local skeleton',()=>{
 for (const props of [{size:'compact'},{variant:'embedded'},{size:'compact',variant:'embedded'}]) {
  const out=html(StateView,{state:'loading',title:'Loading briefs',description:'Preparing your list.',...props});
  assert.equal((out.match(/role="status"/g)||[]).length,1);
  assert.match(out,/aria-busy="true"/);
  assert.match(out,/ct-state-loading-skeleton" aria-hidden="true"/);
  assert.match(out,/Loading briefs/);assert.match(out,/Preparing your list\./);
  assert.doesNotMatch(out,/ct-content-loading|Workspace loading|ARLAB workspace|contour-loader/);
 }
 assert.match(html(StateView,{state:'loading'}),/ct-content-loading-skeleton/);
});

test('route progress is indeterminate, independently exported and absent when idle',()=>{
 assert.equal(LoadingEntryProgress,NavigationProgress);
 const out=html(NavigationProgress,{label:'Opening projects'});
 assert.match(out,/role="progressbar"/);assert.match(out,/aria-label="Opening projects"/);
 assert.doesNotMatch(out,/aria-valuenow|aria-valuemax|%|lib-loading/);
 assert.equal(html(NavigationProgress,{active:false}),'');
 const track=declarations('.arlab-contour .ct-navigation-progress');
 assert.equal(track.height,'2px');assert.equal(track.position,'fixed');
 let reducedMotion;
 css.walkRules(rule=>{if(rule.selector==='.arlab-contour .ct-navigation-progress > span'&&rule.parent.params==='(prefers-reduced-motion:reduce)')reducedMotion=rule.toString();});
 assert.match(reducedMotion,/animation:none/);
});

test('weekly chart labels preserve thirty focus targets, exact values and all table records',()=>{
 const data=Array.from({length:30},(_,i)=>({label:`October ${i+1}`,value:i+.25}));
 const out=html(ColumnChart,{data,labelInterval:7,primaryLabel:'Spend',color:'var(--dim)'});
 assert.equal((out.match(/data-label-visible="true"/g)||[]).length,5);
 assert.equal((out.match(/data-label-visible="false"/g)||[]).length,25);
 assert.equal((out.match(/tabindex="0"/g)||[]).length,30);
 for(const point of data) {
  assert.ok(out.includes(`aria-label="${point.label}: Spend ${point.value}"`));
  assert.ok(out.includes(`title="${point.label}: Spend ${point.value}"`));
  assert.ok(out.includes(`<th scope="row">${point.label}</th><td>${point.value}</td>`));
 }
 assert.match(out,/View data table/);assert.match(out,/ct-column-tooltip/);
 assert.equal((html(ColumnChart,{data}).match(/data-label-visible="true"/g)||[]).length,30);
 for(const labelInterval of [0,-7,NaN,Infinity])assert.equal((html(ColumnChart,{data,labelInterval}).match(/data-label-visible="true"/g)||[]).length,30);
});

test('comparison chart exact values remain category-aligned when ticks are sparse',()=>{
 const out=html(ColumnChart,{data:[{label:'Mon',value:2},{label:'Tue',value:5}],secondaryData:[{label:'Tue',value:8}],labelInterval:7});
 assert.match(out,/aria-label="Mon: Value 2, Comparison not available"/);
 assert.match(out,/aria-label="Tue: Value 5, Comparison 8"/);
 assert.match(out,/<th scope="row">Tue<\/th><td>5<\/td><td>8<\/td>/);
});

test('richer virtual table cells keep fixed geometry while owning their individual line limits',()=>{
 const out=html(InfiniteTable,{rowKey:'id',rows:[{id:'one',title:'Brief title',meta:'Brief attached'}],rowHeight:88,columns:[
  {key:'title',label:'Title',lineClamp:false,render:row=>h('div',null,h('strong',null,row.title),h('small',null,row.meta))},
  {key:'meta',label:'Metadata',lineClamp:3},
  {key:'id',label:'Identifier'},
 ]});
 assert.match(out,/--ct-infinite-row-height:88px/);assert.match(out,/--ct-infinite-cell-height:72px/);
 assert.match(out,/class="ct-infinite-cell" data-line-clamp="none"><div><strong>Brief title<\/strong><small>Brief attached<\/small>/);
 assert.match(out,/-webkit-line-clamp:3/);assert.match(out,/-webkit-line-clamp:2/);
 const richCell=declarations('.arlab-contour .ct-infinite-cell[data-line-clamp="none"]');
 assert.equal(richCell.display,'block');assert.equal(richCell['-webkit-line-clamp'],'unset');
 assert.equal(declarations('.arlab-contour .ct-infinite-cell')['max-height'],'var(--ct-infinite-cell-height)');
});

test('stacked facts preserve semantic names and long contact values in a single column',()=>{
 const out=html(Facts,{layout:'stacked',items:[['Email','long-contact@example.com']]});
 assert.match(out,/data-layout="stacked"/);assert.match(out,/<dt>Email<\/dt><dd>long-contact@example.com<\/dd>/);
 assert.equal(declarations('.arlab-contour dl.ct-facts[data-layout="stacked"] > div')['grid-template-columns'],'minmax(0,1fr)');
 assert.match(html(Facts,{items:[]}),/data-layout="rows"/);
});

test('saved editors retain a quiet disabled primary after all chrome rules',()=>{
 const out=html(SaveBar,{dirty:false});
 assert.match(out,/All changes saved/);assert.match(out,/<button[^>]*class="btn primary[^>]*disabled=""[^>]*>Save changes<\/button>/);
 const disabled=declarations('.arlab-contour .btn.primary[data-button="text"]:disabled,.arlab-contour .btn.primary[data-button="text"][aria-disabled="true"]');
 assert.equal(disabled.background,'var(--sunken)');assert.equal(disabled.color,'var(--dim)');assert.equal(disabled['box-shadow'],'none');
});

test('TagInput and public Chip share the leaf control with unchanged removal labels',()=>{
 const out=html(TagInput,{value:['Creative'],onChange(){},label:null});
 assert.match(out,/aria-label="Remove Creative"/);assert.match(out,/class="ct-chip-label"/);
 assert.match(html(Chip,{children:'Creative',onRemove(){}}),/aria-label="Remove Creative"/);
});
