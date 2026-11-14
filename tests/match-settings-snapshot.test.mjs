import assert from 'node:assert/strict';
import {act,newRoom,player,view} from '../lib/game.ts';
import {multiplayerCardSvg} from '../lib/multiplayer-card.ts';

const host=player('Host'),guest=player('Guest'),room=newRoom('RESULT',host,0);room.players.push(guest);
room.settings={collection:'mixed',era:'all',mode:'individual',difficulty:'hard',rounds:3,speedBonus:true};
room.deck=[0,1,2];room.round=2;room.started=1000;room.status='reveal';room.matchMode='individual';
host.score=600;guest.score=300;
act(room,host.token,{action:'next',round:2,roundStarted:1000},2000);

let result=view(room,host.token,2001);
assert.deepEqual(result.resultSettings,{difficulty:'hard',speedBonus:true},'the completed match snapshots its card settings');

act(room,host.token,{action:'settings',settings:{collection:'mixed',era:'all',mode:'individual',difficulty:'easy',rounds:5,speedBonus:false}},2002);
result=view(room,host.token,2003);
assert.deepEqual(result.settings,{collection:'mixed',era:'all',mode:'individual',difficulty:'easy',rounds:5,speedBonus:false});
assert.deepEqual(result.resultSettings,{difficulty:'hard',speedBonus:true},'next-match changes cannot rewrite the completed result');

const svg=multiplayerCardSvg(result);
assert.match(svg,/SOLO · 3 ROUNDS · HARD · SPEED BONUS/);
assert.doesNotMatch(svg,/SOLO · 3 ROUNDS · EASY/);

const legacy={...room,result:{...room.result,settings:undefined}};
assert.deepEqual(view(legacy,host.token,2004).resultSettings,{difficulty:'easy',speedBonus:false},'legacy rooms fall back safely');

console.log('PASS: completed match cards keep immutable difficulty and Speed Bonus settings.');

