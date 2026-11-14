export type ScoreJourneyRound={round:number;totals?:{id?:string;name:string;score:number}[]};

export type ScoreJourneyRow={id?:string;name:string;scores:(number|null)[];leaders:boolean[]};

export function scoreJourney(recap:ScoreJourneyRound[]){
 const rounds=[...recap]
  .filter(row=>Number.isInteger(row.round)&&row.round>=0&&Array.isArray(row.totals)&&row.totals.length>0&&row.totals.every(total=>typeof total.name==='string'&&total.name.trim()&&Number.isFinite(total.score)))
  .sort((a,b)=>a.round-b.round);
 if(!rounds.length)return {rounds:[] as number[],rows:[] as ScoreJourneyRow[]};
 const entries=[...new Map(rounds.flatMap(row=>row.totals!).map(total=>[total.id?`id:${total.id}`:`name:${total.name}`,total])).values()];
 const maxima=rounds.map(row=>Math.max(...row.totals!.map(total=>total.score)));
 const rows=entries.map(entry=>{
  const scores=rounds.map(row=>row.totals!.find(total=>entry.id?total.id===entry.id:!total.id&&total.name===entry.name)?.score??null);
  return {...(entry.id?{id:entry.id}:{}),name:entry.name,scores,leaders:scores.map((score,index)=>score!==null&&score===maxima[index])};
 });
 const finalScore=(row:ScoreJourneyRow)=>[...row.scores].reverse().find(score=>score!==null)??-Infinity;
 rows.sort((a,b)=>finalScore(b)-finalScore(a)||a.name.localeCompare(b.name));
 return {rounds:rounds.map(row=>row.round),rows};
}
