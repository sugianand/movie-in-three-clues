import assert from 'node:assert/strict';
import {normalizeRoomCode,uniquePlayerName} from '../lib/join.ts';
assert.equal(normalizeRoomCode('  ab c234  '),'ABC234');
assert.equal(normalizeRoomCode('https://example.com/?room=abc234'),'ABC234');
for(const invite of [
 'example.com/?room=abc234',
 '/play?room=abc234',
 '?room=abc234',
 ' <https://example.com/?room=abc234> ',
 'example.com/play?source=chat&room=%61bc234#lobby',
])assert.equal(normalizeRoomCode(invite),'ABC234',invite);
for(const invalid of ['https://example.com','example.com/play','https://example.com/?other=abc234','?room=']){
 assert.equal(normalizeRoomCode(invalid),'',invalid);
}
assert.equal(uniquePlayerName('Sam',['Sam']),'Sam 2');
assert.equal(uniquePlayerName('Sam',['Sam','sam 2']),'Sam 3');
assert.equal(uniquePlayerName('abcdefghijklmnopqrst',['abcdefghijklmnopqrst']),'abcdefghijklmnopqr 2');
console.log('PASS: pasted and lowercase codes, invite URL, duplicate display names, max name length.');
