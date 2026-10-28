export type SeriesPlayer={name:string;seriesWins:number};
export type SeriesStakes={leaders:string[];wins:number;goal:number;remaining:number;headline:string};

export function seriesStakes(players:SeriesPlayer[],goal:number):SeriesStakes|null{
 if(!Number.isInteger(goal)||goal<2||!players.length||players.some(player=>!Number.isInteger(player.seriesWins)||player.seriesWins<0))return null;
 const wins=Math.max(...players.map(player=>player.seriesWins)),remaining=Math.max(0,goal-wins);
 if(remaining!==1)return null;
 const leaders=players.filter(player=>player.seriesWins===wins).map(player=>player.name);
 const headline=leaders.length===1?`${leaders[0]} is on match point.`:leaders.length===2?`${leaders[0]} & ${leaders[1]} are on match point.`:`${leaders.length} players are on match point.`;
 return {leaders,wins,goal,remaining,headline};
}
