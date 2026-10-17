import type {DailyResult} from './daily-types.ts';

export function dailyPerformance(history:DailyResult[]){
 const counts=[0,0,0,0];
 for(const row of history)counts[row.score===300?0:row.score===200?1:row.score===100?2:3]++;
 return {counts,played:history.length,average:history.length?Math.round(history.reduce((sum,row)=>sum+row.score,0)/history.length):0};
}
