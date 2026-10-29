import {Clapperboard} from 'lucide-react';

type SeriesMatch={match:number;winners:string[]};

export function SeriesTimeline({history}:{history:SeriesMatch[]}){
 if(!history.length)return null;
 return <section className="series-timeline" aria-label="Movie Night Series match winners">
  <div className="series-timeline-heading"><Clapperboard size={19}/><div><span>THE SERIES SO FAR</span><strong>Match winners</strong></div></div>
  <ol>{history.map(row=><li key={row.match}><span>MATCH {row.match}</span><strong>{row.winners.join(' & ')}</strong><small>{row.winners.length>1?'Shared the win':'Took the win'}</small></li>)}</ol>
 </section>;
}
