export function CinemaBackdrop({subdued}: {subdued: boolean}) {
 return <div className={`cinema-backdrop${subdued ? ' cinema-backdrop-subdued' : ''}`} aria-hidden="true">
  <div className="cinema-backdrop-reel"/>
  <div className="theme-environment">
   <div className="theme-orbit"/><div className="theme-horizon"/>
   <div className="theme-geometry"><i/><i/><i/></div>
   <div className="theme-particles">{Array.from({length:12},(_,i)=><i key={i}/>)}</div>
  </div>
  <div className="cinema-backdrop-shade"/>
 </div>;
}
