import assert from 'node:assert/strict';
import {dailyCardSvg,dailyCardPng} from '../lib/daily-card.ts';
const base={done:true,date:'2026-10-10',number:2,score:300,marks:['hit']};
// Even a full server response with hostile/private text cannot enter the card.
const clean=dailyCardSvg(base);
const privateResult={...base,answer:{title:'SECRET MOVIE'},clues:['SECRET CLUE'],guesses:['SECRET GUESS'],token:'SECRET TOKEN',stats:{streak:999},history:[{title:'SECRET HISTORY'}]};
assert.equal(dailyCardSvg(privateResult),clean);
assert(!clean.includes('SECRET'));assert(!clean.includes('<script'));assert(!clean.includes('href='));
assert(clean.includes('width="1080" height="1080"'));
for(const [score,marks] of [[300,['hit']],[200,['skip','hit']],[100,['miss','miss','hit']],[0,['miss','skip','miss']],[0,['skip','skip','skip']]]){
 const svg=dailyCardSvg({...base,score,marks});
 assert(svg.includes(`>${score}</text>`));
 assert.equal((svg.match(/>CLUE [123]</g)||[]).length,3);
 assert.equal((svg.match(/>SOLVED</g)||[]).length,score?1:0);
 assert.equal((svg.match(/>UNUSED</g)||[]).length,3-marks.length);
}
for(const changes of [{done:false},{date:'<script>alert(1)</script>'},{number:NaN},{number:1.1},{number:1000000},{score:150},{marks:['<img>']},{marks:[]},{marks:['hit','miss']},{score:300,marks:['miss','hit']},{score:0,marks:['miss']},{score:0,marks:['hit','hit','hit']}])assert.throws(()=>dailyCardSvg({...base,...changes}));
// Exercise PNG output and temporary-URL cleanup, including browser failures.
const original={Image:globalThis.Image,document:globalThis.document,create:URL.createObjectURL,revoke:URL.revokeObjectURL};
let creates=0,revokes=0,draws=0,failImage=false,noContext=false,failBlob=false;
URL.createObjectURL=()=>{creates++;return 'blob:test';};URL.revokeObjectURL=url=>{assert.equal(url,'blob:test');revokes++;};
globalThis.Image=class{set src(value){assert.equal(value,'blob:test');queueMicrotask(()=>failImage?this.onerror():this.onload());}};
globalThis.document={createElement(tag){assert.equal(tag,'canvas');return {getContext(){return noContext?null:{drawImage(image,x,y){assert.equal(x,0);assert.equal(y,0);draws++;}};},toBlob(callback,type){assert.equal(this.width,1080);assert.equal(this.height,1080);assert.equal(type,'image/png');callback(failBlob?null:new Blob(['png'],{type}));}};}};
try{
 assert.equal((await dailyCardPng(clean)).type,'image/png');assert.equal(draws,1);
 failImage=true;await assert.rejects(dailyCardPng(clean),/preview could not load/);failImage=false;
 noContext=true;await assert.rejects(dailyCardPng(clean),/unavailable/);noContext=false;
 failBlob=true;await assert.rejects(dailyCardPng(clean),/export failed/);
 assert.equal(creates,4);assert.equal(revokes,4);
}finally{globalThis.Image=original.Image;globalThis.document=original.document;URL.createObjectURL=original.create;URL.revokeObjectURL=original.revoke;}
console.log('Daily image cards: all scores, privacy allowlist, invalid results, PNG export and URL cleanup passed.');
