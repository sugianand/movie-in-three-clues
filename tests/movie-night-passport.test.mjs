import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emptyMovieNightPassport,newlyUnlockedPassportStamps,parseMovieNightPassport,passportAchievements,passportShareText,recordMovieNight,shareMovieNightPassport} from '../lib/movie-night-passport.ts';

const solo={status:'finished',code:'ABC234',seriesMatches:1,roundStarted:1000,totalRounds:3,matchMode:'individual',winners:['Sugi'],me:{id:'p1',spectator:false},players:[{id:'p1',name:'Sugi',score:700,seriesWins:1},{id:'p2',name:'Guest',score:300,seriesWins:0}],teams:[],recap:[
 {round:0,solvers:[{name:'Sugi',clue:1,ms:1400}],missed:['Guest']},
 {round:1,solvers:[{name:'Sugi',clue:2,ms:3200}],missed:[]},
 {round:2,solvers:[{name:'Sugi',clue:1,ms:900}],missed:[]},
]};
let profile=recordMovieNight(emptyMovieNightPassport(),solo);
assert.deepEqual({...profile,recorded:[]},{matches:1,wins:1,solves:3,firstClueSolves:2,perfectMatches:1,seriesTitles:0,bestTitleStreak:0,currentStreak:1,bestStreak:1,bestScore:700,fastestMs:900,recorded:[]});
assert.deepEqual(newlyUnlockedPassportStamps(emptyMovieNightPassport(),profile).map(stamp=>stamp.id),['opening-night','box-office-hit','quick-cut','perfect-screening'],'a first great match celebrates every newly earned stamp');
assert.deepEqual(newlyUnlockedPassportStamps(profile,profile),[],'revisiting the same result cannot celebrate stamps twice');
let stamps=passportAchievements(profile);assert.deepEqual(stamps.filter(stamp=>stamp.unlocked).map(stamp=>stamp.id),['opening-night','box-office-hit','quick-cut','perfect-screening']);
assert.deepEqual(recordMovieNight(profile,solo),profile,'polling the same finished match cannot count it twice');

const team={...solo,code:'TEAM42',seriesMatches:2,roundStarted:2000,matchMode:'teams',winners:['Reel Legends'],me:{id:'p1',spectator:false,team:'purple'},players:[{id:'p1',name:'Sugi',score:450,seriesWins:2,team:'purple'}],teams:[{id:'purple',name:'Reel Legends',score:900},{id:'gold',name:'Plot Twisters',score:1000}],recap:[{round:0,solvers:[{name:'Sugi',clue:2,ms:2500}],missed:[]}]};
profile=recordMovieNight(profile,team);assert.equal(profile.matches,2);assert.equal(profile.wins,2);assert.equal(profile.currentStreak,2);
const loss={...solo,code:'LOSS42',seriesMatches:1,roundStarted:3000,winners:['Guest'],players:[{id:'p1',name:'Sugi',score:-100,seriesWins:0},{id:'p2',name:'Guest',score:300,seriesWins:1}],recap:[]};
profile=recordMovieNight(profile,loss);assert.equal(profile.matches,3);assert.equal(profile.currentStreak,0);
assert.deepEqual(recordMovieNight(profile,{...loss,code:'WATCH1',me:{id:'p1',spectator:true}}),profile);

const crown={...solo,code:'CROWN3',seriesMatches:5,roundStarted:4000,seriesChampions:['Sugi'],titleStreak:2,players:[{...solo.players[0],seriesWins:3}],recap:[]};
profile=recordMovieNight(profile,crown);assert.equal(profile.seriesTitles,1);assert.equal(profile.bestTitleStreak,2);
stamps=passportAchievements(profile);assert(stamps.find(stamp=>stamp.id==='crown-collector')?.unlocked);assert(stamps.find(stamp=>stamp.id==='dynasty')?.unlocked);
const nextSeries={...solo,seriesMatches:1,roundStarted:5000,winners:['Guest'],players:[{...solo.players[0],seriesWins:0}],recap:[]};
assert.equal(recordMovieNight(profile,nextSeries).matches,5,'new series match one in the same room must not collide with the old series');
assert.deepEqual(parseMovieNightPassport({matches:-4,wins:'x',fastestMs:-2,recorded:['ok','ok',7]}),{matches:0,wins:0,solves:0,firstClueSolves:0,perfectMatches:0,seriesTitles:0,bestTitleStreak:0,currentStreak:0,bestStreak:0,bestScore:0,fastestMs:null,recorded:['ok']});
const completedPassport={...profile,matches:5,firstClueSolves:5};
assert.deepEqual(newlyUnlockedPassportStamps(profile,completedPassport).map(stamp=>stamp.id),['season-ticket','sharp-eye'],'multiple milestones earned together share one celebration');
const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const resultCard=readFileSync(new URL('../components/multiplayer-result-card.tsx',import.meta.url),'utf8');
const passportComponent=readFileSync(new URL('../components/movie-night-passport.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/game\?\.status==='finished'&&!game\.me\.spectator&&<MovieNightPassport result=\{game\}/,'the Passport must record the championship-clinching match');
assert.match(page,/!session&&entryStep==='landing'&&<MovieNightPassport\/>/,'returning players must be able to see their saved Passport from the landing page');
assert.doesNotMatch(resultCard,/<MovieNightPassport/,'Passport recording must not depend on the result-card panel or an unfinished Series');
assert.match(passportComponent,/className="passport-unlocked" role="status"/);assert.match(passportComponent,/newStamps\.join\(' · '\)/);assert.match(css,/\.passport-unlocked\{/);
const shareText=passportShareText(profile,'https://example.com/?room=CROWN3&token=secret#answer');
assert.match(shareText,/Movie Night Passport/);assert.match(shareText,/4 matches · 75% wins/);assert.match(shareText,/1 Series title · Best title streak: 2/);assert(shareText.endsWith('https://example.com/'));
for(const secret of ['CROWN3','secret','#answer','Sugi'])assert(!shareText.includes(secret),'Passport shares must exclude room, URL and player details');
assert.equal(passportShareText(emptyMovieNightPassport(),'https://example.com'),null);assert.equal(passportShareText(profile,'javascript:alert(1)'),null);
let shared,copied;assert.equal(await shareMovieNightPassport(shareText,{share:async data=>{shared=data;}}),'shared');assert.equal(shared.title,'Three Clues · Movie Night Passport');assert.equal(shared.text,shareText);
assert.equal(await shareMovieNightPassport(shareText,{share:async()=>{throw {name:'AbortError'};},copy:async()=>{throw Error('must not copy');}}),'cancelled');
assert.equal(await shareMovieNightPassport(shareText,{share:async()=>{throw Error('blocked');},copy:async value=>{copied=value;}}),'copied');assert.equal(copied,shareText);assert.equal(await shareMovieNightPassport(shareText,{},false),'manual');
console.log('PASS: Movie Night Passport tracks matches, Series crowns and Dynasty streaks without cross-series collisions.');
