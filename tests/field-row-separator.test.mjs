import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {FieldRow,Separator} from '../dist/contour/index.js';
import fs from 'node:fs';
import postcss from 'postcss';

test('FieldRow leaves visual grouping to an optional shared Separator',()=>{
 const row=renderToStaticMarkup(React.createElement(FieldRow,{label:'Access',hint:'Team members'},'Team'));
 assert.doesNotMatch(row,/separator|border/);
 const divider=renderToStaticMarkup(React.createElement(Separator,{}));
 assert.match(divider,/class="ct-separator "/);assert.match(divider,/aria-hidden="true"/);
 const named=renderToStaticMarkup(React.createElement(Separator,{orientation:'vertical',decorative:false,label:'Properties'}));
 assert.match(named,/role="separator"/);assert.match(named,/aria-orientation="vertical"/);assert.match(named,/aria-label="Properties"/);
 const css=postcss.parse(fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8'));
 let fieldRule;css.walkRules(rule=>{if(rule.selector==='.arlab-contour .lib-field-row')fieldRule=rule;});
 assert.ok(fieldRule);assert.equal(fieldRule.nodes.some(node=>node.prop==='border-bottom'),false);
});
