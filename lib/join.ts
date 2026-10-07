export function normalizeRoomCode(value:string){
 const text=value.trim();
 try{const url=new URL(text);const code=url.searchParams.get('room');if(code)return code.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);}catch{}
 return text.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
}
export function uniquePlayerName(name:string,names:string[]){
 let result=name;let suffix=2;
 while(names.some(n=>n.toLowerCase()===result.toLowerCase())){const tail=` ${suffix++}`;result=name.slice(0,20-tail.length)+tail;}
 return result;
}
