type GuessContext={code:string;round:number;roundStarted:number;status:string;me:{id:string;attempt:number;solved:boolean}};
export const multiplayerDraftKey='three-clues-multiplayer-draft';
export function writeGuessDraft(game:(GuessContext&{me:GuessContext['me']&{spectator?:boolean}})|null,value:string){
 if(!game||game.status!=='playing'||game.me.solved||game.me.spectator||!value.trim()||value.length>150)return null;
 return JSON.stringify({context:guessDraftContext(game),value});
}
export function readGuessDraft(raw:string|null,game:Parameters<typeof writeGuessDraft>[0]){
 if(!raw||raw.length>1000)return '';
 try{const saved=JSON.parse(raw);return typeof saved?.value==='string'&&writeGuessDraft(game,saved.value)&&saved.context===guessDraftContext(game)?saved.value:'';}catch{return '';}
}

/** Clue changes and polling updates must not erase a title still being typed. */
export function guessDraftContext(game:GuessContext|null|undefined){
 if(!game)return '';
 return JSON.stringify([game.code,game.me.id,game.round,game.roundStarted,game.status,game.me.attempt,game.me.solved]);
}
