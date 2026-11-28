import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,newRoom,player,view} from '../lib/game.ts';

const host=player('Sugi'),guest=player('Guest'),room=newRoom('DYNASTY',host,0);room.players.push(guest);room.deck=[0];room.status='finished';
room.seriesWins={[host.id]:3};
let state=view(room,host.token,1000);
assert.equal(state.titleStreak,1,'a first championship starts a one-title run');
act(room,host.token,{action:'reset-series'},1100);state=view(room,guest.token,1101);
assert.deepEqual(state.defendingChampions,['Sugi']);assert.equal(state.defendingTitleStreak,1);

room.seriesWins={[host.id]:3};
state=view(room,guest.token,1200);assert.equal(state.titleStreak,2,'retaining the crown creates a back-to-back dynasty');
act(room,host.token,{action:'reset-series'},1201);state=view(room,host.token,1202);
assert.equal(state.defendingTitleStreak,2,'the title streak carries into the next series');

room.seriesWins={[guest.id]:3};
state=view(room,host.token,1300);assert.equal(state.titleStreak,1,'a new champion starts a fresh title run');
act(room,host.token,{action:'reset-series'},1301);state=view(room,guest.token,1302);
assert.deepEqual(state.defendingChampions,['Guest']);assert.equal(state.defendingTitleStreak,1);

room.defendingChampions=['Guest','Sugi'];room.defendingTitleStreak=2;room.seriesWins={[host.id]:3,[guest.id]:3};
state=view(room,host.token,1400);assert.equal(state.titleStreak,3,'the same tied champion set retains its dynasty regardless of order');

const legacyHost=player('Legacy'),legacy=newRoom('OLDROOM',legacyHost,0);legacy.deck=[0];legacy.status='finished';legacy.defendingChampions=['Legacy'];legacy.seriesWins={[legacyHost.id]:3};
state=view(legacy,legacyHost.token,0);
assert.equal(state.defendingTitleStreak,1,'legacy defending champions safely default to one title');
assert.equal(state.titleStreak,2,'a legacy champion can immediately extend the run');

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/DYNASTY · \{game\.titleStreak\} STRAIGHT TITLES/);
assert.match(page,/game\.defendingTitleStreak>1/);
assert.match(css,/\.series-dynasty\{/);
console.log('PASS: repeat, replacement, tied and legacy champions receive accurate Dynasty Streaks.');
