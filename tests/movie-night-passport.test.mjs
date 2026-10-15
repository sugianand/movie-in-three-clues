import assert from 'node:assert/strict';
import {emptyMovieNightPassport,parseMovieNightPassport,recordMovieNight} from '../lib/movie-night-passport.ts';

const solo={status:'finished',code:'ABC234',seriesMatches:1,totalRounds:3,matchMode:'individual',winners:['Sugi'],me:{id:'p1',spectator:false},players:[{id:'p1',name:'Sugi',score:700},{id:'p2',name:'Guest',score:300}],teams:[],recap:[
 {round:0,solvers:[{name:'Sugi',clue:1,ms:1400}],missed:['Guest']},
 {round:1,solvers:[{name:'Sugi',clue:2,ms:3200}],missed:[]},
 {round:2,solvers:[{name:'Sugi',clue:1,ms:900}],missed:[]},
]};
let profile=recordMovieNight(emptyMovieNightPassport(),solo);
assert.deepEqual({...profile,recorded:[]},{matches:1,wins:1,solves:3,firstClueSolves:2,perfectMatches:1,currentStreak:1,bestStreak:1,bestScore:700,fastestMs:900,recorded:[]});
assert.deepEqual(recordMovieNight(profile,solo),profile,'polling the same finished match cannot count it twice');

const team={...solo,code:'TEAM42',seriesMatches:2,totalRounds:3,matchMode:'teams',winners:['Reel Legends'],me:{id:'p1',spectator:false,team:'purple'},players:[{id:'p1',name:'Sugi',score:450,team:'purple'}],teams:[{id:'purple',name:'Reel Legends',score:900},{id:'gold',name:'Plot Twisters',score:1000}],recap:[{round:0,solvers:[{name:'Sugi',clue:2,ms:2500}],missed:[]}]};
profile=recordMovieNight(profile,team);
assert.equal(profile.matches,2);assert.equal(profile.wins,2);assert.equal(profile.currentStreak,2);assert.equal(profile.bestStreak,2);assert.equal(profile.bestScore,700);assert.equal(profile.fastestMs,900);

const loss={...solo,code:'LOSS42',seriesMatches:1,winners:['Guest'],players:[{id:'p1',name:'Sugi',score:-100},{id:'p2',name:'Guest',score:300}],recap:[]};
profile=recordMovieNight(profile,loss);assert.equal(profile.matches,3);assert.equal(profile.wins,2);assert.equal(profile.currentStreak,0);assert.equal(profile.bestScore,700);
assert.deepEqual(recordMovieNight(profile,{...loss,code:'WATCH1',me:{id:'p1',spectator:true}}),profile);
assert.deepEqual(parseMovieNightPassport({matches:-4,wins:'x',fastestMs:-2,recorded:['ok','ok',7]}),{matches:0,wins:0,solves:0,firstClueSolves:0,perfectMatches:0,currentStreak:0,bestStreak:0,bestScore:0,fastestMs:null,recorded:['ok']});
console.log('PASS: Movie Night Passport tracks browser-local multiplayer records once across solo and team matches.');
