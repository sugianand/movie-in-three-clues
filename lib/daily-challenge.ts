const scores=[100,200,300] as const;

export type DailyChallengeState={
 headline:string;
 detail:string;
 outcome:'open'|'out-of-reach'|'won'|'tied'|'missed'|'expired';
};

export type DailyChallenge={target:number;date:string};

function validDate(value:string|null){
 if(!value||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const parsed=new Date(`${value}T00:00:00Z`);
 return !Number.isNaN(parsed.valueOf())&&parsed.toISOString().slice(0,10)===value;
}

export function dailyChallengeFromSearch(search:string):DailyChallenge|null{
 const params=new URLSearchParams(search),target=Number(params.get('challenge')),date=params.get('day');
 return scores.includes(target as (typeof scores)[number])&&validDate(date)?{target,date:date!}:null;
}

export function dailyChallengeLink(origin:string,score:number,date:string){
 const root=origin.replace(/\/$/,'');
 return scores.includes(score as (typeof scores)[number])&&validDate(date)
  ?`${root}/?daily=1&challenge=${score}&day=${date}`
  :`${root}/?daily=1`;
}

export function dailyChallengeState(target:number,score:number,done:boolean,stage:number,challengeDate:string,today:string):DailyChallengeState{
 if(challengeDate!==today){
  const label=new Date(`${challengeDate}T12:00:00Z`).toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
  return {headline:'Challenge expired',detail:`That target belonged to the ${label} Premiere. Today’s movie is a fresh challenge.`,outcome:'expired'};
 }
 const available=Math.max(100,Math.min(300,(3-stage)*100));
 if(!done&&available<target)return {
  headline:'Challenge target slipped away',
  detail:`The best remaining score is ${available} points. Keep playing for your streak and personal best.`,
  outcome:'out-of-reach'
 };
 if(!done)return {
  headline:`Match or beat ${target} points`,
  detail:target===300?'A first-clue solve ties the challenge.':target===200?'Solve by clue 2 to tie it.':'Any correct solve ties the challenge.',
  outcome:'open'
 };
 if(score>target)return {headline:'Challenge won',detail:`You beat the target by ${score-target} points.`,outcome:'won'};
 if(score===target)return {headline:'Challenge tied',detail:`You matched ${target} points.`,outcome:'tied'};
 return {headline:'Challenge missed',detail:`You finished ${target-score} points short.`,outcome:'missed'};
}
