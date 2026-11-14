type DailyStreakState={
 streak:number;
 done:boolean;
 score:number;
};

export function dailyStreakStatus({streak,done,score}:DailyStreakState){
 if(!done)return streak>0
  ?`Solve today to grow this to ${streak+1} days.`
  :'Solve today to start a new streak.';
 if(score>0)return `Streak secured. Come back tomorrow for day ${streak+1}.`;
 return 'Tomorrow starts a fresh streak.';
}
