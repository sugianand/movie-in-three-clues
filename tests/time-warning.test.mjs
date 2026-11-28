import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {timeWarning} from '../lib/client-sync.ts';

for(const seconds of [0,6,15,-1])assert.equal(timeWarning(seconds,0),'');
for(const seconds of [1,2,3,4,5])assert.equal(timeWarning(seconds,0),timeWarning(5,0));
assert.match(timeWarning(5,0),/next clue/);
assert.match(timeWarning(5,2),/answer reveal/);

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
assert.match(page,/game\?\.status==='playing'&&!waiting&&!game\.me\.spectator\?timeWarning\(seconds,game\.stage\):''/);
assert.match(page,/aria-live="polite" aria-atomic="true"/);
console.log('PASS: stable low-time warnings announce only to active seated guessers.');
