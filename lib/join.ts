export function normalizeRoomCode(value:string){
 const text=value.trim().replace(/^<(.+)>$/,'$1');
 // Read the query independently of the origin: copied invites may omit the
 // scheme or contain only the path/query. Never use the hostname as a code.
 const queryStart=text.indexOf('?');
 if(queryStart!==-1){
  const params=new URLSearchParams(text.slice(queryStart+1).split('#')[0]);
  const code=params.get('room');
  return code?code.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6):'';
 }
 if(text.includes('://')||/[/.]/.test(text))return '';
 return text.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
}
export function uniquePlayerName(name:string,names:string[]){
 let result=name;let suffix=2;
 while(names.some(n=>n.toLowerCase()===result.toLowerCase())){const tail=` ${suffix++}`;result=name.slice(0,20-tail.length)+tail;}
 return result;
}
export function activeRoomUrl(href:string,code:string){
 const url=new URL(href);
 url.searchParams.set('room',code);
 return url.pathname+url.search+url.hash;
}
