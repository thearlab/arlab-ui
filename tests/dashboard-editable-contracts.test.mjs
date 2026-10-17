import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MediaUploadField,MediaGallery} from '../dist/contour/MediaComponents.js';
import {Timeline,ComboboxPicker} from '../dist/contour/library.js';
const html=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
test('Media upload supports PDF/file kinds and an app-owned link action',()=>{
 const pdf=html(MediaUploadField,{label:'Brief',items:[],onFiles:()=>{},kinds:['pdf'],onLink:()=>{}});
 assert.match(pdf,/accept="application\/pdf,.pdf"/);assert.match(pdf,/PDF documents/);assert.match(pdf,/Add a link/);
 const any=html(MediaUploadField,{label:'Files',items:[],onFiles:()=>{},kinds:['file']});assert.doesNotMatch(any,/accept=/);
 const gallery=html(MediaGallery,{items:[{id:'pdf',name:'Brief.pdf',type:'pdf',src:'/brief.pdf'}]});assert.match(gallery,/PDF document/);assert.doesNotMatch(gallery,/<img/);
});
test('Timeline carries tone, metadata and application actions',()=>{
 const result=html(Timeline,{items:[{id:'v2',title:'Published',tone:'ok',meta:'Version 2',actions:React.createElement('a',{href:'/version/2'},'View version')}]});
 assert.match(result,/data-tone="ok"/);assert.match(result,/Version 2/);assert.match(result,/href="\/version\/2"/);
});
test('Custom combobox values stay legible when absent from the options',()=>{
 const result=html(ComboboxPicker,{allowCustom:true,value:'New client',options:[{value:'arlab',label:'ARLAB'}]});assert.match(result,/New client/);assert.doesNotMatch(result,/Choose an option/);
});
