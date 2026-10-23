'use client';
import {useRef,useState} from 'react';
import {Share2} from 'lucide-react';
import {practiceChallengeShareText,sharePracticeChallenge,type PracticeChallenge} from '@/lib/practice-challenge';

export function PracticeChallengeShare({challenge,day,streak}:{challenge:PracticeChallenge;day:string;streak:number}){
 const lock=useRef(false),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[fallback,setFallback]=useState('');
 async function send(){
  if(lock.current)return;lock.current=true;setBusy(true);setNotice('');setFallback('');
  try{const text=practiceChallengeShareText({challenge,day,streak},window.location.href);if(!text)return;const result=await sharePracticeChallenge(text,{share:navigator.share?data=>navigator.share(data):undefined,copy:navigator.clipboard?.writeText?value=>navigator.clipboard.writeText(value):undefined});if(result==='manual')setFallback(text);setNotice(result==='shared'?'Challenge shared.':result==='copied'?'Spoiler-free challenge copied.':result==='cancelled'?'Sharing cancelled.':'Select and copy your challenge below.');}catch{setNotice('Sharing is unavailable right now. Please try again.');}finally{lock.current=false;setBusy(false);}
 }
 return <div className="practice-challenge-share"><button type="button" className="secondary" disabled={busy} onClick={()=>void send()}><Share2 size={15}/>{busy?'Preparing…':'Share streak'}</button><span role="status">{notice}</span>{fallback&&<textarea className="daily-share-text" aria-label="Copyable practice challenge" readOnly rows={6} value={fallback} onFocus={event=>event.currentTarget.select()}/>}</div>;
}
