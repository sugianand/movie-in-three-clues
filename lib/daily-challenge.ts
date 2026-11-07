const scores=[100,200,300] as const;

export type DailyChallengeState={
 headline:string;
 detail:string;
 outcome:'open'|'won'|'tied'|'missed';
};

export function dailyChallengeTarget(search:string){
 const value=Number(new URLSearchParams(search).get('challenge'));
 return scores.includes(value as (typeof scores)[number])?value:null;
}

export function dailyChallengeLink(origin:string,score:number){
 const root=origin.replace(/\/$/,'');
 return scores.includes(score as (typeof scores)[number])
  ?`${root}/?daily=1&challenge=${score}`
  :`${root}/?daily=1`;
}

export function dailyChallengeState(target:number,score:number,done:boolean):DailyChallengeState{
 if(!done)return {
  headline:`Match or beat ${target} points`,
  detail:target===300?'A first-clue solve ties the challenge.':target===200?'Solve by clue 2 to tie it.':'Any correct solve ties the challenge.',
  outcome:'open'
 };
 if(score>target)return {headline:'Challenge won',detail:`You beat the target by ${score-target} points.`,outcome:'won'};
 if(score===target)return {headline:'Challenge tied',detail:`You matched ${target} points.`,outcome:'tied'};
 return {headline:'Challenge missed',detail:`You finished ${target-score} points short.`,outcome:'missed'};
}
