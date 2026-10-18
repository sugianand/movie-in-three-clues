// Older backends omit serverNow; retain their existing device-clock behavior.
export function dailyClockOffset(serverNow:unknown,receivedAt:number){
 return typeof serverNow==='number'&&Number.isFinite(serverNow)?serverNow-receivedAt:0;
}
