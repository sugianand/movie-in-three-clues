export const movieNightPassportKey='three-clues-movie-night-passport-v1';

export type MovieNightPassport={
 matches:number;
 wins:number;
 solves:number;
 firstClueSolves:number;
 perfectMatches:number;
 currentStreak:number;
 bestStreak:number;
 bestScore:number;
 fastestMs:number|null;
 recorded:string[];
};

export type PassportResult={
 status:string;
 code:string;
 seriesMatches?:number;
 roundStarted?:number;
 totalRounds:number;
 matchMode:string;
 winners:string[];
 me:{id:string;spectator:boolean;team?:string};
 players:{id:string;name:string;score:number;team?:string}[];
 teams:{id:string;name:string;score:number}[];
 recap:{round:number;solvers:{name:string;clue:number;ms?:number}[];missed:string[]}[];
};

export type PassportAchievement={
 id:string;
 title:string;
 description:string;
 unlocked:boolean;
 current:number;
 target:number;
};

export const emptyMovieNightPassport=():MovieNightPassport=>({matches:0,wins:0,solves:0,firstClueSolves:0,perfectMatches:0,currentStreak:0,bestStreak:0,bestScore:0,fastestMs:null,recorded:[]});
const count=(value:unknown)=>typeof value==='number'&&Number.isFinite(value)&&value>=0?Math.floor(value):0;

export function parseMovieNightPassport(value:unknown):MovieNightPassport{
 const source=value&&typeof value==='object'?value as Partial<MovieNightPassport>:{};
 const fastest=typeof source.fastestMs==='number'&&Number.isFinite(source.fastestMs)&&source.fastestMs>=0?source.fastestMs:null;
 const recorded=Array.isArray(source.recorded)?[...new Set(source.recorded.filter((key):key is string=>typeof key==='string'&&key.length<=32))].slice(-32):[];
 return {matches:count(source.matches),wins:count(source.wins),solves:count(source.solves),firstClueSolves:count(source.firstClueSolves),perfectMatches:count(source.perfectMatches),currentStreak:count(source.currentStreak),bestStreak:count(source.bestStreak),bestScore:count(source.bestScore),fastestMs:fastest,recorded};
}

export function passportAchievements(input:MovieNightPassport):PassportAchievement[]{
 const profile=parseMovieNightPassport(input);
 const achievement=(id:string,title:string,description:string,current:number,target:number):PassportAchievement=>({id,title,description,unlocked:current>=target,current:Math.min(current,target),target});
 return [
  achievement('opening-night','Opening Night','Finish your first match.',profile.matches,1),
  achievement('box-office-hit','Box Office Hit','Win your first match.',profile.wins,1),
  achievement('season-ticket','Season Ticket','Play five matches.',profile.matches,5),
  achievement('sharp-eye','Sharp Eye','Solve five movies on clue one.',profile.firstClueSolves,5),
  achievement('quick-cut','Quick Cut','Solve a movie in under five seconds.',profile.fastestMs!==null&&profile.fastestMs<5000?1:0,1),
  achievement('perfect-screening','Perfect Screening','Solve every movie in one match.',profile.perfectMatches,1),
 ];
}

export function recordMovieNight(input:MovieNightPassport,result:PassportResult):MovieNightPassport{
 const profile=parseMovieNightPassport(input);
 if(result.status!=='finished'||result.me.spectator||!result.code)return profile;
 // The deployed backend predates series counters. Its final-round start is
 // stable during result polling and changes on replay, so it identifies a match.
 const series=result.seriesMatches;
 const started=result.roundStarted;
 const matchId=typeof series==='number'&&Number.isSafeInteger(series)&&series>0
  ?String(series)
  :typeof started==='number'&&Number.isSafeInteger(started)&&started>0?`t${started}`:null;
 if(!matchId)return profile;
 const key=`${result.code}:${matchId}`;
 if(profile.recorded.includes(key))return profile;
 const me=result.players.find(player=>player.id===result.me.id);if(!me)return profile;
 const mySolves=result.recap.flatMap(round=>round.solvers.filter(solver=>solver.name===me.name));
 const won=result.matchMode==='teams'
  ?result.winners.includes(result.teams.find(team=>team.id===result.me.team)?.name??'')
  :result.winners.includes(me.name);
 const currentStreak=won?profile.currentStreak+1:0;
 const times=mySolves.flatMap(solve=>typeof solve.ms==='number'&&Number.isFinite(solve.ms)&&solve.ms>=0?[solve.ms]:[]);
 const fastest=times.length?Math.min(...times):null;
 return {...profile,
  matches:profile.matches+1,
  wins:profile.wins+(won?1:0),
  solves:profile.solves+mySolves.length,
  firstClueSolves:profile.firstClueSolves+mySolves.filter(solve=>solve.clue===1).length,
  perfectMatches:profile.perfectMatches+(mySolves.length===result.totalRounds?1:0),
  currentStreak,
  bestStreak:Math.max(profile.bestStreak,currentStreak),
  bestScore:Math.max(profile.bestScore,me.score),
  fastestMs:fastest===null?profile.fastestMs:profile.fastestMs===null?fastest:Math.min(profile.fastestMs,fastest),
  recorded:[...profile.recorded,key].slice(-32),
 };
}
