export const movieNightPassportKey='three-clues-movie-night-passport-v1';

export type MovieNightPassport={
 matches:number;
 wins:number;
 solves:number;
 firstClueSolves:number;
 perfectMatches:number;
 seriesTitles:number;
 bestTitleStreak:number;
 currentStreak:number;
 bestStreak:number;
 bestScore:number;
 fastestMs:number|null;
 attendanceStreak:number;
 bestAttendanceStreak:number;
 lastPlayedDay:string|null;
 recorded:string[];
};

export type PassportResult={
 status:string;
 code:string;
 seriesMatches:number;
 roundStarted?:number;
 seriesChampions?:string[];
 titleStreak?:number;
 totalRounds:number;
 matchMode:string;
 winners:string[];
 winnerIds?:string[];
 me:{id:string;spectator:boolean;team?:string};
 players:{id:string;name:string;score:number;seriesWins?:number;team?:string}[];
 teams:{id:string;name:string;score:number}[];
 recap:{round:number;solvers:{id?:string;name:string;clue:number;ms?:number}[];missed:string[]}[];
};

export type PassportAchievement={id:string;title:string;description:string;unlocked:boolean;current:number;target:number};

export const emptyMovieNightPassport=():MovieNightPassport=>({matches:0,wins:0,solves:0,firstClueSolves:0,perfectMatches:0,seriesTitles:0,bestTitleStreak:0,currentStreak:0,bestStreak:0,bestScore:0,fastestMs:null,attendanceStreak:0,bestAttendanceStreak:0,lastPlayedDay:null,recorded:[]});
const count=(value:unknown)=>typeof value==='number'&&Number.isFinite(value)&&value>=0?Math.floor(value):0;
const dayPattern=/^\d{4}-\d{2}-\d{2}$/;
const localDay=(timestamp:number)=>{const date=new Date(timestamp);if(!Number.isFinite(date.getTime()))return null;return `${date.getFullYear().toString().padStart(4,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;};
const dayNumber=(day:string)=>{if(!dayPattern.test(day))return null;const [year,month,date]=day.split('-').map(Number),value=Date.UTC(year,month-1,date);if(new Date(value).toISOString().slice(0,10)!==day)return null;return Math.floor(value/86400000);};

export function parseMovieNightPassport(value:unknown):MovieNightPassport{
 const source=value&&typeof value==='object'?value as Partial<MovieNightPassport>:{};
 const fastest=typeof source.fastestMs==='number'&&Number.isFinite(source.fastestMs)&&source.fastestMs>=0?source.fastestMs:null;
 const lastPlayedDay=typeof source.lastPlayedDay==='string'&&dayNumber(source.lastPlayedDay)!==null?source.lastPlayedDay:null;
 const recorded=Array.isArray(source.recorded)?[...new Set(source.recorded.filter((key):key is string=>typeof key==='string'&&key.length<=32))].slice(-32):[];
 const attendanceStreak=lastPlayedDay?count(source.attendanceStreak):0;
 return {matches:count(source.matches),wins:count(source.wins),solves:count(source.solves),firstClueSolves:count(source.firstClueSolves),perfectMatches:count(source.perfectMatches),seriesTitles:count(source.seriesTitles),bestTitleStreak:count(source.bestTitleStreak),currentStreak:count(source.currentStreak),bestStreak:count(source.bestStreak),bestScore:count(source.bestScore),fastestMs:fastest,attendanceStreak,bestAttendanceStreak:Math.max(attendanceStreak,count(source.bestAttendanceStreak)),lastPlayedDay,recorded};
}

export function passportAttendance(input:MovieNightPassport,now=Date.now()){
 const profile=parseMovieNightPassport(input),today=localDay(now),last=profile.lastPlayedDay;
 const gap=today&&last?dayNumber(today)!-dayNumber(last)!:null;
 const current=gap===0||gap===1?profile.attendanceStreak:0;
 const message=gap===0?`Come back tomorrow to keep your ${current}-day attendance streak.`:gap===1?`Play today to keep your ${current}-day attendance streak.`:'Play today to start a new attendance streak.';
 return {current,best:profile.bestAttendanceStreak,message};
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
  achievement('crown-collector','Crown Collector','Win a Movie Night Series.',profile.seriesTitles,1),
  achievement('dynasty','Dynasty','Win back-to-back Series titles.',profile.bestTitleStreak,2),
  achievement('encore-week','Encore Week','Play on three consecutive days.',profile.bestAttendanceStreak,3),
 ];
}

export function passportNextGoals(input:MovieNightPassport,limit=3){
 const size=Number.isSafeInteger(limit)?Math.max(0,Math.min(limit,9)):3;
 return passportAchievements(input).filter(item=>!item.unlocked).sort((a,b)=>{
  const progressA=a.current/a.target,progressB=b.current/b.target;
  return progressB-progressA||a.target-a.current-(b.target-b.current);
 }).slice(0,size);
}

export function newlyUnlockedPassportStamps(before:MovieNightPassport,after:MovieNightPassport){
 const earned=new Set(passportAchievements(before).filter(item=>item.unlocked).map(item=>item.id));
 return passportAchievements(after).filter(item=>item.unlocked&&!earned.has(item.id));
}

export function newPassportPersonalBests(before:MovieNightPassport,after:MovieNightPassport){
 const previous=parseMovieNightPassport(before),next=parseMovieNightPassport(after);
 if(previous.matches===0||next.matches<=previous.matches)return [];
 const bests:string[]=[];
 if(next.bestScore>previous.bestScore)bests.push(`Score · ${next.bestScore}`);
 if(next.fastestMs!==null&&(previous.fastestMs===null||next.fastestMs<previous.fastestMs))bests.push(`Fastest solve · ${(next.fastestMs/1000).toFixed(1)}s`);
 if(next.bestStreak>previous.bestStreak)bests.push(`Win streak · ${next.bestStreak}`);
 if(next.bestTitleStreak>previous.bestTitleStreak)bests.push(`Title streak · ${next.bestTitleStreak}`);
 if(next.bestAttendanceStreak>previous.bestAttendanceStreak)bests.push(`Attendance streak · ${next.bestAttendanceStreak} days`);
 return bests;
}

export function passportShareText(input:MovieNightPassport,href:string){
 const profile=parseMovieNightPassport(input);if(profile.matches===0)return null;
 let page:URL;try{page=new URL(href);}catch{return null;}if(!['http:','https:'].includes(page.protocol))return null;
 const achievements=passportAchievements(profile),unlocked=achievements.filter(item=>item.unlocked).length;
 const winRate=Math.round(Math.min(profile.wins,profile.matches)/profile.matches*100);
 const lines=['Three Clues · Movie Night Passport',`${profile.matches} ${profile.matches===1?'match':'matches'} · ${winRate}% wins`,`${profile.solves} movies solved · ${profile.firstClueSolves} on Clue 1`,`Best score: ${profile.bestScore} · Best win streak: ${profile.bestStreak}`,`Best attendance streak: ${profile.bestAttendanceStreak} ${profile.bestAttendanceStreak===1?'day':'days'}`,`Passport stamps: ${unlocked}/${achievements.length}`];
 if(profile.seriesTitles>0)lines.push(`${profile.seriesTitles} Series ${profile.seriesTitles===1?'title':'titles'} · Best title streak: ${profile.bestTitleStreak}`);
 lines.push('Build your own cinema record:',`${page.origin}/`);
 return lines.join('\n');
}

export async function shareMovieNightPassport(text:string,platform:{share?:(data:{title:string;text:string})=>Promise<void>;copy?:(text:string)=>Promise<void>},native=true){
 if(native&&platform.share){try{await platform.share({title:'Three Clues · Movie Night Passport',text});return 'shared';}catch(error){if(error&&typeof error==='object'&&'name' in error&&error.name==='AbortError')return 'cancelled';}}
 if(platform.copy){try{await platform.copy(text);return 'copied';}catch{}}
 return 'manual';
}

export function recordMovieNight(input:MovieNightPassport,result:PassportResult):MovieNightPassport{
 const profile=parseMovieNightPassport(input);
 if(result.status!=='finished'||result.me.spectator||!result.code||result.seriesMatches<1)return profile;
 const stamp=typeof result.roundStarted==='number'&&Number.isFinite(result.roundStarted)&&result.roundStarted>=0?Math.floor(result.roundStarted):`legacy:${result.seriesMatches}`;
 const key=`${result.code}:${stamp}`;
 if(profile.recorded.includes(key))return profile;
 const me=result.players.find(player=>player.id===result.me.id);if(!me)return profile;
 const mySolves=result.recap.flatMap(round=>round.solvers.filter(solver=>solver.id?solver.id===me.id:solver.name===me.name));
 const won=result.winnerIds?.length?result.winnerIds.includes(me.id):result.matchMode==='teams'?result.winners.includes(result.teams.find(team=>team.id===result.me.team)?.name??''):result.winners.includes(me.name);
 const currentStreak=won?profile.currentStreak+1:0;
 const playedDay=typeof result.roundStarted==='number'?localDay(result.roundStarted):null,previousDay=profile.lastPlayedDay?dayNumber(profile.lastPlayedDay):null,nextDay=playedDay?dayNumber(playedDay):null;
 const attendanceStreak=nextDay===null||previousDay!==null&&nextDay<previousDay?profile.attendanceStreak:nextDay===previousDay?profile.attendanceStreak:previousDay!==null&&nextDay===previousDay+1?profile.attendanceStreak+1:1;
 const lastPlayedDay=nextDay===null||previousDay!==null&&nextDay<previousDay?profile.lastPlayedDay:playedDay;
 const seriesChampion=typeof me.seriesWins==='number'&&me.seriesWins>=3&&(result.seriesChampions===undefined||result.seriesChampions.includes(me.name));
 const titleStreak=seriesChampion&&typeof result.titleStreak==='number'&&Number.isFinite(result.titleStreak)&&result.titleStreak>0?Math.floor(result.titleStreak):seriesChampion?1:0;
 const times=mySolves.flatMap(solve=>typeof solve.ms==='number'&&Number.isFinite(solve.ms)&&solve.ms>=0?[solve.ms]:[]),fastest=times.length?Math.min(...times):null;
 return {...profile,matches:profile.matches+1,wins:profile.wins+(won?1:0),solves:profile.solves+mySolves.length,firstClueSolves:profile.firstClueSolves+mySolves.filter(solve=>solve.clue===1).length,perfectMatches:profile.perfectMatches+(mySolves.length===result.totalRounds?1:0),seriesTitles:profile.seriesTitles+(seriesChampion?1:0),bestTitleStreak:Math.max(profile.bestTitleStreak,titleStreak),currentStreak,bestStreak:Math.max(profile.bestStreak,currentStreak),bestScore:Math.max(profile.bestScore,me.score),fastestMs:fastest===null?profile.fastestMs:profile.fastestMs===null?fastest:Math.min(profile.fastestMs,fastest),attendanceStreak,bestAttendanceStreak:Math.max(profile.bestAttendanceStreak,attendanceStreak),lastPlayedDay,recorded:[...profile.recorded,key].slice(-32)};
}
