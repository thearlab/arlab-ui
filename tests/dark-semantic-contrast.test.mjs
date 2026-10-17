import {test} from 'node:test';
import assert from 'node:assert/strict';
import {satinLiftTokens} from '../src/contour/satin-foundation.js';
const luminance=hex=>hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);
test('semantic text retains readable contrast against its own tint in both modes',()=>{
 for(const mode of ['light','dark']) {
  const tokens=satinLiftTokens(mode);
  const roles=['ok','bad','info','planning','warn'];
  assert.equal(new Set(roles.map(role=>tokens[role])).size,roles.length);
  for(const role of roles) {
   const a=luminance(tokens[role]),b=luminance(tokens[`${role}Tint`]);
   assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,`${mode} ${role} contrast`);
  }
 }
});
