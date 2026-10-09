export function CinemaBackdrop({subdued}: {subdued: boolean}) {
  return <div className={`cinema-backdrop${subdued ? ' cinema-backdrop-subdued' : ''}`} aria-hidden="true">
    <div className="cinema-backdrop-reel" />
    <div className="cinema-backdrop-shade" />
  </div>;
}
