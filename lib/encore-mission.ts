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
 invited:boolean;
};

export type EncoreMark='clear'|'miss';

export type EncoreProgress={
 version:5;
 lastMatchId:string;
 active:EncoreMission;
 activeInvited:boolean;
 lastOutcome:EncoreOutcome|null;
 streak:number;
 bestStreak:number;
 attempted:number;
 completed:number;
 recent:EncoreMark[];
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

export function encoreMissionProgress(mission:EncoreMission,solves:number,firstClues:number,totalRounds:number,roundsPlayed=0){
 const rounds=Math.max(1,Math.trunc(totalRounds)||1);
 const safeSolves=Math.max(0,Math.min(rounds,Math.trunc(solves)||0));
 const safeFirstClues=Math.max(0,Math.min(safeSolves,Math.trunc(firstClues)||0));
 const current=mission.kind==='first-clue'?safeFirstClues:safeSolves;
 const target=mission.kind==='perfect'?rounds:mission.kind==='solve-rate'?
  Math.min(rounds,Math.floor((mission.baselineRate??1)*rounds)+1):1;
 const unit=mission.kind==='first-clue'?'first-clue solve':target===1?'movie':'movies';
 const remaining=Math.max(0,rounds-Math.max(0,Math.min(rounds,Math.trunc(roundsPlayed)||0)));
 const needed=Math.max(0,target-current),reached=needed===0,possible=current+remaining>=target;
 const chance=remaining===1?`${needed} more in the final round.`:`${needed} more across ${remaining} rounds.`;
 return {current,target,reached,possible,label:reached?'Goal reached — finish the match.':possible?`${current} of ${target} ${unit} secured · ${chance}`:'Goal out of reach this match — finish for a fresh Encore.'};
}

export function advanceEncoreProgress(current:EncoreProgress|null,matchId:string,summary:PersonalMatchSummary,totalRounds:number):EncoreProgress{
 if(current?.lastMatchId===matchId)return current;
 const next=encoreMission(summary,totalRounds);
 const complete=current?.active?completesEncoreMission(current.active,summary,totalRounds):null;
 const streak=complete?(current?.streak??0)+1:complete===false?0:current?.streak??0;
 const mark:EncoreMark=complete?'clear':'miss';
 return {
  version:5,
  lastMatchId:matchId,
  active:next,
  activeInvited:false,
  lastOutcome:current?.active?{complete:!!complete,mission:current.active,invited:current.activeInvited}:null,
  streak,
  bestStreak:Math.max(current?.bestStreak??0,streak),
  attempted:(current?.attempted??0)+(complete===null?0:1),
  completed:(current?.completed??0)+(complete?1:0),
  recent:complete===null?(current?.recent??[]):[...(current?.recent??[]),mark].slice(-7),
 };
}

export function encoreRecord(progress:Pick<EncoreProgress,'attempted'|'completed'>){
 if(progress.attempted===0)return 'Record starts with this mission';
 return `${progress.completed}/${progress.attempted} cleared · ${Math.round(progress.completed/progress.attempted*100)}%`;
}

export function encoreRecentSummary(progress:Pick<EncoreProgress,'recent'>){
 const clears=progress.recent.filter(mark=>mark==='clear').length;
 return `Last ${progress.recent.length}: ${clears} cleared`;
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
  const value=JSON.parse(storage?.getItem(STORAGE_KEY)??'null') as (Omit<Partial<EncoreProgress>,'version'>&{version?:1|2|3|4|5})|null;
  if(!value||![1,2,3,4,5].includes(value.version??0)||typeof value.lastMatchId!=='string'||!validMission(value.active))return null;
  const version=value.version!;
  const outcome=value.lastOutcome;
  if(outcome!==null&&outcome!==undefined&&
   (!outcome||typeof outcome!=='object'||typeof outcome.complete!=='boolean'||!validMission(outcome.mission)||
    ('invited' in outcome&&typeof outcome.invited!=='boolean')))return null;
  const validCount=(count:unknown)=>typeof count==='number'&&Number.isInteger(count)&&count>=0;
  if(version!==1&&(!validCount(value.streak)||!validCount(value.bestStreak)||value.bestStreak! < value.streak!))return null;
  if(version>=3&&typeof value.activeInvited!=='boolean')return null;
  if(version>=4&&(!validCount(value.attempted)||!validCount(value.completed)||value.completed! > value.attempted!))return null;
  if(version===5&&(!Array.isArray(value.recent)||value.recent.length>7||value.recent.some(mark=>!['clear','miss'].includes(mark))))return null;
  return {version:5,lastMatchId:value.lastMatchId,active:value.active,activeInvited:version>=3?value.activeInvited!:false,lastOutcome:outcome?{...outcome,invited:outcome.invited??false}:null,streak:version===1?0:value.streak!,bestStreak:version===1?0:value.bestStreak!,attempted:version>=4?value.attempted!:0,completed:version>=4?value.completed!:0,recent:version===5?value.recent!:[]};
 }catch{return null;}
}

