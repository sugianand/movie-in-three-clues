'use client';
import {useEffect,useState} from 'react';
import {Download,Image as ImageIcon,Share2} from 'lucide-react';
import {dailyCardPng} from '@/lib/daily-card';
import {multiplayerCardSvg,type MultiplayerCardResult} from '@/lib/multiplayer-card';

export function MultiplayerResultCard({result}:{result:MultiplayerCardResult}){
 const [open,setOpen]=useState(false),[image,setImage]=useState<{file:File;url:string}|null>(null),[error,setError]=useState(''),[notice,setNotice]=useState(''),[sharing,setSharing]=useState(false);
 const signature=JSON.stringify({status:result.status,totalRounds:result.totalRounds,matchMode:result.matchMode,settings:result.settings,winners:result.winners,me:result.me,players:result.players,teams:result.teams,recap:result.recap.map(row=>({round:row.round,solvers:row.solvers.map(s=>({name:s.name,clue:s.clue})),missed:row.missed})),fastest:result.fastest&&{name:result.fastest.name,clue:result.fastest.clue,ms:result.fastest.ms}});
 useEffect(()=>{
  if(!open)return;let cancelled=false,url='';setImage(null);setError('');setNotice('');
  void (async()=>{try{const blob=await dailyCardPng(multiplayerCardSvg(result));if(cancelled)return;url=URL.createObjectURL(blob);setImage({file:new File([blob],'three-clues-movie-night.png',{type:'image/png'}),url});}catch(e){if(!cancelled)setError(e instanceof Error?e.message:'Image export is unavailable.');}})();
  return()=>{cancelled=true;if(url)URL.revokeObjectURL(url);};
 // The signature deliberately excludes all movie titles and clue text.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[open,signature]);
 async function share(){if(!image||sharing)return;setSharing(true);setNotice('');try{if(!navigator.share||!navigator.canShare?.({files:[image.file]})){setNotice('Image sharing isn’t available here. Choose Save PNG, then attach it to your message.');return;}await navigator.share({files:[image.file],title:'Three Clues · Movie Night',text:'Our spoiler-free Three Clues result: https://movie-in-three-clues.sugianand89.chatgpt.site'});setNotice('Movie Night result shared.');}catch(e){if(!(e instanceof Error&&e.name==='AbortError'))setNotice('Image sharing couldn’t open. Choose Save PNG instead.');}finally{setSharing(false);}}
 return <div className="match-card"><button className="secondary wide" aria-expanded={open} onClick={()=>setOpen(!open)}><ImageIcon size={18}/>{open?'Hide result card':'Create spoiler-free result card'}</button>{open&&<div className="match-card-panel">{!image&&!error&&<p role="status">Preparing your Movie Night card…</p>}{error&&<p className="error" role="alert">{error}</p>}{image&&<><img className="match-card-preview" src={image.url} width={1080} height={1080} alt="Spoiler-free Three Clues Movie Night result card with winners, standings and clue outcomes."/><div className="match-card-actions"><button className="secondary" disabled={sharing} onClick={()=>void share()}><Share2 size={18}/>{sharing?'Sharing…':'Share image'}</button><a className="secondary" href={image.url} download={image.file.name}><Download size={18}/>Save PNG</a></div><p className="quiet">Winners, scores, clue outcomes, and fastest solve only. No movie titles or clues.</p></>}<p role="status">{notice}</p></div>}</div>;
}
