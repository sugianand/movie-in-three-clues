import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clearRecoverableSession,parseRecoverableSession,recentRoomKey,recentRoomLifetime,saveRecoverableSession} from '../lib/session-recovery.ts';

test('recent room sessions round-trip without player or answer data',()=>{
 const values=new Map();const storage={setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
 const session={code:'ABC234',token:'secret-token'};saveRecoverableSession(storage,session,1_000);
 assert.deepEqual(parseRecoverableSession(values.get(recentRoomKey),1_001),{session,savedAt:1_000});
 assert.deepEqual(Object.keys(JSON.parse(values.get(recentRoomKey))).sort(),['savedAt','session']);
 clearRecoverableSession(storage);assert.equal(values.has(recentRoomKey),false);
});

test('expired, malformed and suspicious sessions cannot be resumed',()=>{
 const valid={session:{code:'ABC234',token:'secret-token'},savedAt:1_000};
 assert.equal(parseRecoverableSession(JSON.stringify(valid),1_000+recentRoomLifetime+1),null);
 assert.equal(parseRecoverableSession(JSON.stringify({...valid,savedAt:70_001}),1_000),null);
 assert.equal(parseRecoverableSession(JSON.stringify({...valid,session:{code:'bad',token:'secret-token'}}),1_001),null);
 assert.equal(parseRecoverableSession(JSON.stringify({...valid,session:{code:'ABC234',token:'short'}}),1_001),null);
 assert.equal(parseRecoverableSession('{bad json',1_001),null);
 assert.equal(parseRecoverableSession(null,1_001),null);
});
