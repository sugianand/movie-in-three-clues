export function dailySkipConfirmation(stage:number){
 if(stage===0||stage===1)return {
  title:`Skip to clue ${stage+2}?`,
  description:`This spends your current chance and lowers the available score from ${(3-stage)*100} to ${(2-stage)*100} points. You cannot return to this clue. Your win streak stays in play if you solve a later clue.`,
  confirm:`Skip · ${(2-stage)*100} points left`,
 };
 return {
  title:'Reveal today’s movie?',
  description:'You still have one guess worth 100 points. Revealing ends today’s Premiere with 0 points and ends your win streak. You can’t replay it on this daily pass.',
  confirm:'Reveal movie',
 };
}
