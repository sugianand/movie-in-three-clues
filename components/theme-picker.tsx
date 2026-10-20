'use client';
import {useEffect,useRef,useState} from 'react';
import {parseTheme,themeKey,themes,type ThemeId} from '@/lib/themes';
export function ThemePicker(){
 const [theme,setTheme]=useState<ThemeId>('premiere');
 const [notice,setNotice]=useState('');
 const panel=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{
  try{const saved=parseTheme(localStorage.getItem(themeKey));setTheme(saved);document.documentElement.dataset.cinemaTheme=saved;}catch{}
  function sync(event:StorageEvent){if(event.key!==themeKey&&event.key!==null)return;const next=parseTheme(event.newValue);setTheme(next);document.documentElement.dataset.cinemaTheme=next;}
  function dismiss(event:PointerEvent){if(event.target instanceof Node&&!panel.current?.contains(event.target)&&panel.current)panel.current.open=false;}
  window.addEventListener('storage',sync);document.addEventListener('pointerdown',dismiss);
  return()=>{window.removeEventListener('storage',sync);document.removeEventListener('pointerdown',dismiss);};
 },[]);
 function choose(value:ThemeId){setTheme(value);document.documentElement.dataset.cinemaTheme=value;try{localStorage.setItem(themeKey,value);setNotice('Theme saved for this browser.');}catch{setNotice('Theme applied for this visit. Your browser blocked saving.');}}
 return <details ref={panel} className="theme-picker" onKeyDown={e=>{if(e.key==='Escape'&&panel.current){panel.current.open=false;panel.current.querySelector('summary')?.focus();}}}>
  <summary>Themes</summary>
  <div className="theme-popover theme-gallery">
   <div className="theme-gallery-heading"><span>SET THE SCENE</span><strong>Choose your universe.</strong></div>
   <div className="theme-options" role="group" aria-label="Cinema theme">
    {themes.map((t,i)=><button type="button" key={t.id} className={`theme-option theme-option-${t.id}`} aria-pressed={theme===t.id} onClick={()=>choose(t.id)}>
     <span className="theme-art" aria-hidden="true">{t.id==='arena'?'○ △ □':t.id==='midnight'?'UPSIDE DOWN':'NOW SHOWING'}</span>
     <span className="theme-option-copy"><span className="theme-option-number">0{i+1}</span><span><strong>{t.name}</strong><small>{t.description}</small></span><span className="theme-option-check" aria-hidden="true">{theme===t.id?'✓':'↗'}</span></span>
    </button>)}
   </div>
   <small className="theme-gallery-note">Your screen, your atmosphere. Switch anytime during a match.</small>
   <p className="theme-notice" role="status">{notice}</p>
  </div>
 </details>;
}
