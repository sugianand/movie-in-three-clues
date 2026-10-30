import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,newRoom,player,view} from '../lib/game.ts';

function finish(room,host,scores,solvers){
 room.deck=[0];room.round=0;room.started=1000;room.status='reveal';room.matchMode='individual';
 room.players.forEach((player,index)=>{player.score=scores[index];});
 room.recap=[{round:0,title:'Movie',solvers,missed:[],totals:room.players.map((player,index)=>({name:player.name,score:scores[index]}))}];
 act(room,host.token,{action:'next',round:0,roundStarted:1000},2000);
}

const host=player('Sugi'),guest=player('Guest'),room=newRoom('HONORS',host,0);room.players.push(guest);
finish(room,host,[500,300],[{name:'Sugi',clue:1,points:300,ms:1400},{name:'Guest',clue:2,points:200,ms:2400}]);
act(room,host.token,{action:'replay'},3000);
finish(room,host,[100,400],[{name:'Guest',clue:1,points:300,ms:1200},{name:'Sugi',clue:2,points:200,ms:1000}]);
let state=view(room,guest.token,4000);
assert.deepEqual(state.players.map(player=>player.seriesPoints),[600,700],'points accumulate for the championship MVP');
assert.deepEqual(state.players.map(player=>player.seriesSolves),[2,2],'solves accumulate across matches');
assert.deepEqual(state.players.map(player=>player.seriesFirstClues),[1,1],'first-clue solves recognize tied aces');
assert.deepEqual(state.seriesFastest,{name:'Sugi',ms:1000},'the quickest solve survives later matches');

room.seriesWins={[guest.id]:3};act(room,host.token,{action:'reset-series'},5000);state=view(room,host.token,5001);
assert.deepEqual(state.players.map(player=>[player.seriesPoints,player.seriesSolves,player.seriesFirstClues]),[[0,0,0],[0,0,0]],'a new championship resets every honor');
assert.equal(state.seriesFastest,null,'a new championship resets the speed record');
const legacyHost=player('Legacy'),legacy=newRoom('OLDROOM',legacyHost,0);legacy.players.push(player('Guest'));
assert.deepEqual(view(legacy,legacyHost.token,0).players.map(player=>[player.seriesSolves,player.seriesFirstClues]),[[0,0],[0,0]],'legacy rooms safely default honor totals');
assert.equal(view(legacy,legacyHost.token,0).seriesFastest,null);

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const component=readFileSync(new URL('../components/series-honors.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/SeriesHonors[^>]+fastest=\{game\.seriesFastest\}/);
assert.match(component,/POINTS MVP/);assert.match(component,/FIRST-CLUE ACE/);assert.match(component,/FASTEST SOLVE/);
assert.match(css,/\.series-honors\{/);
console.log('PASS: Series Honors tracks championship points, first-clue aces, fastest solves, ties, legacy rooms, and resets.');
