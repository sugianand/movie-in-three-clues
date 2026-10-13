import type {GameSettings} from './game-settings.ts';

export type MultiplayerCardResult={
 status:string;
 totalRounds:number;
 matchMode:string;
 settings:Pick<GameSettings,'difficulty'|'speedBonus'>;
 winners:string[];
 me:{id:string};
 players:{id:string;name:string;score:number}[];
 teams:{name:string;score:number}[];
 recap:{round:number;title?:string;solvers:{name:string;clue:number}[];missed:string[]}[];
 fastest:{name:string;title?:string;clue:number;ms:number}|null;
};

const xml=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]!));
const short=(value:string,max:number)=>value.length>max?`${value.slice(0,max-1)}…`:value;
const time=(ms:number)=>`${(ms/1000).toFixed(1)}s`;

// Only the allowlisted fields below reach the SVG. Movie titles, clues and guesses never do.
export function multiplayerCardSvg(result:MultiplayerCardResult):string{
 if(result.status!=='finished')throw Error('Finish the match before sharing a result image.');
 if(![3,5,10].includes(result.totalRounds)||!['individual','teams'].includes(result.matchMode)||!result.winners.length||!result.players.length)throw Error('This match result cannot be shared as an image.');
 const me=result.players.find(player=>player.id===result.me.id);if(!me)throw Error('Your result is unavailable.');
 const rows=(result.matchMode==='teams'?result.teams:result.players).slice().sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
 if(!rows.length||rows.length>8||rows.some(row=>!Number.isFinite(row.score)))throw Error('This scoreboard cannot be shared as an image.');
 const trail=Array.from({length:result.totalRounds},(_,round)=>{
  const recap=result.recap.find(row=>row.round===round),solve=recap?.solvers.find(player=>player.name===me.name);
  return solve?.clue&&solve.clue>=1&&solve.clue<=3?String(solve.clue):'—';
 });
 const cellGap=12,cellWidth=Math.min(76,(920-cellGap*(trail.length-1))/trail.length),trailWidth=cellWidth*trail.length+cellGap*(trail.length-1),trailX=(1080-trailWidth)/2;
 const marks=trail.map((mark,index)=>`<g transform="translate(${trailX+index*(cellWidth+cellGap)} 530)"><rect width="${cellWidth}" height="76" rx="14" fill="${mark==='—'?'#151B29':'#4169FF'}" stroke="#59677F"/><text x="${cellWidth/2}" y="49" text-anchor="middle" font-size="27" font-weight="800">${mark}</text></g>`).join('');
 const rowHeight=Math.min(42,260/rows.length),scoreRows=rows.map((row,index)=>`<g transform="translate(100 ${688+index*rowHeight})"><text y="0" font-size="${rows.length>6?22:25}" fill="${index===0?'#F6F7FB':'#C9D3E5'}">${index+1}. ${xml(short(row.name,28))}</text><text x="880" y="0" text-anchor="end" font-size="${rows.length>6?22:25}" font-weight="800">${row.score} PTS</text></g>`).join('');
 const winner=xml(short(result.winners.join(' & '),48)),format=`${result.matchMode==='teams'?'TEAMS':'SOLO'} · ${result.totalRounds} ROUNDS · ${(result.settings.difficulty??'standard').toUpperCase()}${result.settings.speedBonus?' · SPEED BONUS':''}`;
 const fastest=result.fastest?`<text x="540" y="1010" text-anchor="middle" font-size="21" fill="#C9D3E5">FASTEST · ${xml(short(result.fastest.name,28))} · ${time(result.fastest.ms)} · CLUE ${result.fastest.clue}</text>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img" aria-label="Three Clues Movie Night result">
 <rect width="1080" height="1080" fill="#0B0D12"/><rect x="24" y="24" width="1032" height="1032" rx="32" fill="none" stroke="#4169FF" stroke-width="2"/>
 <g fill="#F6F7FB" font-family="Arial, Helvetica, sans-serif">
 <g transform="translate(80 60) scale(1.35)"><path d="M12 12H6v40h6M52 12h6v40h-6" fill="none" stroke="#F6F7FB" stroke-width="4"/><rect x="17" y="6" width="30" height="52" rx="7" fill="#4169FF"/><path d="M26 23a6 6 0 1 1 10 4.5c-3 2-4 3-4 7" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="43" r="2.5" fill="white"/></g>
 <text x="185" y="122" font-size="52" font-weight="900" letter-spacing="-2">THREE CLUES</text><path d="M80 174h920" stroke="#47546C"/>
 <text x="540" y="226" text-anchor="middle" font-size="21" letter-spacing="2.5" fill="#B8C8FF">${format}</text>
 <text x="540" y="292" text-anchor="middle" font-size="22" letter-spacing="3" fill="#C9D3E5">WINNER${result.winners.length>1?'S':''}</text><text x="540" y="365" text-anchor="middle" font-size="54" font-weight="900">${winner}</text>
 <rect x="80" y="410" width="920" height="82" rx="18" fill="#182446"/><text x="110" y="462" font-size="24" fill="#DAE3FF">MY SCORE · ${xml(short(me.name,28))}</text><text x="970" y="463" text-anchor="end" font-size="38" font-weight="900">${me.score} PTS</text>
 <text x="80" y="520" font-size="19" letter-spacing="2.5" fill="#B8C8FF">MY CLUE TRAIL · NUMBER = SOLVED ON CLUE</text>${marks}
 <text x="80" y="654" font-size="19" letter-spacing="2.5" fill="#B8C8FF">FINAL ${result.matchMode==='teams'?'TEAM ':''}STANDINGS</text>${scoreRows}
 ${fastest}<text x="540" y="1040" text-anchor="middle" font-size="18" fill="#8290A8">NO MOVIE SPOILERS · movie-in-three-clues.sugianand89.chatgpt.site</text>
 </g></svg>`;
}
