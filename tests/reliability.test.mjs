import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {movies,matches} from '../lib/game.ts';
import {acceptsSnapshot,clueAnnouncement,errorAfterRecovery,gameRequest,runActionOnce} from '../lib/client-sync.ts';
for(const title of ['Toy Story','Frozen','Shrek','Moana']){const movie=movies.find(m=>m.title===title);assert(matches(title,movie));assert(!matches(title+' 2',movie),title);}
assert(matches('Jurasic Park',movies.find(m=>m.title==='Jurassic Park')));
assert(matches('Harry Potter 1',movies.find(m=>m.title.startsWith('Harry Potter'))));
assert(!matches('Harry Potter 2',movies.find(m=>m.title.startsWith('Harry Potter'))));
assert(!acceptsSnapshot({version:4,serverNow:900},{version:4,serverNow:1000}));
assert(!acceptsSnapshot({version:3,serverNow:1100},{version:4,serverNow:1000}));
assert(acceptsSnapshot({version:5,serverNow:900},{version:4,serverNow:1000}));
// React can defer state updater callbacks until after accept() resets the ref.
const recovery={current:true};
const queuedRecoveryUpdate=errorAfterRecovery(recovery.current);
recovery.current=false;
assert.equal(queuedRecoveryUpdate('Connection timed out.'),'');
assert.equal(queuedRecoveryUpdate('Connection timed out.'),''); // Strict Mode can replay updates.
const queuedNormalUpdate=errorAfterRecovery(recovery.current);
recovery.current=true;
assert.equal(queuedNormalUpdate('Wait for the next clue.'),'Wait for the next clue.');
assert.equal(clueAnnouncement(0,'A hidden identity is revealed.'),'Clue 1 of 3, worth 300 points: A hidden identity is revealed.');
assert.equal(clueAnnouncement(2,'The final clue.'),'Clue 3 of 3, worth 100 points: The final clue.');
const pageSource=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
assert(!pageSource.includes(`className={\`feedback \${game.me.solved?'success':''}\`} role="status"`),'changing countdown feedback must not be a live region');
assert(pageSource.includes('className="sr-only" role="status">{game.me.solved?'),'guess results need a stable live region');
const actionLock={current:false};let release;
const firstAction=runActionOnce(actionLock,()=>new Promise(resolve=>{release=resolve;}));
assert.equal(actionLock.current,true);
await assert.rejects(runActionOnce(actionLock,async()=>{}),/already being sent/);
release('done');assert.equal(await firstAction,'done');assert.equal(actionLock.current,false);
await assert.rejects(runActionOnce(actionLock,async()=>{throw Error('failed');}),/failed/);assert.equal(actionLock.current,false);
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
console.log('PASS: sequel rejection, retained typo/alias support, delayed snapshot protection, duplicate-action guard, request timeout, safe HTML error, cancellation, clue announcements.');
