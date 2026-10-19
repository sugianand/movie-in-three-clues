const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const text=(v:unknown)=>typeof v==='string';
const finite=(v:unknown)=>typeof v==='number'&&Number.isFinite(v);
const strings=(v:unknown)=>Array.isArray(v)&&v.every(text);
const rows=(v:unknown,check:(row:Record<string,unknown>)=>boolean)=>Array.isArray(v)&&v.every(row=>record(row)&&check(row));
const named=(v:Record<string,unknown>)=>text(v.id)&&text(v.name);
const nullableText=(v:unknown)=>v===null||text(v);

/** Validate render-critical fields before accepting a snapshot, not its newer optional features. */
export function isGameSnapshot(v:unknown):boolean{
 if(!record(v)||!record(v.me)||!record(v.settings))return false;
 return text(v.code)&&text(v.host)&&['lobby','playing','reveal','finished'].includes(v.status as string)&&
  ['version','serverNow','round','roundStarted','stage','deadline','roundEnd','totalRounds','clueSeconds','movieCount','unseenCount'].every(k=>finite(v[k]))&&
  [0,1,2].includes(v.stage as number)&&strings(v.clues)&&strings(v.winners)&&nullableText(v.answer)&&
  text(v.me.id)&&typeof v.me.solved==='boolean'&&finite(v.me.attempt)&&finite(v.me.gain)&&
  ['collection','era','mode','difficulty'].every(k=>text((v.settings as Record<string,unknown>)[k]))&&
  rows(v.players,p=>named(p)&&finite(p.score)&&finite(p.gain))&&
  rows(v.teamOptions,named)&&rows(v.teams,t=>named(t)&&finite(t.score)&&finite(t.members))&&
  rows(v.poolOptions,p=>text(p.collection)&&text(p.era)&&finite(p.count))&&
  rows(v.report,r=>text(r.title)&&['plays','players','first','second','third','missed'].every(k=>finite(r[k])))&&
  (v.spectators===undefined||rows(v.spectators,named))&&
  (v.recap===undefined||rows(v.recap,r=>finite(r.round)&&text(r.title)&&strings(r.missed)&&rows(r.solvers,s=>text(s.name)&&finite(s.clue)&&finite(s.points))))&&
  (v.fastest==null||(record(v.fastest)&&text(v.fastest.name)&&text(v.fastest.title)&&finite(v.fastest.ms)))&&
  (v.roundSpotlight==null||(record(v.roundSpotlight)&&finite(v.roundSpotlight.solved)&&finite(v.roundSpotlight.players)&&
   (v.roundSpotlight.fastest==null||(record(v.roundSpotlight.fastest)&&text(v.roundSpotlight.fastest.name)&&finite(v.roundSpotlight.fastest.ms)))));
}

export function isGameResponse(data:unknown,body:unknown,ok:boolean){
 if(!record(data))return false;
 if(!ok)return typeof data.error==='string'&&data.error.length<=500;
 const action=record(body)?body.action:undefined;
 if(action==='leave')return data.left===true;
 if(!isGameSnapshot(data))return false;
 return action!=='create'&&action!=='join'||typeof data.token==='string'&&data.token.length>0;
}
