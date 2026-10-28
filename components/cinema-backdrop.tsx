const posters = ['dune-2', 'rrr', 'interstellar', 'pushpa-2', 'barbie', 'oppenheimer', 'baahubali-2', 'kalki'];

/** Each row shows every poster once, in its own order, so neighbouring rows never line up. */
const rows = [
  posters,
  ['oppenheimer', 'kalki', 'dune-2', 'barbie', 'rrr', 'interstellar', 'pushpa-2', 'baahubali-2'],
  ['barbie', 'baahubali-2', 'interstellar', 'rrr', 'kalki', 'pushpa-2', 'dune-2', 'oppenheimer'],
  ['pushpa-2', 'interstellar', 'oppenheimer', 'kalki', 'baahubali-2', 'dune-2', 'barbie', 'rrr'],
];

/**
 * Moving poster wall: four tilted rows that glide sideways at different speeds, alternating
 * direction. Each row holds three identical copies of its posters and moves exactly one copy's
 * width per loop, so the loop is seamless. The Stranger Things and Squid Game themes hide the
 * wall and use their own dark backgrounds.
 */
export function CinemaBackdrop({subdued}: {subdued: boolean}) {
  return <div className={`cinema-backdrop${subdued ? ' cinema-backdrop-subdued' : ''}`} aria-hidden="true">
    <div className="cinema-backdrop-reel tc-wall">
      {rows.map((row, r) => <div key={r} className={`tc-wall-row tc-wall-row-${r + 1}`}>
        {[0, 1, 2].map(copy => <div key={copy} className="tc-wall-set">
          {row.map(poster => <img key={poster} src={`/posters/${poster}.webp`} alt="" width={640} height={960} decoding="async" loading="eager" draggable={false}/>)}
        </div>)}
      </div>)}
    </div>
    <div className="cinema-backdrop-shade"/>
  </div>;
}
