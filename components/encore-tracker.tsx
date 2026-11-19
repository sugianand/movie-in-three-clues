'use client';
import {useEffect,useState} from 'react';
import {Sparkles} from 'lucide-react';
import {readEncoreProgress,type EncoreProgress} from '@/lib/encore-mission';

export function EncoreTracker({phase}:{phase:string}){
 const [progress,setProgress]=useState<EncoreProgress|null>(null);
 useEffect(()=>{try{setProgress(readEncoreProgress(localStorage));}catch{}},[]);
 if(!progress)return null;
 const mission=progress.active;
 const phaseLabel=phase==='lobby'?'Ready for this match':phase==='reveal'?'Next round still counts':'Mission in progress';
 return <aside className="encore-tracker" aria-label="Private Encore mission">
  <div className="encore-tracker-icon" aria-hidden="true"><Sparkles size={17}/></div>
  <div className="encore-tracker-copy">
   <span>{progress.activeInvited?'FRIEND CHALLENGE':'YOUR ENCORE'} · {phaseLabel}</span>
   <strong>{mission.target}</strong>
   <small>{mission.detail} Checked after the final result.</small>
  </div>
  <div className="encore-tracker-run"><b>{progress.streak?progress.streak+' live':'Fresh run'}</b><span>Best · {progress.bestStreak}</span></div>
 </aside>;
}
