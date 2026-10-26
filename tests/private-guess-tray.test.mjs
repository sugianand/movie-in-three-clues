import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,movies,newRoom,player,view} from '../lib/game.ts';

const host=player('Host'),guest=player('Guest'),room=newRoom('PRIVATE',host,0);
room.players.push(guest);
act(room,host.token,{action:'start'},1000);
const answer=movies[room.deck[0]].title;

act(room,host.token,{action:'guess',round:0,stage:0,roundStarted:room.started,guess:'  Wrong   Turn  '},1001);
assert.deepEqual(view(room,host.token,1002).me.guesses,['Wrong   Turn']);
assert.deepEqual(view(room,guest.token,1002).me.guesses,[],'another player never receives the host attempt');
assert.deepEqual(view(room,guest.token,1002).roundGuesses,[],'the shared board stays empty during play');

assert.throws(()=>act(room,host.token,{action:'guess',round:0,stage:1,roundStarted:room.started,guess:'wrong-turn'},16001),/already tried/);
assert.equal(host.attempt,0,'a blocked repeat does not consume the next clue attempt');
assert.deepEqual(host.guesses,['Wrong   Turn']);

act(room,host.token,{action:'guess',round:0,stage:1,roundStarted:room.started,guess:answer},16002);
act(room,guest.token,{action:'guess',round:0,stage:1,roundStarted:room.started,guess:answer},16003);
assert.equal(room.status,'reveal');
act(room,host.token,{action:'next',round:0,roundStarted:room.started},17000);
assert.deepEqual(view(room,host.token,17001).me.guesses,[],'a new round clears the private tray');

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/YOUR PRIVATE GUESSES/);
assert.match(page,/Only you can see these until the reveal/);
assert.match(css,/\.private-guess-tray/);
console.log('PASS: private guess history is owner-only, repeat-safe and cleared each round.');
