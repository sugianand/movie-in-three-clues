import assert from 'node:assert/strict';
import {multiplayerCardSvg} from '../lib/multiplayer-card.ts';

const result={status:'finished',totalRounds:5,matchMode:'individual',settings:{difficulty:'standard',speedBonus:true},winners:['Ava & Co'],me:{id:'p2'},players:[{id:'p1',name:'Ava & Co',score:1200},{id:'p2',name:'Me <Movie Buff>',score:900}],teams:[],recap:[
 {round:0,title:'SECRET TITLE 1',solvers:[{name:'Me <Movie Buff>',clue:2}],missed:[]},
 {round:1,title:'SECRET TITLE 2',solvers:[{name:'Ava & Co',clue:1}],missed:['Me <Movie Buff>']},
 {round:2,title:'SECRET TITLE 3',solvers:[{name:'Me <Movie Buff>',clue:3}],missed:[]},
 {round:3,title:'SECRET TITLE 4',solvers:[],missed:['Me <Movie Buff>']},
 {round:4,title:'SECRET TITLE 5',solvers:[{name:'Me <Movie Buff>',clue:1}],missed:[]}
],fastest:{name:'Ava & Co',title:'FAST SECRET',clue:1,ms:2380}};
const svg=multiplayerCardSvg(result);
assert.match(svg,/THREE CLUES/);assert.match(svg,/SOLO · 5 ROUNDS · STANDARD · SPEED BONUS/);assert.match(svg,/Ava &amp; Co/);assert.match(svg,/Me &lt;Movie Buff&gt;/);assert.match(svg,/900 PTS/);assert.match(svg,/2\.4s · CLUE 1/);
for(const secret of ['SECRET TITLE 1','SECRET TITLE 5','FAST SECRET'])assert(!svg.includes(secret),`${secret} leaked into result card`);
assert.equal((svg.match(/translate\([^)]* 530\)/g)||[]).length,5,'one clue-trail cell per round');
assert.throws(()=>multiplayerCardSvg({...result,status:'playing'}),/Finish the match/);
const teams=multiplayerCardSvg({...result,totalRounds:3,matchMode:'teams',settings:{difficulty:'relaxed',speedBonus:false},winners:['Reel Legends'],teams:[{name:'Reel Legends',score:1700},{name:'Plot Twisters',score:1400}],recap:result.recap.slice(0,3),fastest:null});
assert.match(teams,/TEAMS · 3 ROUNDS · RELAXED/);assert.match(teams,/FINAL TEAM STANDINGS/);assert.match(teams,/Reel Legends/);assert(!teams.includes('FAST SECRET'));
const ten=multiplayerCardSvg({...result,totalRounds:10,recap:Array.from({length:10},(_,round)=>({round,title:`Hidden ${round}`,solvers:[],missed:['Me <Movie Buff>']}))});
assert.equal((ten.match(/translate\([^)]* 530\)/g)||[]).length,10);assert(!ten.includes('Hidden 9'));
console.log('PASS: multiplayer result cards are branded, useful, escaped, format-aware, and contain no movie spoilers.');
