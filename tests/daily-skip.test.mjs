import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dailySkipConfirmation} from '../lib/daily-skip.ts';
for(const stage of [0,1]){
 const copy=dailySkipConfirmation(stage);
 assert.equal(copy.title,`Skip to clue ${stage+2}?`);
 assert.match(copy.description,new RegExp(`from ${(3-stage)*100} to ${(2-stage)*100} points`));
 assert.match(copy.description,/cannot return/);
 assert.match(copy.description,/win streak stays in play/);
}
assert.equal(dailySkipConfirmation(2).confirm,'Reveal movie');
assert.match(dailySkipConfirmation(2).description,/0 points and ends your win streak/);
const source=readFileSync(new URL('../components/daily-premiere.tsx',import.meta.url),'utf8');
assert.ok(source.includes('onClick={()=>setRevealOpen(true)}'));
assert.equal((source.match(/request\('skip'\)/g)||[]).length,1,'only the confirmed action submits a skip');
assert.ok(source.includes('<AlertDialogCancel disabled={busy}>Keep guessing</AlertDialogCancel>'));
assert.ok(source.includes("disabled={busy||expired} onClick={()=>void request('skip')}"));
console.log('PASS: every Daily skip confirms its point cost, preserves a cancel path, and guards expired/busy actions.');
