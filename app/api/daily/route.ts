import {roomDb} from '@/db/rooms';
import {dailyDate,openDaily,dailyAction,dailyView,type DailyProfile} from '@/lib/daily';
export const dynamic='force-dynamic';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(req:Request){
 try{
  const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return reply({error:'Request origin not allowed.'},403);
  if(Number(req.headers.get('content-length')||0)>2048)return reply({error:'Request too large.'},413);
  const raw=await req.text();if(raw.length>2048)return reply({error:'Request too large.'},413);
  const body=JSON.parse(raw);
  if(!body||typeof body.token!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.token))return reply({error:'Your daily pass is missing. Reopen Daily Premiere.'},400);
  if(!['state','guess','skip'].includes(body.action))return reply({error:'Unknown daily action.'},400);
  const db=roomDb(),key='daily:'+body.token.toLowerCase(),now=Date.now();
  for(let retry=0;retry<8;retry++){
   const row=await db.prepare('SELECT state,version FROM rooms WHERE code=?').bind(key).first<{state:string;version:number}>();
   const profile=openDaily(row?JSON.parse(row.state) as DailyProfile:null,now);
   const version=row?.version??0;
   // A retry, another tab, or yesterday's delayed request must never spend a second guess.
   if(body.action!=='state'&&(body.date!==dailyDate(now)||body.version!==version))return reply(dailyView(profile,version));
   if(body.action!=='state')dailyAction(profile,body.action,body.guess);
   const state=JSON.stringify(profile);
   if(row&&row.state===state)return reply(dailyView(profile,version));
   const nextVersion=version+1;
   const result=row?await db.prepare('UPDATE rooms SET state=?,version=? WHERE code=? AND version=?').bind(state,nextVersion,key,version).run():await db.prepare('INSERT OR IGNORE INTO rooms (code,state,version,created) VALUES (?,?,?,?)').bind(key,state,nextVersion,now).run();
   if(result.meta.changes)return reply(dailyView(profile,nextVersion));
  }
  return reply({error:'Your daily pass is updating. Try again.'},409);
 }catch(e){const msg=e instanceof Error?e.message:'Unable to load the daily challenge.';if(/D1|SQLITE|database|binding/i.test(msg)){console.error(e);return reply({error:'The daily challenge is temporarily unavailable. Try again shortly.'},503);}return reply({error:msg},400);}
}
