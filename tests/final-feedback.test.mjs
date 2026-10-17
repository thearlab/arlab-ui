import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Checkbox,AccountMenu,Chip,Timestamp,SortHead} from '../dist/contour/library.js';
import {Loader,PageLoading} from '../dist/contour/loading.js';
const html=(C,p)=>renderToStaticMarkup(React.createElement(C,p));
test('Checkbox separates supporting description and retains supplied accessible descriptions',()=>{
 const output=html(Checkbox,{label:'Notify the team',hint:'One message before review.','aria-describedby':'external-help'});
 assert.match(output,/aria-labelledby="[^"]+-label"/);assert.match(output,/aria-describedby="external-help [^"]+-hint"/);
 assert.match(output,/<span[^>]*ct-choice-label[^>]*>Notify the team<\/span><small/);
 assert.match(output,/ct-choice-hint[^>]*>One message before review\.<\/small>/);
});
test('Account identity is not a trigger and only sign out is interactive',()=>{
 const output=html(AccountMenu,{name:'Maya',roleCaption:'Creative director',onLogout:()=>{}});
 assert.equal((output.match(/<button/g)||[]).length,1);assert.match(output,/aria-label="Log out"/);assert.doesNotMatch(output,/aria-haspopup|account-trigger|role="menu"/);
});
test('action Chip does not submit forms and date-only Timestamp omits the time',()=>{
 const chip=html(Chip,{children:'Reset tags',onClick:()=>{},disabled:true});assert.match(chip,/<button[^>]*type="button"/);assert.match(chip,/disabled=""/);
 const stamp=html(Timestamp,{date:'2026-10-21T12:00:00Z',format:'date'});assert.match(stamp,/21 October/);assert.doesNotMatch(stamp,/timestamp-divider|timestamp-time/);
});
test('Loader uses the selected circular outline and one accessible status',()=>{
 const output=html(Loader,{});assert.equal((output.match(/<circle/g)||[]).length,2);assert.doesNotMatch(output,/<rect/);assert.equal((output.match(/role="status"/g)||[]).length,1);
});
test('SortHead shares the table sort control and announces the next direction',()=>{
 const output=html(SortHead,{label:'Project',direction:'ascending',onSort:()=>{}});
 assert.match(output,/scope="col"/);assert.match(output,/aria-sort="ascending"/);
 assert.match(output,/class="ct-table-sort"/);assert.match(output,/aria-label="Sort Project descending"/);
 assert.match(output,/ct-sort-arrows/);assert.equal((output.match(/data-active="true"/g)||[]).length,1);
});
test('Content preview loading includes one live message and a decorative circular loader',()=>{
 const output=html(PageLoading,{title:'Opening your workspace'});
 assert.equal((output.match(/role="status"/g)||[]).length,1);
 assert.match(output,/aria-busy="true"/);assert.match(output,/ct-content-loading-copy/);
 assert.equal((output.match(/<circle/g)||[]).length,2);
});
