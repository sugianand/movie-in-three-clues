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
assert.deepEqual([first.streak,first.bestStreak],[0,0]);
const second=advanceEncoreProgress(first,'2000',{...summary,solves:3},5);
assert.equal(second.lastOutcome?.complete,true,'the next unique match evaluates the active mission');
assert.deepEqual([second.streak,second.bestStreak],[1,1],'a completed mission starts a streak');
assert.equal(advanceEncoreProgress(second,'2000',{...summary,solves:0},5),second,'repeat result views cannot re-evaluate a mission');
const third=advanceEncoreProgress(second,'3000',{...summary,solves:4},5);
assert.deepEqual([third.streak,third.bestStreak],[2,2],'consecutive clears extend the current and best streak');
const missed=advanceEncoreProgress(third,'4000',{...summary,solves:0},5);
assert.deepEqual([missed.streak,missed.bestStreak],[0,2],'a miss resets only the current streak');

const memory=new Map(),storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)};
assert(writeEncoreProgress(storage,missed));assert.deepEqual(readEncoreProgress(storage),missed);
memory.set('three-clues-encore-v1',JSON.stringify({...second,version:1,streak:undefined,bestStreak:undefined}));
assert.deepEqual(readEncoreProgress(storage),{...second,version:2,streak:0,bestStreak:0},'version-one missions migrate without losing the active goal');
memory.set('three-clues-encore-v1','{"version":1,"active":{"kind":"broken"}}');
assert.equal(readEncoreProgress(storage),null,'malformed browser data fails quietly');
memory.set('three-clues-encore-v1',JSON.stringify({...second,streak:3,bestStreak:2}));
assert.equal(readEncoreProgress(storage),null,'a best streak cannot trail the current streak');
console.log('PASS: tracked Encore Missions are private, streak-aware, migration-safe and duplicate-proof.');
