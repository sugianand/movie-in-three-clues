export type PersonalMatchResult={
 totalRounds:number;
 me:{id:string;spectator:boolean};
 players:{id:string;name:string;score:number}[];
 recap:{solvers:{id?:string;name:string;clue:number;ms?:number}[]}[];
};

export type PersonalMatchSummary={
 score:number;
 solves:number;
 firstClues:number;
 averageClue:number|null;
 fastestMs:number|null;
 headline:string;
};

export function personalMatchSummary(result:PersonalMatchResult):PersonalMatchSummary|null{
 if(result.me.spectator||!Number.isInteger(result.totalRounds)||result.totalRounds<1)return null;
 const me=result.players.find(player=>player.id===result.me.id);if(!me||!Number.isFinite(me.score))return null;
 const solves=result.recap.flatMap(round=>round.solvers.filter(solver=>solver.id?solver.id===me.id:solver.name===me.name)).filter(solver=>Number.isInteger(solver.clue)&&solver.clue>=1&&solver.clue<=3);
 const firstClues=solves.filter(solve=>solve.clue===1).length;
 const times=solves.flatMap(solve=>typeof solve.ms==='number'&&Number.isFinite(solve.ms)&&solve.ms>=0?[solve.ms]:[]);
 const averageClue=solves.length?solves.reduce((sum,solve)=>sum+solve.clue,0)/solves.length:null;
 const headline=solves.length===result.totalRounds?'Perfect slate — every movie found.':
  solves.length===0?'Fresh start. Take the next match one clue at a time.':
  firstClues>=Math.ceil(solves.length/2)?'Strong first impressions — your early reads landed.':
  `You found ${solves.length} of ${result.totalRounds}. One more early solve can change the next match.`;
 return {score:me.score,solves:solves.length,firstClues,averageClue,fastestMs:times.length?Math.min(...times):null,headline};
}
