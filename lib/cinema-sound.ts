export const cinemaSoundKey='three-clues-cinema-sound';
export type CinemaCue='round'|'clue'|'correct'|'reveal'|'finish';
export type CinemaSoundSnapshot={status:string;round:number;roundStarted:number;stage:number;me:{solved:boolean;spectator:boolean}};

export function parseCinemaSound(value:unknown){return value==='on';}

export function cinemaCueFor(previous:CinemaSoundSnapshot|null,current:CinemaSoundSnapshot|null):CinemaCue|null{
 if(!previous||!current)return null;
 if(current.status==='finished'&&previous.status!=='finished')return 'finish';
 if(current.status==='playing'&&current.roundStarted!==previous.roundStarted)return 'round';
 if(previous.status==='playing'&&current.roundStarted===previous.roundStarted&&!current.me.spectator&&!previous.me.solved&&current.me.solved)return 'correct';
 if(current.status==='playing'&&previous.status==='playing'&&current.roundStarted===previous.roundStarted){
  if(current.stage>previous.stage)return 'clue';
 }
 if(current.status==='reveal'&&previous.status==='playing')return 'reveal';
 return null;
}
