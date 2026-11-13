import type {PersonalMatchSummary} from './personal-match-summary';

export type EncoreMission={
 kind:'perfect'|'first-solve'|'first-clue'|'solve-rate';
 title:string;
 target:string;
 detail:string;
 baselineRate?:number;
};

export type EncoreOutcome={
 complete:boolean;
 mission:EncoreMission;
};

export type EncoreProgress={
 version:1;
 lastMatchId:string;
 active:EncoreMission;
 lastOutcome:EncoreOutcome|null;
};

type StorageLike={
 getItem(key:string):string|null;
 setItem(key:string,value:string):void;
};

const STORAGE_KEY='three-clues-encore-v1';

export function encoreMission(summary:PersonalMatchSummary,totalRounds:number):EncoreMission{
 if(summary.solves>=totalRounds)return {
  kind:'perfect',
  title:'Hold the spotlight',
  target:'Solve every movie again.',
  detail:'A perfect slate is yours to defend.',
 };
 if(summary.solves===0)return {
  kind:'first-solve',
  title:'Find your first frame',
  target:'Solve 1 movie next match.',
  detail:'One correct title starts the comeback.',
 };
 if(summary.firstClues===0)return {
  kind:'first-clue',
  title:'Beat the reveal',
  target:'Land 1 first-clue solve.',
  detail:'Trust the first read before the later clues arrive.',
 };
 const baselineRate=summary.solves/totalRounds;
 return {
  kind:'solve-rate',
  title:'Raise the hit rate',
  target:`Beat your ${Math.round(baselineRate*100)}% solve rate.`,
  detail:'Any match length counts, so the goal stays fair if settings change.',
  baselineRate,
 };
}

export function completesEncoreMission(mission:EncoreMission,summary:PersonalMatchSummary,totalRounds:number){
 if(mission.kind==='perfect')return summary.solves>=totalRounds;
 if(mission.kind==='first-solve')return summary.solves>=1;
 if(mission.kind==='first-clue')return summary.firstClues>=1;
 return typeof mission.baselineRate==='number'&&summary.solves/totalRounds>mission.baselineRate;
}

export function advanceEncoreProgress(current:EncoreProgress|null,matchId:string,summary:PersonalMatchSummary,totalRounds:number):EncoreProgress{
 if(current?.lastMatchId===matchId)return current;
 const next=encoreMission(summary,totalRounds);
 return {
  version:1,
  lastMatchId:matchId,
  active:next,
  lastOutcome:current?.active?{complete:completesEncoreMission(current.active,summary,totalRounds),mission:current.active}:null,
 };
}

function validMission(value:unknown):value is EncoreMission{
 if(!value||typeof value!=='object')return false;
 const mission=value as Partial<EncoreMission>;
 return ['perfect','first-solve','first-clue','solve-rate'].includes(mission.kind??'')&&
  typeof mission.title==='string'&&typeof mission.target==='string'&&typeof mission.detail==='string'&&
  (mission.kind!=='solve-rate'||(typeof mission.baselineRate==='number'&&Number.isFinite(mission.baselineRate)&&mission.baselineRate>=0&&mission.baselineRate<1));
}

export function readEncoreProgress(storage?:StorageLike|null):EncoreProgress|null{
 try{
  const value=JSON.parse(storage?.getItem(STORAGE_KEY)??'null') as Partial<EncoreProgress>|null;
  if(!value||value.version!==1||typeof value.lastMatchId!=='string'||!validMission(value.active))return null;
  const outcome=value.lastOutcome;
  if(outcome!==null&&outcome!==undefined&&
   (!outcome||typeof outcome!=='object'||typeof outcome.complete!=='boolean'||!validMission(outcome.mission)))return null;
  return {version:1,lastMatchId:value.lastMatchId,active:value.active,lastOutcome:outcome??null};
 }catch{return null;}
}

export function writeEncoreProgress(storage:StorageLike|undefined|null,value:EncoreProgress){
 try{storage?.setItem(STORAGE_KEY,JSON.stringify(value));return !!storage;}catch{return false;}
}
