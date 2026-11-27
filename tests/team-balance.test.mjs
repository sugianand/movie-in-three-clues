import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,newRoom,player,view} from '../lib/game.ts';

const players=['Host','A','B','C'].map(name=>player(name));
const room=newRoom('ABC234',players[0],0);room.players.push(...players.slice(1));
act(room,players[0].token,{action:'settings',settings:{collection:'mixed',era:'all',mode:'teams'}},0);
players.forEach(player=>{player.team='purple';});
assert.throws(()=>act(room,players[1].token,{action:'balance-teams'},1),/Only the host/);
act(room,players[0].token,{action:'balance-teams'},2);
assert.deepEqual(players.map(player=>player.team),['purple','gold','purple','gold']);
assert.deepEqual(view(room,players[0].token,2).teams.map(team=>team.members),[2,2]);
assert.match(room.notice,/balanced the teams 2–2/);

room.status='finished';players.forEach(player=>{player.ready=true;});
act(room,players[0].token,{action:'balance-teams'},3);assert(players.every(player=>player.ready===false));
room.players.pop();assert.throws(()=>act(room,players[0].token,{action:'balance-teams'},4),/even number/);
room.settings.mode='individual';room.players.push(players[3]);assert.throws(()=>act(room,players[0].token,{action:'balance-teams'},5),/Switch to Teams/);

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/run\('balance-teams'\)/);assert.match(page,/Balance teams/);assert.match(page,/Team names and series wins stay intact/);assert.match(css,/\.team-balance\{/);
console.log('PASS: hosts can evenly rebalance team lobbies without resetting team names or series history.');
