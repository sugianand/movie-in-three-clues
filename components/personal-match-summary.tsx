'use client';
import {useEffect,useState} from 'react';
import {personalMatchSummary,type PersonalMatchResult} from '@/lib/personal-match-summary';
import {advanceEncoreProgress,encoreMission,readEncoreProgress,writeEncoreProgress,type EncoreProgress} from '@/lib/encore-mission';

export function PersonalMatchSummary({result,matchId}:{result:PersonalMatchResult;matchId:string}){
 const summary=personalMatchSummary(result);
 const [progress,setProgress]=useState<EncoreProgress|null>(null);
 useEffect(()=>{
  if(!summary)return;
  let storage:Storage|undefined;
  try{storage=window.localStorage;}catch{}
  const next=advanceEncoreProgress(readEncoreProgress(storage),matchId,summary,result.totalRounds);
  writeEncoreProgress(storage,next);
  setProgress(next);
 },[matchId,result.totalRounds,summary?.solves,summary?.firstClues,summary?.score,summary?.fastestMs]);
 if(!summary)return null;
 const mission=progress?.active??encoreMission(summary,result.totalRounds);
 const outcome=progress?.lastMatchId===matchId?progress.lastOutcome:null;
 return <section className="personal-match-summary" aria-labelledby="personal-match-title">
  <div className="personal-match-heading"><span>YOUR CUT</span><h3 id="personal-match-title">{summary.headline}</h3></div>
  <div className="personal-match-stats">
   <div><strong>{summary.score}</strong><span>Match points</span></div>
   <div><strong>{summary.solves}/{result.totalRounds}</strong><span>Movies solved</span></div>
   <div><strong>{summary.firstClues}</strong><span>First-clue hits</span></div>
   <div><strong>{summary.averageClue===null?'—':summary.averageClue.toFixed(1)}</strong><span>Average clue</span></div>
  </div>
  {summary.fastestMs!==null&&<p>Fastest personal solve · {(summary.fastestMs/1000).toFixed(1)}s</p>}
  {outcome&&<div className={`encore-outcome ${outcome.complete?'is-complete':'is-missed'}`} role="status">
   <span>{outcome.complete?'ENCORE COMPLETE':'ENCORE MISSED'}</span>
   <strong>{outcome.complete?'Goal cleared. Take the next challenge.':'Keep the reel rolling.'}</strong>
   <small>{outcome.mission.target}</small>
  </div>}
  <div className="encore-mission" aria-label="Personal next-match goal">
   <div><span>NEXT-MATCH ENCORE</span><strong>{mission.title}</strong></div>
   <p><b>{mission.target}</b><span>{mission.detail}</span></p>
  </div>
 </section>;
}
