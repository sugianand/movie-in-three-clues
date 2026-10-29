import {Crown} from 'lucide-react';
import {seriesRace,type SeriesPlayer} from '@/lib/series-stakes';

export function SeriesStakes({players,goal,status,matches}:{players:SeriesPlayer[];goal:number;status:string;matches:number}){
 const race=seriesRace(players,goal);
 const active=status==='playing'||status==='reveal';
 if(!race||!['playing','reveal','finished'].includes(status)||(!active&&!race.matchPoint)||matches<0)return null;
 return <section className={`series-stakes${active?' series-race-live':''}`} aria-label="Live Movie Night Series standings" aria-live="polite">
  <div className="series-stakes-heading"><Crown size={24}/><div><span>MOVIE NIGHT SERIES · {race.matchPoint?'MATCH POINT':'LIVE RACE'}</span><strong>{race.headline}</strong><p>{race.matchPoint?(active?'A win this match claims the first-to-three crown.':'The next match could decide the first-to-three series.'):`${matches} ${matches===1?'match':'matches'} complete · first to ${race.goal} wins the crown.`}</p></div></div>
  <div className="series-race-list">{race.players.map((player,index)=><div className={race.leaders.includes(player.name)&&race.wins>0?'series-race-leader':''} key={`${player.name}-${index}`}>
   <b>{player.name}</b><span>{player.seriesWins}/{race.goal} wins</span><span className="series-race-dots" aria-label={`${player.seriesWins} of ${race.goal} series wins`}>{Array.from({length:race.goal},(_,index)=><i className={index<player.seriesWins?'filled':''} key={index}/>)}</span>
  </div>)}</div>
 </section>;
}
