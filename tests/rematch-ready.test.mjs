import assert from 'node:assert/strict';
import {act,newRoom,player,view} from '../lib/game.ts';

const host=player('Host'),guest=player('Guest'),room=newRoom('READY2',host,0);room.players.push(guest);
assert.throws(()=>act(room,guest.token,{action:'ready',ready:true}),/after the final reveal/);
act(room,host.token,{action:'start'},1000);room.status='finished';room.result={winners:['Host'],teams:[]};
act(room,guest.token,{action:'ready',ready:true});
let hostView=view(room,host.token);assert.equal(hostView.players.find(p=>p.id===guest.id).ready,true);assert.equal(hostView.me.ready,false);
assert.throws(()=>act(room,host.token,{action:'ready',ready:'yes'}),/valid rematch status/);
act(room,host.token,{action:'ready',ready:true});assert.equal(view(room,guest.token).players.filter(p=>p.ready).length,2);
act(room,guest.token,{action:'ready',ready:false});assert.equal(view(room,guest.token).me.ready,false);
act(room,guest.token,{action:'ready',ready:true});act(room,host.token,{action:'settings',settings:room.settings});assert(room.players.every(p=>p.ready===false),'changing the next match clears stale readiness');
act(room,host.token,{action:'replay'},2000);hostView=view(room,host.token,2001);assert.equal(hostView.status,'playing');assert(hostView.players.every(p=>p.ready===false));assert.equal(hostView.me.ready,false);

console.log('PASS: rematch readiness syncs after a match, validates input, toggles safely and resets on replay.');
