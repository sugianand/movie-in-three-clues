'use client';
import {useEffect,useRef,useState} from 'react';
import {FastForward,Pause} from 'lucide-react';
import {autoAdvanceDelayMs,autoAdvanceDestination,autoAdvanceKey,parseAutoAdvance,shouldAutoAdvance} from '@/lib/auto-advance';

type AutoAdvanceProps={host:boolean;status?:string;round:number;totalRounds:number;roundStarted:number;online:boolean;busy:boolean;onAdvance:()=>void};

export function AutoAdvance({host,status,round,totalRounds,roundStarted,online,busy,onAdvance}:Readonly<AutoAdvanceProps>){
 const [enabled,setEnabled]=useState(false),[remaining,setRemaining]=useState<number|null>(null),[notice,setNotice]=useState('');
 const advance=useRef(onAdvance),scheduled=useRef(''),fired=useRef('');advance.current=onAdvance;
 useEffect(()=>{try{setEnabled(parseAutoAdvance(localStorage.getItem(autoAdvanceKey)));}catch{}},[]);
 useEffect(()=>{
  if(!shouldAutoAdvance(enabled,host,status,online,busy)){scheduled.current='';setRemaining(null);return;}
  const key=`${roundStarted}:${round}`;if(fired.current===key)return;
  scheduled.current=key;const deadline=Date.now()+autoAdvanceDelayMs;
  const tick=()=>{if(scheduled.current!==key)return;const seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));setRemaining(seconds);if(seconds===0){scheduled.current='';fired.current=key;advance.current();}};
  tick();const timer=setInterval(tick,250);return()=>{clearInterval(timer);if(scheduled.current===key)scheduled.current='';};
 },[enabled,host,status,round,roundStarted,online,busy]);
 if(!host||status!=='reveal')return null;
 function toggle(){const next=!enabled;setEnabled(next);setNotice(next?'Auto Continue on.':'Auto Continue off.');try{localStorage.setItem(autoAdvanceKey,next?'on':'off');}catch{}}
 const destination=autoAdvanceDestination(round,totalRounds);
 return <section className={`auto-advance ${enabled?'is-enabled':''}`} aria-label="Host Auto Continue"><div>{enabled?<FastForward size={20}/>:<Pause size={20}/>}<span><strong>Auto Continue</strong><small>{enabled?`${destination[0].toUpperCase()+destination.slice(1)} in ${remaining??Math.ceil(autoAdvanceDelayMs/1000)}s`:`Start ${destination} after the reveal`}</small></span></div><button type="button" aria-pressed={enabled} disabled={!online||busy} onClick={toggle}>{enabled?'On · cancel':'Turn on'}</button><span className="sr-only" role="status">{notice}</span></section>;
}
