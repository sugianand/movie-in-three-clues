import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {practiceChallengeBestKey,practiceChallengeFor,practiceChallengeState,readPracticeChallengeBest,recordPracticeChallenge} from '../lib/practice-challenge.ts';

const now=Date.UTC(2026,9,22,12),data=new Map(),storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};
const session={id:'first',playedAt:now,format:'classic',rounds:5,score:300,solved:2,firstClue:1,efficiency:25};
const first=recordPracticeChallenge(storage,session,now);assert.equal(first.bestProgress.percent,50);assert.equal(readPracticeChallengeBest(storage,now)?.label,'1 / 2 first-clue solves');
const worse=recordPracticeChallenge(storage,{...session,id:'worse',firstClue:0},now);assert.equal(worse.bestProgress.percent,50,'a weaker retry must not replace today’s best');
const complete=recordPracticeChallenge(storage,{...session,id:'complete',firstClue:2},now);assert.equal(complete.bestProgress.percent,100);assert.equal(practiceChallengeState(storage,now).bestProgress?.percent,100);
assert.equal(readPracticeChallengeBest(storage,now+86_400_000),null,'best progress expires with the UTC challenge');
data.set(practiceChallengeBestKey,'{"day":"bad"}');assert.equal(readPracticeChallengeBest(storage,now),null,'malformed progress fails closed');
data.set(practiceChallengeBestKey,JSON.stringify({day:'2026-10-22',challengeKey:practiceChallengeFor(now).key,progress:{value:9,target:2,percent:450,label:'bad',guidance:'bad'}}));assert.equal(readPracticeChallengeBest(storage,now),null,'out-of-range progress is rejected');
const component=readFileSync(new URL('../components/practice-challenge.tsx',import.meta.url),'utf8'),css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(component,/Best attempt today/);assert.match(component,/Try to beat today’s best/);assert.match(component,/aria-label={`Best attempt:/);assert.match(css,/\.practice-challenge-best\{/);
console.log('PASS: Daily Practice preserves and displays the best challenge attempt for the current UTC day.');
