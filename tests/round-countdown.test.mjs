import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,newRoom,player,roundCountdownMs,view,movies} from '../lib/game.ts';
import {roundAnnouncement} from '../lib/client-sync.ts';

const host=player('Host'),guest=player('Guest'),room=newRoom('SYNC23',host,0);room.players.push(guest);
act(room,host.token,{action:'start',countdown:true},1000);
assert.equal(room.started,1000+roundCountdownMs);
let state=view(room,guest.token,1001);
assert.deepEqual(state.clues,[],'the answer clue stays server-hidden before the countdown ends');
assert.equal(state.deadline,room.started+state.clueSeconds*1000);
assert.equal(state.roundEnd,room.started+state.clueSeconds*3000);
assert.match(roundAnnouncement(state),/First clue in 3 seconds/);
assert.throws(()=>act(room,guest.token,{action:'guess',round:0,stage:0,roundStarted:room.started,guess:'Anything'},3999),/countdown/);
assert.equal(view(room,guest.token,4000).clues.length,1);

act(room,host.token,{action:'guess',round:0,stage:0,roundStarted:room.started,guess:movies[room.deck[0]].title},4001);
act(room,guest.token,{action:'guess',round:0,stage:0,roundStarted:room.started,guess:movies[room.deck[0]].title},4002);
assert.equal(room.status,'reveal');
act(room,host.token,{action:'next',round:0,roundStarted:room.started,countdown:true},5000);
assert.equal(room.started,8000);
assert.deepEqual(view(room,guest.token,5001).clues,[]);
assert.equal(view(room,guest.token,8000).clues.length,1);

const legacyHost=player('Legacy'),legacyGuest=player('Guest'),legacy=newRoom('OLD234',legacyHost,0);legacy.players.push(legacyGuest);
act(legacy,legacyHost.token,{action:'start'},1000);
assert.equal(legacy.started,1000,'older clients still start immediately');
assert.equal(view(legacy,legacyGuest.token,1000).clues.length,1);
const badHost=player('Bad host'),badGuest=player('Bad guest'),bad=newRoom('BAD234',badHost,0);bad.players.push(badGuest);
assert.throws(()=>act(bad,badHost.token,{action:'start',countdown:'yes'},0),/countdown/);

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/Eyes on your screen/);
assert.match(page,/The first clue lands for everyone/);
assert((page.match(/countdown:true/g)??[]).length>=4,'start, rematch, manual next and auto-advance request synchronized countdowns');
assert.match(css,/\.round-countdown/);
assert.match(css,/prefers-reduced-motion:no-preference/);
console.log('PASS: opted-in multiplayer rounds hide clues, block early guesses and share a three-second server countdown.');
