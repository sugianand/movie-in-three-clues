import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dailyMilestones} from '../lib/daily-milestones.ts';

const empty=dailyMilestones({played:0,wins:0,bestStreak:0,points:0,counts:[0,0,0,0]});
assert.equal(empty.length,6);assert(empty.every(item=>!item.earned));assert.equal(empty.find(item=>item.id==='headliner')?.progress,'0 / 3,000');
const progress=dailyMilestones({played:7,wins:4,bestStreak:3,points:1600,counts:[1,2,1,3]});
assert.deepEqual(progress.map(item=>item.earned),[true,true,true,true,true,false]);assert.equal(progress.at(-1)?.progress,'1,600 / 3,000');
const complete=dailyMilestones({played:30,wins:20,bestStreak:8,points:4200,counts:[6,7,7,10]});assert(complete.every(item=>item.earned));assert(complete.every(item=>!item.description.toLowerCase().includes('movie')));
const component=readFileSync(new URL('../components/daily-milestones.tsx',import.meta.url),'utf8'),daily=readFileSync(new URL('../components/daily-premiere.tsx',import.meta.url),'utf8'),css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(component,/PREMIERE PASSPORT/);assert.match(component,/No movie answers are stored here/);assert.match(component,/aria-label="Daily Premiere Passport"/);assert.match(daily,/DailyMilestones stats=\{data\.stats\} counts=\{data\.performance\.counts\}/);assert.match(css,/\.daily-milestone-grid\{/);
console.log('PASS: Daily Premiere Passport derives six private, progress-aware milestones without movie spoilers.');
