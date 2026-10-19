import type {DailyResult} from './daily-types.ts';
export function dailyWeek(today:string,history:DailyResult[]){
 const end=Date.parse(today+'T00:00:00Z');
 if(!Number.isFinite(end))return [];
 const results=new Map(history.map(row=>[row.date,row]));
 return Array.from({length:7},(_,i)=>{
  const date=new Date(end-(6-i)*86400000).toISOString().slice(0,10),result=results.get(date);
  return {date,today:date===today,status:result?(result.score>0?'won':'revealed'):date===today?'open':'unplayed',score:result?.score??null};
 });
}
