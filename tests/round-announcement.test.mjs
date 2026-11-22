import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {roundAnnouncement} from '../lib/client-sync.ts';

const game={status:'playing',round:2,totalRounds:10,stage:0,clues:['Public clue'],answer:'Private title'};
assert.equal(roundAnnouncement(game),'Round 3 of 10. Clue 1 of 3, worth 300 points: Public clue');
assert(!roundAnnouncement(game).includes('Private title'),'Never announce an answer during play');
assert.equal(roundAnnouncement({...game,status:'reveal'}),'Round 3 of 10. The movie was Private title.');
assert.equal(roundAnnouncement({...game,status:'finished'}),'Match complete. Final standings are ready.');
assert.equal(roundAnnouncement({...game,status:'lobby'}),'');
assert.equal(roundAnnouncement(null),'');

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
assert.match(page,/aria-atomic="true">\{roundAnnouncement\(game\)\}<\/p>/);
assert(!page.includes('clueAnnouncement(game.stage'),'Use one global round announcer instead of duplicate clue announcements');
console.log('PASS: clues, reveals and final standings are announced without leaking answers during play.');
