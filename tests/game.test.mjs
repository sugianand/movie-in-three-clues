import assert from 'node:assert/strict';
import {newRoom,player,act,view,movies,matches,advance} from '../lib/game.ts';
const p=player('Host'),q=player('Guest');const r=newRoom('ABC234',p,1000);r.players.push(q);
assert.throws(()=>act(r,q.token,{action:'start'},1000),/host/);
act(r,p.token,{action:'start'},1000);assert.equal(new Set(r.deck).size,5);
assert.equal(view(r,p.token,1000).answer,null);assert.equal(view(r,p.token,1000).clues.length,1);
act(r,p.token,{action:'guess',round:0,stage:0,guess:'definitely incorrect'},1001);
assert.throws(()=>act(r,p.token,{action:'guess',round:0,stage:0,guess:'x'},1002),/used/);
assert.equal(view(r,p.token,16000).clues.length,2);
act(r,p.token,{action:'guess',round:0,stage:1,guess:movies[r.deck[0]].title},16000);assert.equal(p.score,200);
assert.equal(view(r,q.token,16000).players[0].score,0);
act(r,q.token,{action:'guess',round:0,stage:2,guess:movies[r.deck[0]].title},31000);assert.equal(q.score,100);assert.equal(r.status,'reveal');
assert.equal(view(r,q.token,31000).answer,movies[r.deck[0]].title);
for(let round=1;round<5;round++){act(r,p.token,{action:'next',round:round-1},round*50000);for(const v of [p,q])act(r,v.token,{action:'guess',round,stage:0,guess:movies[r.deck[round]].title},round*50000+1);}
act(r,p.token,{action:'next',round:4},260000);assert.equal(r.status,'finished');assert.equal(p.score,1400);assert.equal(q.score,1300);assert.deepEqual(view(r,p.token,260000).winners,['Host']);
act(r,p.token,{action:'replay'},270000);assert.equal(p.score,0);assert.equal(r.round,0);
// A delayed request from round zero of the previous match must not spend a new guess.
assert.throws(()=>act(r,p.token,{action:'guess',round:0,stage:0,roundStarted:1000,guess:movies[r.deck[0]].title},270001),/earlier round/);
assert.equal(p.attempt,-1);assert.equal(p.score,0);
const replay=view(r,p.token,270001);assert.equal(replay.roundStarted,270000);
act(r,p.token,{action:'guess',round:0,stage:0,roundStarted:replay.roundStarted,guess:movies[r.deck[0]].title},270002);
assert.equal(p.score,300);
advance(r,315000);assert.equal(r.status,'reveal');
assert.throws(()=>act(r,p.token,{action:'next',round:0,roundStarted:1000},315001),/earlier round/);
assert.equal(r.round,0);assert.equal(r.status,'reveal');
act(r,p.token,{action:'next',round:0,roundStarted:replay.roundStarted},315002);
assert.equal(r.round,1);assert.equal(r.status,'playing');
assert(matches('Jurasic Park',movies[3]));assert(matches('TITANIC!!!',movies[0]));assert(!matches('us',movies.find(m=>m.title==='Up')));
console.log('PASS: five rounds, scoring, winner, timer boundaries, hidden answers, permissions, repeat guesses, typos, replay.');
