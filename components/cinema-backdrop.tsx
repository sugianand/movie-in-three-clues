const posters = ['dune-2', 'rrr', 'interstellar', 'pushpa-2', 'barbie', 'oppenheimer', 'baahubali-2', 'kalki'];

export function CinemaBackdrop({subdued}: {subdued: boolean}) {
  return <div className={`cinema-backdrop${subdued ? ' cinema-backdrop-subdued' : ''}`} aria-hidden="true">
    <div className="cinema-backdrop-reel">
      {[0, 1].map(copy => <div key={copy} style={{display: 'contents'}}>
        <div className="cinema-poster-panel cinema-poster-grid">
          {posters.map(poster => <img key={poster} src={`/posters/${poster}.webp`} alt="" decoding="async" draggable={false} />)}
        </div>
        <div className="cinema-poster-panel cinema-poster-original" />
      </div>)}
    </div>
    <div className="cinema-backdrop-shade" />
  </div>;
}
