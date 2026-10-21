// Preview the server's queued-seat promotion and team assignment without changing seats.
export function startReadiness(game:{players:{team?:string}[];spectators:unknown[];settings:{mode?:string};practice?:boolean}){
 if(game.practice)return '';
 const players=game.players.map(player=>({...player}));
 const teams=game.settings.mode==='teams';
 let queued=Math.min(game.spectators.length,Math.max(0,8-players.length));
 if(teams&&(players.length+queued)%2)queued--;
 for(let i=0;i<queued;i++)players.push({});
 if(players.length<2)return 'Invite at least one more player.';
 if(!teams)return '';
 for(const player of players)if(!['purple','gold'].includes(player.team??''))player.team=players.filter(p=>p.team==='purple').length<=players.filter(p=>p.team==='gold').length?'purple':'gold';
 const purple=players.filter(p=>p.team==='purple').length,gold=players.filter(p=>p.team==='gold').length;
 return purple!==gold||!purple?`Teams need equal sizes. Current next-match split: ${purple}–${gold}. Change teams or invite another player.`:'';
}
