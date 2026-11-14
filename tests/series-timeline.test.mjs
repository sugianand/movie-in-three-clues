import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,newRoom,player,view} from '../lib/game.ts';

function finish(room,host,scores,mode='individual'){
 room.deck=[0];room.round=0;room.started=1000;room.status='reveal';room.matchMode=mode;
 room.players.forEach((p,i)=>{p.score=scores[i];});
 act(room,host.token,{action:'next',round:0,roundStarted:1000},2000);
}

const host=player('Sugi'),guest=player('Guest'),room=newRoom('REEL01',host,0);room.players.push(guest);
finish(room,host,[300,100]);
assert.deepEqual(view(room,host.token,2001).seriesHistory,[{match:1,winners:['Sugi']}]);
act(room,host.token,{action:'replay'},3000);finish(room,host,[200,200]);
assert.deepEqual(view(room,guest.token,4000).seriesHistory,[{match:1,winners:['Sugi']},{match:2,winners:['Sugi','Guest']}],'ties snapshot every match winner');

const teamPlayers=['A','B','C','D'].map(player),teams=newRoom('REEL02',teamPlayers[0],0);teams.players.push(...teamPlayers.slice(1));
teamPlayers.forEach((p,i)=>{p.team=i%2?'gold':'purple';});teams.teamNames={purple:'Plot Twists',gold:'Final Cuts'};
finish(teams,teamPlayers[0],[300,100,300,100],'teams');
assert.deepEqual(view(teams,teamPlayers[3].token,2001).seriesHistory,[{match:1,winners:['Plot Twists']}],'team names are frozen into the series reel');

room.seriesWins={[host.id]:3,[guest.id]:1};act(room,host.token,{action:'reset-series'},5000);
assert.deepEqual(view(room,host.token,5001).seriesHistory,[],'a new series starts with a clean reel');
const legacy=newRoom('LEGACY',player('Legacy'),0);legacy.players.push(player('Guest'));
assert.deepEqual(view(legacy,legacy.players[0].token,0).seriesHistory,[],'legacy rooms default to an empty reel');

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const component=readFileSync(new URL('../components/series-timeline.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/SeriesTimeline/);assert.match(component,/THE SERIES SO FAR/);assert.match(component,/Shared the win/);assert.match(css,/\.series-timeline\{/);
console.log('PASS: every series match adds a responsive, tie-safe winner card and new series reset the reel.');
