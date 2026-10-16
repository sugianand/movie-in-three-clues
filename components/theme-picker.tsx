'use client';
import {useEffect,useState} from 'react';
import {Dialog,DialogTrigger,DialogContent,DialogTitle,DialogDescription,DialogClose} from '@/components/ui/dialog';
import {Palette} from 'lucide-react';
import {parseTheme,themeKey,themes,type ThemeId} from '@/lib/themes';
export function ThemePicker(){
 const [theme,setTheme]=useState<ThemeId>('premiere');
 const [notice,setNotice]=useState('');
 useEffect(()=>{
  try{const saved=parseTheme(localStorage.getItem(themeKey));setTheme(saved);document.documentElement.dataset.cinemaTheme=saved;}catch{}
  function sync(event:StorageEvent){if(event.key!==themeKey&&event.key!==null)return;const next=parseTheme(event.newValue);setTheme(next);document.documentElement.dataset.cinemaTheme=next;}
  window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[]);
 function choose(value:string){const next=parseTheme(value);setTheme(next);document.documentElement.dataset.cinemaTheme=next;try{localStorage.setItem(themeKey,next);setNotice('Theme saved for this browser.');}catch{setNotice('Theme applied for this visit. Your browser blocked saving.');}}
 return <Dialog><DialogTrigger asChild><button type="button" className="theme-trigger"><Palette size={17} aria-hidden="true"/>Themes</button></DialogTrigger><DialogContent className="cinema-theme-dialog" showCloseButton={false}><div className="theme-dialog-heading"><div><DialogTitle className="theme-panel-title">Set the scene</DialogTitle><DialogDescription className="theme-panel-intro">Same game. A different universe.</DialogDescription></div><DialogClose asChild><button type="button" className="theme-done">Done</button></DialogClose></div><div className="theme-choices" role="group" aria-label="Cinema theme">{themes.map(t=><button type="button" key={t.id} className={`theme-choice theme-choice-${t.id}`} aria-pressed={theme===t.id} onClick={()=>choose(t.id)}><span className={`theme-swatch theme-swatch-${t.id}`} aria-hidden="true"><i/><i/><i/></span><span><b>{t.name}</b><small>{t.id==='premiere'?'The original':t.id==='classic'?'Vintage picture house':'Inspired cinema'}</small></span><span className="theme-check" aria-hidden="true">{theme===t.id?'✓':'○'}</span></button>)}</div><p>{themes.find(t=>t.id===theme)?.description}</p><small>Saved on this browser. Your match keeps running.</small><p className="theme-notice" role="status">{notice}</p></DialogContent></Dialog>;
}
