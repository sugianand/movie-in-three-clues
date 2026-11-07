'use client';
import {useEffect,useState} from 'react';
import type {DailyView} from '@/lib/daily-types';
import {dailyHomeStatus} from '@/lib/daily-home';

const passKey='three-clues-daily-pass';

export function DailyHomeLaunch({className,onOpen}:{className:string;onOpen:()=>void}){
 const [status,setStatus]=useState('Today’s movie is ready');
 useEffect(()=>{
  let active=true;
  try{
   const token=localStorage.getItem(passKey);
   if(!token||!/^[0-9a-f-]{36}$/i.test(token))return;
   void fetch('/api/daily',{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',signal:AbortSignal.timeout(8000),body:JSON.stringify({action:'state',token})})
    .then(async response=>response.ok?response.json() as Promise<DailyView>:null)
    .then(view=>{if(active&&view)setStatus(dailyHomeStatus(view));})
    .catch(()=>{});
  }catch{}
  return()=>{active=false;};
 },[]);
 return <button className={`${className} daily-home-launch`} onClick={onOpen}><span>Daily Premiere</span><small role="status">{status}</small></button>;
}
