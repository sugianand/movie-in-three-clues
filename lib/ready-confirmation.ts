export type ReadyPlayer={name:string;ready:boolean};

export function unreadyPlayerNames(players:ReadyPlayer[]){
 return players.filter(player=>!player.ready).map(player=>player.name);
}

export function readyConfirmationMessage(names:string[]){
 if(names.length===0)return '';
 if(names.length===1)return `${names[0]} hasn’t marked ready yet.`;
 if(names.length===2)return `${names[0]} and ${names[1]} haven’t marked ready yet.`;
 return `${names.slice(0,-1).join(', ')}, and ${names.at(-1)} haven’t marked ready yet.`;
}
