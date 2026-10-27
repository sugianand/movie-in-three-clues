'use client';
import {useEffect,useRef,useState} from 'react';
import {FastForward,Pause} from 'lucide-react';
import {autoAdvanceDelay,autoAdvanceDelayMs,autoAdvanceDestination,autoAdvanceKey,parseAutoAdvance,shouldAutoAdvance} from '@/lib/auto-advance';

import {createAutoAdvanceClock} from '@/lib/auto-advance-clock';

type AutoAdvanceProps={host:boolean;status?:string;round:number;totalRounds:number;roundStarted:number;readyCount:number;playerCount:number;online:boolean;busy:boolean;onAdvance:()=>void};

export function AutoAdvance({host,status,round,totalRounds,roundStarted,readyCount,playerCount,online,busy,onAdvance}:Readonly<AutoAdvanceProps>){
 const [enabled,setEnabled]=useState(false),[remaining,setRemaining]=useState<number|null>(null),[notice,setNotice]=useState('');
 const [visible,setVisible]=useState(true);
 const advance=useRef(onAdvance),scheduled=useRef(''),fired=useRef('');advance.current=onAdvance;
 useEffect(()=>{try{setEnabled(parseAutoAdvance(localStorage.getItem(autoAdvanceKey)));}catch{}},[]);
 useEffect(()=>{const update=()=>setVisible(document.visibilityState==='visible');update();document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
 const everyoneReady=playerCount>0&&readyCount===playerCount;
 const delay=autoAdvanceDelay(everyoneReady);
 useEffect(()=>{
  if(!visible||!shouldAutoAdvance(enabled,host,status,online,busy)){scheduled.current='';setRemaining(null);return;}
  const key=`${roundStarted}:${round}`;if(fired.current===key)return;
  scheduled.current=key;const clock=createAutoAdvanceClock(delay);
  const tick=()=>{if(scheduled.current!==key)return;const state=clock.tick(Date.now(),document.visibilityState==='visible');setRemaining(state.remaining);if(state.advance){scheduled.current='';fired.current=key;advance.current();}};
  tick();const timer=setInterval(tick,250);return()=>{clearInterval(timer);if(scheduled.current===key)scheduled.current='';};
 },[enabled,host,status,round,roundStarted,online,busy,visible,delay]);
 if(!host||status!=='reveal')return null;
 function toggle(){const next=!enabled;if(next)fired.current='';setEnabled(next);setNotice(next?'Auto Continue on.':'Auto Continue off.');try{localStorage.setItem(autoAdvanceKey,next?'on':'off');}catch{}}
 const destination=autoAdvanceDestination(round,totalRounds);
 const description=!enabled?`Start ${destination} after the reveal`:!online?'Paused · reconnecting':!visible?'Paused · return to this tab':busy?'Waiting for the current action':fired.current===`${roundStarted}:${round}`?'Continue manually or switch off and on to retry':everyoneReady?`Everyone’s ready · ${destination} in ${remaining??Math.ceil(delay/1000)}s`:`${destination[0].toUpperCase()+destination.slice(1)} in ${remaining??Math.ceil(autoAdvanceDelayMs/1000)}s · ${readyCount}/${playerCount} ready`;
 return <section className={`auto-advance ${enabled?'is-enabled':''} ${enabled&&everyoneReady?'is-everyone-ready':''}`} aria-label="Host Auto Continue"><div>{enabled?<FastForward size={20}/>:<Pause size={20}/>}<span><strong>Auto Continue</strong><small>{description}</small></span></div><button type="button" aria-pressed={enabled} onClick={toggle}>{enabled?'On · cancel':'Turn on'}</button><span className="sr-only" role="status">{notice}</span></section>;
}
