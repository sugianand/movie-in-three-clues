import {posterRows} from '@/lib/cinema-posters';

export function CinemaBackdrop({subdued}: {subdued: boolean}) {
  return <div className={`cinema-backdrop${subdued ? ' cinema-backdrop-subdued' : ''}`} aria-hidden="true">
    <div className="cinema-backdrop-reel">
      {posterRows.map((row,index)=><div className="poster-row" key={index}>
        <div className="poster-track">
          {[0,1].map(copy=><div className="poster-group" key={copy}>
            {row.map(poster=><div className="cinema-poster" key={poster.id}>
              <span>{poster.title}</span>
              {/* Decorative thumbnails use TMDB's CDN directly, without an image proxy or API call. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://image.tmdb.org/t/p/w342${poster.posterPath}`} alt="" width="342" height="513" loading="lazy" decoding="async" fetchPriority="low" onError={event=>{event.currentTarget.style.display='none';}}/>
            </div>)}
          </div>)}
        </div>
      </div>)}
    </div>
    <div className="cinema-backdrop-shade" />
  </div>;
}
