import assert from 'node:assert/strict';
import {startVisiblePolling} from '../lib/visible-polling.ts';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function setup(initial='visible'){
 let listener;const queued=new Map();let id=0;
 const visibility={visibilityState:initial,addEventListener:(_type,fn)=>{listener=fn;},removeEventListener:()=>{listener=undefined;}};
 return {visibility,timers:{set(fn,delay){assert.equal(delay,800);queued.set(++id,fn);return id;},clear(key){queued.delete(key);}},queued,change(state){visibility.visibilityState=state;listener?.();},fire(){const [key,fn]=queued.entries().next().value;queued.delete(key);fn();},get listening(){return !!listener;}};
}
const env=setup();let reads=0,resumes=0;
const stop=startVisiblePolling(async()=>{reads++;return true;},()=>resumes++,env.visibility,env.timers);
await tick();assert.equal(reads,1);assert.equal(env.queued.size,1);
env.change('hidden');assert.equal(env.queued.size,0);await tick();assert.equal(reads,1);
env.change('visible');await tick();assert.equal(reads,2);assert.equal(resumes,1);
env.fire();await tick();assert.equal(reads,3);stop();assert.equal(env.queued.size,0);assert(!env.listening);
env.change('visible');assert.equal(reads,3);
const hidden=setup('hidden');let hiddenReads=0;
const stopHidden=startVisiblePolling(async()=>{hiddenReads++;return true;},()=>{},hidden.visibility,hidden.timers);
await tick();assert.equal(hiddenReads,0);hidden.change('visible');await tick();assert.equal(hiddenReads,1);stopHidden();
const pending=setup();let resolve,started=0;
const stopPending=startVisiblePolling(()=>{started++;return new Promise(r=>{resolve=r;});},()=>{},pending.visibility,pending.timers);
pending.change('hidden');pending.change('visible');pending.change('hidden');pending.change('visible');assert.equal(started,1,'No overlapping requests');
resolve(true);await tick();assert.equal(started,2,'One fresh read after returning during an in-flight request');
stopPending();resolve(true);await tick();assert.equal(pending.queued.size,0);
const terminal=setup();startVisiblePolling(async()=>false,()=>{},terminal.visibility,terminal.timers);await tick();assert(!terminal.listening);assert.equal(terminal.queued.size,0);
console.log('Visible polling pauses hidden tabs, refreshes on return, avoids overlap and stops on terminal errors/unmount.');
