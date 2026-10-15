'use client';
import {useEffect,useState} from 'react';
import {Award,Check,Flame,LockKeyhole,Timer,Trophy} from 'lucide-react';
import {emptyMovieNightPassport,movieNightPassportKey,parseMovieNightPassport,passportAchievements,recordMovieNight,type MovieNightPassport,type PassportResult} from '@/lib/movie-night-passport';

export function MovieNightPassport({result}:Readonly<{result?:PassportResult|null}>) {
 const [profile,setProfile]=useState<MovieNightPassport|null>(null);
 useEffect(()=>{
  let next=emptyMovieNightPassport();
  try{next=parseMovieNightPassport(JSON.parse(localStorage.getItem(movieNightPassportKey)||'null'));}catch{}
  if(result)next=recordMovieNight(next,result);
  try{localStorage.setItem(movieNightPassportKey,JSON.stringify(next));}catch{}
  setProfile(next);
 },[result?.code,result?.seriesMatches,result?.status]);
 if(!profile||profile.matches===0)return null;
 const winRate=Math.round(profile.wins/profile.matches*100),fastest=profile.fastestMs===null?'—':`${(profile.fastestMs/1000).toFixed(1)}s`;
 const achievements=passportAchievements(profile),unlocked=achievements.filter(item=>item.unlocked).length;
 return <section className="movie-night-passport" aria-label="Your Movie Night Passport">
  <div className="passport-heading"><div><span>YOUR MOVIE NIGHT PASSPORT</span><h2>Your cinema record.</h2></div><Trophy size={28}/></div>
  <div className="passport-stats"><div><b>{profile.matches}</b><span>Matches</span></div><div><b>{winRate}%</b><span>Win rate</span></div><div><b>{profile.solves}</b><span>Movies solved</span></div><div><b>{profile.firstClueSolves}</b><span>Clue 1 solves</span></div></div>
  <div className="passport-highlights"><span><Flame size={16}/><b>{profile.currentStreak}</b> win streak · best {profile.bestStreak}</span><span><Award size={16}/><b>{profile.bestScore}</b> best score</span><span><Timer size={16}/><b>{fastest}</b> fastest solve</span></div>
  {profile.perfectMatches>0&&<p>{profile.perfectMatches} perfect {profile.perfectMatches===1?'match':'matches'} — every movie solved.</p>}
  <section className="passport-achievements" aria-label={`${unlocked} of ${achievements.length} Passport stamps earned`}><div className="passport-achievement-heading"><div><span>PASSPORT STAMPS</span><h3>Keep filling the marquee.</h3></div><b>{unlocked}/{achievements.length}</b></div><div className="passport-achievement-grid">{achievements.map(item=><div className={item.unlocked?'is-unlocked':''} key={item.id}>{item.unlocked?<Check size={18}/>:<LockKeyhole size={17}/>}<strong>{item.title}</strong><p>{item.description}</p><span>{item.unlocked?'Earned':`${item.current}/${item.target}`}</span></div>)}</div></section>
  <small>Saved only in this browser. Each finished match is counted once.</small>
 </section>;
}
