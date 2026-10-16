import assert from 'node:assert/strict';
import {createAutoAdvanceClock} from '../lib/auto-advance-clock.ts';

const clock=createAutoAdvanceClock(8000);
assert.deepEqual(clock.tick(0,true),{remaining:8,advance:false});
assert.deepEqual(clock.tick(7000,true),{remaining:1,advance:false});
// A suspended/background tab can receive a delayed timer after the deadline.
assert.deepEqual(clock.tick(20000,false),{remaining:null,advance:false});
assert.deepEqual(clock.tick(60000,true),{remaining:8,advance:false});
assert.deepEqual(clock.tick(67000,true),{remaining:1,advance:false});
assert.deepEqual(clock.tick(68000,true),{remaining:0,advance:true});
assert.deepEqual(clock.tick(69000,true),{remaining:null,advance:false});
assert.deepEqual(clock.tick(70000,false),{remaining:null,advance:false});
assert.deepEqual(clock.tick(80000,true),{remaining:null,advance:false});
// Repeated interruptions always give players the full reveal window.
const interrupted=createAutoAdvanceClock(8000);
interrupted.tick(0,true);interrupted.tick(5000,false);
assert.equal(interrupted.tick(9000,true).remaining,8);
interrupted.tick(10000,false);
assert.equal(interrupted.tick(11000,true).remaining,8);
assert.equal(interrupted.tick(18999,true).advance,false);
assert.equal(interrupted.tick(19000,true).advance,true);
console.log('PASS: Background suspension resets the reveal countdown and each clock advances at most once.');
