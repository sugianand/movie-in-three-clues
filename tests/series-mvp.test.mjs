import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,newRoom,player,view} from '../lib/game.ts';

function finish(room,host,scores,mode='individual'){
 room.deck=[0];room.round=0;room.started=1000;room.status='reveal';room.matchMode=mode;
 room.players.forEach((player,index)=>{player.score=scores[index];});
 act(room,host.token,{action:'next',round:0,roundStarted:1000},2000);
}

const host=player('Sugi'),guest=player('Guest'),room=newRoom('MVP001',host,0);room.players.push(guest);
finish(room,host,[500,300]);
assert.deepEqual(view(room,host.token,2001).players.map(player=>player.seriesPoints),[500,300]);
act(room,host.token,{action:'replay'},3000);finish(room,host,[100,400]);
assert.deepEqual(view(room,guest.token,4000).players.map(player=>player.seriesPoints),[600,700],'every final match score accumulates across the series');

const teamPlayers=['A','B','C','D'].map(player),teams=newRoom('MVP002',teamPlayers[0],0);teams.players.push(...teamPlayers.slice(1));
teamPlayers.forEach((player,index)=>{player.team=index%2?'gold':'purple';});
finish(teams,teamPlayers[0],[300,200,100,-100],'teams');
assert.deepEqual(view(teams,teamPlayers[3].token,2001).players.map(player=>player.seriesPoints),[300,200,100,-100],'team games retain each player contribution and penalties');

room.seriesWins={[guest.id]:3};act(room,host.token,{action:'reset-series'},5000);
assert.deepEqual(view(room,host.token,5001).players.map(player=>player.seriesPoints),[0,0]);
const legacyHost=player('Legacy'),legacy=newRoom('MVP003',legacyHost,0);legacy.players.push(player('Guest'));
assert.deepEqual(view(legacy,legacyHost.token,0).players.map(player=>player.seriesPoints),[0,0]);

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const component=readFileSync(new URL('../components/series-timeline.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/SeriesTimeline[^>]+players=\{game\.players\}/);
assert.match(component,/SERIES MVP RACE/);assert.match(component,/Share the points lead/);assert.match(css,/\.series-mvp\{/);
console.log('PASS: the series MVP race accumulates personal match points, supports teams and ties, and resets safely.');
