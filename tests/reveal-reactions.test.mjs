import assert from 'node:assert/strict';
import {act,newRoom,player,spectator,view} from '../lib/game.ts';

const host=player('Host'),guest=player('Guest'),watcher=player('Watcher');
const room=newRoom('REACT1',host,0);room.players.push(guest);room.deck=[0,1];room.round=0;room.started=1000;

assert.throws(()=>act(room,host.token,{action:'react',reaction:'great-pick',round:0,roundStarted:1000},1001),/after the answer/);
room.status='reveal';room.spectators=[spectator(watcher,1002)];
let state=view(room,guest.token,1003);
assert.deepEqual(state.reactions.map(reaction=>reaction.count),[0,0,0,0]);
assert.equal(state.me.reaction,null);

act(room,host.token,{action:'react',reaction:'great-pick',round:0,roundStarted:1000},1004);
state=view(room,host.token,1005);assert.equal(state.me.reaction,'great-pick');assert.equal(state.reactions.find(reaction=>reaction.id==='great-pick').count,1);
act(room,host.token,{action:'react',reaction:'great-pick',round:0,roundStarted:1000},1006);
assert.equal(view(room,guest.token,1007).reactions.find(reaction=>reaction.id==='great-pick').count,1,'retrying a reaction never double-counts it');
act(room,host.token,{action:'react',reaction:'no-way',round:0,roundStarted:1000},1008);
state=view(room,guest.token,1009);assert.equal(state.reactions.find(reaction=>reaction.id==='great-pick').count,0);assert.equal(state.reactions.find(reaction=>reaction.id==='no-way').count,1);
act(room,guest.token,{action:'react',reaction:'no-way',round:0,roundStarted:1000},1010);
state=view(room,watcher.token,1011);assert.equal(state.me.spectator,true);assert.equal(state.me.reaction,null);assert.equal(state.reactions.find(reaction=>reaction.id==='no-way').count,2);
assert(!JSON.stringify(state.reactions).includes(host.name));assert(!JSON.stringify(state.reactions).includes(guest.name));
assert.throws(()=>act(room,guest.token,{action:'react',reaction:'spoiler',round:0,roundStarted:1000},1012),/valid reaction/);
assert.throws(()=>act(room,guest.token,{action:'react',reaction:'great-clue',round:0,roundStarted:999},1012),/earlier round/);
assert.throws(()=>act(room,watcher.token,{action:'react',reaction:'great-clue',round:0,roundStarted:1000},1013),/Spectators/);

act(room,host.token,{action:'next',round:0,roundStarted:1000},2000);
state=view(room,host.token,2001);assert.equal(state.status,'playing');assert.deepEqual(state.reactions,[]);assert.equal(state.me.reaction,null);assert.equal(room.reactions,undefined);

const legacyHost=player('Legacy host'),legacyGuest=player('Legacy guest'),legacy=newRoom('OLD123',legacyHost,0);legacy.players.push(legacyGuest);legacy.deck=[0];legacy.status='reveal';legacy.started=5000;delete legacy.reactions;
assert.deepEqual(view(legacy,legacyHost.token,5001).reactions.map(reaction=>reaction.count),[0,0,0,0]);

console.log('PASS: reveal reactions sync anonymous counts, replace safely, reject invalid or spectator actions, clear between rounds and support legacy rooms.');
