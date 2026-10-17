import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ActionGroup,Button} from '../dist/contour/index.js';
const children=[React.createElement(Button,{key:'save'},'Save'),React.createElement(Button,{key:'cancel'},'Cancel')];
const html=props=>renderToStaticMarkup(React.createElement(ActionGroup,props,children));
test('existing action groups keep every visible button and do not gain a menu or wrapper',()=>{
 for(const overflowActions of [undefined,[]]){
  const result=html({equalWidth:true,overflowActions});assert.match(result,/data-equal-width="true"/);assert.doesNotMatch(result,/ct-action-group-controls|More actions|data-overflow/);assert.match(result,/>Save<\/button>/);assert.match(result,/>Cancel<\/button>/);
 }
});
test('optional secondary actions use the shared icon menu while equal widths apply only to visible controls',()=>{
 const result=html({equalWidth:true,label:'Record actions',overflowLabel:'More record actions',overflowActions:[{label:'Duplicate',onSelect(){}},{label:'Remove',danger:true,onSelect(){}}]});
 assert.match(result,/data-overflow="true"/);assert.match(result,/class="ct-action-group-controls" data-equal-width="true"/);assert.match(result,/aria-label="More record actions"/);assert.match(result,/aria-haspopup="menu"/);assert.match(result,/data-button="icon"/);assert.match(result,/>Save<\/button>/);assert.match(result,/>Cancel<\/button>/);assert.doesNotMatch(result,/role="menuitem"/);
});
