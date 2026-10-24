import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {practiceChallengeFor,practiceChallengeHistoryKey,practiceChallengeMatches,practiceChallengeState,practiceChallengeStreak,practiceChallengeWeek,practiceDayKey,readPracticeChallengeDays,recordPracticeChallenge} from '../lib/practice-challenge.ts';

const now=Date.UTC(2026,9,22,12),day=practiceDayKey(now),data=new Map();
const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};
const base={id:'match',playedAt:now,format:'classic',rounds:3,score:700,solved:3,firstClue:2,efficiency:70};
assert.equal(day,'2026-10-22');assert.equal(practiceChallengeFor(now).key,'first-look');assert.equal(practiceChallengeMatches(practiceChallengeFor(now),base),true);
assert.deepEqual(practiceChallengeState(storage,now),{challenge:practiceChallengeFor(now),day,completed:false,streak:0,week:practiceChallengeWeek([],now),weeklyCompleted:0,weeklyGoal:5});
const result=recordPracticeChallenge(storage,base,now);assert.equal(result.completedNow,true);assert.equal(result.streak,1);assert.deepEqual(readPracticeChallengeDays(storage),[day]);
assert.equal(recordPracticeChallenge(storage,{...base,id:'again'},now).completedNow,false,'a UTC day completes only once');
const yesterday=practiceDayKey(now-86_400_000);data.set(practiceChallengeHistoryKey,JSON.stringify([day,yesterday,'bad',yesterday]));assert.equal(practiceChallengeStreak(readPracticeChallengeDays(storage),now),2);
assert.equal(practiceChallengeStreak([yesterday],now),1,'yesterday keeps the streak alive before today is complete');data.set(practiceChallengeHistoryKey,'not json');assert.deepEqual(readPracticeChallengeDays(storage),[]);
const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8'),component=readFileSync(new URL('../components/practice-challenge.tsx',import.meta.url),'utf8'),progress=readFileSync(new URL('../components/practice-progress.tsx',import.meta.url),'utf8'),css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/!session&&entryStep==='landing'&&<PracticeChallenge\/>/);assert.match(component,/DAILY PRACTICE CHALLENGE/);assert.match(component,/Resets at midnight UTC/);assert.match(progress,/recordPracticeChallenge\(localStorage,session\)/);assert.match(progress,/Daily challenge complete!/);assert.match(css,/\.practice-challenge\{[^}]*backdrop-filter:blur\(10px\)/);assert.match(css,/@media\(max-width:620px\)\{\.practice-challenge\{/);
console.log('PASS: rotating Daily Practice Challenges are private, streak-aware, responsive and recorded once per UTC day.');
