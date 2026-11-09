import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {QuestionThread} from '../dist/contour/index.js';
const html=props=>renderToStaticMarkup(React.createElement(QuestionThread,{onAnswer:()=>{},...props}));
test('answered questions read as a thread with Change only while editable',()=>{
 const out=html({history:[{id:'a',question:'Where will it run?',answer:'In a mall',onChange:()=>{}},{id:'b',question:'Budget?',answer:"I don't know"}]});
 assert.match(out,/<ol class="ct-question-thread-history" aria-label="Your answers so far">/);
 assert.match(out,/ct-question-thread-a">In a mall<button type="button" class="ct-question-thread-change" aria-label="Change answer: Where will it run\?">Change<\/button>/);
 assert.equal(out.match(/>Change</g).length,1);
 assert.match(out,/All answered\./);
});
test('current question shows context, step, why, quick answers and the answer form in a live region',()=>{
 const out=html({current:{context:'Pearl Breath · Digital Installations',question:'How many screens?',why:'Screens set the hardware cost.',options:['One','More'],answer:'Two'},progress:{index:2,total:5},onDontKnow:()=>{}});
 assert.match(out,/aria-live="polite"/);
 assert.match(out,/Pearl Breath · Digital Installations · question 2 of 5/);
 assert.match(out,/Why we ask: Screens set the hardware cost\./);
 assert.match(out,/role="group" aria-label="Quick answers"/);
 assert.equal(out.match(/lib-pill-button/g).length,2);
 assert.match(out,/aria-label="Your answer"[^>]*value="Two"/);
 assert.match(out,/type="submit" class="btn primary[^"]*"[^>]*>Answer</);
 assert.match(out,/btn quiet[^>]*>I don&#x27;t know</);
 assert.doesNotMatch(out,/All answered/);
});
test('no answer submits empty, I do not know is optional, waiting lines and doneLabel',()=>{
 const out=html({current:{question:'Q'},dontKnowLabel:'Not sure'});
 assert.match(out,/type="submit"[^>]*disabled=""/);
 assert.doesNotMatch(out,/Not sure/);
 const waiting=html({waiting:['Re-assessing Pearl Breath with your answers...'],doneLabel:null});
 assert.match(waiting,/role="status"/);assert.match(waiting,/role="progressbar"/);
 assert.doesNotMatch(waiting,/All answered/);
 assert.equal(html({doneLabel:null}).includes('ct-question-thread-context'),false);
});
test('styles use tokens only and ship scoped',()=>{
 const src=fs.readFileSync(new URL('../src/contour/question-thread.css',import.meta.url),'utf8');
 assert.doesNotMatch(src,/#[0-9a-f]{3,8}\b|rgba?\(/i);
 assert.doesNotMatch(src,/font-size: \d/);
 const css=fs.readFileSync(new URL('../dist/contour/styles.css',import.meta.url),'utf8');
 assert.match(css,/\.arlab-contour \.ct-question-thread-a/);
});
