export type DoubleDownReminder={
 label:string;
 detail:string;
 urgent:boolean;
};

type ReminderContext={
 round:number;
 totalRounds:number;
 stage:number;
 lastStage:number;
 used:boolean;
 armed:boolean;
 canGuess:boolean;
};

export function getDoubleDownReminder(context:ReminderContext):DoubleDownReminder|null{
 if(context.used||context.armed||!context.canGuess||context.round!==context.totalRounds-1)return null;
 if(context.stage>=context.lastStage)return {
  label:'Last chance to Double Down',
  detail:'Arm it before this guess or it expires at the reveal.',
  urgent:true
 };
 const guessesLeft=context.lastStage-context.stage+1;
 return {
  label:'Final round · Double Down still available',
  detail:`You have ${guessesLeft} guesses left to use your 2× play.`,
  urgent:false
 };
}
