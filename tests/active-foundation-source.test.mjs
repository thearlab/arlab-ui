import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ContourProvider} from '../dist/contour/provider.js';
import {ColorPicker} from '../dist/contour/DashboardFields.js';
import {PhaseBar} from '../dist/contour/ProjectIndicators.js';
import {tokensFor} from '../dist/contour/system.js';
const root=new URL('../src/contour/',import.meta.url);

test('Active runtime components inherit font families from foundation tokens',()=>{
  const files=fs.readdirSync(root).filter(file=>/\.(?:tsx?|jsx?)$/.test(file)&&!['system.js','satin-foundation.js'].includes(file));
  for(const file of files){const source=fs.readFileSync(new URL(file,root),'utf8');assert.doesNotMatch(source,/["'](?:Urbanist|Manrope|IBM Plex Mono|Inter)["']/,file);}
  console.log(`${files.length} active runtime source files checked for obsolete font family literals.`);
});
test('Custom ColorPicker preview uses the active brand token without overwriting valid colors',()=>{
  for(const mode of ['light','dark']){
    const render=value=>renderToStaticMarkup(React.createElement(ContourProvider,{mode},React.createElement(ColorPicker,{label:'Brand color',value,onChange:()=>{}})));
    const invalid=render('invalid');const accent=tokensFor('contour',mode).accent;
    assert.match(invalid,new RegExp(`ct-color-trigger[^>]*><span style="background:${accent}`));
    assert.match(invalid,new RegExp(`such as ${accent}`));
    assert.match(render('#123ABC'),/ct-color-trigger[^>]*><span style="background:#123ABC/);
  }
});
test('Phase indicators use shared chart/accent tokens while accepting application-owned phase colors',()=>{
  const themed=renderToStaticMarkup(React.createElement(PhaseBar,{phases:[{id:'brief',label:'Brief'}],current:'brief'}));
  assert.match(themed,/var\(--chart-1, var\(--accent\)\)/);assert.doesNotMatch(themed,/#8d617d/i);
  const custom=renderToStaticMarkup(React.createElement(PhaseBar,{phases:[{id:'brief',label:'Brief',color:'#123ABC'}],current:'brief'}));assert.match(custom,/#123ABC/);
});
