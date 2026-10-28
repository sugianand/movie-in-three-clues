export type ShareMatch={status:string;totalRounds:number;matchMode:string;seriesGoal?:number;seriesMatches?:number;me:{id:string;spectator?:boolean};players:{id:string;name:string;score:number;seriesWins?:number}[];recap?:{solvers:{name:string}[]}[]};
export function seriesShareStatus(game:ShareMatch){
 const player=game.players.find(p=>p.id===game.me.id),goal=game.seriesGoal,matches=game.seriesMatches,wins=player?.seriesWins;
 if(typeof goal!=='number'||!Number.isInteger(goal)||goal<1||typeof matches!=='number'||!Number.isInteger(matches)||matches<0||typeof wins!=='number'||!Number.isInteger(wins)||wins<0)return null;
 return {champion:wins>=goal,line:`${wins>=goal?'Series champion':'Movie Night Series'}: ${wins}/${goal} wins · ${matches} ${matches===1?'match':'matches'}`};
}
export function matchShareText(game:ShareMatch,href:string){
 if(game.status!=='finished'||game.me.spectator)return null;
 const player=game.players.find(p=>p.id===game.me.id);if(!player)return null;
 const current=new URL(href);if(!['http:','https:'].includes(current.protocol))return null;
 const lines=['Three Clues · Movie night',`${game.totalRounds} rounds · ${game.matchMode==='teams'?'Team play':'Free-for-all'}`,`My score: ${player.score} points`];
 // Recaps from older backends may be absent: never invent a solve count.
 if(game.recap?.length===game.totalRounds){
  const solved=game.recap.filter(r=>r.solvers.some(s=>s.name===player.name)).length;
  lines.push(`Movies solved: ${solved}/${game.totalRounds}`);
 }
 const series=seriesShareStatus(game);if(series)lines.push(series.line);
 lines.push('Think you can beat me?',`${current.origin}/`);
 return lines.join('\n');
}
export async function shareMatchResult(text:string,platform:{share?:(data:{title:string;text:string})=>Promise<void>;copy?:(text:string)=>Promise<void>},native=true){
 if(native&&platform.share){try{await platform.share({title:'Three Clues · Movie night',text});return 'shared';}catch(e){if(e&&typeof e==='object'&&'name' in e&&e.name==='AbortError')return 'cancelled';}}
 if(platform.copy){try{await platform.copy(text);return 'copied';}catch{}}
 return 'manual';
}
