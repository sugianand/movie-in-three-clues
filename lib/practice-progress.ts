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

export type PracticeSession={id:string;playedAt:number;format:'classic'|'lightning';rounds:number;score:number;solved:number;firstClue:number;efficiency:number};
export const practiceHistoryKey='three-clues-practice-history-v1';
const validSession=(value:unknown):value is PracticeSession=>{const row=value as Partial<PracticeSession>|null;return !!row&&typeof row.id==='string'&&row.id.length>0&&Number.isSafeInteger(row.playedAt)&&row.playedAt!>=0&&(row.format==='classic'||row.format==='lightning')&&[3,5,10].includes(row.rounds??0)&&Number.isSafeInteger(row.score)&&row.score!>=0&&Number.isSafeInteger(row.solved)&&row.solved!>=0&&row.solved!<=row.rounds!&&Number.isSafeInteger(row.firstClue)&&row.firstClue!>=0&&row.firstClue!<=row.solved!&&Number.isSafeInteger(row.efficiency)&&row.efficiency!>=0&&row.efficiency!<=100;};
export function readPracticeHistory(storage:Pick<Storage,'getItem'>){try{const value=JSON.parse(storage.getItem(practiceHistoryKey)??'[]');return Array.isArray(value)?value.filter(validSession).slice(0,5):[];}catch{return [];}}
export function recordPracticeSession(storage:Pick<Storage,'getItem'|'setItem'>,session:PracticeSession){const sessions=readPracticeHistory(storage);if(sessions.some(row=>row.id===session.id))return sessions;const next=[session,...sessions].slice(0,5);storage.setItem(practiceHistoryKey,JSON.stringify(next));return next;}
export function summarizePracticeHistory(sessions:PracticeSession[]){return {sessions:sessions.length,solved:sessions.reduce((sum,row)=>sum+row.solved,0),averageEfficiency:sessions.length?Math.round(sessions.reduce((sum,row)=>sum+row.efficiency,0)/sessions.length):0,bestScore:sessions.reduce((best,row)=>Math.max(best,row.score),0)};}
