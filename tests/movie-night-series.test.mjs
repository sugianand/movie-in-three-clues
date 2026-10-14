import assert from 'node:assert/strict';
import {act,newRoom,player,view} from '../lib/game.ts';
import {roundCount} from '../lib/game-settings.ts';

function finish(room,host,scores,mode='individual'){
 const rounds=roundCount(room.settings);room.deck=Array(rounds).fill(0);room.round=rounds-1;room.started=1000;room.status='reveal';room.matchMode=mode;
 room.players.forEach((p,i)=>{p.score=scores[i];});
 act(room,host.token,{action:'next',round:rounds-1,roundStarted:1000},2000);
}

const host=player('Host'),guest=player('Guest'),room=newRoom('SERIES',host,0);room.players.push(guest);
assert.equal(view(room,host.token,0).seriesMatches,0);assert(room.players.every(p=>view(room,host.token,0).players.find(x=>x.id===p.id).seriesWins===0));
finish(room,host,[300,100]);let state=view(room,guest.token,2001);assert.equal(state.seriesMatches,1);assert.equal(state.players.find(p=>p.id===host.id).seriesWins,1);assert.equal(state.players.find(p=>p.id===guest.id).seriesWins,0);
assert.throws(()=>act(room,host.token,{action:'next',round:4,roundStarted:1000},2002),/finish/);assert.equal(room.seriesMatches,1,'retries cannot award a match twice');
act(room,host.token,{action:'replay'},3000);finish(room,host,[50,250]);state=view(room,host.token,4001);assert.equal(state.seriesMatches,2);assert.deepEqual(state.players.map(p=>p.seriesWins),[1,1]);
act(room,host.token,{action:'replay'},5000);finish(room,host,[200,200]);state=view(room,host.token,6001);assert.equal(state.seriesMatches,3);assert.deepEqual(state.players.map(p=>p.seriesWins),[2,2],'a tie awards every winner');
const teamPlayers=['A','B','C','D'].map(player),teamRoom=newRoom('TEAMS1',teamPlayers[0],0);teamRoom.players.push(...teamPlayers.slice(1));teamPlayers.forEach((p,i)=>{p.team=i%2?'gold':'purple';});finish(teamRoom,teamPlayers[0],[300,100,300,100],'teams');
const teamState=view(teamRoom,teamPlayers[3].token,2001);assert.deepEqual(teamState.players.map(p=>p.seriesWins),[1,0,1,0],'every member of the winning team earns a series win');
const legacyHost=player('Legacy'),legacyGuest=player('Guest'),legacy=newRoom('LEGACY',legacyHost,0);legacy.players.push(legacyGuest);delete legacy.seriesMatches;delete legacy.seriesWins;
assert.equal(view(legacy,legacyHost.token,0).seriesMatches,0);assert(legacy.players.every(p=>view(legacy,legacyHost.token,0).players.find(x=>x.id===p.id).seriesWins===0));
console.log('PASS: movie-night series wins persist across rematches, award solo/team ties once, and keep legacy rooms compatible.');
