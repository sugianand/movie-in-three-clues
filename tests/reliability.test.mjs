import assert from 'node:assert/strict';
import {movies,matches} from '../lib/game.ts';
import {acceptsSnapshot,gameRequest} from '../lib/client-sync.ts';
for(const title of ['Toy Story','Frozen','Shrek','Moana']){const movie=movies.find(m=>m.title===title);assert(matches(title,movie));assert(!matches(title+' 2',movie),title);}
assert(matches('Jurasic Park',movies.find(m=>m.title==='Jurassic Park')));
assert(matches('Harry Potter 1',movies.find(m=>m.title.startsWith('Harry Potter'))));
assert(!matches('Harry Potter 2',movies.find(m=>m.title.startsWith('Harry Potter'))));
assert(!acceptsSnapshot({version:4,serverNow:900},{version:4,serverNow:1000}));
assert(!acceptsSnapshot({version:3,serverNow:1100},{version:4,serverNow:1000}));
assert(acceptsSnapshot({version:5,serverNow:900},{version:4,serverNow:1000}));
const original=globalThis.fetch;
try{
 globalThis.fetch=async()=>new Response(JSON.stringify({code:'ABC234'}),{status:200});
 const result=await gameRequest({action:'create'});assert.equal(result.data.code,'ABC234');
 globalThis.fetch=async()=>new Response('<html>Unavailable</html>',{status:503});
 await assert.rejects(gameRequest({action:'state'}),/could not respond/);
 globalThis.fetch=async(_,options)=>new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true}));
 await assert.rejects(gameRequest({action:'state'},{timeoutMs:5}),/Connection timed out/);
 const controller=new AbortController();const pending=gameRequest({action:'state'},{signal:controller.signal});controller.abort();await assert.rejects(pending,/aborted/);
}finally{globalThis.fetch=original;}
console.log('PASS: sequel rejection, retained typo/alias support, delayed snapshot protection, request timeout, safe HTML error, cancellation.');
