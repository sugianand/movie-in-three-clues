import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {practiceChallengeShareText,sharePracticeChallenge} from '../lib/practice-challenge.ts';

const result={challenge:{key:'first-look',title:'First Look',description:'Solve early.'},day:'2026-10-22',streak:3};
const text=practiceChallengeShareText(result,'https://example.com/?room=SECRET');
assert.equal(text,'Three Clues · Daily Practice\n✅ First Look\n🔥 3-day challenge streak\n2026-10-22\nNo movie spoilers. Can you complete today’s challenge?\nhttps://example.com/');
assert.doesNotMatch(text,/SECRET|movie title|score/i,'share text excludes room codes, titles, and scores');assert.equal(practiceChallengeShareText(result,'file:///game'),null);
let shared=null,copied=null;assert.equal(await sharePracticeChallenge(text,{share:async data=>{shared=data;}}),'shared');assert.equal(shared.text,text);
assert.equal(await sharePracticeChallenge(text,{share:async()=>{throw Error('blocked');},copy:async value=>{copied=value;}}),'copied');assert.equal(copied,text);
assert.equal(await sharePracticeChallenge(text,{share:async()=>{const error=new Error('cancelled');error.name='AbortError';throw error;},copy:async()=>{throw Error('must not copy');}}),'cancelled');assert.equal(await sharePracticeChallenge(text,{}),'manual');
const component=readFileSync(new URL('../components/practice-challenge-share.tsx',import.meta.url),'utf8'),challenge=readFileSync(new URL('../components/practice-challenge.tsx',import.meta.url),'utf8'),progress=readFileSync(new URL('../components/practice-progress.tsx',import.meta.url),'utf8'),css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(component,/Share streak/);assert.match(component,/navigator\.share/);assert.match(component,/navigator\.clipboard/);assert.match(component,/Copyable practice challenge/);assert.match(challenge,/state\.completed&&<PracticeChallengeShare/);assert.match(progress,/challenge\.completedNow/);assert.match(css,/\.practice-challenge-share\{/);assert.match(css,/@media\(max-width:620px\)[^{]*\{\.practice-progress>\.practice-challenge-share/);
console.log('PASS: completed Daily Practice Challenges share without movies, scores, guesses, or room codes.');
