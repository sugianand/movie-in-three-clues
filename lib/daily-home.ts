import type {DailyView} from './daily-types.ts';

type DailyHomeState=Pick<DailyView,'done'|'score'|'stage'|'stats'>;

export function dailyHomeStatus({done,score,stage,stats}:DailyHomeState){
 if(done)return score>0
  ?`${stats.streak} day streak secured`
  :'Come back tomorrow for a fresh movie';
 if(stage>0)return `Clue ${stage+1} waiting${stats.streak>0?` · ${stats.streak} day streak at stake`:''}`;
 if(stats.streak>0)return `${stats.streak} day streak · Play to extend`;
 return 'Today’s movie is ready';
}
