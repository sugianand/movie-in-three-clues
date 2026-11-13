import type {PersonalMatchSummary} from './personal-match-summary';

export type EncoreMission={
 title:string;
 target:string;
 detail:string;
};

export function encoreMission(summary:PersonalMatchSummary,totalRounds:number):EncoreMission{
 if(summary.solves>=totalRounds)return {
  title:'Hold the spotlight',
  target:'Solve every movie again.',
  detail:'A perfect slate is yours to defend.',
 };
 if(summary.solves===0)return {
  title:'Find your first frame',
  target:'Solve 1 movie next match.',
  detail:'One correct title starts the comeback.',
 };
 if(summary.firstClues===0)return {
  title:'Beat the reveal',
  target:'Land 1 first-clue solve.',
  detail:'Trust the first read before the later clues arrive.',
 };
 const target=Math.min(totalRounds,summary.solves+1);
 return {
  title:'Add one to the reel',
  target:`Solve ${target} of ${totalRounds} movies.`,
  detail:'One more solve than this match keeps the story moving.',
 };
}
