import assert from 'node:assert/strict';
import {act,leaveRoom,newRoom,player,promoteSpectators,spectator,view} from '../lib/game.ts';

const host=player('Host'),guest=player('Guest'),late=player('Late arrival');
const room=newRoom('SEE234',host,0);room.players.push(guest);act(room,host.token,{action:'start'},1000);room.spectators=[spectator(late,1001)];
const watching=view(room,late.token,1002);
assert.equal(watching.me.spectator,true);assert.equal(watching.players.length,2);assert.deepEqual(watching.spectators,[{id:late.id,name:'Late arrival'}]);assert.equal(watching.answer,null);assert.equal(watching.clues.length,1);assert(!JSON.stringify(watching).includes(late.token));
assert.throws(()=>act(room,late.token,{action:'guess',round:0,stage:0,guess:'Anything'},1003),/Spectators can watch/);
leaveRoom(room,late.token);assert.equal(room.status,'playing');assert.equal(room.players.length,2);assert.deepEqual(room.spectators,[]);

const first=player('First watcher'),second=player('Second watcher');room.spectators=[spectator(first),spectator(second)];room.status='finished';room.result={winners:['Host'],teams:[]};act(room,host.token,{action:'replay'},2000);
assert.equal(room.status,'playing');assert.equal(room.players.length,4);assert.equal(room.spectators.length,0);assert.equal(view(room,first.token,2001).me.spectator,false);

const teamRoom=newRoom('TEAM34',player('Team host'));teamRoom.settings.mode='teams';teamRoom.players.push(player('Team guest'));teamRoom.spectators=[spectator(player('Odd watcher'))];
assert.equal(promoteSpectators(teamRoom),0,'team promotion waits for an even pair');assert.equal(teamRoom.spectators.length,1);
teamRoom.spectators.push(spectator(player('Even watcher')));assert.equal(promoteSpectators(teamRoom),2);assert.equal(teamRoom.players.length,4);assert.deepEqual(teamRoom.players.map(p=>p.team),['purple','gold','purple','gold']);

console.log('PASS: spectator views stay spoiler-safe and scoreless, leaving is non-disruptive, and queued viewers promote safely next match.');
