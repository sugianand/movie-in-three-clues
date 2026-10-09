export type SnapshotStamp={version:number;serverNow:number};
export function acceptsSnapshot(incoming:SnapshotStamp,current:SnapshotStamp){
 return incoming.version>current.version||(incoming.version===current.version&&incoming.serverNow>=current.serverNow);
}
// Capture recovery when the update is queued; React may apply it after refs change.
export function errorAfterRecovery(recovered:boolean){return (message:string)=>recovered?'':message;}
export function clueAnnouncement(stage:number,clue:string){return `Clue ${stage+1} of 3, worth ${(3-stage)*100} points: ${clue}`;}
export async function runActionOnce<T>(lock:{current:boolean},action:()=>Promise<T>){
 if(lock.current)throw Error('That action is already being sent. Please wait.');
 lock.current=true;
 try{return await action();}finally{lock.current=false;}
}
export async function gameRequest<T>(body:unknown,options:{signal?:AbortSignal;timeoutMs?:number}={}){
 const controller=new AbortController();let timedOut=false;
 const abort=()=>controller.abort();
 if(options.signal?.aborted)controller.abort();
 options.signal?.addEventListener('abort',abort,{once:true});
 const timeout=setTimeout(()=>{timedOut=true;controller.abort();},options.timeoutMs??12000);
 try{
  const response=await fetch('/api/game',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal,cache:'no-store'});
  const raw=await response.text();let data:T;
  try{data=JSON.parse(raw) as T;}catch{throw Error('The game could not respond. Please try again in a moment.');}
  return {ok:response.ok,status:response.status,data};
 }catch(error){
  if(timedOut)throw Error('Connection timed out. Check your connection and try again.');
  throw error;
 }finally{clearTimeout(timeout);options.signal?.removeEventListener('abort',abort);}
}