export function writeEncoreProgress(storage:StorageLike|undefined|null,value:EncoreProgress){
 try{storage?.setItem(STORAGE_KEY,JSON.stringify(value));return !!storage;}catch{return false;}
}

function invitedEncoreMission(kind:string,baselineRate?:number):EncoreMission|null{
 if(kind==='perfect')return {kind,title:'Hold the spotlight',target:'Solve every movie again.',detail:'A perfect slate is yours to defend.'};
 if(kind==='first-solve')return {kind,title:'Find your first frame',target:'Solve 1 movie next match.',detail:'One correct title starts the comeback.'};
 if(kind==='first-clue')return {kind,title:'Beat the reveal',target:'Land 1 first-clue solve.',detail:'Trust the first read before the later clues arrive.'};
 if(kind==='solve-rate'&&typeof baselineRate==='number'&&Number.isFinite(baselineRate)&&baselineRate>=0&&baselineRate<1)return {kind,title:'Raise the hit rate',target:`Beat your ${Math.round(baselineRate*100)}% solve rate.`,detail:'Any match length counts, so the goal stays fair if settings change.',baselineRate};
 return null;
}

export function encoreInviteFromUrl(href:string){
 let page:URL;try{page=new URL(href);}catch{return null;}if(!['http:','https:'].includes(page.protocol))return null;
 const kind=page.searchParams.get('encore')??'',rate=page.searchParams.get('rate');
 return invitedEncoreMission(kind,rate===null||rate.trim()===''?undefined:Number(rate));
}

export function acceptEncoreInvite(current:EncoreProgress|null,mission:EncoreMission):EncoreProgress{
 return {version:5,lastMatchId:'',active:mission,activeInvited:true,lastOutcome:null,streak:0,bestStreak:current?.bestStreak??0,attempted:current?.attempted??0,completed:current?.completed??0,recent:current?.recent??[]};
}

function encoreInviteUrl(mission:EncoreMission,href:string){
 let page:URL;try{page=new URL(href);}catch{return null;}if(!['http:','https:'].includes(page.protocol))return null;
 const invite=new URL('/',page.origin);invite.searchParams.set('encore',mission.kind);
 if(mission.kind==='solve-rate'&&typeof mission.baselineRate==='number')invite.searchParams.set('rate',String(mission.baselineRate));
 return invite.toString();
}

export function encoreShareText(progress:EncoreProgress,href:string){
 const invite=encoreInviteUrl(progress.active,href);if(!invite)return null;
 const streak=progress.streak===1?'1 mission':`${progress.streak} missions`,best=progress.bestStreak===1?'1 mission':`${progress.bestStreak} missions`;
 return ['Three Clues · My Encore',progress.active.target,`Current streak: ${streak} · Best: ${best}`,'Accept this next-show challenge:',invite].join('\n');
}

export function encoreOutcomeShareText(outcome:EncoreOutcome,href:string){
 const invite=encoreInviteUrl(outcome.mission,href);if(!invite)return null;
 return ['Three Clues · Friend Encore',outcome.complete?'Challenge cleared.':'Challenge missed — rematch accepted.',outcome.mission.target,'Try the same spoiler-free challenge:',invite].join('\n');
}

export async function shareEncore(text:string,platform:{share?:(data:{title:string;text:string})=>Promise<void>;copy?:(text:string)=>Promise<void>},native=true,title='Three Clues · My Encore'){
 if(native&&platform.share){try{await platform.share({title,text});return 'shared';}catch(error){if(error&&typeof error==='object'&&'name' in error&&error.name==='AbortError')return 'cancelled';}}
 if(platform.copy){try{await platform.copy(text);return 'copied';}catch{}}
 return 'manual';
}
