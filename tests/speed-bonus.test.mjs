import assert from 'node:assert/strict';
import {act,movies,newRoom,player,speedBonus,view} from '../lib/game.ts';
import {parseSettings} from '../lib/game-settings.ts';

function setup(enabled=false){
 const host=player('Host'),guest=player('Guest'),room=newRoom('ABC234',host,1000);room.players.push(guest);
 act(room,host.token,{action:'settings',settings:{collection:'mixed',era:'all',mode:'individual',difficulty:'normal',speedBonus:enabled}},1000);
 act(room,host.token,{action:'start'},1000);
 return {host,guest,room};
}
function solve(room,p,now){act(room,p.token,{action:'guess',round:room.round,roundStarted:room.started,stage:Math.floor((now-room.started)/15000),guess:movies[room.deck[room.round]].title},now);}

assert.equal(parseSettings({collection:'mixed',era:'all'}).speedBonus,false);
assert.throws(()=>parseSettings({collection:'mixed',era:'all',speedBonus:'yes'}),/Speed Bonus/);

const classic=setup(false);solve(classic.room,classic.host,1001);assert.equal(classic.host.score,300);assert.equal(classic.host.speedBonus,0);
const fast=setup(true);assert.equal(speedBonus(fast.room,1000),50);assert.equal(speedBonus(fast.room,15999),5);
solve(fast.room,fast.host,1001);assert.equal(fast.host.score,350);assert.equal(view(fast.room,fast.host.token,1002).me.speedBonus,50);
assert.equal(view(fast.room,fast.guest.token,1002).players[0].score,0,'opponents still see hidden scores');
const middle=setup(true);solve(middle.room,middle.host,23500);assert.equal(middle.host.score,225);assert.equal(middle.host.speedBonus,25);assert.equal(middle.host.solveMs,7500);

console.log('PASS: optional server-timed Speed Bonus tiers, classic defaults, recap-safe stages and hidden scores.');
