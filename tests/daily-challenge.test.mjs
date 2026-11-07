import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dailyChallengeLink,dailyChallengeState,dailyChallengeTarget} from '../lib/daily-challenge.ts';

assert.equal(dailyChallengeTarget('?daily=1&challenge=200'),200);
assert.equal(dailyChallengeTarget('?challenge=150'),null);
assert.equal(dailyChallengeTarget('?challenge=movie-title'),null);
assert.equal(dailyChallengeLink('https://three-clues.test/',300),'https://three-clues.test/?daily=1&challenge=300');
assert.equal(dailyChallengeLink('https://three-clues.test',0),'https://three-clues.test/?daily=1');
assert.deepEqual(dailyChallengeState(200,0,false),{headline:'Match or beat 200 points',detail:'Solve by clue 2 to tie it.',outcome:'open'});
assert.equal(dailyChallengeState(100,300,true).outcome,'won');
assert.equal(dailyChallengeState(200,200,true).outcome,'tied');
assert.deepEqual(dailyChallengeState(300,100,true),{headline:'Challenge missed',detail:'You finished 200 points short.',outcome:'missed'});
const premiere=readFileSync(new URL('../components/daily-premiere.tsx',import.meta.url),'utf8');
assert.match(premiere,/dailyChallengeLink\(window\.location\.origin,d\.score\)/);
assert.match(premiere,/daily-challenge-\$\{challenge\.outcome\}/);
console.log('PASS: Daily Challenge links accept only real score targets and report open, won, tied and missed outcomes.');
