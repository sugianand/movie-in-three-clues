'use client';
import {useEffect,useState} from 'react';
import {Download,Image as ImageIcon,Share2} from 'lucide-react';
import {dailyCardPng,dailyCardSvg,type DailyCardResult} from '@/lib/daily-card';

export function DailyResultCard({result}:{result:DailyCardResult}){
 const [open,setOpen]=useState(false),[image,setImage]=useState<{file:File;url:string}|null>(null),[error,setError]=useState(''),[notice,setNotice]=useState(''),[sharing,setSharing]=useState(false);
 const {done,date,number,score}=result,marks=result.marks.join(',');
 useEffect(()=>{
  if(!open||!done)return;
  let cancelled=false,url='';setImage(null);setError('');setNotice('');
  void (async()=>{
   try{
    const blob=await dailyCardPng(dailyCardSvg({done,date,number,score,marks:marks.split(',') as DailyCardResult['marks']}));
    if(cancelled)return;
    url=URL.createObjectURL(blob);setImage({file:new File([blob],`three-clues-daily-${date}.png`,{type:'image/png'}),url});
   }catch(e){if(!cancelled)setError(e instanceof Error?e.message:'Image export is unavailable. Try the text result.');}
  })();
  return()=>{cancelled=true;if(url)URL.revokeObjectURL(url);};
 },[open,done,date,number,score,marks]);
 async function share(){
  if(!image||sharing)return;setSharing(true);setNotice('');
  try{
   if(!navigator.share||!navigator.canShare?.({files:[image.file]})){setNotice('Image sharing isn’t available here. Choose Save PNG, then attach it to your message.');return;}
   // The PNG is prepared before this tap, preserving mobile user activation.
   await navigator.share({files:[image.file],title:'Three Clues · Daily Premiere',text:'Can you beat my score? https://movie-in-three-clues.sugianand89.chatgpt.site/?daily=1'});
   setNotice('Result image shared.');
  }catch(e){if(!(e instanceof Error&&e.name==='AbortError'))setNotice('Image sharing couldn’t open. Choose Save PNG or use the text result.');}
  finally{setSharing(false);}
 }
 return <div className="daily-card"><button className="secondary wide" aria-expanded={open} onClick={()=>setOpen(!open)}><ImageIcon size={18}/>{open?'Hide result image':'Create spoiler-free result image'}</button>{open&&<div className="daily-card-panel">
  {!image&&!error&&<p role="status">Preparing your result image…</p>}
  {error&&<p className="error" role="alert">{error}</p>}
  {image&&<><img className="daily-card-preview" src={image.url} width={1080} height={1080} alt={`Daily Premiere ${number}, ${score} of 300 points. ${result.marks.join(', ')}. No movie spoilers.`}/><div className="daily-card-actions"><button className="secondary" disabled={sharing} onClick={()=>void share()}><Share2 size={18}/>{sharing?'Sharing…':'Share image'}</button><a className="secondary" href={image.url} download={image.file.name}><Download size={18}/>Save PNG</a></div><p className="quiet">Only your score and clue outcomes. No title, clues, or guesses.</p></>}
  <p role="status">{notice}</p>
 </div>}</div>;
}
