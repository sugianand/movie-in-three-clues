import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dailyChallengeFromSearch,dailyChallengeLink,dailyChallengeState} from '../lib/daily-challenge.ts';

assert.deepEqual(dailyChallengeFromSearch('?daily=1&challenge=200&day=2026-11-07'),{target:200,date:'2026-11-07'});
assert.equal(dailyChallengeFromSearch('?challenge=200'),null,'dayless legacy links cannot target a different movie');
assert.equal(dailyChallengeFromSearch('?challenge=150&day=2026-11-07'),null);
assert.equal(dailyChallengeFromSearch('?challenge=200&day=2026-02-30'),null);
assert.equal(dailyChallengeLink('https://three-clues.test/',300,'2026-11-07'),'https://three-clues.test/?daily=1&challenge=300&day=2026-11-07');
assert.equal(dailyChallengeLink('https://three-clues.test',0,'2026-11-07'),'https://three-clues.test/?daily=1');
assert.deepEqual(dailyChallengeState(200,0,false,'2026-11-07','2026-11-07'),{headline:'Match or beat 200 points',detail:'Solve by clue 2 to tie it.',outcome:'open'});
assert.equal(dailyChallengeState(100,300,true,'2026-11-07','2026-11-07').outcome,'won');
assert.equal(dailyChallengeState(200,200,true,'2026-11-07','2026-11-07').outcome,'tied');
assert.deepEqual(dailyChallengeState(300,100,true,'2026-11-07','2026-11-07'),{headline:'Challenge missed',detail:'You finished 200 points short.',outcome:'missed'});
assert.deepEqual(dailyChallengeState(200,300,true,'2026-11-06','2026-11-07'),{headline:'Challenge expired',detail:'That target belonged to the Nov 6 Premiere. Today’s movie is a fresh challenge.',outcome:'expired'});
const premiere=readFileSync(new URL('../components/daily-premiere.tsx',import.meta.url),'utf8');
assert.match(premiere,/dailyChallengeLink\(window\.location\.origin,d\.score,d\.date\)/);
assert.match(premiere,/daily-challenge-\$\{challenge\.outcome\}/);
console.log('PASS: date-bound Daily Challenges report active, won, tied, missed and expired outcomes.');
