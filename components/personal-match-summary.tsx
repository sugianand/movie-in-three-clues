'use client';
import {useEffect,useRef,useState} from 'react';
import {Copy,Share2} from 'lucide-react';
import {personalMatchSummary,type PersonalMatchResult} from '@/lib/personal-match-summary';
import {advanceEncoreProgress,encoreMission,encoreOutcomeShareText,readEncoreProgress,shareEncore,writeEncoreProgress,type EncoreProgress} from '@/lib/encore-mission';

export function PersonalMatchSummary({result,matchId}:{result:PersonalMatchResult;matchId:string}){
 const summary=personalMatchSummary(result);
 const shareLock=useRef(false),[progress,setProgress]=useState<EncoreProgress|null>(null),[sharing,setSharing]=useState(false),[shareNotice,setShareNotice]=useState(''),[shareFallback,setShareFallback]=useState('');
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
 async function shareChallengeResult(native:boolean){
  if(!outcome||shareLock.current)return;shareLock.current=true;setSharing(true);setShareNotice('');setShareFallback('');
  try{
   const text=encoreOutcomeShareText(outcome,window.location.href);if(!text)return;
   const action=await shareEncore(text,{share:navigator.share?data=>navigator.share(data):undefined,copy:navigator.clipboard?.writeText?value=>navigator.clipboard.writeText(value):undefined},native,'Three Clues · Friend Encore');
   if(action==='manual')setShareFallback(text);
   setShareNotice(action==='shared'?'Challenge result shared.':action==='copied'?'Challenge result copied.':action==='cancelled'?'Sharing cancelled.':'Select and copy your challenge result below.');
  }catch{setShareNotice('Sharing is unavailable right now. Please try again.');}
  finally{shareLock.current=false;setSharing(false);}
 }
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
   <strong>{outcome.complete?(progress!.streak===1?'Encore streak started.':`${progress!.streak} mission streak.`):(progress!.bestStreak?'Streak paused. Start the comeback.':'Keep the reel rolling.')}</strong>
   <small>{outcome.mission.target}</small>
   {outcome.invited&&<div className="encore-outcome-share">
    <p>Friend challenge finished. Send back a spoiler-free result.</p>
    <button type="button" className="secondary" disabled={sharing} onClick={()=>void shareChallengeResult(true)}><Share2 size={14}/>{sharing?'Preparing…':'Share result'}</button>
    <button type="button" className="encore-copy" disabled={sharing} onClick={()=>void shareChallengeResult(false)}><Copy size={13}/>Copy</button>
    {(shareNotice||shareFallback)&&<div><p role="status">{shareNotice}</p>{shareFallback&&<textarea className="daily-share-text" aria-label="Copyable Encore result" readOnly rows={5} value={shareFallback} onFocus={event=>event.currentTarget.select()}/>}</div>}
   </div>}
  </div>}
  <div className="encore-mission" aria-label="Personal next-match goal">
   <div><span>NEXT-MATCH ENCORE</span><strong>{mission.title}</strong></div>
   <p><b>{mission.target}</b><span>{mission.detail}</span></p>
  </div>
 </section>;
}
