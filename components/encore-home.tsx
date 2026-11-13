'use client';
import {useEffect,useState} from 'react';
import {Sparkles} from 'lucide-react';
import {readEncoreProgress,type EncoreProgress} from '@/lib/encore-mission';

export function EncoreHome({onPlay}:{onPlay:()=>void}){
 const [progress,setProgress]=useState<EncoreProgress|null>(null);
 useEffect(()=>{
  try{setProgress(readEncoreProgress(localStorage));}catch{}
 },[]);
 if(!progress)return null;
 const mission=progress.active;
 return <aside className="encore-home" aria-label="Saved Encore Mission">
  <div className="encore-home-icon" aria-hidden="true"><Sparkles size={22}/></div>
  <div className="encore-home-copy"><span>YOUR ENCORE</span><h2>{mission.title}</h2><p><strong>{mission.target}</strong> {mission.detail}</p><div className="encore-home-run"><b>{progress.streak?`${progress.streak} mission streak`:'Clear it to start a streak'}</b><span>Best · {progress.bestStreak}</span></div><small>Saved only in this browser. Your next completed match checks the goal.</small></div>
  <button type="button" className="secondary" onClick={onPlay}>Play your encore</button>
 </aside>;
}
