'use client';
import {useRef,useState} from 'react';
import {Share2,Copy} from 'lucide-react';
import {matchShareText,seriesShareStatus,shareMatchResult,type ShareMatch} from '@/lib/match-share';
import './match-share.css';
export function MatchShare({game}:{game:ShareMatch}){
 const lock=useRef(false),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[fallback,setFallback]=useState('');
 if(game.status!=='finished'||game.me.spectator||!game.players.some(p=>p.id===game.me.id))return null;
 const series=seriesShareStatus(game);
 async function send(native:boolean){
  if(lock.current)return;lock.current=true;setBusy(true);setNotice('');setFallback('');
  try{
   const text=matchShareText(game,window.location.href);if(!text)return;
   const result=await shareMatchResult(text,{share:navigator.share?data=>navigator.share(data):undefined,copy:navigator.clipboard?.writeText?value=>navigator.clipboard.writeText(value):undefined},native);
   if(result==='manual')setFallback(text);
   setNotice(result==='shared'?'Result shared.':result==='copied'?'Spoiler-free result copied.':result==='cancelled'?'Sharing cancelled.':'Select and copy your result below.');
  }catch{setNotice('Sharing is unavailable right now. Please try again.');}
  finally{lock.current=false;setBusy(false);}
 }
 return <section className="match-share" aria-label={series?.champion?'Share your series championship':'Share your match result'}><div><h2>{series?.champion?'Share the crown.':'Take your score to the group chat.'}</h2><p className="quiet">{series?'Your points, solves, and personal series record. ':'Only your points and solve count. '}No movie spoilers, names, or room code.</p></div><div className="invite-actions"><button type="button" className="secondary" disabled={busy} onClick={()=>void send(true)}><Share2 size={17}/>{series?.champion?'Share championship':'Share result'}</button><button type="button" className="secondary" disabled={busy} onClick={()=>void send(false)}><Copy size={17}/>{series?.champion?'Copy championship':'Copy result'}</button></div><p role="status">{notice}</p>{fallback&&<textarea className="daily-share-text" aria-label="Copyable match result" readOnly rows={7} value={fallback} onFocus={e=>e.currentTarget.select()}/>}</section>;
}
