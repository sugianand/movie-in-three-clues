import assert from 'node:assert/strict';
import {dailyMovie} from '../lib/daily.ts';
const base=process.env.GAME_TEST_URL||'http://localhost:4173';
async function api(body,status=200,origin=base){const res=await fetch(base+'/api/daily',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});const data=await res.json();assert.equal(res.status,status,JSON.stringify(data));return data;}
const token=crypto.randomUUID();
let state=await api({action:'state',token});assert.equal(state.clues.length,1);assert.equal(state.answer,null);
const movie=dailyMovie(state.date);assert(!JSON.stringify(state).includes(movie.title));
const attempt={token,action:'guess',date:state.date,version:state.version,guess:'wrong movie title'};
const [a,b]=await Promise.all([api(attempt),api(attempt)]);assert.equal(a.stage,1);assert.equal(b.stage,1);assert.equal(a.version,b.version);
state=await api({token,action:'state'});assert.equal(state.stage,1);assert.equal(state.marks.length,1);
state=await api({token,action:'guess',date:state.date,version:state.version,guess:movie.title});assert.equal(state.done,true);assert.equal(state.score,200);assert.equal(state.stats.played,1);
const again=await api(attempt);assert.equal(again.score,200);assert.equal(again.history.length,1);
assert.equal((await api({token,action:'state'})).score,200);
await api({token,action:'state'},403,'https://example.com');await api({token:'bad',action:'state'},400);
await api({token,action:'invent'},400);
const other=await api({token:crypto.randomUUID(),action:'state'});assert.equal(other.date,state.date);assert.equal(other.clues[0],state.clues[0]);assert.equal(other.done,false);
const old=await api({token,action:'skip',date:'2026-01-01',version:state.version});assert.equal(old.score,200);
console.log('Daily Worker API: persistence, concurrent retries, private answers, shared puzzle, origin validation, and completed-result protection passed.');
