import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {practiceChallengeState,practiceChallengeWeek} from '../lib/practice-challenge.ts';

const now=Date.UTC(2026,9,23,12),days=['2026-10-23','2026-10-22','2026-10-20'];
const week=practiceChallengeWeek(days,now);assert.equal(week.length,7);assert.deepEqual(week.map(item=>item.label),['Sat','Sun','Mon','Tue','Wed','Thu','Fri']);assert.deepEqual(week.filter(item=>item.completed).map(item=>item.day),['2026-10-20','2026-10-22','2026-10-23']);assert.equal(week.at(-1).today,true);
const storage={getItem:()=>JSON.stringify(days)},state=practiceChallengeState(storage,now);assert.deepEqual(state.week,week);assert.equal(state.completed,true);
const component=readFileSync(new URL('../components/practice-challenge.tsx',import.meta.url),'utf8'),css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(component,/Seven-day challenge history/);assert.match(component,/Last 7 UTC days/);assert.match(component,/item\.today\?'is-today'/);assert.match(css,/\.practice-challenge-week\{/);assert.match(css,/\.practice-challenge-week \.is-complete i/);assert.match(css,/grid-template-columns:repeat\(7,1fr\)/);
console.log('PASS: Daily Practice shows an accessible seven-day completion calendar.');
