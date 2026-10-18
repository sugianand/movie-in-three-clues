import assert from 'node:assert/strict';
import {revealTitleOption} from '../lib/title-option-scroll.ts';
function list(top,bottom){return {scrollTop:100,clientTop:1,clientHeight:100,getBoundingClientRect:()=>({top:20}),children:[{getBoundingClientRect:()=>({top,bottom})}]};}
const below=list(100,144);revealTitleOption(below,0);assert.equal(below.scrollTop,123);
const above=list(-10,34);revealTitleOption(above,0);assert.equal(above.scrollTop,69);
const visible=list(30,74);revealTitleOption(visible,0);assert.equal(visible.scrollTop,100);
const edge=list(21,121);revealTitleOption(edge,0);assert.equal(edge.scrollTop,100);
for(const index of [-1,2]){revealTitleOption(visible,index);assert.equal(visible.scrollTop,100);}
assert.doesNotThrow(()=>revealTitleOption(null,0));
console.log('PASS: keyboard selection scrolls only clipped suggestions, preserving visible rows and guarding stale indexes.');
