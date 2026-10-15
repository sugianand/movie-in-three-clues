'use client';
import {useEffect,useRef,useState} from 'react';
import {Moon,Sun} from 'lucide-react';
import {isActiveMatch,parseScreenAwake,screenAwakeKey,shouldHoldScreenAwake} from '@/lib/screen-awake';

type ScreenWakeLock={release():Promise<void>;addEventListener(type:'release',listener:()=>void,options?:{once?:boolean}):void};
type WakeNavigator=Navigator&{wakeLock?:{request(type:'screen'):Promise<ScreenWakeLock>}};

export function ScreenAwake({status}:Readonly<{status?:string|null}>){
 const [supported,setSupported]=useState(false),[enabled,setEnabled]=useState(false),[active,setActive]=useState(false),[notice,setNotice]=useState('');
 const sentinel=useRef<ScreenWakeLock|null>(null),matchActive=isActiveMatch(status);
 useEffect(()=>{setSupported('wakeLock' in navigator);try{setEnabled(parseScreenAwake(localStorage.getItem(screenAwakeKey)));}catch{}},[]);
 useEffect(()=>{
  if(!supported)return;
  let cancelled=false;
  const shouldHold=()=>shouldHoldScreenAwake(enabled,matchActive?'playing':'idle',document.visibilityState);
  const release=()=>{const lock=sentinel.current;sentinel.current=null;setActive(false);if(lock)void lock.release();};
  const acquire=async()=>{
   if(cancelled||sentinel.current||!shouldHold())return;
   try{
    const lock=await (navigator as WakeNavigator).wakeLock?.request('screen');if(!lock)return;
    if(cancelled||!shouldHold()){void lock.release();return;}
    sentinel.current=lock;setActive(true);lock.addEventListener('release',()=>{if(sentinel.current===lock){sentinel.current=null;setActive(false);}},{once:true});
   }catch{setActive(false);setNotice('Screen lock is unavailable right now.');}
  };
  if(enabled&&matchActive)void acquire();else release();
  const visibility=()=>{if(document.visibilityState==='visible')void acquire();else release();};
  document.addEventListener('visibilitychange',visibility);
  return()=>{cancelled=true;document.removeEventListener('visibilitychange',visibility);release();};
 },[enabled,matchActive,supported]);
 if(!supported)return null;
 function toggle(){const next=!enabled;setEnabled(next);setNotice(next?(matchActive?'Keeping this screen awake.':'Screen awake is armed for the next match.'):'Screen can sleep normally.');try{localStorage.setItem(screenAwakeKey,next?'on':'off');}catch{}}
 return <div className="screen-awake"><button type="button" aria-pressed={enabled} aria-label={`Keep screen awake ${enabled?'on':'off'}`} title="Keep screen awake during matches" onClick={toggle}>{enabled?<Sun size={17}/>:<Moon size={17}/>}<span>{active?'Awake':enabled?'Awake armed':'Screen sleep'}</span></button><span className="sr-only" role="status">{notice}</span></div>;
}
