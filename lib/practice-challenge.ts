import type {PracticeSession} from './practice-progress';

export type PracticeChallenge={key:'first-look'|'clean-sweep'|'sharp-cut'|'lightning-strike';title:string;description:string};
export const practiceChallengeHistoryKey='three-clues-practice-challenges-v1';
const dayMs=86_400_000;
const challenges:PracticeChallenge[]=[
 {key:'first-look',title:'First Look',description:'Solve at least 2 movies on clue one in a single practice match.'},
 {key:'clean-sweep',title:'Clean Sweep',description:'Solve every movie in one practice match.'},
 {key:'sharp-cut',title:'Sharp Cut',description:'Finish a practice match with at least 60% score efficiency.'},
 {key:'lightning-strike',title:'Lightning Strike',description:'Solve at least 5 movies in one Lightning practice match.'},
];

const dayNumber=(now:number)=>Math.floor(now/dayMs);
export const practiceDayKey=(now=Date.now())=>new Date(dayNumber(now)*dayMs).toISOString().slice(0,10);
export function practiceChallengeFor(now=Date.now()){const index=((dayNumber(now)%challenges.length)+challenges.length)%challenges.length;return challenges[index];}
export function practiceChallengeMatches(challenge:PracticeChallenge,session:PracticeSession){
 if(challenge.key==='first-look')return session.firstClue>=2;
 if(challenge.key==='clean-sweep')return session.solved===session.rounds;
 if(challenge.key==='sharp-cut')return session.efficiency>=60;
 return session.format==='lightning'&&session.solved>=5;
}
export function practiceChallengeProgress(challenge:PracticeChallenge,session:PracticeSession){
 if(challenge.key==='first-look'){const target=2,value=Math.min(session.firstClue,target),remaining=Math.max(0,target-session.firstClue);return {value,target,percent:value/target*100,label:`${session.firstClue} / ${target} first-clue solves`,guidance:remaining?`Solve ${remaining} more ${remaining===1?'movie':'movies'} on clue one in a single run.`:'First-look target reached.'};}
 if(challenge.key==='clean-sweep'){const target=session.rounds,value=Math.min(session.solved,target),remaining=Math.max(0,target-session.solved);return {value,target,percent:target?value/target*100:0,label:`${session.solved} / ${target} movies solved`,guidance:remaining?`Solve ${remaining} more ${remaining===1?'movie':'movies'} before the reveal.`:'Clean sweep secured.'};}
 if(challenge.key==='sharp-cut'){const target=60,value=Math.min(session.efficiency,target),remaining=Math.max(0,target-session.efficiency);return {value,target,percent:value/target*100,label:`${session.efficiency}% / ${target}% efficiency`,guidance:remaining?`Raise score efficiency by ${remaining} percentage ${remaining===1?'point':'points'}.`:'Efficiency target reached.'};}
 const target=5,value=session.format==='lightning'?Math.min(session.solved,target):0,remaining=Math.max(0,target-value);return {value,target,percent:value/target*100,label:session.format==='lightning'?`${session.solved} / ${target} Lightning solves`:'Lightning format required',guidance:session.format==='lightning'?(remaining?`Solve ${remaining} more ${remaining===1?'movie':'movies'} in one Lightning run.`:'Lightning target reached.'):'Switch Format to Lightning, then solve 5 movies in one run.'};
}
export function readPracticeChallengeDays(storage:Pick<Storage,'getItem'>){
 try{const value=JSON.parse(storage.getItem(practiceChallengeHistoryKey)??'[]');if(!Array.isArray(value))return [];return [...new Set(value.filter((day):day is string=>typeof day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(Date.parse(`${day}T00:00:00.000Z`))))].slice(0,90);}catch{return [];}
}
export function practiceChallengeStreak(days:string[],now=Date.now()){
 const completed=new Set(days.map(day=>Math.floor(Date.parse(`${day}T00:00:00.000Z`)/dayMs)));
 let cursor=dayNumber(now);if(!completed.has(cursor))cursor--;let streak=0;while(completed.has(cursor)){streak++;cursor--;}return streak;
}
export function practiceChallengeWeek(days:string[],now=Date.now()){
 const completed=new Set(days),today=dayNumber(now),labels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 return Array.from({length:7},(_,index)=>{const value=today-6+index,date=new Date(value*dayMs),day=date.toISOString().slice(0,10);return {day,label:labels[date.getUTCDay()],completed:completed.has(day),today:value===today};});
}
export function practiceChallengeState(storage:Pick<Storage,'getItem'>,now=Date.now()){
 const days=readPracticeChallengeDays(storage),day=practiceDayKey(now),week=practiceChallengeWeek(days,now),weeklyGoal=5;
 return {challenge:practiceChallengeFor(now),day,completed:days.includes(day),streak:practiceChallengeStreak(days,now),week,weeklyCompleted:week.filter(item=>item.completed).length,weeklyGoal};
}
export function recordPracticeChallenge(storage:Pick<Storage,'getItem'|'setItem'>,session:PracticeSession,now=Date.now()){
 const challenge=practiceChallengeFor(now),day=practiceDayKey(now),days=readPracticeChallengeDays(storage),alreadyCompleted=days.includes(day),qualifies=practiceChallengeMatches(challenge,session);
 const next=alreadyCompleted||!qualifies?days:[day,...days].slice(0,90);if(!alreadyCompleted&&qualifies)storage.setItem(practiceChallengeHistoryKey,JSON.stringify(next));
 return {challenge,day,completed:alreadyCompleted||qualifies,completedNow:!alreadyCompleted&&qualifies,streak:practiceChallengeStreak(next,now),progress:practiceChallengeProgress(challenge,session)};
}

export function practiceChallengeShareText(result:{challenge:PracticeChallenge;day:string;streak:number},href:string){
 const current=new URL(href);if(!['http:','https:'].includes(current.protocol))return null;
 return ['Three Clues · Daily Practice',`✅ ${result.challenge.title}`,`🔥 ${result.streak}-day challenge streak`,result.day,'No movie spoilers. Can you complete today’s challenge?',`${current.origin}/`].join('\n');
}
export async function sharePracticeChallenge(text:string,platform:{share?:(data:{title:string;text:string})=>Promise<void>;copy?:(text:string)=>Promise<void>}){
 if(platform.share){try{await platform.share({title:'Three Clues · Daily Practice',text});return 'shared';}catch(error){if(error&&typeof error==='object'&&'name' in error&&error.name==='AbortError')return 'cancelled';}}
 if(platform.copy){try{await platform.copy(text);return 'copied';}catch{}}
 return 'manual';
}
