export const autoAdvanceKey='three-clues-auto-continue';
export const autoAdvanceDelayMs=8000;
export const allReadyAdvanceDelayMs=3000;

export function parseAutoAdvance(value:unknown){return value==='on';}

export function shouldAutoAdvance(enabled:boolean,host:boolean,status:string|undefined,online:boolean,busy:boolean){
 return enabled&&host&&status==='reveal'&&online&&!busy;
}

export function autoAdvanceDestination(round:number,totalRounds:number){
 return round===totalRounds-1?'results':'next round';
}

export function autoAdvanceDelay(everyoneReady:boolean){
 return everyoneReady?allReadyAdvanceDelayMs:autoAdvanceDelayMs;
}
