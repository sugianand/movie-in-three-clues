import assert from 'node:assert/strict';
import fs from 'node:fs';
import {act,newRoom,player,view} from '../lib/game.ts';

const host=player('Sugi'),guest=player('Guest'),room=newRoom('DEFEND',host,0);room.players.push(guest);
room.status='finished';room.deck=[0];room.seriesMatches=5;room.seriesWins={[host.id]:3,[guest.id]:2};
act(room,host.token,{action:'reset-series'},1000);
let state=view(room,guest.token,1001);
assert.deepEqual(state.defendingChampions,['Sugi'],'the champion survives the new-series reset');
assert.deepEqual(state.players.map(p=>p.seriesWins),[0,0],'the new race still begins at zero');
act(room,host.token,{action:'replay'},1002);
assert.deepEqual(view(room,host.token,1003).defendingChampions,['Sugi'],'the crown stays visible during the next match');

const sharedHost=player('A'),sharedGuest=player('B'),shared=newRoom('SHARED',sharedHost,0);shared.players.push(sharedGuest);shared.status='finished';shared.deck=[0];shared.seriesWins={[sharedHost.id]:3,[sharedGuest.id]:3};
act(shared,sharedHost.token,{action:'reset-series'},1000);
assert.deepEqual(view(shared,sharedHost.token,1001).defendingChampions,['A','B'],'shared champions keep the crown together');

const legacyHost=player('Legacy'),legacy=newRoom('LEGACY',legacyHost,0);
assert.deepEqual(view(legacy,legacyHost.token,0).defendingChampions,[],'older rooms have no defending champion');
const page=fs.readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8'),css=fs.readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/DEFENDING.*CHAMPION/);assert.match(page,/first-to-three race has a new winner/);assert.match(css,/\.series-defender\{/);
console.log('PASS: completed series hand their defending crown into the next first-to-three race.');
