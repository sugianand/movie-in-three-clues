import assert from 'node:assert/strict';
import {act,newRoom,player,spectator,view} from '../lib/game.ts';

const host=player('Host'),guest=player('Disconnected'),third=player('Still here'),watcher=player('Watcher');
const room=newRoom('REMOVE',host,0);room.players.push(guest,third);room.spectators=[spectator(watcher,1)];room.seen=[1,2,3];room.players[0].score=300;room.players[2].ready=true;
const settings=structuredClone(room.settings),seen=[...room.seen];

assert.throws(()=>act(room,guest.token,{action:'remove-player',playerId:third.id},2),/Only the host/);
assert.throws(()=>act(room,host.token,{action:'remove-player',playerId:host.id},2),/another active player/);
assert.throws(()=>act(room,host.token,{action:'remove-player',playerId:'missing'},2),/another active player/);
assert.throws(()=>act(room,host.token,{action:'remove-player',playerId:watcher.id},2),/another active player/);
assert.throws(()=>act(room,watcher.token,{action:'remove-player',playerId:guest.id},2),/Spectators/);

act(room,host.token,{action:'remove-player',playerId:guest.id},3);
assert.deepEqual(room.players.map(p=>p.name),['Host','Still here']);assert.equal(room.notice,'Disconnected was removed by the host.');
assert.throws(()=>view(room,guest.token,4),/session/);assert.deepEqual(room.settings,settings);assert.deepEqual(room.seen,seen);assert.equal(room.players[0].score,300);assert.equal(room.players[1].ready,true);

room.status='playing';room.deck=[0];room.started=10;
assert.throws(()=>act(room,host.token,{action:'remove-player',playerId:third.id},11),/before or between/);
room.status='reveal';assert.throws(()=>act(room,host.token,{action:'remove-player',playerId:third.id},11),/before or between/);
room.status='finished';act(room,host.token,{action:'remove-player',playerId:third.id},12);assert.deepEqual(room.players.map(p=>p.name),['Host']);
console.log('PASS: hosts can clear inactive seats only between matches without resetting room progress.');
