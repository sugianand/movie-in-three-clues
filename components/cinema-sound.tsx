'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {Volume2,VolumeX} from 'lucide-react';
import {cinemaCueFor,cinemaSoundKey,parseCinemaSound,type CinemaCue,type CinemaSoundSnapshot} from '@/lib/cinema-sound';

type BrowserAudioContext=AudioContext&{createGain():GainNode};
const notes:Record<CinemaCue,{hz:number;at:number;length:number}[]>={
 round:[{hz:392,at:0,length:.09},{hz:523.25,at:.1,length:.13}],
 clue:[{hz:659.25,at:0,length:.11}],
 correct:[{hz:523.25,at:0,length:.1},{hz:659.25,at:.09,length:.1},{hz:783.99,at:.18,length:.18}],
 reveal:[{hz:587.33,at:0,length:.12},{hz:440,at:.12,length:.2}],
 finish:[{hz:392,at:0,length:.12},{hz:523.25,at:.11,length:.12},{hz:659.25,at:.22,length:.12},{hz:783.99,at:.33,length:.24}],
};

export function CinemaSound({snapshot}:Readonly<{snapshot?:CinemaSoundSnapshot|null}>){
 const [enabled,setEnabled]=useState(false),[notice,setNotice]=useState('');
 const context=useRef<BrowserAudioContext|null>(null),previous=useRef<CinemaSoundSnapshot|null>(null);
 const arm=useCallback(()=>{
  try{const AudioCtor=window.AudioContext||(window as typeof window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!AudioCtor)return null;context.current??=new AudioCtor() as BrowserAudioContext;if(context.current.state==='suspended')void context.current.resume();return context.current;}catch{return null;}
 },[]);
 const play=useCallback((cue:CinemaCue)=>{
  const audio=context.current;if(!audio||audio.state!=='running')return;
  const start=audio.currentTime+.015;
  for(const note of notes[cue]){const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(note.hz,start+note.at);gain.gain.setValueAtTime(.0001,start+note.at);gain.gain.exponentialRampToValueAtTime(.045,start+note.at+.015);gain.gain.exponentialRampToValueAtTime(.0001,start+note.at+note.length);oscillator.connect(gain).connect(audio.destination);oscillator.start(start+note.at);oscillator.stop(start+note.at+note.length+.02);}
 },[]);
 useEffect(()=>{try{setEnabled(parseCinemaSound(localStorage.getItem(cinemaSoundKey)));}catch{}},[]);
 useEffect(()=>{
  if(!enabled)return;
  const unlock=()=>{arm();};document.addEventListener('pointerdown',unlock,{once:true});document.addEventListener('keydown',unlock,{once:true});
  return()=>{document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock);};
 },[enabled,arm]);
 useEffect(()=>{const cue=cinemaCueFor(previous.current,snapshot??null);previous.current=snapshot??null;if(enabled&&cue)play(cue);},[enabled,play,snapshot]);
 function toggle(){const next=!enabled;setEnabled(next);setNotice(next?'Sound on.':'Sound off.');try{localStorage.setItem(cinemaSoundKey,next?'on':'off');}catch{}if(next){arm();setTimeout(()=>play('round'),30);}}
 return <div className="cinema-sound"><button type="button" aria-pressed={enabled} aria-label={`Game sound ${enabled?'on':'off'}`} title="Cinema sound cues" onClick={toggle}>{enabled?<Volume2 size={17}/>:<VolumeX size={17}/>}<span>{enabled?'Sound on':'Sound off'}</span></button><span className="sr-only" role="status">{notice}</span></div>;
}
