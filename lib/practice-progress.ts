export type PracticeRecap={solvers:{clue:number;ms?:number}[];missed:string[]};

export function maxPracticeScore(rounds:number,format:string,speedBonus:boolean){
 const cluePoints=format==='lightning'?100:300;
 return Math.max(0,rounds)*cluePoints+cluePoints+(speedBonus?Math.max(0,rounds)*50:0);
}

export function summarizePractice(recap:PracticeRecap[],rounds:number,score:number,format:string,speedBonus=false){
 const solves=recap.flatMap(round=>round.solvers.slice(0,1));
 const maxScore=maxPracticeScore(rounds,format,speedBonus);
 const timed=solves.filter(s=>s.ms!==undefined);
 return {solved:solves.length,missed:Math.max(0,rounds-solves.length),firstClue:solves.filter(s=>s.clue===1).length,averageClue:solves.length?solves.reduce((sum,s)=>sum+s.clue,0)/solves.length:null,averageMs:timed.length?timed.reduce((sum,s)=>sum+s.ms!,0)/timed.length:null,efficiency:maxScore?Math.max(0,Math.min(100,Math.round(score/maxScore*100))):0,maxScore};
}

export const practiceBestKey=(format:string,rounds:number)=>`three-clues-practice-best:${format}:${rounds}`;
export function recordPracticeBest(storage:Pick<Storage,'getItem'|'setItem'>,key:string,score:number){const saved=Number(storage.getItem(key));const previous=Number.isFinite(saved)&&saved>0?saved:0;const best=Math.max(previous,score);if(best!==previous)storage.setItem(key,String(best));return {best,isNew:score>previous};}
