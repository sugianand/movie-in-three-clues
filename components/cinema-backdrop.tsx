'use client';
import {useEffect, useState} from 'react';
import {posterWall} from '@/lib/poster-wall';

// How many posters one visit shows. Divisible by 3 so all three rows stay full and the loop has no hole.
export const WALL_SIZE = 36;

// Pick a fresh random set on every page load, so each visit shows different movies.
export function pickPosters(pool: readonly string[], count = WALL_SIZE, random = Math.random): string[] {
  const deck = [...pool];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, Math.min(count, deck.length - deck.length % 3));
}

export function CinemaBackdrop({subdued}: {subdued: boolean}) {
  // Chosen after mount so the server render and first client render match.
  const [posters, setPosters] = useState<string[]>([]);
  useEffect(() => setPosters(pickPosters(posterWall)), []);
  return <div className={`cinema-backdrop${subdued ? ' cinema-backdrop-subdued' : ''}`} aria-hidden="true">
    {/* Three flush rows; the set renders twice so the reel loops seamlessly. */}
    <div className={`cinema-backdrop-reel${posters.length ? ' is-ready' : ''}`}>
      {[0, 1].map(copy => posters.map(poster => <img key={`${copy}-${poster}`} src={`/posters/${poster}.webp`} alt="" decoding="async" draggable={false} />))}
    </div>
    <div className="cinema-backdrop-shade" />
  </div>;
}
