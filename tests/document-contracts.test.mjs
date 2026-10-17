import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Markdown,ReadableDoc} from '../dist/contour/library.js';
const html=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
test('Markdown formats bold and safe links while preserving literal HTML and code',()=>{
 const result=html(Markdown,{children:'# Guide\n\n**Important** [Read guide](/guide) and `**literal**`\n\n<script>alert(1)</script>\n\n[Unsafe](javascript:alert)\n\n```js\n**code** <div>\n```'});
 assert.match(result,/<h2>Guide<\/h2>/);assert.match(result,/<strong>Important<\/strong>/);assert.match(result,/<a href="\/guide">Read guide<\/a>/);assert.match(result,/<code>\*\*literal\*\*<\/code>/);
 assert.doesNotMatch(result,/<script>|href="javascript:/);assert.match(result,/&lt;script&gt;/);assert.match(result,/<pre><code>\*\*code\*\* &lt;div&gt;<\/code><\/pre>/);
});
test('ReadableDoc renders structured values, empty data, cycles and legacy children',()=>{
 const value={clientName:'ARLAB',review:{approved:false},tags:['Creative','Engineering'],empty:null};
 const result=html(ReadableDoc,{value});assert.match(result,/<dt>Client Name<\/dt>/);assert.match(result,/<dt>Approved<\/dt>/);assert.match(result,/>false<\/span>/);assert.match(result,/<li><span>Creative/);assert.match(result,/>None<\/span>/);
 assert.match(html(ReadableDoc,{v:{count:0}}),/>0<\/span>/);
 const cycle={};cycle.self=cycle;assert.match(html(ReadableDoc,{value:cycle}),/Circular reference/);
 assert.match(html(ReadableDoc,{title:'Guide',children:React.createElement('p',null,'Existing document')}),/<h2>Guide<\/h2><p>Existing document<\/p>/);
});
