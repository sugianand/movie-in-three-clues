import assert from 'node:assert/strict';
import {personalMatchSummary} from '../lib/personal-match-summary.ts';

const result={totalRounds:3,me:{id:'p1',spectator:false},players:[{id:'p1',name:'Alex',score:500},{id:'p2',name:'Alex',score:200}],recap:[
 {solvers:[{id:'p1',name:'Alex',clue:1,ms:1200},{id:'p2',name:'Alex',clue:2,ms:2000}]},
 {solvers:[{id:'p1',name:'Alex',clue:2,ms:3100}]},
 {solvers:[]},
]};
assert.deepEqual(personalMatchSummary(result),{score:500,solves:2,firstClues:1,averageClue:1.5,fastestMs:1200,headline:'Strong first impressions — your early reads landed.'},'stable IDs keep the private debrief personal');
assert.equal(personalMatchSummary({...result,me:{id:'p1',spectator:true}}),null,'spectators do not receive a player debrief');
assert.equal(personalMatchSummary({...result,me:{id:'missing',spectator:false}}),null,'missing seats fail quietly');
assert.equal(personalMatchSummary({...result,recap:[{solvers:[]},{solvers:[]},{solvers:[]}]}).headline,'Fresh start. Take the next match one clue at a time.');
assert.equal(personalMatchSummary({...result,recap:result.recap.map((round,index)=>({solvers:[{id:'p1',name:'Alex',clue:index+1,ms:1000+index}]}))}).headline,'Perfect slate — every movie found.');
const legacy={...result,players:[{id:'p1',name:'Sugi',score:300}],recap:[{solvers:[{name:'Sugi',clue:3}]}]};
assert.equal(personalMatchSummary(legacy).solves,1,'legacy name-only recaps remain supported');
console.log('PASS: personal match debrief is private, identity-safe, spoiler-free and legacy-compatible.');
