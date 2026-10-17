import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import fs from 'node:fs';
import postcss from 'postcss';
import {Stat,StatRow,StatNote,StatNoteRow} from '../dist/contour/index.js';

const h=React.createElement;
const html=(Component,props)=>renderToStaticMarkup(h(Component,props));
const css=postcss.parse(fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8'));
const target=':is(.lib-stat[data-interactive],a.ct-status-stat,button.ct-status-stat)';
function rules(selector){const found=[];css.walkRules(rule=>{if(rule.selector===selector){const declarations={};rule.walkDecls(d=>declarations[d.prop]=d.value);found.push({declarations,media:rule.parent.type==='atrule'?rule.parent.params:null});}});return found;}

test('Stat exposes the whole label, value and caption as one native action while passive markup stays compatible',()=>{
 const passive=html(Stat,{label:'Live projects',value:8,hint:'Across four clients'});
 assert.match(passive,/^<div class="lib-stat">/);assert.doesNotMatch(passive,/data-interactive|tabindex|role="button"/);
 const button=html(Stat,{label:'Live projects',value:8,hint:'Across four clients',onClick:()=>{}});
 assert.match(button,/^<button[^>]*data-interactive="true"[^>]*type="button"/);
 assert.match(button,/<span>Live projects<\/span><strong>8<\/strong><small>Across four clients<\/small><\/button>$/);
 const link=html(Stat,{label:'Live projects',value:8,href:'/projects',actionLabel:'View eight live projects'});
 assert.match(link,/^<a[^>]*href="\/projects"/);assert.match(link,/aria-label="View eight live projects"/);assert.doesNotMatch(link,/<button|type="button"/);
 const row=html(StatRow,{children:[h(Stat,{key:'a',label:'Live',value:8,onClick:()=>{}}),h(Stat,{key:'b',label:'Waiting',value:2})]});
 assert.equal((row.match(/<button/g)||[]).length,1);assert.equal((row.match(/<strong/g)||[]).length,2);
});

test('StatNote action semantics still cover the full metric without nesting an action inside the value',()=>{
 const output=html(StatNoteRow,{children:h(StatNote,{label:'Live projects',value:8,onClick:()=>{},caption:'Across four clients',note:{tone:'ok',label:'Healthy'},actionLabel:'View projects'})});
 assert.equal((output.match(/<button/g)||[]).length,1);
 assert.match(output,/<button[^>]*aria-label="Live projects, 8, ok: Healthy, Across four clients, View projects"/);
 assert.match(output,/ct-status-stat-caption/);assert.match(output,/View projects/);
});

test('Metric actions have shared useful padding, a full-width hover and an inset focus without changing typography',()=>{
 const base=rules(`.arlab-contour ${target}`).find(r=>!r.media).declarations;
 assert.equal(base.padding,'var(--space-4) var(--space-6)');assert.equal(base.width,'100%');assert.equal(base['box-sizing'],'border-box');
 assert.equal(base['min-height'],'var(--control-h-touch)');assert.equal(base['font-size'],undefined);assert.equal(base['font-weight'],undefined);
 assert.equal(rules(`.arlab-contour ${target}:hover`)[0].declarations.background,'var(--chrome-row-hover)');
 const focus=rules(`.arlab-contour ${target}:focus-visible`)[0].declarations;
 assert.equal(focus['outline-offset'],'calc(-1 * var(--line-width))');assert.equal(focus['box-shadow'],'none');
 const phone=rules(`.arlab-contour ${target}`).find(r=>r.media==='(max-width:640px)').declarations;
 assert.equal(phone.padding,'var(--space-3) var(--space-4)');
 const rows=rules('.arlab-contour :is(.lib-stat-row,.ct-stat-note-row):has(> :is([data-interactive],a.ct-status-stat,button.ct-status-stat))')[0].declarations;
 assert.equal(rows['column-gap'],'0');assert.equal(rows['border-radius'],'var(--radius-panel)');assert.equal(rows.overflow,'hidden');
});
