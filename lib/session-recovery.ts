export type RoomSession={code:string;token:string};
export type RecoverableSession={session:RoomSession;savedAt:number};
export const recentRoomKey='movie-clues-recent-room';
export const recentRoomLifetime=6*60*60*1000;

export function parseRecoverableSession(raw:string|null,now=Date.now()):RecoverableSession|null{
 if(!raw)return null;
 try{
  const value=JSON.parse(raw) as Partial<RecoverableSession>;
  const session=value.session;
  if(!session||typeof session.code!=='string'||!/^[A-Z0-9]{6}$/.test(session.code)||typeof session.token!=='string'||session.token.length<8||typeof value.savedAt!=='number'||value.savedAt>now+60_000||now-value.savedAt>recentRoomLifetime)return null;
  return {session:{code:session.code,token:session.token},savedAt:value.savedAt};
 }catch{return null;}
}

export function saveRecoverableSession(storage:Pick<Storage,'setItem'>,session:RoomSession,now=Date.now()){
 storage.setItem(recentRoomKey,JSON.stringify({session,savedAt:now}));
}

export function clearRecoverableSession(storage:Pick<Storage,'removeItem'>){storage.removeItem(recentRoomKey);}
