// Older backends omit serverNow; retain their existing device-clock behavior.
export function dailyClockOffset(serverNow:unknown,receivedAt:number){
 return typeof serverNow==='number'&&Number.isFinite(serverNow)?serverNow-receivedAt:0;
}

// Anchor once per server reply. Wall-clock adjustments must not expire a
// playable puzzle early or push the next premiere hours into the future.
export function createDailyClock(serverNow:unknown,receivedAt:number,elapsedAt:number){
 const epoch=receivedAt+dailyClockOffset(serverNow,receivedAt);
 return (elapsedNow:number)=>epoch+Math.max(0,elapsedNow-elapsedAt);
}
