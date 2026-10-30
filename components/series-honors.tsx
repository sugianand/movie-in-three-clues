import {Bolt,Medal,Sparkles} from 'lucide-react';

type Player={id:string;name:string;seriesPoints:number;seriesSolves:number;seriesFirstClues:number};

const leaders=(players:Player[],field:'seriesPoints'|'seriesSolves'|'seriesFirstClues')=>{
 const high=Math.max(...players.map(player=>player[field]));
 return {high,names:players.filter(player=>player[field]===high).map(player=>player.name)};
};

export function SeriesHonors({players,fastest}:{players:Player[];fastest:{name:string;ms:number}|null}){
 if(!players.length)return null;
 const points=leaders(players,'seriesPoints'),solves=leaders(players,'seriesSolves'),firstClues=leaders(players,'seriesFirstClues');
 const clueAce=firstClues.high>0?firstClues:solves;
 return <section className="series-honors" aria-label="Movie Night Series honors">
  <div className="series-honors-heading"><span>SERIES HONORS</span><strong>More ways to own movie night.</strong></div>
  <div className="series-honors-grid">
   <article><Sparkles size={20}/><span>POINTS MVP</span><strong>{points.names.join(' & ')}</strong><small>{points.high.toLocaleString()} points across the series</small></article>
   {clueAce.high>0&&<article><Medal size={20}/><span>{firstClues.high>0?'FIRST-CLUE ACE':'MOST SOLVES'}</span><strong>{clueAce.names.join(' & ')}</strong><small>{clueAce.high} {firstClues.high>0?'movies solved on clue one':'movies solved across the series'}</small></article>}
   {fastest&&<article><Bolt size={20}/><span>FASTEST SOLVE</span><strong>{fastest.name}</strong><small>{(fastest.ms/1000).toFixed(1)} seconds</small></article>}
  </div>
 </section>;
}
