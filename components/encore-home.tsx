'use client';
import {useEffect,useState} from 'react';
import {Sparkles} from 'lucide-react';
import {readEncoreProgress,type EncoreMission} from '@/lib/encore-mission';

export function EncoreHome({onPlay}:{onPlay:()=>void}){
 const [mission,setMission]=useState<EncoreMission|null>(null);
 useEffect(()=>{
  try{setMission(readEncoreProgress(localStorage)?.active??null);}catch{}
 },[]);
 if(!mission)return null;
 return <aside className="encore-home" aria-label="Saved Encore Mission">
  <div className="encore-home-icon" aria-hidden="true"><Sparkles size={22}/></div>
  <div className="encore-home-copy"><span>YOUR ENCORE</span><h2>{mission.title}</h2><p><strong>{mission.target}</strong> {mission.detail}</p><small>Saved only in this browser. Your next completed match checks the goal.</small></div>
  <button type="button" className="secondary" onClick={onPlay}>Play your encore</button>
 </aside>;
}
