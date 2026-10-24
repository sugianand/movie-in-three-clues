import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {practiceChallengeCountdown} from '../lib/practice-challenge.ts';

assert.deepEqual(practiceChallengeCountdown(Date.parse('2026-10-24T12:30:00Z')),{dateTime:'2026-10-25T00:00:00.000Z',totalMinutes:690,label:'11h 30m'});
assert.deepEqual(practiceChallengeCountdown(Date.parse('2026-10-24T23:59:30Z')),{dateTime:'2026-10-25T00:00:00.000Z',totalMinutes:1,label:'1m'});
assert.deepEqual(practiceChallengeCountdown(Date.parse('2026-10-25T00:00:00Z')),{dateTime:'2026-10-26T00:00:00.000Z',totalMinutes:1440,label:'24h'});
const component=readFileSync(new URL('../components/practice-challenge.tsx',import.meta.url),'utf8'),css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(component,/setInterval\(\(\)=>setClock\(Date\.now\(\)\),60_000\)/);assert.match(component,/state\.completed\?'Next challenge':'Challenge ends'/);assert.match(component,/aria-live="polite"/);assert.match(component,/dateTime=\{countdown\.dateTime\}/);assert.match(css,/\.practice-challenge-countdown\{/);assert.match(css,/font-variant-numeric:tabular-nums/);
console.log('PASS: Daily Practice shows an accessible live countdown to the UTC challenge reset.');
