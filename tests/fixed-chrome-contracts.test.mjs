import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PageFrame,DayTimeline,Modal,IconButton} from '../dist/contour/index.js';
const h=React.createElement;
test('PageFrame keeps tabs outside its content scroll region',()=>{
 const out=renderToStaticMarkup(h(PageFrame,{header:'Title',tabs:h('nav',null,'Clients and internal'),children:'Body'}));
 assert.match(out,/data-has-tabs="true"/);assert.ok(out.indexOf('ct-page-frame-tabs')<out.indexOf('ct-page-frame-scroll'));
});
test('DayTimeline can scroll entries independently from its fixed heading and days',()=>{
 const out=renderToStaticMarkup(h(DayTimeline,{date:'2026-10-19',days:[{value:'mon',label:'Monday'}],value:'mon',itemsMaxHeight:360,itemsLabel:'Week entries',items:[{id:'one',time:'09:00',title:'Review'}]}));
 assert.match(out,/max-height:360px/);assert.match(out,/aria-label="Week entries"/);
 assert.ok(out.indexOf('Schedule days')<out.indexOf('ct-day-timeline-items-scroll'));
 assert.match(out,/ct-day-timeline-entry/);assert.match(out,/Review/);
});
test('Modal header actions sit beside native Close, with shared link-shaped icon buttons',()=>{
 const out=renderToStaticMarkup(h(Modal,{open:true,onClose(){},title:'Project',headerActions:h(IconButton,{label:'Drive folder',href:'https://example.com/drive',external:true},'D'),children:'Details'}));
 assert.match(out,/ct-modal-header-actions/);assert.match(out,/<a[^>]+aria-label="Drive folder"[^>]+data-button="icon"/);
 assert.match(out,/rel="noopener noreferrer"/);assert.ok(out.indexOf('Drive folder')<out.indexOf('Close dialog'));assert.ok(out.indexOf('Close dialog')<out.indexOf('modal-body'));
 const disabled=renderToStaticMarkup(h(IconButton,{label:'Unavailable link',href:'/private',disabled:true},'D'));
 assert.doesNotMatch(disabled,/href=/);assert.match(disabled,/aria-disabled="true"/);assert.match(disabled,/tabindex="-1"/);
});
