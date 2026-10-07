import assert from 'node:assert/strict';
import {movies,newRoom,player,chooseDeck,eligibleMovies,act,matches} from '../lib/game.ts';
import {collections,eras} from '../lib/game-settings.ts';
for(const c of collections)for(const e of eras){
 const settings={collection:c.value,era:e.value},pool=eligibleMovies(settings);
 assert(pool.length>=5);
 const r=newRoom('ABC234',player('Host'));r.settings=settings;const drawn=[];
 for(let game=0;game<Math.ceil(pool.length/5)+2;game++){
  chooseDeck(r);assert.equal(new Set(r.deck).size,5);assert(r.deck.every(i=>pool.includes(i)));drawn.push(...r.deck);
 }
 assert.equal(new Set(drawn.slice(0,pool.length)).size,pool.length);
}
const h=player('Host'),g=player('Guest'),r=newRoom('ABC234',h,0);r.players.push(g);
const indian={collection:'indian',era:'all'},hollywood={collection:'hollywood',era:'all'};
assert.throws(()=>act(r,g.token,{action:'settings',settings:indian},0),/host/);
assert.throws(()=>act(r,h.token,{action:'settings',settings:{collection:'bad',era:'all'}},0),/valid/);
act(r,h.token,{action:'settings',settings:indian},0);act(r,h.token,{action:'start'},0);const first=[...r.deck];
assert.throws(()=>act(r,h.token,{action:'settings',settings:hollywood},1),/between/);
r.status='finished';act(r,h.token,{action:'settings',settings:hollywood},1);act(r,h.token,{action:'replay'},1);
assert(first.every(i=>r.seen.includes(i)));r.status='finished';act(r,h.token,{action:'settings',settings:indian},2);act(r,h.token,{action:'replay'},2);
assert(r.deck.every(i=>!first.includes(i)));
const alien=movies.find(m=>m.title==='Alien'),aliens=movies.find(m=>m.title==='Aliens');
assert(!matches('Aliens',alien));assert(!matches('Alien',aliens));assert(matches('Alienz',aliens));
console.log('PASS: all nine filters, pool exhaustion, unique decks, cross-filter history, settings permissions and exact-title precedence.');
