import assert from 'node:assert/strict';
import {act,advance,comebackHighlight,fastestSolve,movies,newRoom,player,view} from '../lib/game.ts';
const host=player('Host'),guest=player('Guest'),room=newRoom('REC234',host,1);room.players.push(guest);act(room,host.token,{action:'start'},1000);
assert.deepEqual(view(room,guest.token,1001).recap,[],'recap stays private during play');assert.equal(view(room,guest.token,1001).fastest,null);
for(let round=0;round<5;round++){
 const solver=round===0?host:guest;
 act(room,solver.token,{action:'guess',round,stage:0,guess:movies[room.deck[round]].title},room.started+1);
 advance(room,room.started+45001);
 assert.deepEqual(view(room,guest.token,room.started+45001).recap,[],'recap stays private at reveal');assert.equal(view(room,guest.token,room.started+45001).fastest,null);
 act(room,host.token,{action:'next',round},room.started+45002);
}
const result=view(room,guest.token,room.started+1);
assert.equal(result.status,'finished');assert.equal(result.recap.length,5);assert.match(result.comeback,/Guest climbed from 2nd after round 1 to win/);
assert.deepEqual(result.fastest,{name:'Guest',title:movies[room.deck[1]].title,clue:1,points:300,ms:1});
assert.deepEqual(result.recap.map(row=>row.solvers.map(s=>s.clue)),[[1],[1],[1],[1],[1]]);assert.deepEqual(result.recap.map(row=>row.solvers.map(s=>s.points)),[[300],[300],[300],[300],[300]]);assert.deepEqual(result.recap.map(row=>row.solvers.map(s=>s.ms)),[[1],[1],[1],[1],[1]]);
view(room,host.token,room.started+2);assert.equal(room.recap.length,5,'state reads do not duplicate rounds');
const legacy=newRoom('OLD234',player('Legacy'));legacy.status='finished';legacy.deck=[0];delete legacy.recap;assert.deepEqual(view(legacy,legacy.players[0].token,10).recap,[]);assert.equal(view(legacy,legacy.players[0].token,10).fastest,null);
assert.equal(comebackHighlight([{round:0,title:'Movie',solvers:[],missed:[],totals:[{name:'Purple',score:100},{name:'Gold',score:300}]}],['Purple']),'Purple climbed from 2nd after round 1 to win.');
assert.equal(fastestSolve([{round:0,title:'Old',solvers:[{name:'Legacy',clue:1,points:300}],missed:[],totals:[]}]),null);
console.log('PASS: private match recap, round capture, clue/point/timing detail, fastest solve, comeback highlight, idempotent reads and legacy rooms.');
