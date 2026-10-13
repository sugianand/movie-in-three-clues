import assert from 'node:assert/strict';
import {player,newRoom,act,view,movies,advance} from '../lib/game.ts';
function setup(){const a=player('A'),b=player('B'),r=newRoom('ABC234',a,1000);r.players.push(b);act(r,a.token,{action:'start'},1000);return {a,b,r};}
function guess(r,p,stage,doubleDown,correct=true){act(r,p.token,{action:'guess',round:r.round,roundStarted:r.started,stage,doubleDown,guess:correct?movies[r.deck[r.round]].title:'totally wrong movie'},r.started+stage*15000+1);}
for(let s=0;s<3;s++){const {a,b,r}=setup();guess(r,a,s,true);assert.equal(a.score,(3-s)*200);assert.equal(view(r,b.token,1001+s*15000).players[0].score,0);assert.equal(view(r,a.token,1001+s*15000).me.doubleUsed,true);advance(r,46000);assert.equal(r.stats[movies[r.deck[0]].title][['first','second','third'][s]],1);}
const {a,b,r}=setup();guess(r,a,0,true,false);assert.equal(a.score,-100);assert.equal(view(r,b.token,1002).players[0].score,0);assert.throws(()=>guess(r,a,0,true,false),/used this guess/);assert.throws(()=>guess(r,a,1,true),/already been used/);assert.equal(a.attempt,0);guess(r,a,1,false);assert.equal(a.score,100);assert.equal(a.gain,100);guess(r,b,1,true);assert.equal(b.score,400);assert.equal(r.status,'reveal');assert.equal(r.stats[movies[r.deck[0]].title].second,2);
act(r,a.token,{action:'next',round:0},50000);assert.equal(a.doubleUsed,true);assert.equal(a.gain,0);assert.throws(()=>guess(r,a,0,true),/already been used/);
// Saved rooms preserve the spent power; missing fields in older rooms remain compatible.
const saved=JSON.parse(JSON.stringify(r));assert.equal(view(saved,a.token,50001).me.doubleUsed,true);
for(let n=1;n<5;n++){guess(r,a,0,false);guess(r,b,0,false);act(r,a.token,{action:'next',round:n},50000+n*50000);}
act(r,a.token,{action:'replay'},300000);assert.equal(a.doubleUsed,false);assert.equal(a.score,0);
assert.throws(()=>act(r,a.token,{action:'guess',round:0,stage:0,roundStarted:1000,doubleDown:true,guess:'x'},300001),/earlier/);assert.equal(a.doubleUsed,false);
assert.throws(()=>guess(r,a,0,'yes'),/valid Double Down/);assert.equal(a.attempt,-1);
// Team totals also conceal risk and reward until the reveal.
const t=setup();t.r.matchMode='teams';t.a.team='purple';t.b.team='gold';guess(t.r,t.a,0,true,false);assert.equal(view(t.r,t.b.token,1002).teams[0].score,0);advance(t.r,46000);assert.equal(view(t.r,t.b.token,46000).teams[0].score,-100);
console.log('PASS: Double Down scoring, penalty recovery, hidden scores, persistence, replay, stale actions, validation and team totals.');
