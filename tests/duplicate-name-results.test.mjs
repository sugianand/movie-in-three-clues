import assert from 'node:assert/strict';
import {act,advance,newRoom,player,view} from '../lib/game.ts';
import {multiplayerCardSvg} from '../lib/multiplayer-card.ts';
import {emptyMovieNightPassport,recordMovieNight} from '../lib/movie-night-passport.ts';
import {scoreJourney} from '../lib/score-journey.ts';

const host=player('Alex'),guest=player('Alex'),room=newRoom('TWINS1',host,0);room.players.push(guest);
room.settings={...room.settings,rounds:3};room.deck=[0,1,2];room.round=0;room.started=1000;room.status='playing';room.matchMode='individual';
Object.assign(host,{solved:true,attempt:0,solvedStage:0,solveMs:1000,gain:300,score:300});
advance(room,46000);
assert.equal(room.status,'reveal');assert.equal(room.recap?.[0].solvers[0].id,host.id,'new recaps bind a solve to the player ID');
room.recap?.push(
 {round:1,title:'Hidden two',solvers:[],missed:['Alex','Alex'],totals:[{id:host.id,name:'Alex',score:300},{id:guest.id,name:'Alex',score:0}]},
 {round:2,title:'Hidden three',solvers:[],missed:['Alex','Alex'],totals:[{id:host.id,name:'Alex',score:300},{id:guest.id,name:'Alex',score:0}]},
);
room.round=2;
act(room,host.token,{action:'next',round:2,roundStarted:1000},46001);

const hostResult=view(room,host.token,46002),guestResult=view(room,guest.token,46002);
assert.deepEqual(hostResult.winnerIds,[host.id]);assert.deepEqual(guestResult.winnerIds,[host.id]);
assert.equal(hostResult.players.find(player=>player.id===host.id).seriesSolves,1);
assert.equal(hostResult.players.find(player=>player.id===guest.id).seriesSolves,0,'same-name players keep separate Series solves');
assert.deepEqual(scoreJourney(hostResult.recap).rows.map(row=>({id:row.id,scores:row.scores})),[
 {id:host.id,scores:[300,300,300]},
 {id:guest.id,scores:[0,0,0]},
],'same-name players keep separate Score Journey lines');

const hostCard=multiplayerCardSvg(hostResult),guestCard=multiplayerCardSvg(guestResult);
assert.match(hostCard,/>1<\/text>/);assert.doesNotMatch(guestCard,/>1<\/text>/,'the other Alex cannot inherit the winner’s clue trail');
assert.match(guestCard,/>—<\/text>/);

const hostPassport=recordMovieNight(emptyMovieNightPassport(),hostResult),guestPassport=recordMovieNight(emptyMovieNightPassport(),guestResult);
assert.deepEqual({wins:hostPassport.wins,solves:hostPassport.solves},{wins:1,solves:1});
assert.deepEqual({wins:guestPassport.wins,solves:guestPassport.solves},{wins:0,solves:0},'the other Alex cannot inherit Passport wins or solves');
console.log('PASS: duplicate display names keep separate wins, solves, score journeys, clue trails and Passports.');
