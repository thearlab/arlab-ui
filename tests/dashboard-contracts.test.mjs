import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Avatar,Status} from '../dist/contour/ui.js';
import {StateView,SegmentedControl} from '../dist/contour/library.js';
const html = (component, props) => renderToStaticMarkup(React.createElement(component,props));

test('Avatar supports compact sizes, image content and native descriptions', () => {
  const compact = html(Avatar,{size:22,initials:'AB',name:'Amina',title:'Amina'});
  assert.match(compact,/width:22px;height:22px/);
  assert.match(compact,/aria-label="Amina"/);
  assert.match(compact,/title="Amina"/);
  const image = html(Avatar,{src:'/amina.png',name:'Amina'});
  assert.match(image,/<img[^>]*src="\/amina.png"/);
  assert.match(image,/alt=""/);
  assert.doesNotMatch(html(Avatar,{size:-1}),/width:-1/);
});
test('Status retains native tooltip and live status semantics', () => {
  const result = html(Status,{children:'Ready',title:'Published version',role:'status'});
  assert.match(result,/title="Published version"/);
  assert.match(result,/role="status"/);
});
test('StateView supports product actions without creating projects', () => {
  const custom = html(StateView,{actionLabel:'Invite a person',onAction:()=>{}});
  assert.match(custom,/Invite a person/);
  assert.doesNotMatch(custom,/Create project<\/button>/);
  assert.match(html(StateView,{state:'error',onRetry:()=>{}}),/Try again/);
  const slot = html(StateView,{action:React.createElement('a',{href:'/guide'},'Read guide'),onCreate:()=>{}});
  assert.match(slot,/href="\/guide"/);
  assert.doesNotMatch(slot,/Create project<\/button>/);
});
test('SegmentedControl emits stable values, avoids form submission and skips disabled options with keyboard', () => {
  const changes=[];
  const options=[{value:'list',label:'List view'},{value:'grid',label:'Grid view',disabled:true},{value:'board',label:'Board view'}];
  const group=SegmentedControl({options,value:'list',onChange:value=>changes.push(value)});
  const buttons=group.props.children;
  buttons[2].props.onClick();
  assert.deepEqual(changes,['board']);
  assert.equal(buttons[0].props.type,'button');
  assert.equal(buttons[0].props['aria-pressed'],true);
  let focused=-1;
  buttons[0].props.onKeyDown({key:'ArrowRight',preventDefault(){},currentTarget:{parentElement:{querySelectorAll:()=>[0,1].map(i=>({focus:()=>focused=i}))}}});
  assert.deepEqual(changes,['board','board']);
  assert.equal(focused,1);
  assert.match(html(SegmentedControl,{options:['List','Grid'],value:'List',onChange:()=>{}}),/List/);
});
