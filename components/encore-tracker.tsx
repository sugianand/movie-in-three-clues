'use client';
import {useEffect,useState} from 'react';
import {Sparkles} from 'lucide-react';
import {encoreMissionProgress,readEncoreProgress,type EncoreProgress} from '@/lib/encore-mission';

export function EncoreTracker({phase,totalRounds,solves,firstClues}:{phase:string;totalRounds:number;solves:number;firstClues:number}){
 const [progress,setProgress]=useState<EncoreProgress|null>(null);
 useEffect(()=>{try{setProgress(readEncoreProgress(localStorage));}catch{}},[]);
 if(!progress)return null;
 const mission=progress.active;
 const live=phase==='lobby'?null:encoreMissionProgress(mission,solves,firstClues,totalRounds);
 const phaseLabel=phase==='lobby'?'Ready for this match':phase==='reveal'?'Next round still counts':'Mission in progress';
 return <aside className="encore-tracker" aria-label="Private Encore mission">
  <div className="encore-tracker-icon" aria-hidden="true"><Sparkles size={17}/></div>
  <div className="encore-tracker-copy">
   <span>{progress.activeInvited?'FRIEND CHALLENGE':'YOUR ENCORE'} · {phaseLabel}</span>
   <strong>{mission.target}</strong>
   <small>{mission.detail} Checked after the final result.</small>
   {live&&<div className={`encore-tracker-progress ${live.reached?'is-reached':''}`}><progress aria-label="Encore mission progress" max={live.target} value={live.current}/><b>{live.label}</b></div>}
  </div>
  <div className="encore-tracker-run"><b>{progress.streak?progress.streak+' live':'Fresh run'}</b><span>Best · {progress.bestStreak}</span></div>
 </aside>;
}
