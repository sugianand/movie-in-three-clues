import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,leaveRoom,newRoom,player,view} from '../lib/game.ts';

function crown(room,host,winner){
 room.deck=[0];room.round=0;room.started=1000;room.status='reveal';room.matchMode='individual';room.seriesWins={[winner.id]:2};
 room.players.forEach(p=>{p.score=p.id===winner.id?500:100;});
 act(room,host.token,{action:'next',round:0,roundStarted:1000},2000);
}

const host=player('Sugi'),guest=player('Guest'),room=newRoom('LEAVER',host,0);room.players.push(guest);
crown(room,host,host);
assert.deepEqual(view(room,guest.token,2001).seriesChampions,['Sugi']);
leaveRoom(room,host.token);
let state=view(room,guest.token,2002);
assert.equal(state.status,'lobby');assert.equal(state.host,guest.id);
assert.deepEqual(state.seriesChampions,['Sugi'],'the crown survives its winner leaving the room');
assert.equal(state.titleStreak,1);
assert.throws(()=>act(room,guest.token,{action:'start'},2003),/new Movie Night Series/,'the lobby cannot bypass the completed series');
act(room,guest.token,{action:'reset-series'},2004);
state=view(room,guest.token,2005);
assert.deepEqual(state.seriesChampions,[]);assert.deepEqual(state.defendingChampions,['Sugi']);
assert.equal(state.defendingTitleStreak,1);assert.equal(state.seriesMatches,0);

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
assert.match(page,/championSnapshot\.length>0\|\|!!game&&seriesMax>=seriesTarget/);
assert.match(page,/game&&seriesComplete&&<section className="series-champion"/);
console.log('PASS: completed series stay recoverable when champions leave.');
