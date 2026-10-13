import assert from 'node:assert/strict';
import {act,advance,comebackHighlight,fastestSolve,movies,newRoom,player,view} from '../lib/game.ts';

const host=player('Host'),guest=player('Guest'),room=newRoom('REC234',host,1);room.players.push(guest);
act(room,host.token,{action:'settings',settings:{collection:'mixed',era:'all',rounds:3}},2);
act(room,host.token,{action:'start'},1000);
assert.deepEqual(view(room,guest.token,1001).recap,[],'recap stays private during play');assert.equal(view(room,guest.token,1001).fastest,null);assert.equal(view(room,guest.token,1001).roundSpotlight,null);

act(room,host.token,{action:'guess',round:0,stage:0,guess:movies[room.deck[0]].title},1001);
advance(room,46001);
assert.equal(room.recap.length,1);assert.equal(room.recap[0].solvers[0].name,'Host');assert.deepEqual(room.recap[0].missed,['Guest']);
const reveal=view(room,guest.token,46001);assert.deepEqual(reveal.recap,[],'full recap stays private at reveal');assert.equal(reveal.fastest,null);assert.deepEqual(reveal.roundSpotlight,{solved:1,players:2,fastest:{name:'Host',clue:1,points:300,ms:1}});

act(room,host.token,{action:'next',round:0},46002);
act(room,guest.token,{action:'guess',round:1,stage:0,guess:movies[room.deck[1]].title},46003);
advance(room,92003);act(room,host.token,{action:'next',round:1},92004);
act(room,guest.token,{action:'guess',round:2,stage:0,guess:movies[room.deck[2]].title},92005);
advance(room,138005);act(room,host.token,{action:'next',round:2},138006);

const result=view(room,guest.token,138006);
assert.equal(result.status,'finished');assert.equal(result.recap.length,3);assert.equal(result.recap[2].title,movies[room.deck[2]].title);
assert.match(result.comeback,/Guest climbed from 2nd after round 1 to win/);
assert.deepEqual(result.fastest,{name:'Guest',title:movies[room.deck[1]].title,clue:1,points:300,ms:1});
assert.deepEqual(result.recap.map(row=>row.solvers.map(s=>s.clue)),[[1],[1],[1]]);
assert.deepEqual(result.recap.map(row=>row.solvers.map(s=>s.points)),[[300],[300],[300]]);
assert.deepEqual(result.recap.map(row=>row.solvers.map(s=>s.ms)),[[1],[1],[1]]);

// Repeated state reads never duplicate a captured round.
view(room,host.token,138007);view(room,guest.token,138008);assert.equal(room.recap.length,3);
// Older saved rooms remain readable and simply show no recap.
const legacy=newRoom('OLD234',player('Legacy'));legacy.status='finished';legacy.deck=[0];delete legacy.recap;
assert.deepEqual(view(legacy,legacy.players[0].token,10).recap,[]);assert.equal(view(legacy,legacy.players[0].token,10).comeback,null);assert.equal(view(legacy,legacy.players[0].token,10).fastest,null);assert.equal(view(legacy,legacy.players[0].token,10).roundSpotlight,null);
assert.equal(comebackHighlight([{round:0,title:'Movie',solvers:[],missed:[],totals:[{name:'Purple',score:100},{name:'Gold',score:300}]}],['Purple']),'Purple climbed from 2nd after round 1 to win.');
assert.equal(fastestSolve([{round:0,title:'Old',solvers:[{name:'Legacy',clue:1,points:300}],missed:[],totals:[]}]),null);
console.log('PASS: private in-match recap, round capture, solver clue/points/timing, fastest solve, comeback highlight, idempotent reads and legacy-room compatibility.');
