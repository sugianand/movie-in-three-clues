import {normalizeRoomCode,uniquePlayerName} from '@/lib/join';
import {roomDb} from '@/db/rooms';
import {player,newRoom,act,view,assignTeams,leaveRoom,type Room} from '@/lib/game';
export const dynamic='force-dynamic';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(req:Request){try{
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return reply({error:'Request origin not allowed.'},403);
 if(Number(req.headers.get('content-length')||0)>4096)return reply({error:'Request too large.'},413);
 const raw=await req.text();if(raw.length>4096)return reply({error:'Request too large.'},413);const b=JSON.parse(raw);const db=roomDb();
 if(b.action==='create'){
 if(b.mode!==undefined&&!['individual','teams'].includes(b.mode))throw Error('Choose Solo or Teams.');
 const p=player(b.name);for(let n=0;n<5;n++){const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const code=Array.from(crypto.getRandomValues(new Uint8Array(6)),x=>alphabet[x%alphabet.length]).join('');const r=newRoom(code,p);r.settings!.mode=b.mode??'individual';if(b.mode==='teams')assignTeams(r);
 const result=await db.prepare('INSERT OR IGNORE INTO rooms (code,state,version,created) VALUES (?,?,0,?)').bind(code,JSON.stringify(r),r.created).run();if(result.meta.changes)return reply({token:p.token,...view(r,p.token)});}
 throw Error('Could not create a room. Please try again.');
 }
 const code=typeof b.code==='string'?normalizeRoomCode(b.code):'';if(!/^[A-Z2-9]{6}$/.test(code))throw Error('Enter a valid six-character room code.');
 const joining=b.action==='join'?player(b.name):null;
 for(let n=0;n<8;n++){
 const row=await db.prepare('SELECT state,version,created FROM rooms WHERE code=?').bind(code).first<{state:string;version:number;created:number}>();if(!row||Date.now()-row.created>86400000)throw Error('Room not found or expired. Check the code or create a new room.');
 const r=JSON.parse(row.state) as Room;let token=b.token;
 if(b.action==='leave'){
  leaveRoom(r,b.token);
  const changed=r.players.length?await db.prepare('UPDATE rooms SET state=?,version=? WHERE code=? AND version=?').bind(JSON.stringify({...r,version:row.version+1}),row.version+1,code,row.version).run():await db.prepare('DELETE FROM rooms WHERE code=? AND version=?').bind(code,row.version).run();
  if(changed.meta.changes)return reply({left:true});continue;
 }

 if(joining){if(r.status!=='lobby')throw Error('This game has started. Join a new room.');if(r.players.length>=8)throw Error('This room is full (8 players).');joining.name=uniquePlayerName(typeof b.name==='string'?b.name.trim():joining.name,r.players.map(p=>p.name));r.players.push(joining);if(r.settings?.mode==='teams')assignTeams(r);token=joining.token;}
 else if(b.action!=='state')act(r,token,b);
 const data=view(r,token);const changed=JSON.stringify(r)!==row.state;
 if(!changed)return reply(data);
 r.version=row.version+1;const result=await db.prepare('UPDATE rooms SET state=?,version=? WHERE code=? AND version=?').bind(JSON.stringify(r),r.version,code,row.version).run();
 if(result.meta.changes)return reply({...data,version:r.version,...(joining?{token}: {})});
 }return reply({error:'The room is busy. Try that action again.'},409);
 }catch(e){const msg=e instanceof Error?e.message:'Unable to reach the game.';const infra=/D1|SQLITE|database|binding/i.test(msg);if(infra)console.error(e);return reply({error:infra?'The game is temporarily unavailable. Please try again.':msg},infra?503:400);}}
