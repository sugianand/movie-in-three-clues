import {movies,matches} from './game.ts';
import type {DailyResult,DailyView} from './daily-types.ts';
export type DailyProfile={date:string;title:string;stage:number;done:boolean;score:number;marks:DailyResult['marks'];history:DailyResult[]};
const dayMs=86400000;
export const dailyDate=(now=Date.now())=>new Date(now).toISOString().slice(0,10);
export function dailyMovie(date:string){
 const bank=[...movies].sort((a,b)=>a.title<b.title?-1:a.title>b.title?1:0);
 // 73 is coprime to the 200-film bank: no repeats during one full rotation.
 const day=Math.floor(Date.parse(date+'T00:00:00Z')/dayMs);
 return bank[((day*73)%bank.length+bank.length)%bank.length];
}
export function openDaily(previous:DailyProfile|null,now=Date.now()):DailyProfile{
 const date=dailyDate(now);if(previous?.date===date)return previous;
 return {date,title:dailyMovie(date).title,stage:0,done:false,score:0,marks:[],history:previous?.history??[]};
}
export function dailyAction(p:DailyProfile,action:unknown,guess:unknown){
 if(p.done)return;
 if(action!=='guess'&&action!=='skip')throw Error('Choose a guess or reveal the next clue.');
 if(action==='guess'&&(typeof guess!=='string'||!guess.trim()||guess.length>150))throw Error('Enter a movie title up to 150 characters.');
 const movie=movies.find(m=>m.title===p.title);if(!movie)throw Error('Today’s movie is unavailable.');
 const correct=action==='guess'&&matches(guess as string,movie);
 p.marks.push(correct?'hit':action==='skip'?'skip':'miss');
 if(correct||p.stage===2){p.done=true;p.score=correct?(3-p.stage)*100:0;p.history.push({date:p.date,score:p.score,marks:[...p.marks]});}
 else p.stage++;
}
export function dailyStats(history:DailyResult[],today:string):DailyView['stats']{
 let bestStreak=0,run=0,last='';
 for(const row of history){run=row.score>0?(last&&Date.parse(row.date)-Date.parse(last)===dayMs?run+1:1):0;bestStreak=Math.max(bestStreak,run);last=row.date;}
 let streak=0;let cursor=Date.parse(today);const scores=new Map(history.map(r=>[r.date,r.score]));
 if(!scores.has(today))cursor-=dayMs;
 while((scores.get(dailyDate(cursor))??0)>0){streak++;cursor-=dayMs;}
 return {played:history.length,wins:history.filter(r=>r.score>0).length,streak,bestStreak,points:history.reduce((n,r)=>n+r.score,0)};
}
export function dailyView(p:DailyProfile,version:number):DailyView{
 const movie=movies.find(m=>m.title===p.title)!;
 return {date:p.date,number:Math.floor(Date.parse(p.date)/dayMs)-Math.floor(Date.parse('2026-10-09')/dayMs)+1,stage:p.stage,done:p.done,score:p.score,clues:movie.clues.slice(0,p.done?3:p.stage+1),marks:p.marks,answer:p.done?{title:movie.title,year:movie.year,language:movie.language}:null,nextAt:Date.parse(p.date+'T00:00:00Z')+dayMs,version,history:p.history.slice(-7),stats:dailyStats(p.history,p.date)};
}
