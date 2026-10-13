import assert from 'node:assert/strict';
import {newRoom,player,act,movies,view} from '../lib/game.ts';
import {parseSettings} from '../lib/game-settings.ts';
for(const rounds of [3,5,10]){
 const a=player('Host'),b=player('Guest'),r=newRoom('ABC234',a,1);r.players.push(b);
 act(r,a.token,{action:'settings',settings:{collection:'mixed',era:'all',rounds}},1);
 assert.equal(view(r,b.token,1).totalRounds,rounds);act(r,a.token,{action:'start'},1000);assert.equal(r.deck.length,rounds);assert.equal(new Set(r.deck).size,rounds);
 assert.throws(()=>act(r,a.token,{action:'settings',settings:{collection:'mixed',era:'all',rounds:3}},1001),/before or between/);
 for(let i=0;i<rounds;i++){for(const p of [a,b])act(r,p.token,{action:'guess',round:i,stage:0,guess:movies[r.deck[i]].title},r.started+1);act(r,a.token,{action:'next',round:i},r.started+10);}
 assert.equal(r.status,'finished');assert.equal(a.score,rounds*300);assert.equal(view(r,a.token,r.started+10).totalRounds,rounds);
 const old=[...r.deck];act(r,a.token,{action:'replay'},5000);assert.equal(r.deck.length,rounds);assert(r.deck.every(i=>!old.includes(i)));
}
for(const rounds of [0,4,100,'10',null])assert.throws(()=>parseSettings({collection:'mixed',era:'all',rounds}),/3, 5 or 10/);
const legacy=newRoom('ABC234',player('Old'));assert.equal(view(legacy,legacy.players[0].token).totalRounds,5);
console.log('PASS: 3/5/10 complete matches, scoring, replay rotation, locked settings, invalid lengths and legacy defaults.');
