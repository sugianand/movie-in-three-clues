'use client';
import {useEffect,useState} from 'react';
import {practiceChallengeState,type PracticeChallenge as Challenge} from '@/lib/practice-challenge';
import {PracticeChallengeShare} from '@/components/practice-challenge-share';

type ChallengeState={challenge:Challenge;day:string;completed:boolean;streak:number;week:{day:string;label:string;completed:boolean;today:boolean}[]};
export function PracticeChallenge(){
 const [state,setState]=useState<ChallengeState|null>(null);
 useEffect(()=>{let timeout:ReturnType<typeof setTimeout>;const refresh=()=>{try{setState(practiceChallengeState(localStorage));}catch{}const now=Date.now(),next=(Math.floor(now/86_400_000)+1)*86_400_000;timeout=setTimeout(refresh,Math.max(1000,next-now+50));};refresh();return()=>clearTimeout(timeout);},[]);
 if(!state)return null;
 return <section className={`practice-challenge${state.completed?' is-complete':''}`} aria-label="Daily Solo Practice challenge"><div><span>DAILY PRACTICE CHALLENGE</span><h2>{state.challenge.title}</h2><p>{state.challenge.description}</p></div><aside><strong>{state.completed?'Complete today':'In progress'}</strong><b>{state.streak?`${state.streak}-day streak`:'Start your streak'}</b><ol className="practice-challenge-week" aria-label="Seven-day challenge history">{state.week.map(item=><li className={`${item.completed?'is-complete ':''}${item.today?'is-today':''}`} key={item.day} aria-label={`${item.label}: ${item.completed?'challenge complete':item.today?'today, incomplete':'not completed'}`}><span>{item.label.slice(0,1)}</span><i aria-hidden="true"/></li>)}</ol><small>Last 7 UTC days · Resets at midnight UTC · saved only in this browser</small>{state.completed&&<PracticeChallengeShare challenge={state.challenge} day={state.day} streak={state.streak}/>}</aside></section>;
}
