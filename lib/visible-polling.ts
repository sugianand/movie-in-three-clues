type Visibility={visibilityState:string;addEventListener:(type:string,listener:()=>void)=>void;removeEventListener:(type:string,listener:()=>void)=>void};
type Timers={set:(callback:()=>void,delay:number)=>unknown;clear:(id:unknown)=>void};
/** Poll reads only while visible, never overlap requests, and catch up after a tab switch. */
export function startVisiblePolling(poll:()=>Promise<boolean>,onResume:()=>void,visibility:Visibility,timers:Timers={set:(fn,ms)=>setTimeout(fn,ms),clear:id=>clearTimeout(id as ReturnType<typeof setTimeout>)}){
 let stopped=false,running=false,timer:unknown,refreshPending=false;
 const visible=()=>visibility.visibilityState==='visible';
 const clear=()=>{if(timer!==undefined){timers.clear(timer);timer=undefined;}};
 async function run(){
  if(stopped||running||!visible())return;
  running=true;refreshPending=false;
  try{if(!await poll()){stop();return;}}
  finally{
   running=false;
   if(!stopped&&visible()){
    if(refreshPending){refreshPending=false;void run();}
    else timer=timers.set(()=>{timer=undefined;void run();},800);
   }
  }
 }
 function changed(){
  clear();
  if(stopped||!visible())return;
  onResume();
  if(running)refreshPending=true;else void run();
 }
 function stop(){stopped=true;clear();visibility.removeEventListener('visibilitychange',changed);}
 visibility.addEventListener('visibilitychange',changed);
 void run();
 return stop;
}
