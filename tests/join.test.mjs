import assert from 'node:assert/strict';
import {normalizeRoomCode,uniquePlayerName,activeRoomUrl} from '../lib/join.ts';
assert.equal(normalizeRoomCode('  ab c234  '),'ABC234');
assert.equal(normalizeRoomCode('https://example.com/?room=abc234'),'ABC234');
assert.equal(normalizeRoomCode('example.com/?room=abc234'),'ABC234');
assert.equal(normalizeRoomCode('Join me: example.com/play?source=chat&room=ab%20c234'),'ABC234');
assert.equal(uniquePlayerName('Sam',['Sam']),'Sam 2');
assert.equal(uniquePlayerName('Sam',['Sam','sam 2']),'Sam 3');
assert.equal(uniquePlayerName('abcdefghijklmnopqrst',['abcdefghijklmnopqrst']),'abcdefghijklmnopqr 2');
console.log('PASS: pasted and lowercase codes, full/shortened invite URLs, wrapped links, duplicate display names, max name length.');
// A stale invite must not make refresh ignore the newly saved room session.
for(const href of ['https://example.com/?room=OLD234','https://example.com/','https://example.com/?room=OLD234&room=OLD567']){
 const saved={code:'NEW234',token:'private-session-token'};
 const next=new URL(activeRoomUrl(href,saved.code),href);
 const invite=normalizeRoomCode(next.searchParams.get('room')||'');
 assert.equal(invite,saved.code);
 assert(!invite||saved.code===invite,'refresh must restore the saved session');
 assert.deepEqual(next.searchParams.getAll('room'),[saved.code]);
 assert(!next.href.includes(saved.token));
}
assert.equal(activeRoomUrl('https://example.com/play?source=friend&room=OLD234#game-rules','NEW234'),'/play?source=friend&room=NEW234#game-rules');
console.log('PASS: active room replaces stale/duplicate invites, refresh session matches, path/query/hash preserved, no session token in URL.');
for(const value of ['https://example.com','example.com/play','https://example.com/?other=abc234','?room='])assert.equal(normalizeRoomCode(value),'');
assert.equal(normalizeRoomCode('<https://example.com/?room=abc234>'),'ABC234');
