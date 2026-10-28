import assert from 'node:assert/strict';
import fs from 'node:fs';
import {act,newRoom,player,seriesGoal,view} from '../lib/game.ts';

function finish(room,host,scores,mode='individual'){
 room.deck=[0];room.round=0;room.started=1000;room.status='reveal';room.matchMode=mode;
 room.players.forEach((p,i)=>{p.score=scores[i];});
 act(room,host.token,{action:'next',round:0,roundStarted:1000},2000);
}

const host=player('Host'),guest=player('Guest'),room=newRoom('CROWN3',host,0);room.players.push(guest);
assert.equal(seriesGoal,3);
assert.equal(view(room,host.token,0).seriesMatches,0);
finish(room,host,[300,100]);
let state=view(room,guest.token,2001);
assert.equal(state.seriesGoal,3);assert.equal(state.seriesMatches,1);assert.deepEqual(state.players.map(p=>p.seriesWins),[1,0]);
assert.throws(()=>act(room,host.token,{action:'next',round:0,roundStarted:1000},2002),/finish/);assert.equal(room.seriesMatches,1,'retries cannot award twice');

act(room,host.token,{action:'replay'},3000);finish(room,host,[100,300]);
act(room,host.token,{action:'replay'},4000);finish(room,host,[200,200]);
state=view(room,host.token,5000);assert.equal(state.seriesMatches,3);assert.deepEqual(state.players.map(p=>p.seriesWins),[2,2],'ties award every winner');

room.seriesMatches=5;room.seriesWins={[host.id]:3,[guest.id]:2};room.seen=[1,2,3];room.players.forEach(p=>p.ready=true);
assert.throws(()=>act(room,host.token,{action:'replay'},5001),/new Movie Night Series/);
assert.throws(()=>act(room,host.token,{action:'ready',ready:true},5001),/series is complete/i);
assert.throws(()=>act(room,guest.token,{action:'reset-series'},5001),/Only the host/);
act(room,host.token,{action:'reset-series'},5002);state=view(room,guest.token,5003);
assert.equal(state.seriesMatches,0);assert.deepEqual(state.players.map(p=>p.seriesWins),[0,0]);assert(state.players.every(p=>!p.ready));assert.deepEqual(room.seen,[1,2,3]);assert.equal(room.status,'finished');

act(room,host.token,{action:'replay'},5004);assert.equal(room.status,'playing','replay unlocks after a fresh series');
assert.throws(()=>act(room,host.token,{action:'reset-series'},5005),/before or between games/);
const page=fs.readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8'),css=fs.readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/SERIES CHAMPION/);assert.match(page,/Start a new Movie Night Series/);assert.match(page,/Series complete · start a new series/);assert.match(css,/\.series-champion/);
console.log('PASS: first-to-three championships persist, crown winners, reset safely, and preserve room history.');
