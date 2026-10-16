/** A reveal countdown must never catch up while its host is away. */
export function createAutoAdvanceClock(delayMs:number){
 let deadline:number|null=null;
 let fired=false;
 return {
  tick(now:number,active:boolean):{remaining:number|null;advance:boolean}{
   if(fired)return {remaining:null,advance:false};
   if(!active){deadline=null;return {remaining:null,advance:false};}
   if(deadline===null)deadline=now+delayMs;
   const remaining=Math.max(0,Math.ceil((deadline-now)/1000));
   if(remaining===0){fired=true;return {remaining,advance:true};}
   return {remaining,advance:false};
  }
 };
}
