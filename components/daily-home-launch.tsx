'use client';
import {useEffect,useState} from 'react';
import type {DailyView} from '@/lib/daily-types';
import {dailyHomeStatus} from '@/lib/daily-home';
import {dailyRequest} from '@/lib/daily-request';

const passKey='three-clues-daily-pass';

export function DailyHomeLaunch({className,onOpen}:{className:string;onOpen:()=>void}){
 const [status,setStatus]=useState('Today’s movie is ready');
 useEffect(()=>{
  let active=true,pending=false;
  async function refresh(){
   if(pending)return;
   let token='';try{token=localStorage.getItem(passKey)??'';}catch{return;}
   if(!/^[0-9a-f-]{36}$/i.test(token))return;
   pending=true;
   try{const view:DailyView=await dailyRequest({action:'state',token},8000);if(active)setStatus(dailyHomeStatus(view));}catch{}finally{pending=false;}
  }
  const retry=()=>void refresh(),resume=()=>{if(document.visibilityState==='visible')retry();};
  retry();window.addEventListener('online',retry);document.addEventListener('visibilitychange',resume);
  return()=>{active=false;window.removeEventListener('online',retry);document.removeEventListener('visibilitychange',resume);};
 },[]);
 return <button className={`${className} daily-home-launch`} onClick={onOpen}><span>Daily Premiere</span><small role="status">{status}</small></button>;
}
