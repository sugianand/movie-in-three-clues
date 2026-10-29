export type SeriesPlayer={name:string;seriesWins:number};
export type SeriesStakes={leaders:string[];wins:number;goal:number;remaining:number;headline:string};
export type SeriesRace={players:SeriesPlayer[];leaders:string[];wins:number;goal:number;remaining:number;headline:string;matchPoint:boolean};

export function seriesRace(players:SeriesPlayer[],goal:number):SeriesRace|null{
 if(!Number.isInteger(goal)||goal<2||!players.length||players.some(player=>!player.name||!Number.isInteger(player.seriesWins)||player.seriesWins<0))return null;
 // Stable sorting keeps tied players in their room/join order.
 const sorted=[...players].sort((a,b)=>b.seriesWins-a.seriesWins);
 const wins=sorted[0].seriesWins,remaining=Math.max(0,goal-wins),leaders=sorted.filter(player=>player.seriesWins===wins).map(player=>player.name);
 const matchPoint=remaining===1;
 const headline=matchPoint
  ?leaders.length===1?`${leaders[0]} is on match point.`:leaders.length===2?`${leaders[0]} & ${leaders[1]} are on match point.`:`${leaders.length} players are on match point.`
  :wins===0?'The race for the crown starts now.'
  :leaders.length===1?`${leaders[0]} leads the series.`:leaders.length===2?`${leaders[0]} & ${leaders[1]} share the lead.`:`${leaders.length} players share the lead.`;
 return {players:sorted,leaders,wins,goal,remaining,headline,matchPoint};
}

export function seriesStakes(players:SeriesPlayer[],goal:number):SeriesStakes|null{
 const race=seriesRace(players,goal);
 if(!race?.matchPoint)return null;
 return {leaders:race.leaders,wins:race.wins,goal:race.goal,remaining:race.remaining,headline:race.headline};
}
