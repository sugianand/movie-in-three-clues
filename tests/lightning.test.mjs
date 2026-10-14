import assert from 'node:assert/strict';
import {act,advance,movies,newRoom,player,stage,view} from '../lib/game.ts';
import {clueCount,cluePoints,clueSeconds,parseSettings,roundCount} from '../lib/game-settings.ts';

const lightning={collection:'mixed',era:'all',format:'lightning',difficulty:'easy'};
assert.equal(roundCount(lightning),10);assert.equal(clueCount(lightning),1);assert.equal(clueSeconds(lightning),10);assert.equal(cluePoints(lightning,0),100);
assert.throws(()=>parseSettings({...lightning,format:'turbo'}),/Classic or Lightning/);

const host=player('Host'),guest=player('Guest'),room=newRoom('FLASH1',host,0);room.players.push(guest);
act(room,host.token,{action:'settings',settings:lightning},1);let state=view(room,guest.token,2);
assert.equal(state.totalRounds,10);assert.equal(state.clueSeconds,10);assert.equal(state.settings.format,'lightning');
act(room,host.token,{action:'start'},1000);assert.equal(room.deck.length,10);state=view(room,guest.token,1001);
const movie=movies[room.deck[0]];assert.deepEqual(state.clues,[movie.clues[1]],'only the selected Lightning clue reaches clients');
assert(!JSON.stringify(state).includes(movie.clues[0]));assert(!JSON.stringify(state).includes(movie.clues[2]));assert.equal(state.roundEnd-state.roundStarted,10000);assert.equal(stage(room,9999),0);
act(room,host.token,{action:'guess',round:0,stage:0,guess:movie.title},1200);assert.equal(host.score,100);
act(room,guest.token,{action:'guess',round:0,stage:0,guess:movie.title},1300);assert.equal(guest.score,100);assert.equal(room.status,'reveal');
state=view(room,guest.token,1301);assert.equal(state.roundSpotlight.fastest.name,'Host');assert.equal(state.roundSpotlight.fastest.clue,2);assert.equal(room.stats[movie.title].second,2);assert.equal(room.recap[0].solvers[0].clue,2);

const slowHost=player('Slow Host'),slowGuest=player('Slow Guest'),timed=newRoom('FLASH2',slowHost,0);timed.players.push(slowGuest);
act(timed,slowHost.token,{action:'settings',settings:lightning},1);act(timed,slowHost.token,{action:'start'},1000);advance(timed,10999);assert.equal(timed.status,'playing');advance(timed,11000);assert.equal(timed.status,'reveal');

const classic=parseSettings({collection:'mixed',era:'all'});assert.equal(roundCount(classic),5);assert.equal(clueCount(classic),3);assert.equal(cluePoints(classic,0),300);
console.log('PASS: Lightning runs ten private single-clue rounds with fixed timing, scoring, analytics and classic compatibility.');
