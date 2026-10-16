export function roomInvite(href:string,code:string){
 if(!/^[A-Z0-9]{6}$/.test(code))throw new Error('Invalid room code');
 const current=new URL(href);
 if(!['https:','http:'].includes(current.protocol))throw new Error('Invalid game URL');
 const url=new URL(current.pathname,current.origin);
 url.searchParams.set('room',code);
 return {title:'Three Clues · Movie night',text:`Join my Three Clues movie night! Room code: ${code}`,url:url.toString()};
}
type Invite=ReturnType<typeof roomInvite>;
type SharePlatform={share?:(data:Invite)=>Promise<void>;copy?:(text:string)=>Promise<void>};
export async function sendRoomInvite(invite:Invite,platform:SharePlatform,preferNative=true){
 if(preferNative&&platform.share){
  try{await platform.share(invite);return 'shared' as const;}
  catch(error){if(error&&typeof error==='object'&&'name' in error&&error.name==='AbortError')return 'cancelled' as const;}
 }
 if(platform.copy){try{await platform.copy(invite.url);return 'copied' as const;}catch{}}
 return 'manual' as const;
}
