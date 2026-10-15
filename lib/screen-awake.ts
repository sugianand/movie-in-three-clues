export const screenAwakeKey='three-clues-screen-awake';

export function parseScreenAwake(value:unknown){return value==='on';}

export function isActiveMatch(status:unknown){return status==='playing'||status==='reveal';}

export function shouldHoldScreenAwake(enabled:boolean,status:unknown,visibility:unknown){
 return enabled&&isActiveMatch(status)&&visibility==='visible';
}
