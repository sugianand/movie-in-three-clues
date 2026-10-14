import assert from 'node:assert/strict';
import {act,newRoom,player,spectator,view} from '../lib/game.ts';

const host=player('Original host'),guest=player('Next host'),third=player('Third player'),watcher=player('Watcher');
const room=newRoom('PASS01',host,0);room.players.push(guest,third);room.spectators=[spectator(watcher,1)];
room.players[0].score=420;room.players[1].score=310;room.players[0].ready=true;room.seriesMatches=3;room.seriesWins={[host.id]:2,[guest.id]:1};room.seen=[1,2,3];
const settings=structuredClone(room.settings);

assert.throws(()=>act(room,guest.token,{action:'transfer-host',playerId:guest.id},2),/Only the host/);
assert.throws(()=>act(room,host.token,{action:'transfer-host',playerId:host.id},2),/another active player/);
assert.throws(()=>act(room,host.token,{action:'transfer-host',playerId:'missing'},2),/another active player/);
assert.throws(()=>act(room,host.token,{action:'transfer-host',playerId:watcher.id},2),/another active player/);
assert.throws(()=>act(room,watcher.token,{action:'transfer-host',playerId:guest.id},2),/Spectators/);

act(room,host.token,{action:'transfer-host',playerId:guest.id},3);
assert.equal(room.host,guest.id);assert.equal(room.notice,'Next host is now the host.');
assert.deepEqual(room.players.map(p=>p.score),[420,310,0]);assert.deepEqual(room.players.map(p=>!!p.ready),[true,false,false]);
assert.equal(room.seriesMatches,3);assert.deepEqual(room.seriesWins,{[host.id]:2,[guest.id]:1});assert.deepEqual(room.seen,[1,2,3]);assert.deepEqual(room.settings,settings);
assert.equal(view(room,host.token,4).host,guest.id);
assert.throws(()=>act(room,host.token,{action:'settings',settings},4),/Only the host/);
act(room,guest.token,{action:'settings',settings},4);

room.status='playing';room.deck=[0];room.started=10;
assert.throws(()=>act(room,guest.token,{action:'transfer-host',playerId:third.id},11),/before or between/);
room.status='reveal';
assert.throws(()=>act(room,guest.token,{action:'transfer-host',playerId:third.id},11),/before or between/);
room.status='finished';
act(room,guest.token,{action:'transfer-host',playerId:third.id},12);
assert.equal(room.host,third.id);assert.equal(room.notice,'Third player is now the host.');
assert.throws(()=>act(room,guest.token,{action:'replay'},13),/Only the host/);

console.log('PASS: host handoff is authorized, phase-locked, spectator-safe and preserves room progress between matches.');
