'use client';
import {useEffect,useRef,useState} from 'react';
import {Award,CalendarDays,Check,Copy,Crown,Flame,LockKeyhole,Share2,Sparkles,Timer,Trophy} from 'lucide-react';
import {emptyMovieNightPassport,movieNightPassportKey,newPassportPersonalBests,newlyUnlockedPassportStamps,parseMovieNightPassport,passportAchievements,passportAttendance,passportNextGoals,passportShareText,recordMovieNight,shareMovieNightPassport,type MovieNightPassport,type PassportResult} from '@/lib/movie-night-passport';

export function MovieNightPassport({result}:Readonly<{result?:PassportResult|null}>) {
 const shareLock=useRef(false),[profile,setProfile]=useState<MovieNightPassport|null>(null),[newStamps,setNewStamps]=useState<string[]>([]),[newBests,setNewBests]=useState<string[]>([]),[sharing,setSharing]=useState(false),[shareNotice,setShareNotice]=useState(''),[shareFallback,setShareFallback]=useState('');
 useEffect(()=>{
  let previous=emptyMovieNightPassport();
  try{previous=parseMovieNightPassport(JSON.parse(localStorage.getItem(movieNightPassportKey)||'null'));}catch{}
  let next=previous;
  if(result)next=recordMovieNight(next,result);
  setNewStamps(result?newlyUnlockedPassportStamps(previous,next).map(item=>item.title):[]);
  setNewBests(result?newPassportPersonalBests(previous,next):[]);
  try{localStorage.setItem(movieNightPassportKey,JSON.stringify(next));}catch{}
  setProfile(next);
 },[result?.code,result?.roundStarted,result?.seriesMatches,result?.status]);
 async function share(native:boolean){
  if(!profile||shareLock.current)return;shareLock.current=true;setSharing(true);setShareNotice('');setShareFallback('');
  try{
   const text=passportShareText(profile,window.location.href);if(!text)return;
   const outcome=await shareMovieNightPassport(text,{share:navigator.share?data=>navigator.share(data):undefined,copy:navigator.clipboard?.writeText?value=>navigator.clipboard.writeText(value):undefined},native);
   if(outcome==='manual')setShareFallback(text);
   setShareNotice(outcome==='shared'?'Passport shared.':outcome==='copied'?'Passport stats copied.':outcome==='cancelled'?'Sharing cancelled.':'Select and copy your Passport below.');
  }catch{setShareNotice('Sharing is unavailable right now. Please try again.');}
  finally{shareLock.current=false;setSharing(false);}
 }
 if(!profile||profile.matches===0)return null;
 const winRate=Math.round(profile.wins/profile.matches*100),fastest=profile.fastestMs===null?'—':`${(profile.fastestMs/1000).toFixed(1)}s`;
 const achievements=passportAchievements(profile),unlocked=achievements.filter(item=>item.unlocked).length,goals=passportNextGoals(profile),attendance=passportAttendance(profile);
 return <section className="movie-night-passport" aria-label="Your Movie Night Passport">
  <div className="passport-heading"><div><span>YOUR MOVIE NIGHT PASSPORT</span><h2>Your cinema record.</h2></div><Trophy size={28}/></div>
  {(newStamps.length>0||newBests.length>0)&&<div className="passport-celebrations" role="status">{newStamps.length>0&&<div className="passport-unlocked"><Sparkles size={22}/><div><span>{newStamps.length===1?'NEW PASSPORT STAMP':'NEW PASSPORT STAMPS'}</span><strong>{newStamps.join(' · ')}</strong><p>Added to your cinema record.</p></div></div>}{newBests.length>0&&<div className="passport-personal-best"><Award size={22}/><div><span>{newBests.length===1?'NEW PERSONAL BEST':'NEW PERSONAL BESTS'}</span><strong>{newBests.join(' · ')}</strong><p>Your previous record was beaten.</p></div></div>}</div>}
  <div className="passport-stats"><div><b>{profile.matches}</b><span>Matches</span></div><div><b>{winRate}%</b><span>Win rate</span></div><div><b>{profile.solves}</b><span>Movies solved</span></div><div><b>{profile.firstClueSolves}</b><span>Clue 1 solves</span></div></div>
  <div className="passport-highlights"><span><Flame size={16}/><b>{profile.currentStreak}</b> win streak · best {profile.bestStreak}</span><span><Award size={16}/><b>{profile.bestScore}</b> best score</span><span><Timer size={16}/><b>{fastest}</b> fastest solve</span></div>
  <div className="passport-attendance"><CalendarDays size={19}/><div><span>ENCORE ATTENDANCE</span><strong>{attendance.current} day streak · best {attendance.best}</strong><p>{attendance.message}</p></div></div>
  {profile.seriesTitles>0&&<div className="passport-crown"><Crown size={18}/><span><b>{profile.seriesTitles}</b> Series {profile.seriesTitles===1?'title':'titles'} · best {profile.bestTitleStreak} straight</span></div>}
  {profile.perfectMatches>0&&<p>{profile.perfectMatches} perfect {profile.perfectMatches===1?'match':'matches'} — every movie solved.</p>}
  <section className="passport-achievements" aria-label={`${unlocked} of ${achievements.length} Passport stamps earned`}><div className="passport-achievement-heading"><div><span>PASSPORT STAMPS</span><h3>Keep filling the marquee.</h3></div><b>{unlocked}/{achievements.length}</b></div><div className="passport-achievement-grid">{achievements.map(item=><div className={item.unlocked?'is-unlocked':''} key={item.id}>{item.unlocked?<Check size={18}/>:<LockKeyhole size={17}/>}<strong>{item.title}</strong><p>{item.description}</p><span>{item.unlocked?'Earned':`${item.current}/${item.target}`}</span></div>)}</div></section>
  {goals.length?<section className="passport-goals" aria-label="Next Passport goals"><div><span>NEXT ON THE MARQUEE</span><h3>What to chase next.</h3></div><div className="passport-goal-grid">{goals.map(goal=><article key={goal.id}><div><strong>{goal.title}</strong><b>{goal.current}/{goal.target}</b></div><p>{goal.description}</p><div className="passport-goal-progress" role="progressbar" aria-label={`${goal.title}: ${goal.current} of ${goal.target}`} aria-valuemin={0} aria-valuemax={goal.target} aria-valuenow={goal.current}><span style={{width:`${Math.round(goal.current/goal.target*100)}%`}}/></div></article>)}</div></section>:<div className="passport-complete"><Sparkles size={20}/><div><strong>Passport complete.</strong><p>Every stamp is on the marquee.</p></div></div>}
  <div className="passport-share"><div><strong>Share your cinema record.</strong><span>Stats and stamps only—no names, room codes, or movie spoilers.</span></div><div className="invite-actions"><button type="button" className="secondary" disabled={sharing} onClick={()=>void share(true)}><Share2 size={16}/>{sharing?'Preparing…':'Share Passport'}</button><button type="button" className="secondary" disabled={sharing} onClick={()=>void share(false)}><Copy size={16}/>Copy stats</button></div><p role="status">{shareNotice}</p>{shareFallback&&<textarea className="daily-share-text" aria-label="Copyable Movie Night Passport" readOnly rows={7} value={shareFallback} onFocus={event=>event.currentTarget.select()}/>}</div>
  <small>Saved only in this browser. Each finished match is counted once.</small>
 </section>;
}
