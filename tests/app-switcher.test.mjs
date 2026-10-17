import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {AppSwitcher} from '../dist/contour/library.js';
test('AppSwitcher identifies the current app and commits custom application values',()=>{
 const changed=[];let closed=false;
 const props={value:'ops',onChange:value=>changed.push(value),options:[{value:'ops',label:'Operations',description:'Daily work'},{value:'docs',label:'Knowledge',description:'Reference library'}]};
 const html=renderToStaticMarkup(React.createElement(AppSwitcher,props));assert.match(html,/Switch application: Operations/);assert.match(html,/aria-haspopup="menu"/);assert.match(html,/type="button"/);
 const element=AppSwitcher(props);const menu=element.props.children.props.children(()=>closed=true);const buttons=menu.props.children[1];
 assert.equal(buttons[0].props['aria-checked'],true);buttons[1].props.onClick();assert.deepEqual(changed,['docs']);assert.equal(closed,true);
});

test('Content-preview loading is a centered shell-body state with one live announcement',async()=>{
 const {PageLoading}=await import('../dist/contour/loading.js');
 const html=renderToStaticMarkup(React.createElement(PageLoading,{variant:'content-preview',title:'Opening your workspace',description:'Fetching recent activity.'}));
 assert.match(html,/class="ct-content-loading"/);assert.match(html,/aria-busy="true"/);assert.equal((html.match(/role="status"/g)||[]).length,1);assert.match(html,/aria-hidden="true"/);assert.match(html,/Opening your workspace/);assert.doesNotMatch(html,/<header>|<footer>/);
});
