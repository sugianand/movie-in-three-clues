export type DailyMilestoneInput={played:number;wins:number;bestStreak:number;points:number;counts:number[]};
export type DailyMilestone={id:string;name:string;description:string;earned:boolean;progress:string};

export function dailyMilestones(input:DailyMilestoneInput):DailyMilestone[]{
 const firstClue=input.counts[0]??0;
 return [
  {id:'opening-night',name:'Opening Night',description:'Finish your first Daily Premiere.',earned:input.played>=1,progress:`${Math.min(input.played,1)} / 1`},
  {id:'box-office-hit',name:'Box Office Hit',description:'Solve your first Daily Premiere.',earned:input.wins>=1,progress:`${Math.min(input.wins,1)} / 1`},
  {id:'first-look',name:'First Look',description:'Solve a Daily Premiere on clue one.',earned:firstClue>=1,progress:`${Math.min(firstClue,1)} / 1`},
  {id:'regular',name:'The Regular',description:'Finish seven Daily Premieres.',earned:input.played>=7,progress:`${Math.min(input.played,7)} / 7`},
  {id:'hot-streak',name:'Hot Streak',description:'Build a three-day winning streak.',earned:input.bestStreak>=3,progress:`${Math.min(input.bestStreak,3)} / 3`},
  {id:'headliner',name:'Headliner',description:'Earn 3,000 Daily Premiere points.',earned:input.points>=3000,progress:`${Math.min(input.points,3000).toLocaleString('en-US')} / 3,000`},
 ];
}
