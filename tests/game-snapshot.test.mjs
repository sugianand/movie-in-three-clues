import assert from 'node:assert/strict';
import {newRoom,player,view,act} from '../lib/game.ts';
import {isGameSnapshot,isGameResponse} from '../lib/game-snapshot.ts';
import {gameRequest} from '../lib/client-sync.ts';
const host=player('Host'),guest=player('Guest'),room=newRoom('ABC234',host,1000);room.players.push(guest);
const lobby=view(room,host.token,1000);assert(isGameSnapshot(lobby));
act(room,host.token,{action:'start'},1000);
const live=view(room,host.token,1001);assert(isGameSnapshot(live));
assert(isGameSnapshot(view(room,host.token,100000)));
const legacy=structuredClone(live);delete legacy.settings.format;delete legacy.seriesMatches;delete legacy.recap;delete legacy.spectators;
assert(isGameSnapshot(legacy),'Optional newer backend fields must remain optional');
const malformed=[null,[],{}, {...live,me:null},{...live,settings:null},{...live,players:[null]}, {...live,clues:null},{...live,version:NaN},{...live,status:'unknown'},{...live,stage:9},{...live,report:[{}]},{...live,recap:[{solvers:null}]},{...live,roundSpotlight:{fastest:{}}}];
for(const value of malformed)assert(!isGameSnapshot(value));
assert(isGameResponse({left:true},{action:'leave'},true));
assert(!isGameResponse({}, {action:'leave'},true));
assert(isGameResponse({error:'Room expired'},{action:'state'},false));
assert(!isGameResponse({error:{}},{action:'state'},false));
assert(!isGameResponse(live,{action:'join'},true));
assert(isGameResponse({...live,token:'session-token'},{action:'join'},true));
const original=globalThis.fetch;
try{
 for(const value of malformed){globalThis.fetch=async()=>Response.json(value);await assert.rejects(gameRequest({action:'state'}),/incomplete response/);}
 globalThis.fetch=async()=>Response.json(live);assert.deepEqual((await gameRequest({action:'state'})).data,JSON.parse(JSON.stringify(live)));
 globalThis.fetch=async()=>Response.json({error:'Room expired'},{status:400});assert.equal((await gameRequest({action:'state'})).ok,false);
}finally{globalThis.fetch=original;}
console.log('Invalid snapshots are rejected before state updates; valid recovery, legacy fields, errors and leave acknowledgements remain supported.');
