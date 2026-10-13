import assert from 'node:assert/strict';
import {movies} from '../lib/game.ts';
const base=process.env.GAME_TEST_URL||'http://localhost:4173';
async function api(body){const res=await fetch(base+'/api/game',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify(body)});return {status:res.status,data:await res.json()};}
const {data:a}=await api({action:'create',name:'Risk host'});
const {data:b}=await api({action:'join',name:'Risk guest',code:a.code});
const host={code:a.code,token:a.token},guest={code:a.code,token:b.token};
const {data:round}=await api({...host,action:'start'});
const title=movies.find(m=>m.clues[0]===round.clues[0]).title;
const request={...host,action:'guess',round:0,stage:0,roundStarted:round.roundStarted,guess:title,doubleDown:true};
const responses=await Promise.all([api(request),api(request)]);
assert.deepEqual(responses.map(r=>r.status).sort(),[200,400]);
const recovered=(await api({...host,action:'state'})).data;assert.equal(recovered.me.gain,600);assert.equal(recovered.me.doubleUsed,true);
const hidden=(await api({...guest,action:'state'})).data;assert.equal(hidden.players[0].score,0);
const reveal=(await api({...guest,action:'guess',round:0,stage:0,guess:title})).data;assert.equal(reveal.status,'reveal');assert.equal(reveal.players[0].score,600);
const next=(await api({...host,action:'next',round:0})).data;
const reuse=await api({...request,round:1,roundStarted:next.roundStarted,guess:movies.find(m=>m.clues[0]===next.clues[0]).title});assert.equal(reuse.status,400);assert.equal((await api({...host,action:'state'})).data.me.attempt,-1);
console.log('PASS: Worker Double Down atomic concurrency, reconnect, hidden scores, reveal and single-use enforcement.');
