import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {tokensFor,directions,cssTokens} from '../src/contour/system.js';
const luminance=hex=>hex.slice(1).match(/../g).map(channel=>parseInt(channel,16)/255).map(channel=>channel<=.04045?channel/12.92:((channel+.055)/1.055)**2.4).reduce((sum,channel,index)=>sum+channel*[.2126,.7152,.0722][index],0);
const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);

test('Satin Lift uses the approved brand, typography, corners and neutral dark surfaces',()=>{
  const light=tokensFor('contour','light'),dark=tokensFor('contour','dark');
  assert.equal(light.action,'#E414DB');assert.equal(light.actionInk,'#FFFFFF');assert.match(light['action-gradient'],/^linear-gradient/);assert.doesNotMatch(light['action-gradient'],/251,146,60/);
  assert.deepEqual(['ground','raise','sunken','ink','dim','line'].map(key=>dark[key]),['#202022','#29292C','#1B1B1E','#F4F4F6','#BDBDC5','#414146']);
  for(const tokens of [light,dark]) {
    assert.equal(tokens['font-sans'],"'Satoshi', sans-serif");assert.equal(tokens['font-display'],"'Satoshi', sans-serif");
    assert.equal(tokens['font-mono'],"'DM Mono', monospace");assert.equal(tokens['weight-heading'],'600');
    assert.equal(tokens['radius-panel'],'14px');assert.equal(tokens['radius-sm'],'7px');assert.match(tokens['page-gradient'],/^radial-gradient/);
    assert.match(tokens['chrome-gradient'],/^linear-gradient/);assert.notEqual(tokens['switch-off-track'],tokens.raise);
  }
  assert.equal(directions.contour.dark.ground,dark.ground);
  assert.match(cssTokens('contour'),/--font-mono: 'DM Mono', monospace/);
});
test('Foundation preserves component sizing and edition/instrument identities',()=>{
 const tokens=tokensFor('contour');
 for(const [key,value] of Object.entries({'control-h':'38px','button-height':'38px','control-h-touch':'44px','button-padding-inline':'13px','text-field':'12px','text-sm':'13px','space-1':'4px','space-2':'8px','space-3':'12px','space-4':'16px','page-pad':'32px','side-w':'210px','top-h':'60px','list-w':'280px','scrollbar-size':'2px'}))assert.equal(tokens[key],value,key);
 assert.equal(tokensFor('edition')['font-sans'],"'DM Sans', sans-serif");assert.equal(tokensFor('instrument').action,'#2357CB');
});
test('Text and semantic notes pass contrast; exact brand choices stay explicit',()=>{
 let checks=0;
 for(const mode of ['light','dark']){
  const t=tokensFor('contour',mode);
  for(const bg of ['ground','raise','sunken'])for(const text of ['ink','dim']){assert.ok(contrast(t[text],t[bg])>=4.5,`${mode} ${text}/${bg}`);checks++;}
  for(const role of ['ok','warn','bad','info']){assert.ok(contrast(t[role],t[`${role}Tint`])>=4.5,`${mode} ${role} note`);checks++;}
  for(const department of ['creative','engineering','client','company','strategy']){assert.equal(t[`dept-${department}-solid`],t[`dept-${department}`]);assert.equal(t[`dept-${department}-ink`],'#FFFFFF');}
  for(const role of ['link','focus','navSelected','accent-deep','action','actionHover'])assert.equal(t[role],t.accent,`${mode} ${role} uses the main pink`);
  assert.equal(t.action,t.accent);assert.equal(t.actionInk,'#FFFFFF');assert.ok(contrast(t.action,t.actionInk)>=3);
 }
 const light=tokensFor('contour');const brandRatio=contrast(light.action,light.actionInk);
 assert.ok(brandRatio>=3 && brandRatio<4.5,`Explicit white-on-brand-pink exception: ${brandRatio.toFixed(2)}:1`);
 console.log(`${checks} text/note checks pass. Approved light button exception: ${brandRatio.toFixed(2)}:1 (normal-text target 4.5:1).`);
});
test('Satoshi uses its publisher and local DM Mono assets are valid WOFF2',()=>{
 const css=fs.readFileSync(new URL('../src/contour/fonts.css',import.meta.url),'utf8');
 const files=[...css.matchAll(/url\('\.\/fonts\/([^']+)'\)/g)].map(match=>match[1]);
 assert.equal(files.length,1);
 for(const file of files){const data=fs.readFileSync(new URL(`../src/contour/fonts/${file}`,import.meta.url));assert.equal(data.subarray(0,4).toString(),'wOF2');}
 assert.match(css,/https:\/\/api\.fontshare\.com\/v2\/css/);assert.match(css,/satoshi@1/);
 const build=fs.readFileSync(new URL('../scripts/build-contour.mjs',import.meta.url),'utf8');assert.match(build,/copyFileSync/);assert.match(build,/fonts\.css/);
});
