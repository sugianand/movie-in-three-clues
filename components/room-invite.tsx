'use client';
import {useState} from 'react';
import {Share2,Copy} from 'lucide-react';
import {roomInvite,sendRoomInvite} from '@/lib/room-invite';

export function RoomInvite({code}:{code:string}){
 const [busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[fallback,setFallback]=useState('');
 async function send(native:boolean){
  if(busy)return;
  setBusy(true);setNotice('');setFallback('');
  try{
   const invite=roomInvite(window.location.href,code);
   const result=await sendRoomInvite(invite,{
    share:typeof navigator.share==='function'?data=>navigator.share(data):undefined,
    copy:navigator.clipboard?.writeText?text=>navigator.clipboard.writeText(text):undefined,
   },native);
   if(result==='manual'){setFallback(invite.url);setNotice('Select and copy the invite below, or share the room code.');}
   else setNotice(result==='shared'?'Invite shared.':result==='copied'?'Invite link copied.':'Sharing cancelled.');
  }catch{setNotice('Share the room code shown here to invite your friends.');}
  finally{setBusy(false);}
 }
 return <div className="room-invite"><div className="invite-panel"><div><span className="eyebrow">BRING YOUR MOVIE PEOPLE</span><strong className="invite-code">{code}</strong></div><div className="invite-actions"><button type="button" className="secondary" disabled={busy} onClick={()=>void send(true)}><Share2 size={17}/>Share invite</button><button type="button" className="secondary" disabled={busy} onClick={()=>void send(false)}><Copy size={17}/>Copy link</button></div></div><p className="invite-status" role="status">{notice}</p>{fallback&&<div className="invite-fallback"><label htmlFor="room-invite-link">Invite link</label><input id="room-invite-link" readOnly value={fallback} onFocus={event=>event.currentTarget.select()}/></div>}</div>;
}
