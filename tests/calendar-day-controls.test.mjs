import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Calendar} from '../dist/contour/Calendar.js';
const render=props=>renderToStaticMarkup(React.createElement(Calendar,props));

test('Calendar day controls remain semantic native buttons with selected/disabled state and ISO dates',()=>{
 const html=render({startDate:'2026-10-12',weeks:5,value:'2026-10-17',min:'2026-10-15',max:'2026-11-10',locale:'en-GB'});
 const dates=[...html.matchAll(/<button[^>]*class="ct-calendar-date"[^>]*>/g)].map(match=>match[0]);
 assert.equal(dates.length,35);assert.ok(dates.every(button=>button.includes('type="button"')&&!button.includes('data-button=')));
 const selected=dates.find(button=>button.includes('data-calendar-date="2026-10-17"'));assert.match(selected,/aria-pressed="true"/);
 const early=dates.find(button=>button.includes('data-calendar-date="2026-10-12"'));assert.match(early,/disabled=""/);
 assert.match(html,/<time dateTime="2026-10-17">17<\/time>/);
});
test('Embedded calendar events and overflow actions do not inherit general toolbar button geometry',()=>{
 const html=render({month:'2026-10',value:'2026-10-17',maxEventsPerDay:1,events:[{id:'one',date:'2026-10-17',title:'Review'},{id:'two',date:'2026-10-17',title:'Handoff'}],onEventSelect:()=>{}});
 for(const className of ['ct-calendar-event','ct-calendar-more','ct-calendar-phone-count']){
  const buttons=[...html.matchAll(new RegExp(`<button[^>]*class="${className}"[^>]*>`,'g'))].map(match=>match[0]);
  assert.ok(buttons.length>0,className);assert.ok(buttons.every(button=>!button.includes('data-button=')),className);
 }
 assert.match(html,/data-button="text">Today/);
});
test('Calendar and custom date picker share square date geometry, tabular numerals and selected action tokens',()=>{
 const calendar=fs.readFileSync(new URL('../src/contour/calendar.css',import.meta.url),'utf8');
 assert.match(calendar,/width: 36px;\s*height: 36px;/);assert.match(calendar,/aspect-ratio: 1/);
 assert.match(calendar,/width:min\(44px,100%\);height:auto/);assert.match(calendar,/font-variant-numeric: tabular-nums/);
 assert.match(calendar,/ct-calendar-date\[aria-pressed="true"\][\s\S]*?color:var\(--actionInk\)/);
 assert.match(calendar,/border-radius: var\(--radius-control\)/);
 const picker=fs.readFileSync(new URL('../src/contour/dashboard.css',import.meta.url),'utf8');
 assert.match(picker,/ct-calendar-days button \{[\s\S]*?aspect-ratio:1/);
 assert.match(picker,/ct-calendar-days button\[aria-pressed="true"\] \{[^}]*color:var\(--actionInk\)/);
 assert.match(picker,/@media \(pointer: coarse\), \(max-width:640px\)/);
 assert.match(picker,/width: 352px/);
});
