import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PageLoading,DayTimeline,TabStrip,StateView} from '../dist/contour/index.js';
const h=React.createElement;
const html=(Component,props)=>renderToStaticMarkup(h(Component,props));
const css=postcss.parse(fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8'));
const declarations=selector=>{const result={};css.walkRules(rule=>{if(rule.parent.type==='root'&&rule.selectors.includes(`.arlab-contour ${selector}`))rule.walkDecls(d=>result[d.prop]=d.value);});return result;};
test('both PageLoading variants honor optional container/viewport layout and announce once',()=>{
 for(const variant of ['content-preview','signature'])for(const layout of [undefined,'container','viewport']) {
  const out=html(PageLoading,{variant,layout,title:'Loading projects',description:'Fetching the latest records',workspaceName:'Projects',onCancel(){}});
  assert.match(out,new RegExp(`data-layout="${layout||'container'}"`));assert.equal((out.match(/role="status"/g)||[]).length,1);
  assert.match(out,/Loading projects/);assert.match(out,/Fetching the latest records/);assert.match(out,/Cancel loading/);
  assert.match(out,variant==='content-preview'?/ct-content-loading-skeleton" aria-hidden="true"/:/page-loading-center/);
 }
 let cancelled=0;const element=PageLoading({onCancel:()=>cancelled++});
 const findCancel=node=>{if(!node||typeof node!=='object')return; if(node.props?.children==='Cancel loading')return node;for(const child of React.Children.toArray(node.props?.children)){const found=findCancel(child);if(found)return found;}};
 findCancel(element).props.onClick();assert.equal(cancelled,1);
});
test('viewport dimensions are explicit and container loading remains bounded with centered copy',()=>{
 for(const root of ['.ct-content-loading','.page-loading']) {
  const container=declarations(`${root}[data-layout="container"]`),viewport=declarations(`${root}[data-layout="viewport"]`);
  assert.equal(container.height,'100%');assert.equal(container['min-height'],'0');assert.equal(container.width,'100%');assert.equal(container.flex,'1 1 0');
  assert.equal(viewport.height,'100dvh');assert.equal(viewport['min-height'],'100dvh');assert.equal(viewport.width,'100%');assert.equal(viewport.flex,'0 0 auto');
 }
 assert.equal(declarations('.ct-content-loading').display,'grid');assert.equal(declarations('.ct-content-loading')['place-items'],'center');
 assert.equal(declarations('.ct-content-loading-copy')['text-align'],'center');
 let reduced=false;css.walkAtRules('media',rule=>{if(rule.params.includes('prefers-reduced-motion'))rule.walkRules(inner=>{if(inner.selector.includes('ct-content-loading-skeleton'))reduced=true;});});assert.equal(reduced,true);
 const embedded=html(StateView,{state:'loading',size:'compact',variant:'embedded'});assert.doesNotMatch(embedded,/ct-content-loading|data-layout="viewport"/);
});
test('compact DayTimeline preserves records, selected/disabled semantics and change callbacks',()=>{
 const props={days:[{value:'mon',label:'Monday'},{value:'tue',label:'Tuesday',disabled:true}],value:'mon',daySize:'compact',dayVariant:'quiet',items:[{id:'review',time:'09:00',title:'Review brief',href:'/briefs/review'}]};
 const out=html(DayTimeline,props);assert.match(out,/data-variant="quiet" data-size="compact"/);assert.match(out,/aria-pressed="true"/);assert.match(out,/disabled=""/);assert.match(out,/Review brief/);assert.match(out,/09:00/);
 assert.match(html(DayTimeline,{days:props.days,value:'mon'}),/data-size="regular"/);
 let selected;DayTimeline({...props,onChange:value=>selected=value}).props.children[1].props.children[0].props.onClick();assert.equal(selected,'mon');
 const compact=declarations('.lib-day-timeline .ct-day-strip[data-size="compact"] button');assert.equal(compact['font-size'],'var(--text-xs)');assert.equal(compact.padding,'var(--space-1) var(--space-2)');
});
test('TabStrip keeps intrinsic labels and one native scroll owner while preserving inset/count/disabled state',()=>{
 const out=html(TabStrip,{inset:'flush',label:'Sections',value:'access',options:[{value:'access',label:'Keys and people',count:12},{value:'disabled',label:'Unavailable',disabled:true}],onChange(){}});
 assert.match(out,/data-inset="flush"/);assert.match(out,/Keys and people/);assert.match(out,/ct-tab-count">12/);assert.match(out,/role="tab" disabled=""/);assert.equal((out.match(/tabindex="0"/g)||[]).length,1);
 assert.equal(declarations('.detail-tabs > button').flex,'0 0 auto');assert.equal(declarations('.detail-tabs > button')['white-space'],'nowrap');assert.equal(declarations('.detail-tabs')['overflow-x'],'auto');
 assert.equal(declarations('.ct-collection-tabs > .detail-tabs').overflow,'visible');assert.equal(declarations('.ct-kanban-phone-tabs .detail-tabs').overflow,'visible');
});
