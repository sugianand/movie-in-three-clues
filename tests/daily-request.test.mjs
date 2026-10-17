import assert from 'node:assert/strict';
import {dailyRequest,isDailyView} from '../lib/daily-request.ts';
import {openDaily,dailyView,dailyAction} from '../lib/daily.ts';
const profile=openDaily(null,Date.parse('2026-10-17T12:00:00Z'));
const valid=dailyView(profile,1);assert(isDailyView(valid));
dailyAction(profile,'skip');assert(isDailyView(dailyView(profile,2)));
dailyAction(profile,'skip');dailyAction(profile,'skip');assert(isDailyView(dailyView(profile,3)));
for(const bad of [null,{}, {...valid,clues:null},{...valid,stats:{}},{...valid,history:[{}]},{...valid,performance:{counts:[]}}, {...valid,stage:8},{...valid,done:true,answer:null}])assert(!isDailyView(bad));
const original=globalThis.fetch;let requests=0;
try{
 globalThis.fetch=async(url,options)=>{requests++;assert.equal(url,'/api/daily');assert.equal(options.cache,'no-store');assert.equal(JSON.parse(options.body).action,'guess');return Response.json(valid);};
 assert.deepEqual(await dailyRequest({action:'guess'}),valid);assert.equal(requests,1);
 for(const response of [new Response('<html>gateway failure</html>',{status:502}),Response.json(null),Response.json({})]){
  globalThis.fetch=async()=>response;await assert.rejects(dailyRequest({action:'state'}),/Recover saved progress/);
 }
 globalThis.fetch=async()=>Response.json({error:'Your daily pass is updating. Try again.'},{status:409});
 await assert.rejects(dailyRequest({}),/daily pass is updating/);
 globalThis.fetch=async()=>{throw new TypeError('Failed to fetch');};await assert.rejects(dailyRequest({}),/Connection lost/);
 requests=0;globalThis.fetch=(_url,{signal})=>{requests++;return new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true}));};
 await assert.rejects(dailyRequest({action:'guess'},5),/Connection timed out/);assert.equal(requests,1);
}finally{globalThis.fetch=original;}
console.log('PASS: Daily transport validates state, handles gateway/offline/timeout errors, preserves server messages and never retries guesses automatically.');
