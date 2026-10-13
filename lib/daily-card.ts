import type {DailyView} from './daily-types.ts';

// Explicitly allowlist public result fields. Never serialize a DailyView into an image.
export type DailyCardResult=Pick<DailyView,'done'|'date'|'number'|'score'|'marks'>;
export function dailyCardSvg(result:DailyCardResult):string{
 const {done,date,number,score,marks}=result;
 if(!done)throw Error('Finish today’s Premiere before sharing an image.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isSafeInteger(number)||number<1||number>999999||![0,100,200,300].includes(score)||marks.length<1||marks.length>3||marks.some(m=>!['hit','miss','skip'].includes(m)))throw Error('This result cannot be shared as an image.');
 const hit=marks.indexOf('hit');
 if(score?(hit!==marks.length-1||marks.filter(m=>m==='hit').length!==1||score!==(3-hit)*100):(hit!==-1||marks.length!==3))throw Error('This result is incomplete.');
 const cells=[0,1,2].map(i=>{
  const mark=marks[i],x=90+i*310,label=mark==='hit'?'SOLVED':mark==='miss'?'MISSED':mark==='skip'?'SKIPPED':'UNUSED';
  const icon=mark==='hit'?'<path d="m65 90 30 30 65-65"/>':mark==='miss'?'<path d="m78 65 64 64m0-64-64 64"/>':mark==='skip'?'<path d="M75 96h70"/>':'<circle cx="110" cy="96" r="5" fill="#AAB4C8" stroke="none"/>';
  return `<g transform="translate(${x} 510)"><rect width="280" height="230" rx="24" fill="${mark==='hit'?'#4169FF':'#151B29'}" stroke="#47546C"/><g transform="translate(30 0)" fill="none" stroke="#F6F7FB" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">${icon}</g><text x="140" y="175" text-anchor="middle" font-size="23" font-weight="700">${label}</text><text x="140" y="207" text-anchor="middle" fill="#C9D3E5" font-size="18">CLUE ${i+1}</text></g>`;
 }).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img" aria-label="Three Clues Daily Premiere result">
 <rect width="1080" height="1080" fill="#0B0D12"/><rect x="24" y="24" width="1032" height="1032" rx="32" fill="none" stroke="#4169FF" stroke-width="2"/>
 <g fill="#F6F7FB" font-family="Arial, Helvetica, sans-serif">
 <g transform="translate(80 65) scale(1.5)"><path d="M12 12H6v40h6M52 12h6v40h-6" fill="none" stroke="#F6F7FB" stroke-width="4"/><rect x="17" y="6" width="30" height="52" rx="7" fill="#4169FF"/><path d="M26 23a6 6 0 1 1 10 4.5c-3 2-4 3-4 7" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="43" r="2.5" fill="white"/></g>
 <text x="200" y="133" font-size="56" font-weight="900" letter-spacing="-2">THREE CLUES</text>
 <path d="M80 198h920" stroke="#47546C"/>
 <text x="80" y="254" font-size="24" letter-spacing="3" fill="#B8C8FF">DAILY PREMIERE #${number}</text><text x="1000" y="254" font-size="24" text-anchor="end" fill="#C9D3E5">${date}</text>
 <text x="80" y="421" font-size="150" font-weight="900">${score}</text><text x="375" y="418" font-size="32" fill="#C9D3E5">/ 300 POINTS</text>
 ${cells}
 <text x="540" y="825" text-anchor="middle" font-size="36" font-weight="700">${score===300?'One clue. That’s all I needed.':score?'Your turn. Can you beat my score?':'Three clues. A fresh chance tomorrow.'}</text>
 <text x="540" y="875" text-anchor="middle" font-size="23" fill="#C9D3E5">One movie every day. No spoilers here.</text>
 <rect x="80" y="930" width="920" height="70" rx="16" fill="#182446"/><text x="540" y="974" text-anchor="middle" font-size="24" fill="#DAE3FF">movie-in-three-clues.sugianand89.chatgpt.site</text>
 </g></svg>`;
}

export async function dailyCardPng(svg:string):Promise<Blob>{
 const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
 try{
  const image=new Image();
  await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(Error('Image preview could not load. Try sharing the text result.'));image.src=url;});
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1080;
  const context=canvas.getContext('2d');if(!context)throw Error('Image export is unavailable. You can still share the text result.');
  context.drawImage(image,0,0);
  return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image export failed. Try sharing the text result.')),'image/png'));
 }finally{URL.revokeObjectURL(url);}
}
