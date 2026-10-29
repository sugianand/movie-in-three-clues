import {Clapperboard,Sparkles} from 'lucide-react';

type SeriesMatch={match:number;winners:string[]};
type SeriesPlayer={id:string;name:string;seriesPoints:number};

export function SeriesTimeline({history,players}:{history:SeriesMatch[];players:SeriesPlayer[]}){
 if(!history.length)return null;
 const ranked=[...players].sort((a,b)=>b.seriesPoints-a.seriesPoints||a.name.localeCompare(b.name));
 const high=ranked[0]?.seriesPoints??0,leaders=ranked.filter(player=>player.seriesPoints===high).map(player=>player.name);
 return <section className="series-timeline" aria-label="Movie Night Series match winners">
  <div className="series-timeline-heading"><Clapperboard size={19}/><div><span>THE SERIES SO FAR</span><strong>Match winners</strong></div></div>
  <ol>{history.map(row=><li key={row.match}><span>MATCH {row.match}</span><strong>{row.winners.join(' & ')}</strong><small>{row.winners.length>1?'Shared the win':'Took the win'}</small></li>)}</ol>
  <div className="series-mvp" aria-label="Series MVP race"><Sparkles size={18}/><div><span>SERIES MVP RACE</span><strong>{leaders.join(' & ')}</strong><small>{leaders.length>1?'Share the points lead':'Leads all players'} with {high.toLocaleString()} pts across {history.length} {history.length===1?'match':'matches'}.</small></div></div>
  <div className="series-mvp-list">{ranked.map(player=><span className={player.seriesPoints===high?'is-leading':''} key={player.id}><b>{player.name}</b>{player.seriesPoints.toLocaleString()} pts</span>)}</div>
 </section>;
}
