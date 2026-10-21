export type ScoreJourneyRound={round:number;totals?:{name:string;score:number}[]};

export type ScoreJourneyRow={name:string;scores:(number|null)[];leaders:boolean[]};

export function scoreJourney(recap:ScoreJourneyRound[]){
 const rounds=[...recap]
  .filter(row=>Number.isInteger(row.round)&&row.round>=0&&Array.isArray(row.totals)&&row.totals.length>0&&row.totals.every(total=>typeof total.name==='string'&&total.name.trim()&&Number.isFinite(total.score)))
  .sort((a,b)=>a.round-b.round);
 if(!rounds.length)return {rounds:[] as number[],rows:[] as ScoreJourneyRow[]};
 const names=[...new Set(rounds.flatMap(row=>row.totals!.map(total=>total.name)))];
 const maxima=rounds.map(row=>Math.max(...row.totals!.map(total=>total.score)));
 const rows=names.map(name=>{
  const scores=rounds.map(row=>row.totals!.find(total=>total.name===name)?.score??null);
  return {name,scores,leaders:scores.map((score,index)=>score!==null&&score===maxima[index])};
 });
 const finalScore=(row:ScoreJourneyRow)=>[...row.scores].reverse().find(score=>score!==null)??-Infinity;
 rows.sort((a,b)=>finalScore(b)-finalScore(a)||a.name.localeCompare(b.name));
 return {rounds:rounds.map(row=>row.round),rows};
}
