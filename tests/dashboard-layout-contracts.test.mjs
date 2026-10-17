import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Button,Dropdown} from '../dist/contour/ui.js';
import {Gate,DayTimeline,LinkTile} from '../dist/contour/library.js';
import {RecordHeader} from '../dist/contour/RecordLayouts.js';
import {DailyVerdictStrip,PhaseBar} from '../dist/contour/ProjectIndicators.js';
const html=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
test('Link buttons preserve shared classes, external safety and disabled navigation',()=>{
  const ordinary=html(Button,{href:'/projects',children:'Projects',variant:'primary'});
  assert.match(ordinary,/<a[^>]*href="\/projects"/);assert.match(ordinary,/data-button="text"/);
  const external=html(Button,{href:'https://example.com',external:true,children:'Docs'});
  assert.match(external,/target="_blank"/);assert.match(external,/noopener noreferrer/);
  const disabled=html(Button,{href:'/projects',disabled:true,children:'Projects'});
  assert.doesNotMatch(disabled,/href=/);assert.match(disabled,/aria-disabled="true"/);assert.match(disabled,/tabindex="-1"/);
  const tile=html(LinkTile,{title:'Guide',href:'/guide',meta:'Updated today',badge:'New'});
  assert.match(tile,/<a[^>]*href="\/guide"/);assert.match(tile,/Updated today/);assert.match(tile,/New/);
});
test('Picker prefix is rendered within the shared dropdown trigger',()=>{
  const result=html(Dropdown,{prefix:'PM',options:[{value:'all',label:'Every PM',count:12}]});
  assert.match(result,/class="dropdown-prefix">PM/);assert.match(result,/Every PM/);
});
test('RecordHeader supports a record-kind label without tabs',()=>{
  const result=html(RecordHeader,{label:'Person',title:'Amina',backLabel:'People',onBack:()=>{}});
  assert.match(result,/ct-record-header-label">Person/);assert.doesNotMatch(result,/role="tablist"/);
});
test('Daily verdicts cover the six production meanings and compact phases retain full labels',()=>{
  const states=['blocked','due-today','at-risk','delayed','on-track','no-update'];
  const result=html(DailyVerdictStrip,{days:states.map((state,i)=>({date:`2026-10-${17+i}`,state}))});
  for(const label of ['Blocked','Due today','At risk','Delayed','On track','No update'])assert.match(result,new RegExp(label));
  const phases=html(PhaseBar,{density:'compact',phases:[{id:'brief',label:'Brief'},{id:'dev',label:'Development'}],current:'dev'});
  assert.match(phases,/data-density="compact"/);assert.match(phases,/Development/);assert.match(phases,/aria-current="step"/);
});
test('Gate and day agenda render application data without invented schedule content',()=>{
  const gate=html(Gate,{title:'Team sign in',description:'Your workspace',fine:'Restricted access',action:React.createElement('a',{href:'/login'},'Sign in')});
  assert.match(gate,/Team sign in/);assert.match(gate,/href="\/login"/);assert.doesNotMatch(gate,/Demo access/);
  const agenda=html(DayTimeline,{date:'2026-10-17',items:[{id:'review',time:'09:30',title:'Client review',description:'Amina',href:'/review',state:'late'}],days:[{value:'2026-10-17',label:'Sat'}],value:'2026-10-17'});
  assert.match(agenda,/Client review/);assert.match(agenda,/href="\/review"/);assert.match(agenda,/data-state="late"/);assert.match(agenda,/aria-pressed="true"/);
  const empty=html(DayTimeline,{items:[],empty:'No meetings'});assert.match(empty,/No meetings/);assert.doesNotMatch(empty,/Project planning/);
});
