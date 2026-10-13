'use client';
import {useEffect,useState} from 'react';
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
 return <details className="theme-picker"><summary>Themes</summary><div className="theme-popover"><label htmlFor="cinema-theme">Your cinema, your style</label><select id="cinema-theme" value={theme} onChange={e=>choose(e.target.value)}>{themes.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select><div className={`theme-swatch theme-swatch-${theme}`} aria-hidden="true"><i/><i/><i/></div><p>{themes.find(t=>t.id===theme)?.description}</p><small>Only your screen changes. Switch anytime; your match keeps running.</small><p className="theme-notice" role="status">{notice}</p></div></details>;
}
