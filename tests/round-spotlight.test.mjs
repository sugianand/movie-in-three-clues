import assert from 'node:assert/strict';
import {act,advance,movies,newRoom,player,view} from '../lib/game.ts';

const host=player('Host'),quick=player('Quick'),room=newRoom('SPOT23',host,0);room.players.push(quick);
act(room,host.token,{action:'settings',settings:{collection:'mixed',era:'all',rounds:3}},1);
act(room,host.token,{action:'start'},1000);
assert.equal(view(room,host.token,1001).roundSpotlight,null,'spotlight is private while guessing');
act(room,host.token,{action:'guess',round:0,stage:0,guess:movies[room.deck[0]].title},1900);
act(room,quick.token,{action:'guess',round:0,stage:0,guess:movies[room.deck[0]].title},1200);
const revealed=view(room,host.token,1201);
assert.equal(revealed.status,'reveal');
assert.deepEqual(revealed.roundSpotlight,{solved:2,players:2,fastest:{name:'Quick',clue:1,points:300,ms:200}});
assert.equal(revealed.recap.length,0,'the rest of the match recap stays private');

const missHost=player('Miss Host'),missGuest=player('Miss Guest'),missed=newRoom('MISSED',missHost,0);missed.players.push(missGuest);
act(missed,missHost.token,{action:'settings',settings:{collection:'mixed',era:'all',rounds:3}},1);act(missed,missHost.token,{action:'start'},1000);advance(missed,46000);
assert.deepEqual(view(missed,missGuest.token,46000).roundSpotlight,{solved:0,players:2,fastest:null});
act(missed,missHost.token,{action:'next',round:0},46001);assert.equal(view(missed,missGuest.token,46002).roundSpotlight,null,'the previous spotlight clears with the next round');

console.log('PASS: round spotlights stay private during play, select the server-timed fastest solver, handle misses, and clear next round.');
