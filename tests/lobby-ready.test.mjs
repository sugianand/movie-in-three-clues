import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,newRoom,player,view} from '../lib/game.ts';

const host=player('Host'),guest=player('Guest'),room=newRoom('ABC234',host,0);room.players.push(guest);
act(room,guest.token,{action:'ready',ready:true},1);
assert.equal(view(room,host.token,1).players.find(player=>player.id===guest.id).ready,true);
assert.throws(()=>act(room,guest.token,{action:'ready',ready:'yes'},2),/valid rematch status/);
act(room,host.token,{action:'ready',ready:true},3);assert(room.players.every(player=>player.ready));
act(room,host.token,{action:'settings',settings:{...room.settings,rounds:3}},4);
assert(room.players.every(player=>player.ready===false),'changing setup clears stale readiness');

act(room,host.token,{action:'settings',settings:{...room.settings,mode:'teams'}},5);
act(room,guest.token,{action:'ready',ready:true},6);
act(room,guest.token,{action:'team',team:'purple'},7);assert.equal(guest.ready,false,'changing teams clears that player’s signal');
act(room,host.token,{action:'team',team:'gold'},8);
act(room,host.token,{action:'ready',ready:true},9);act(room,guest.token,{action:'ready',ready:true},10);
act(room,host.token,{action:'start'},11);assert(room.players.every(player=>player.ready===false));
assert.throws(()=>act(room,guest.token,{action:'ready',ready:true},12),/lobby or after/);

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/aria-label="Lobby readiness"/);assert.match(page,/Ready for the first clue/);
assert.match(page,/players seated/);assert.match(page,/Start game ·/);assert.match(css,/\.lobby-ready\{/);
console.log('PASS: lobby readiness is visible, player-controlled, and reset by setup changes or match start.');
