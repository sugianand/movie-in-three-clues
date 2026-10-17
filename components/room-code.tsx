'use client';
import {useRef,useState} from 'react';
import {Copy} from 'lucide-react';

export function RoomCode({code}:{code:string}){
 const [status,setStatus]=useState(''),[manual,setManual]=useState(false),[busy,setBusy]=useState(false);
 const lock=useRef(false);
 async function copy(){
  if(lock.current)return;
  lock.current=true;setBusy(true);setStatus('');
  try{
   if(typeof navigator.clipboard?.writeText!=='function')throw Error('Clipboard unavailable');
   await navigator.clipboard.writeText(code);
   setManual(false);setStatus('Room code copied.');
  }catch{
   setManual(true);setStatus('Copy is unavailable. Select the room code below, or read it to your friends.');
  }finally{lock.current=false;setBusy(false);}
 }
 return <div><span className="eyebrow">ROOM CODE</span><button type="button" className="room-code" title="Copy room code" aria-label={`Copy room code ${code}`} disabled={busy} onClick={()=>void copy()}>{code}<Copy size={17}/></button><p className="quiet" role="status">{status}</p>{manual&&<input aria-label="Select room code to copy" readOnly value={code} onFocus={event=>event.currentTarget.select()} style={{maxWidth:'12ch',fontSize:16}}/>}</div>;
}
