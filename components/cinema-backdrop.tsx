'use client';

import {useEffect, useState} from 'react';
import {Pause, Play} from 'lucide-react';

export function CinemaBackdrop({subdued}: {subdued: boolean}) {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return <>
    <div className={`cinema-backdrop${subdued ? ' cinema-backdrop-subdued' : ''}${paused ? ' cinema-backdrop-paused' : ''}`} aria-hidden="true">
      <div className="cinema-backdrop-reel" />
      <div className="cinema-backdrop-shade" />
    </div>
    {!subdued && !reducedMotion && <button className="cinema-motion" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play background animation' : 'Pause background animation'}>
      {paused ? <Play size={14} /> : <Pause size={14} />}
      <span>{paused ? 'Play background' : 'Pause background'}</span>
    </button>}
  </>;
}
