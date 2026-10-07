import assert from 'node:assert/strict';
import {movies as catalog,activeMovieIds,newRoom,player,chooseDeck,act,view,advance} from '../lib/game.ts';
const movies=activeMovieIds.map(i=>catalog[i]);
for(const [region,expected] of [['indian',50],['hollywood',50]]){
 assert.equal(movies.filter(m=>m.region===region&&m.year<2010).length,expected);
 assert.equal(movies.filter(m=>m.region===region&&m.year>=2010).length,expected);
}
const canonical=s=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g,'').replace(/^the/,'');
assert.equal(new Set(movies.map(m=>canonical(m.title))).size,200);
assert(movies.every(m=>m.clues.every(c=>!c.includes('undefined')&&!c.includes('null'))));
assert(movies.filter(m=>m.region==='hollywood').every(m=>m.language==='English'));
assert.equal(movies.length,200);assert.equal(new Set(movies.map(m=>m.title)).size,200);assert(movies.every(m=>m.clues.length===3&&m.clues.every(c=>c.length>20)));
let room=newRoom('ABC234',player('Host'));const seen=[];let last=[];
for(let game=0;game<40;game++){chooseDeck(room);assert.equal(new Set(room.deck).size,5);seen.push(...room.deck);last=[...room.deck];room=JSON.parse(JSON.stringify(room));}
assert.equal(new Set(seen).size,200);assert.equal(room.seen.length,200);chooseDeck(room);assert.equal(room.cycle,2);assert(room.deck.every(i=>!last.includes(i)));assert.equal(room.seen.length,5);
const legacy={...room};delete legacy.seen;const old=[...legacy.deck];chooseDeck(legacy);assert(legacy.deck.every(i=>!old.includes(i)));
const a=player('A'),b=player('B'),c=player('C'),d=player('D');const r=newRoom('DEF234',a,0);r.players.push(b,c,d);act(r,a.token,{action:'start'},0);
const title=catalog[r.deck[0]].title;
act(r,a.token,{action:'guess',round:0,stage:0,guess:title},1);
act(r,b.token,{action:'guess',round:0,stage:1,guess:title},15001);
act(r,c.token,{action:'guess',round:0,stage:2,guess:title},30001);
advance(r,45000);assert.deepEqual(r.stats[title],{title,plays:1,players:4,first:1,second:1,third:1,missed:1});
for(let i=0;i<5;i++)view(r,a.token,45001);assert.equal(r.stats[title].plays,1);
assert.deepEqual(view(r,a.token,45001).report,[]);
r.status='finished';assert.equal(view(r,a.token,45001).report.length,1);assert.deepEqual(view(r,b.token,45001).report,[]);
console.log('PASS: 200 active movies, 40 no-repeat games, reshuffle boundary, saved/legacy room history, clue/miss counts recorded once, host-only report.');
