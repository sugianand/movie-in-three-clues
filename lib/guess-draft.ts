type GuessContext={code:string;round:number;roundStarted:number;status:string;me:{id:string;attempt:number;solved:boolean}};

/** Clue changes and polling updates must not erase a title still being typed. */
export function guessDraftContext(game:GuessContext|null|undefined){
 if(!game)return '';
 return JSON.stringify([game.code,game.me.id,game.round,game.roundStarted,game.status,game.me.attempt,game.me.solved]);
}
