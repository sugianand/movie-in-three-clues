import assert from 'node:assert/strict';
import fs from 'node:fs';
import {seriesRace,seriesStakes} from '../lib/series-stakes.ts';

assert.equal(seriesStakes([{name:'Sugi',seriesWins:1}],3),null,'match point begins one win from the crown');
assert.equal(seriesStakes([{name:'Sugi',seriesWins:3}],3),null,'champions use the dedicated winner treatment');
assert.deepEqual(seriesStakes([{name:'Sugi',seriesWins:2},{name:'Guest',seriesWins:1}],3),{leaders:['Sugi'],wins:2,goal:3,remaining:1,headline:'Sugi is on match point.'});
assert.equal(seriesStakes([{name:'Sugi',seriesWins:2},{name:'Guest',seriesWins:2}],3)?.headline,'Sugi & Guest are on match point.');
assert.equal(seriesStakes([{name:'A',seriesWins:2},{name:'B',seriesWins:2},{name:'C',seriesWins:2}],3)?.headline,'3 players are on match point.');
assert.equal(seriesStakes([{name:'Invalid',seriesWins:-1}],3),null);
assert.equal(seriesRace([{name:'Sugi',seriesWins:0},{name:'Guest',seriesWins:0}],3)?.headline,'The race for the crown starts now.');
assert.equal(seriesRace([{name:'Sugi',seriesWins:1},{name:'Guest',seriesWins:0}],3)?.headline,'Sugi leads the series.');
assert.equal(seriesRace([{name:'Sugi',seriesWins:1},{name:'Guest',seriesWins:1}],3)?.headline,'Sugi & Guest share the lead.');
assert.deepEqual(seriesRace([{name:'Guest',seriesWins:0},{name:'Sugi',seriesWins:2}],3)?.players.map(player=>player.name),['Sugi','Guest'],'live standings are sorted by series wins');
const page=fs.readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8'),component=fs.readFileSync(new URL('../components/series-stakes.tsx',import.meta.url),'utf8'),css=fs.readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/<SeriesStakes/);assert.match(component,/LIVE RACE/);assert.match(component,/MATCH POINT/);assert.match(component,/series-race-dots/);assert.match(component,/next match could decide/i);assert.match(component,/win this match claims/i);assert.match(css,/\.series-stakes\{/);assert.match(css,/\.series-race-list/);assert.match(css,/@media\(max-width:560px\)/);
console.log('PASS: live series standings track every race and preserve match-point and championship states.');
