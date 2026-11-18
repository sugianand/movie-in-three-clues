// 30 title-only posters, laid out straight in three flush rows. The list renders twice so the reel loops seamlessly.
const posters = ["dune-2", "rrr", "interstellar", "pushpa-2", "barbie", "jawan", "dark-knight", "baahubali-2", "oppenheimer", "kalki", "inception", "kgf-2", "titanic", "3-idiots", "jurassic-park", "pathaan", "matrix", "dangal", "avatar", "jailer", "endgame", "lagaan", "spider-verse", "vikram", "top-gun", "sholay", "joker", "leo", "back-to-the-future", "lion-king"];

export function CinemaBackdrop({subdued}: {subdued: boolean}) {
  return <div className={`cinema-backdrop${subdued ? ' cinema-backdrop-subdued' : ''}`} aria-hidden="true">
    <div className="cinema-backdrop-reel">
      {[0, 1].map(copy => posters.map(poster => <img key={`${copy}-${poster}`} src={`/posters/${poster}.webp`} alt="" decoding="async" draggable={false} />))}
    </div>
    <div className="cinema-backdrop-shade" />
  </div>;
}
