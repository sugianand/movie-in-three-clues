import assert from 'node:assert/strict';
import {newRoom,player,act,view,movies,stage,advance} from '../lib/game.ts';
for(const [difficulty,ms] of [['easy',30000],['normal',15000],['hard',10000]]){
 const a=player('A'),b=player('B'),r=newRoom('ABC234',a,0);r.players.push(b);
 act(r,a.token,{action:'settings',settings:{collection:'mixed',era:'all',difficulty}},0);
 act(r,a.token,{action:'start'},0);
 assert.equal(stage(r,ms-1),0);assert.equal(stage(r,ms),1);assert.equal(stage(r,ms*2),2);
 assert.equal(view(r,a.token,0).roundEnd,ms*3);
 act(r,a.token,{action:'guess',round:0,stage:1,guess:movies[r.deck[0]].title},ms);assert.equal(a.score,200);
 advance(r,ms*3-1);assert.equal(r.status,'playing');advance(r,ms*3);assert.equal(r.status,'reveal');
}
const ps=['A','B','C','D'].map(n=>player(n)),r=newRoom('DEF234',ps[0],0);r.players.push(...ps.slice(1));
act(r,ps[0].token,{action:'settings',settings:{collection:'mixed',era:'all',mode:'teams',difficulty:'hard'}},0);
assert.deepEqual(ps.map(p=>p.team),['purple','gold','purple','gold']);
assert.throws(()=>act(r,ps[1].token,{action:'settings',settings:{collection:'mixed',era:'all',difficulty:'easy'}},0),/host/);
act(r,ps[1].token,{action:'team',team:'purple'},0);assert.throws(()=>act(r,ps[0].token,{action:'start'},0),/equally/);
act(r,ps[1].token,{action:'team',team:'gold'},0);act(r,ps[0].token,{action:'start'},0);
assert.throws(()=>act(r,ps[0].token,{action:'team',team:'gold'},1),/locked/);
assert.throws(()=>act(r,ps[0].token,{action:'settings',settings:{collection:'mixed',era:'all',difficulty:'easy'}},1),/between/);
for(let round=0;round<5;round++){
 const start=r.started,title=movies[r.deck[round]].title;
 for(const p of [ps[0],ps[2]])act(r,p.token,{action:'guess',round,stage:0,guess:title},start+1);
 assert.equal(view(r,ps[1].token,start+2).teams[0].score,round*600);
 for(const p of [ps[1],ps[3]])act(r,p.token,{action:'guess',round,stage:1,guess:title},start+10000);
 assert.equal(view(r,ps[0].token,start+10000).teams[0].score,(round+1)*600);
 act(r,ps[0].token,{action:'next',round},start+10001);
}
assert.deepEqual(view(r,ps[0].token,r.started+10002).winners,['Team Purple']);
act(r,ps[0].token,{action:'settings',settings:{collection:'mixed',era:'all',mode:'individual',difficulty:'easy'}},r.started+10003);
assert.deepEqual(view(r,ps[0].token,r.started+10004).winners,['Team Purple']);
act(r,ps[0].token,{action:'replay'},r.started+10005);assert.equal(r.matchMode,'individual');assert(ps.every(p=>p.score===0));
console.log('PASS: all timer boundaries, team assignment, equal sizes, permissions, hidden team scores, five-round team winner, stable results and replay.');

const nh=player('Host'),ng=player('Guest'),nr=newRoom('GHJ234',nh,0);nr.players.push(ng);
act(nr,nh.token,{action:'settings',settings:{collection:'mixed',era:'all',mode:'teams'}},0);
act(nr,ng.token,{action:'rename-team',name:'  Movie   Masters  '},0);assert.equal(view(nr,nh.token,0).teamOptions[1].name,'Movie Masters');
assert.throws(()=>act(nr,nh.token,{action:'rename-team',name:'movie masters'},0),/already/);
for(const name of ['', ' ', 'x'.repeat(25), null])assert.throws(()=>act(nr,nh.token,{action:'rename-team',name},0));
act(nr,nh.token,{action:'start'},0);assert.throws(()=>act(nr,ng.token,{action:'rename-team',name:'Changed'},1),/locked/);
