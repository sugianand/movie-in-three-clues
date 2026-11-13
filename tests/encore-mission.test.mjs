import assert from 'node:assert/strict';
import {encoreMission} from '../lib/encore-mission.ts';

const summary={score:400,solves:2,firstClues:1,averageClue:1.5,fastestMs:1200,headline:'Match complete'};
assert.deepEqual(encoreMission({...summary,solves:3},3),{
 title:'Hold the spotlight',target:'Solve every movie again.',detail:'A perfect slate is yours to defend.',
},'perfect matches receive a defendable encore');
assert.equal(encoreMission({...summary,solves:0,firstClues:0},5).target,'Solve 1 movie next match.','a scoreless match starts with an achievable goal');
assert.equal(encoreMission({...summary,firstClues:0},5).target,'Land 1 first-clue solve.','players with solves receive an early-read challenge');
assert.equal(encoreMission(summary,5).target,'Solve 3 of 5 movies.','the standard mission asks for one more solve');
assert.equal(encoreMission({...summary,solves:9},10).target,'Solve 10 of 10 movies.','the solve target never exceeds the match length');
console.log('PASS: Encore Missions set a private, achievable next-match goal for every performance path.');
