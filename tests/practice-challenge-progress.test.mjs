import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {practiceChallengeProgress,recordPracticeChallenge} from '../lib/practice-challenge.ts';

const session={id:'run',playedAt:Date.UTC(2026,9,22),format:'classic',rounds:5,score:500,solved:3,firstClue:1,efficiency:45};
assert.deepEqual(practiceChallengeProgress({key:'first-look',title:'First Look',description:''},session),{value:1,target:2,percent:50,label:'1 / 2 first-clue solves',guidance:'Solve 1 more movie on clue one in a single run.'});
assert.equal(practiceChallengeProgress({key:'clean-sweep',title:'Clean Sweep',description:''},session).percent,60);
assert.match(practiceChallengeProgress({key:'sharp-cut',title:'Sharp Cut',description:''},session).guidance,/15 percentage points/);
assert.deepEqual(practiceChallengeProgress({key:'lightning-strike',title:'Lightning Strike',description:''},session),{value:0,target:5,percent:0,label:'Lightning format required',guidance:'Switch Format to Lightning, then solve 5 movies in one run.'});
const data=new Map(),storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)},result=recordPracticeChallenge(storage,session,Date.UTC(2026,9,22,12));assert.equal(result.completed,false);assert.equal(result.progress.percent,50);
const component=readFileSync(new URL('../components/practice-progress.tsx',import.meta.url),'utf8'),css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(component,/Daily challenge progress/);assert.match(component,/practice-challenge-meter/);assert.match(component,/Math\.min\(100,challenge\.progress\.percent\)/);assert.match(css,/\.practice-challenge-meter\{/);assert.match(css,/\.practice-challenge-result\.is-complete/);
console.log('PASS: Daily Practice results show exact progress and actionable retry coaching.');
