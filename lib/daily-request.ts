import type {DailyView} from './daily-types.ts';

const recovery='Daily Premiere could not respond. Recover saved progress before trying your guess again.';
const record=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const number=(value:unknown)=>typeof value==='number'&&Number.isFinite(value);
const marks=(value:unknown)=>Array.isArray(value)&&value.every(mark=>['hit','miss','skip'].includes(mark));
export function isDailyView(value:unknown):value is DailyView{
 if(!record(value)||!record(value.stats))return false;
 return (value.serverNow===undefined||number(value.serverNow))&&typeof value.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value.date)&&
  ['number','stage','score','nextAt','version'].every(key=>number(value[key]))&&[0,1,2].includes(value.stage as number)&&typeof value.done==='boolean'&&
  Array.isArray(value.clues)&&value.clues.length>=(value.done?3:(value.stage as number)+1)&&value.clues.every(clue=>typeof clue==='string')&&
  marks(value.marks)&&Array.isArray(value.guesses)&&value.guesses.every(guess=>guess===null||typeof guess==='string')&&
  (value.done?record(value.answer)&&typeof value.answer.title==='string'&&number(value.answer.year)&&typeof value.answer.language==='string':value.answer===null)&&
  ['played','wins','streak','bestStreak','points'].every(key=>number((value.stats as Record<string,unknown>)[key]))&&
  Array.isArray(value.history)&&value.history.every(row=>record(row)&&typeof row.date==='string'&&number(row.score)&&marks(row.marks))&&
  (value.performance===undefined||(record(value.performance)&&Array.isArray(value.performance.counts)&&value.performance.counts.length===4&&value.performance.counts.every(number)&&number(value.performance.played)&&number(value.performance.average)));
}
export async function dailyRequest(body:unknown,timeoutMs=12000):Promise<DailyView>{
 const controller=new AbortController();let timedOut=false;
 const timer=setTimeout(()=>{timedOut=true;controller.abort();},timeoutMs);
 try{
  const response=await fetch('/api/daily',{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',signal:controller.signal,body:JSON.stringify(body)});
  let data:unknown;
  try{data=await response.json();}catch{throw Error(recovery);}
  if(!response.ok)throw Error(record(data)&&typeof data.error==='string'&&data.error.length<=200?data.error:recovery);
  if(!isDailyView(data))throw Error(recovery);
  return data;
 }catch(error){
  if(timedOut)throw Error('Connection timed out. Recover saved progress before trying your guess again.');
  if(error instanceof TypeError)throw Error('Connection lost. Check your connection, then recover saved progress.');
  throw error;
 }finally{clearTimeout(timer);}
}
