import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,movies,newRoom,player,view} from '../lib/game.ts';

const host=player('Host'),guest=player('Guest'),room=newRoom('READY2',host,0);
room.players.push(guest);
act(room,host.token,{action:'start'},1000);
const answer=movies[room.deck[0]].title;
act(room,host.token,{action:'guess',round:0,stage:0,roundStarted:room.started,guess:answer},1001);
act(room,guest.token,{action:'guess',round:0,stage:0,roundStarted:room.started,guess:answer},1002);
assert.equal(room.status,'reveal');

assert.throws(()=>act(room,guest.token,{action:'round-ready',round:0,roundStarted:room.started-1,ready:true},1003),/earlier round/);
assert.throws(()=>act(room,guest.token,{action:'round-ready',round:0,roundStarted:room.started,ready:'yes'},1003),/valid round readiness/);
act(room,guest.token,{action:'round-ready',round:0,roundStarted:room.started,ready:true},1003);
let state=view(room,guest.token,1004);
assert.equal(state.me.roundReady,true);
assert.deepEqual(state.players.map(p=>({name:p.name,ready:p.roundReady})),[{name:'Host',ready:false},{name:'Guest',ready:true}]);

act(room,guest.token,{action:'round-ready',round:0,roundStarted:room.started,ready:false},1005);
assert.equal(view(room,guest.token,1006).me.roundReady,false,'players can undo their signal');
act(room,host.token,{action:'round-ready',round:0,roundStarted:room.started,ready:true},1007);
act(room,guest.token,{action:'round-ready',round:0,roundStarted:room.started,ready:true},1008);
act(room,host.token,{action:'next',round:0,roundStarted:room.started},1010);
state=view(room,host.token,1011);
assert.equal(state.status,'playing');
assert.deepEqual(state.players.map(p=>p.roundReady),[false,false],'new rounds clear every ready signal');
assert.throws(()=>act(room,guest.token,{action:'round-ready',round:1,roundStarted:room.started,ready:true},1012),/after the answer/);

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/READY CHECK/);
assert.match(page,/Ready for next round/);
assert.match(page,/The host still decides when the room moves on/);
assert.match(css,/\.round-ready/);
console.log('PASS: reveal readiness is round-scoped, player-controlled and host-paced.');
