import assert from 'node:assert/strict';
import {dailyDraftKey,readDailyDraft,sameDailyProgress,writeDailyDraft} from '../lib/daily-draft.ts';
const progress={date:'2026-10-11',version:7,stage:1,done:false};
const draft=writeDailyDraft(progress,'  Baahubali');
assert.equal(readDailyDraft(draft,progress),'  Baahubali');
assert(sameDailyProgress(progress,{...progress}),'tab refresh retains live typing');
for(const changed of [{date:'2026-10-12'},{version:8},{stage:2},{done:true}]){
 const next={...progress,...changed};
 assert(!sameDailyProgress(progress,next));
 assert.equal(readDailyDraft(draft,next),'','another tab or day must invalidate old typing');
}
assert(!sameDailyProgress(null,progress));
for(const raw of [null,'broken','null','{}','42',JSON.stringify({...progress,text:15}),JSON.stringify({...progress,text:'x'.repeat(151)})])assert.equal(readDailyDraft(raw,progress),'');
assert.equal(writeDailyDraft({...progress,done:true},'answer'),null);
assert.equal(writeDailyDraft(progress,''),null);
assert.equal(readDailyDraft(writeDailyDraft(progress,'x'.repeat(151)),progress).length,150);
assert.notEqual(dailyDraftKey('pass-a'),dailyDraftKey('pass-b'));
// Only the user's input and progress stamp are persisted, even with a full response.
const saved=JSON.parse(writeDailyDraft({...progress,answer:{title:'SECRET'},clues:['SECRET'],history:[{score:300}],stats:{}},'my guess'));
assert.deepEqual(Object.keys(saved).sort(),['date','done','stage','text','version']);
console.log('PASS: Daily draft reload recovery, unchanged refresh, cross-tab/day invalidation, malformed storage, completion cleanup, pass isolation and minimal persisted data.');
