'use client';
import {useEffect,useRef,useState} from 'react';
import {Copy,Share2,Sparkles} from 'lucide-react';
import {acceptEncoreInvite,encoreInviteFromUrl,encoreShareText,readEncoreProgress,shareEncore,writeEncoreProgress,type EncoreMission,type EncoreProgress} from '@/lib/encore-mission';

export function EncoreHome({onPlay}:{onPlay:()=>void}){
 const shareLock=useRef(false),[progress,setProgress]=useState<EncoreProgress|null>(null),[invite,setInvite]=useState<EncoreMission|null>(null),[sharing,setSharing]=useState(false),[shareNotice,setShareNotice]=useState(''),[shareFallback,setShareFallback]=useState('');
 useEffect(()=>{
  try{setProgress(readEncoreProgress(localStorage));setInvite(encoreInviteFromUrl(window.location.href));}catch{}
 },[]);
 function clearInvite(){
  try{const url=new URL(window.location.href);url.searchParams.delete('encore');url.searchParams.delete('rate');history.replaceState(null,'',url.pathname+url.search+url.hash);}catch{}
 }
 function acceptInvite(){
  if(!invite)return;
  const next=acceptEncoreInvite(progress,invite);
  if(!writeEncoreProgress(localStorage,next)){setShareNotice('Browser storage is unavailable. This challenge could not be saved.');return;}
  setProgress(next);setInvite(null);clearInvite();onPlay();
 }
 function dismissInvite(){setInvite(null);clearInvite();}
 async function share(native:boolean){
  if(shareLock.current)return;shareLock.current=true;setSharing(true);setShareNotice('');setShareFallback('');
  try{
   const text=encoreShareText(progress!,window.location.href);if(!text)return;
   const outcome=await shareEncore(text,{share:navigator.share?data=>navigator.share(data):undefined,copy:navigator.clipboard?.writeText?value=>navigator.clipboard.writeText(value):undefined},native);
   if(outcome==='manual')setShareFallback(text);
   setShareNotice(outcome==='shared'?'Encore shared.':outcome==='copied'?'Encore challenge copied.':outcome==='cancelled'?'Sharing cancelled.':'Select and copy your Encore below.');
  }catch{setShareNotice('Sharing is unavailable right now. Please try again.');}
  finally{shareLock.current=false;setSharing(false);}
 }
 if(invite)return <aside className="encore-home encore-invite" aria-label="Shared Encore Challenge">
  <div className="encore-home-icon" aria-hidden="true"><Share2 size={21}/></div>
  <div className="encore-home-copy"><span>FRIEND&apos;S ENCORE</span><h2>{invite.title}</h2><p><strong>{invite.target}</strong> {invite.detail}</p><div className="encore-home-run"><b>Fresh streak starts at 0</b><span>Personal best kept · {progress?.bestStreak??0}</span></div><small>The link carries only this mission rule. Accepting replaces your active mission and starts a fresh streak. After the match, you can send back a spoiler-free result.</small></div>
  <div className="encore-home-actions"><button type="button" className="secondary" onClick={acceptInvite}>Accept &amp; play</button><button type="button" className="encore-copy" onClick={dismissInvite}>Not now</button></div>
  {shareNotice&&<div className="encore-share-result"><p role="status">{shareNotice}</p></div>}
 </aside>;
 if(!progress)return null;
 const mission=progress.active;
 return <aside className="encore-home" aria-label="Saved Encore Mission">
  <div className="encore-home-icon" aria-hidden="true"><Sparkles size={22}/></div>
  <div className="encore-home-copy"><span>YOUR ENCORE</span><h2>{mission.title}</h2><p><strong>{mission.target}</strong> {mission.detail}</p><div className="encore-home-run"><b>{progress.streak?`${progress.streak} mission streak`:'Clear it to start a streak'}</b><span>Best · {progress.bestStreak}</span></div><small>Saved only in this browser. Your next completed match checks the goal.</small></div>
  <div className="encore-home-actions"><button type="button" className="secondary" onClick={onPlay}>Play your encore</button><button type="button" className="secondary" disabled={sharing} onClick={()=>void share(true)}><Share2 size={15}/>{sharing?'Preparing…':'Share challenge'}</button><button type="button" className="encore-copy" disabled={sharing} onClick={()=>void share(false)}><Copy size={14}/>Copy</button></div>
  {(shareNotice||shareFallback)&&<div className="encore-share-result"><p role="status">{shareNotice}</p>{shareFallback&&<textarea className="daily-share-text" aria-label="Copyable Encore challenge" readOnly rows={5} value={shareFallback} onFocus={event=>event.currentTarget.select()}/>}</div>}
 </aside>;
}
