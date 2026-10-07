import assert from 'node:assert/strict';
import {normalizeRoomCode,uniquePlayerName} from '../lib/join.ts';
assert.equal(normalizeRoomCode('  ab c234  '),'ABC234');
assert.equal(normalizeRoomCode('https://example.com/?room=abc234'),'ABC234');
assert.equal(uniquePlayerName('Sam',['Sam']),'Sam 2');
assert.equal(uniquePlayerName('Sam',['Sam','sam 2']),'Sam 3');
assert.equal(uniquePlayerName('abcdefghijklmnopqrst',['abcdefghijklmnopqrst']),'abcdefghijklmnopqr 2');
console.log('PASS: pasted and lowercase codes, invite URL, duplicate display names, max name length.');
