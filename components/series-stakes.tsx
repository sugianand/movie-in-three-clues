import {Crown} from 'lucide-react';
import {seriesStakes,type SeriesPlayer} from '@/lib/series-stakes';

export function SeriesStakes({players,goal,status,matches}:{players:SeriesPlayer[];goal:number;status:string;matches:number}){
 const stakes=seriesStakes(players,goal);
 if(!stakes||matches<1||!['playing','reveal','finished'].includes(status))return null;
 const active=status==='playing'||status==='reveal';
 return <section className="series-stakes" aria-label="Movie Night Series match point" role="status">
  <Crown size={24}/>
  <div><span>MOVIE NIGHT SERIES · MATCH POINT</span><strong>{stakes.headline}</strong><p>{active?'A win this match claims the first-to-three crown.':'The next match could decide the first-to-three series.'}</p></div>
  <b>{stakes.wins}/{stakes.goal}<small>WINS</small></b>
 </section>;
}
