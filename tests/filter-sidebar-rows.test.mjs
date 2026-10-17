import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {FilterSidebar} from '../dist/contour/DataFilters.js';
import {Checkbox} from '../dist/contour/library.js';
import {CollectionLayout} from '../dist/contour/RecordLayouts.js';
const filters=[{id:'status',label:'Status',type:'multi',options:[{value:'running',label:'Running',count:12},{value:'review',label:'Waiting for editorial review',count:0}]},{id:'team',label:'Team',type:'multi',options:[{value:'creative',label:'Creative department with a long label',count:1234}]}];
const render=(Component,props)=>renderToStaticMarkup(React.createElement(Component,props));

test('All multi-filter groups separate Checkbox labels and right-aligned counts',()=>{
 const result=render(FilterSidebar,{filters,value:{status:['running']},onChange:()=>{}});
 assert.equal((result.match(/class="ct-filter-option-count"/g)||[]).length,3);
 assert.equal((result.match(/class="ct-choice-trailing"/g)||[]).length,3);
 assert.match(result,/aria-label="Running, 12"/);assert.match(result,/aria-label="Waiting for editorial review, 0"/);
 assert.match(result,/title="Creative department with a long label"/);assert.match(result,/type="checkbox"[^>]*checked=""/);
 assert.doesNotMatch(result,/<svg[^>]*lucide-filter/);
 const compact=render(FilterSidebar,{filters,value:{},onChange:()=>{},variant:'compact'});assert.match(compact,/data-variant="compact"/);assert.match(compact,/ct-choice-trailing/);
});
test('Checkbox trailing metadata does not become supporting text or alter hint associations',()=>{
 const result=render(Checkbox,{label:'Running',trailing:'12',hint:'Only published records'});
 assert.match(result,/ct-choice-trailing">12/);assert.match(result,/ct-choice-hint/);assert.match(result,/aria-describedby=/);assert.match(result,/Only published records/);
 const css=fs.readFileSync(new URL('../src/contour/library.css',import.meta.url),'utf8');
 assert.match(css,/:has\(> \.ct-choice-trailing\) \{grid-template-columns:16px minmax\(0,1fr\) max-content/);
 assert.match(css,/ct-choice-hint \{grid-column:1\/-1/);
});
test('Filter title and collection filter trigger use text and counts without decorative filter icons',()=>{
 const sidebar=render(FilterSidebar,{filters:[],value:{},onChange:()=>{}});assert.doesNotMatch(sidebar,/lucide-filter/);
 const layout=render(CollectionLayout,{title:'Projects',filters:'Filter fields',activeFilters:2,children:'Records'});
 assert.match(layout,/Filters \(2\)/);assert.doesNotMatch(layout,/lucide-sliders-horizontal/);
});
test('Filter count and label CSS preserve one-line rows and ellipsis at compact widths',()=>{
 const css=fs.readFileSync(new URL('../src/contour/dashboard.css',import.meta.url),'utf8');
 assert.match(css,/ct-filter-option-label \{[^}]*text-overflow:ellipsis;white-space:nowrap/);
 assert.match(css,/ct-filter-option-count \{[^}]*font-variant-numeric:tabular-nums;white-space:nowrap/);
 assert.doesNotMatch(css,/\.ct-filter-checks label\s*\{[^}]*display:\s*flex/);
 const facet=fs.readFileSync(new URL('../src/contour/data-lists.css',import.meta.url),'utf8');assert.match(facet,/ct-facet-count \{ flex:0 0 auto; max-width:none; white-space:nowrap/);
});

import {Button,IconButton} from '../dist/contour/ui.js';
const findElements=(node,component)=>{
 if(!React.isValidElement(node))return [];
 return [...(node.type===component?[node]:[]),...React.Children.toArray(node.props.children).flatMap(child=>findElements(child,component))];
};
test('Filter rows retain controlled selection, reset and compact rail expansion behavior',()=>{
 let next,expanded;
 const value={status:['running'],team:['creative'],search:'brief'};
 const tree=FilterSidebar({filters,value,onChange:result=>next=result});
 const options=findElements(tree,Checkbox);
 options[1].props.onChange({target:{checked:true}});
 assert.deepEqual(next,{status:['running','review'],team:['creative'],search:'brief'});
 options[0].props.onChange({target:{checked:false}});
 assert.deepEqual(next,{status:[],team:['creative'],search:'brief'});
 findElements(tree,Button).find(button=>button.props.children==='Reset filters').props.onClick();assert.deepEqual(next,{});
 const rail=FilterSidebar({filters,value,onChange:()=>{},collapsed:true,onCollapsedChange:result=>expanded=result});
 findElements(rail,IconButton)[0].props.onClick();assert.equal(expanded,false);
});
