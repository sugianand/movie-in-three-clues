import assert from 'node:assert/strict';
import {advanceEncoreProgress,completesEncoreMission,encoreMission,readEncoreProgress,writeEncoreProgress} from '../lib/encore-mission.ts';

const summary={score:400,solves:2,firstClues:1,averageClue:1.5,fastestMs:1200,headline:'Match complete'};
const perfect=encoreMission({...summary,solves:3},3);
assert.equal(perfect.kind,'perfect');assert.equal(perfect.target,'Solve every movie again.');
assert.equal(encoreMission({...summary,solves:0,firstClues:0},5).kind,'first-solve');
assert.equal(encoreMission({...summary,firstClues:0},5).kind,'first-clue');
const rate=encoreMission(summary,5);
assert.equal(rate.kind,'solve-rate');assert.equal(rate.target,'Beat your 40% solve rate.');

assert(completesEncoreMission(perfect,{...summary,solves:5},5),'perfect goals adapt to a new match length');
assert(completesEncoreMission(encoreMission({...summary,solves:0},5),{...summary,solves:1},3));
assert(completesEncoreMission(encoreMission({...summary,firstClues:0},5),{...summary,firstClues:1},10));
assert(completesEncoreMission(rate,{...summary,solves:3},5));
assert.equal(completesEncoreMission(rate,{...summary,solves:4},10),false,'matching the prior solve rate is not an improvement');

const first=advanceEncoreProgress(null,'1000',summary,5);
assert.equal(first.lastOutcome,null,'the first recorded match sets a mission without inventing an outcome');
const second=advanceEncoreProgress(first,'2000',{...summary,solves:3},5);
assert.equal(second.lastOutcome?.complete,true,'the next unique match evaluates the active mission');
assert.equal(advanceEncoreProgress(second,'2000',{...summary,solves:0},5),second,'repeat result views cannot re-evaluate a mission');

const memory=new Map(),storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)};
assert(writeEncoreProgress(storage,second));assert.deepEqual(readEncoreProgress(storage),second);
memory.set('three-clues-encore-v1','{"version":1,"active":{"kind":"broken"}}');
assert.equal(readEncoreProgress(storage),null,'malformed browser data fails quietly');
console.log('PASS: tracked Encore Missions are private, match-length safe, duplicate-proof and storage-resilient.');
