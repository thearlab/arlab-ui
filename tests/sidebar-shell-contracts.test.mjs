import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {SidebarShell,ArlabMark} from '../dist/contour/index.js';
const props={brand:React.createElement(ArlabMark,{height:21}),toolName:'Studio',spaces:[{id:'creative',label:'Creative',dept:'creative'},{id:'website',label:'Website'}],activeSpace:'creative',navigation:'Tool navigation',children:'Workspace content',account:({collapsed})=>React.createElement('span',{'data-account-state':String(collapsed)},'Maya'),onHelp(){},onSettings(){}};
const render=extra=>renderToStaticMarkup(React.createElement(SidebarShell,{...props,...extra}));

test('spaces shell defaults to compact outer rail and keeps its inner navigation and account open',()=>{
 const html=render();assert.match(html,/data-rail-collapsed="true"/);assert.doesNotMatch(html,/data-panel-collapsed/);assert.doesNotMatch(html,/Collapse space navigation/);
 const rail=html.match(/<aside[^>]+class="contour-spaces-rail"[\s\S]*?<\/aside>/)[0];
 assert.match(rail,/viewBox="0 -48 842 842"/);assert.doesNotMatch(rail,/data-account-state/);
 assert.match(html,/<footer class="contour-space-panel-footer"><span data-account-state="false">Maya/);
 assert.ok(rail.indexOf('aria-label="Help"')<rail.indexOf('aria-label="Settings"'));assert.ok(rail.indexOf('aria-label="Settings"')<rail.indexOf('aria-label="Expand spaces rail"'));
});

test('expanded rail uses the supplied full wordmark and neutral glyph tiles separate from labels',()=>{
 const html=render({railCollapsed:false});assert.doesNotMatch(html,/data-rail-collapsed/);
 const rail=html.match(/<aside[^>]+class="contour-spaces-rail"[\s\S]*?<\/aside>/)[0];
 assert.match(rail,/viewBox="0 0 2003 630"/);assert.match(rail,/contour-dept-tile-compact/);assert.match(rail,/contour-rail-action-glyph/);assert.match(rail,/<span class="contour-space-name">Creative<\/span>/);
 assert.match(rail,/aria-label="Collapse spaces rail" aria-expanded="true"/);
});

test('explicit legacy visibility remains host-owned without reintroducing a fold control',()=>{
 const html=render({panelCollapsed:true});assert.match(html,/class="contour-space-panel"[^>]+hidden=""/);assert.doesNotMatch(html,/Expand space navigation/);assert.match(html,/Expand spaces rail/);
});

test('single shell keeps help, settings and collapse together in its fixed footer',()=>{
 const html=render({spaces:undefined,collapsed:false});
 const nav=html.match(/<aside[^>]+class="contour-navigation [^"]*"[\s\S]*?<\/aside>/)[0];
 const footer=nav.slice(nav.indexOf('<footer'));
 assert.match(footer,/aria-label="Help"/);assert.match(footer,/aria-label="Settings"/);assert.match(footer,/aria-label="Collapse navigation" aria-expanded="true"/);
 assert.ok(footer.indexOf('aria-label="Settings"')<footer.indexOf('aria-label="Collapse navigation"'));
 assert.doesNotMatch(nav.slice(0,nav.indexOf('</header>')),/Collapse navigation/);
});
