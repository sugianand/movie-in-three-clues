import assert from 'node:assert/strict';
import {scoreJourney} from '../lib/score-journey.ts';

const journey=scoreJourney([
 {round:2,totals:[{name:'Ava',score:500},{name:'Ben',score:600}]},
 {round:0,totals:[{name:'Ava',score:300},{name:'Ben',score:-100}]},
 {round:1,totals:[{name:'Ava',score:300},{name:'Ben',score:300}]},
]);
assert.deepEqual(journey.rounds,[0,1,2]);
assert.deepEqual(journey.rows.map(row=>row.name),['Ben','Ava'],'final standings order the rows');
assert.deepEqual(journey.rows[0],{name:'Ben',scores:[-100,300,600],leaders:[false,true,true]});
assert.deepEqual(journey.rows[1],{name:'Ava',scores:[300,300,500],leaders:[true,true,false]});

const teams=scoreJourney([{round:0,totals:[{name:'Reel Legends',score:200},{name:'Plot Twisters',score:200}]}]);
assert(teams.rows.every(row=>row.leaders[0]),'ties highlight every leader');
assert.deepEqual(scoreJourney([{round:0},{round:1,totals:[{name:'Broken',score:Number.NaN}]}]),{rounds:[],rows:[]},'legacy and malformed totals stay hidden');
console.log('PASS: score journey ordering, negative scores, lead changes, ties and legacy recap compatibility.');
