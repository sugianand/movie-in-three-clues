import popularAmerican from '../data/popular-american.json' with {type:'json'};
import {defaultSettings,parseSettings,collections,eras,teams,clueSeconds,type GameSettings} from './game-settings.ts';
import {movies} from './movie-bank.ts';
export {movies};
const selectedAmerican=new Set(popularAmerican);
export const activeMovieIds=movies.flatMap((m,i)=>m.region==='indian'||selectedAmerican.has(m.title)?[i]:[]);

export type TeamScore={id:string;name:string;score:number;members:number};
export type Player={team?:string;id:string;token:string;name:string;score:number;solved:boolean;attempt:number;gain:number};
export type MovieResult={title:string;plays:number;players:number;first:number;second:number;third:number;missed:number};
export type Room={code:string;created:number;host:string;status:'lobby'|'playing'|'reveal'|'finished';round:number;started:number;deck:number[];players:Player[];version:number;seen?:number[];stats?:Record<string,MovieResult>;cycle?:number;settings?:GameSettings;notice?:string;teamNames?:Record<string,string>;matchMode?:string;result?:{winners:string[];teams:TeamScore[]}};
export function player(name:unknown,token=crypto.randomUUID()):Player{if(typeof name!=='string'||!name.trim()||name.trim().length>20)throw Error('Use a name between 1 and 20 characters.');return {id:crypto.randomUUID(),token,name:name.trim(),score:0,solved:false,attempt:-1,gain:0};}
export function newRoom(code:string,p:Player,now=Date.now()):Room{return {code,created:now,host:p.id,status:'lobby',round:0,started:0,deck:[],players:[p],version:0,seen:[],stats:{},cycle:1,settings:{...defaultSettings}};}
export function stage(r:Room,now:number){return Math.min(2,Math.max(0,Math.floor((now-r.started)/(clueSeconds(r.settings)*1000))));}
export function advance(r:Room,now:number){
 if(r.status!=='playing'||!(now-r.started>=clueSeconds(r.settings)*3000||r.players.every(p=>p.solved)))return;
 r.status='reveal';r.stats??={};const movie=movies[r.deck[r.round]];
 const result=r.stats[movie.title]??{title:movie.title,plays:0,players:0,first:0,second:0,third:0,missed:0};
 result.plays++;result.players+=r.players.length;
 for(const p of r.players){if(!p.solved)result.missed++;else if(p.gain===300)result.first++;else if(p.gain===200)result.second++;else result.third++;}
 r.stats[movie.title]=result;
}
export function eligibleMovies(settings:GameSettings=defaultSettings){return activeMovieIds.map(i=>({m:movies[i],i})).filter(({m})=>(settings.collection==='mixed'||m.region===settings.collection)&&(settings.era==='all'||(settings.era==='classic'?m.year<2010:m.year>=2010))).map(({i})=>i);}
export function chooseDeck(r:Room){
 const pool=eligibleMovies(r.settings);if(pool.length<5)throw Error('Choose a collection with at least five movies.');
 // Older saved rooms have no history; at least preserve their last full deck.
 const seen=new Set(r.seen??r.deck);const previous=new Set(r.deck);const deck:number[]=[];
 r.cycle??=1;
 while(deck.length<5){
  let available=pool.filter(i=>!seen.has(i)&&!deck.includes(i));
  if(!available.length){for(const i of pool)seen.delete(i);r.cycle++;available=pool.filter(i=>!deck.includes(i));}
  // Avoid the previous match at a pool boundary when other movies are available.
  const fresher=available.filter(i=>!previous.has(i));if(fresher.length)available=fresher;
  const pick=available[crypto.getRandomValues(new Uint32Array(1))[0]%available.length];deck.push(pick);seen.add(pick);
 }
 r.seen=[...seen];r.deck=deck;
}
const norm=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'').replace(/^the/,'');
function distance(a:string,b:string){let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1));row=next;}return row[b.length];}
export function matches(guess:string,m:typeof movies[number]){
 const x=norm(guess);const answers=[m.title,...m.aliases];
 if(answers.some(a=>norm(a)===x))return true;
 // An exact title for another film is never a typo for this one (Alien vs Aliens).
 if(movies.some(other=>other!==m&&[other.title,...other.aliases].some(a=>norm(a)===x)))return false;
 return answers.some(a=>{const y=norm(a);return (x.match(/\d+/g)||[]).join(',')===(y.match(/\d+/g)||[]).join(',')&&y.length>=5&&distance(x,y)<=(y.length>=12?2:1);});
}
export function assignTeams(r:Room){
 for(const p of r.players)if(!teams.some(t=>t.id===p.team))p.team=r.players.filter(x=>x.team==='purple').length<=r.players.filter(x=>x.team==='gold').length?'purple':'gold';
}
function teamScores(r:Room,hidden=false):TeamScore[]{return teams.map(t=>({...t,name:r.teamNames?.[t.id]??t.name,members:r.players.filter(p=>p.team===t.id).length,score:r.players.filter(p=>p.team===t.id).reduce((n,p)=>n+p.score-(hidden?p.gain:0),0)}));}
function winners(r:Room){const rows=r.matchMode==='teams'?teamScores(r):r.players;return rows.filter(p=>p.score===Math.max(...rows.map(x=>x.score))).map(p=>p.name);}
export function leaveRoom(r:Room,token:string){
 const p=r.players.find(p=>p.token===token);if(!p)throw Error('Player session not found.');
 const wasHost=p.id===r.host,wasRunning=r.status==='playing'||r.status==='reveal';
 r.players=r.players.filter(x=>x.id!==p.id);
 if(wasHost)r.host=r.players[0]?.id??'';
 if(r.status!=='lobby'){
  r.status='lobby';r.round=0;r.started=0;delete r.result;delete r.matchMode;
  r.players.forEach(x=>{x.score=0;x.gain=0;x.solved=false;x.attempt=-1;});
 }
 r.notice=`${p.name} left the room.${wasRunning?' The match ended; get ready for a new game.':''}${wasHost&&r.players.length?` ${r.players[0].name} is now the host.`:''}`;
}
export function act(r:Room,token:string,body:any,now=Date.now()){
 advance(r,now);const p=r.players.find(p=>p.token===token);if(!p)throw Error('Your player session is no longer available. Rejoin the room.');
 // Older open tabs omit this stamp; current clients bind actions to one round instance.
 if((body.action==='guess'||body.action==='next')&&body.roundStarted!==undefined&&body.roundStarted!==r.started)throw Error('That action belongs to an earlier round. Try again in the current round.');
 if(body.action==='rename-team'){
  if(r.status!=='lobby'&&r.status!=='finished')throw Error('Team names are locked during a game.');
  if(r.settings?.mode!=='teams'||!teams.some(t=>t.id===p.team))throw Error('Join a team before naming it.');
  if(typeof body.name!=='string')throw Error('Enter a team name.');
  const name=body.name.trim().replace(/\s+/g,' ');
  if(!name||name.length>24)throw Error('Use a team name between 1 and 24 characters.');
  if(teams.some(t=>t.id!==p.team&&(r.teamNames?.[t.id]??t.name).toLowerCase()===name.toLowerCase()))throw Error('The other team already has that name. Choose a different one.');
  r.teamNames??={};r.teamNames[p.team!]=name;return;
 }
 if(body.action==='team'){
  if(r.status!=='lobby'&&r.status!=='finished')throw Error('Teams are locked during a game.');
  if(r.settings?.mode!=='teams'||!teams.some(t=>t.id===body.team))throw Error('Choose a valid team in team mode.');
  p.team=body.team;return;
 }
 if(body.action==='settings'){
  if(p.id!==r.host)throw Error('Only the host can change the settings.');
  if(r.status!=='lobby'&&r.status!=='finished')throw Error('Settings can only change before or between games.');
  const settings=parseSettings(body.settings);if(eligibleMovies(settings).length<5)throw Error('Choose a collection with at least five movies.');r.settings=settings;if(settings.mode==='teams')assignTeams(r);return;
 }
 if(body.action==='start'||body.action==='next'||body.action==='replay'){
  if(p.id!==r.host)throw Error('Only the host can do that.');
  if(body.action==='start'||body.action==='replay'){
   if(r.status!==(body.action==='start'?'lobby':'finished'))throw Error('The game has already moved on.');if(r.players.length<2)throw Error('At least two players are needed.');
   if(r.settings?.mode==='teams'){assignTeams(r);const counts=teamScores(r).map(t=>t.members);if(!counts[0]||counts[0]!==counts[1])throw Error('Team play needs two equally sized teams (2, 4, 6 or 8 players). Choose your teams before starting.');}
   r.matchMode=r.settings?.mode??'individual';delete r.notice;delete r.result;chooseDeck(r);r.round=0;r.players.forEach(p=>p.score=0);
  }else {if(r.status!=='reveal'||body.round!==r.round)throw Error('Wait for the round to finish.');if(r.round===4){r.status='finished';r.result={winners:winners(r),teams:teamScores(r)};return;}r.round++;}
  r.status='playing';r.started=now;r.players.forEach(p=>{p.solved=false;p.attempt=-1;p.gain=0;});
 }else if(body.action==='guess'){
  if(r.status!=='playing')throw Error('This round has ended.');const s=stage(r,now);if(body.round!==r.round||body.stage!==s)throw Error('A new clue has appeared. Read it and submit again.');
  if(p.solved)throw Error('You already got this movie.');if(p.attempt===s)throw Error('You have used this guess. Wait for the next clue.');
  if(typeof body.guess!=='string'||!body.guess.trim()||body.guess.length>150)throw Error('Enter a movie title.');p.attempt=s;
  if(matches(body.guess,movies[r.deck[r.round]])){p.solved=true;p.gain=(3-s)*100;p.score+=p.gain;}advance(r,now);
 }else throw Error('Unknown action.');
}
export function view(r:Room,token:string,now=Date.now()){
 advance(r,now);const me=r.players.find(p=>p.token===token);if(!me)throw Error('Player session not found.');const s=stage(r,now);const reveal=r.status==='reveal'||r.status==='finished';const m=movies[r.deck[r.round]];
 const settings={...defaultSettings,...r.settings};const pool=eligibleMovies(settings);const seen=new Set(r.seen??r.deck);
 return {notice:r.notice??null,settings,teamOptions:teams.map(t=>({...t,name:r.teamNames?.[t.id]??t.name})),clueSeconds:clueSeconds(settings),matchMode:r.matchMode??settings.mode,teams:r.status==='finished'&&r.result?r.result.teams:teamScores(r,r.status==='playing'),poolOptions:collections.flatMap(c=>eras.map(e=>({collection:c.value,era:e.value,count:eligibleMovies({collection:c.value,era:e.value}).length}))),answerYear:reveal?m?.year:null,answerLanguage:reveal?m?.language:null,totalMovieCount:activeMovieIds.length,movieCount:pool.length,rotationCycle:r.cycle??1,unseenCount:pool.filter(i=>!seen.has(i)).length,report:r.status==='finished'&&me.id===r.host?Object.values(r.stats??{}):[],code:r.code,status:r.status,round:r.round,roundStarted:r.started,stage:s,serverNow:now,deadline:r.started+(s+1)*clueSeconds(settings)*1000,roundEnd:r.started+clueSeconds(settings)*3000,host:r.host,version:r.version,me:{team:me.team,id:me.id,solved:me.solved,attempt:me.attempt,gain:me.gain},clues:r.status==='lobby'?[]:m.clues.slice(0,reveal?3:s+1),answer:reveal?m.title:null,players:r.players.map(p=>({team:p.team,id:p.id,name:p.name,score:reveal||r.status==='lobby'?p.score:p.score-p.gain,gain:reveal?p.gain:0})),winners:r.status==='finished'?(r.result?.winners??winners(r)):[]};
}
