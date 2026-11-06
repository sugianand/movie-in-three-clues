import assert from 'node:assert/strict';
import {getDoubleDownReminder} from '../lib/double-down-reminder.ts';

const base={round:4,totalRounds:5,stage:0,lastStage:2,used:false,armed:false,canGuess:true};
assert.deepEqual(getDoubleDownReminder(base),{
 label:'Final round · Double Down still available',
 detail:'You have 3 guesses left to use your 2× play.',
 urgent:false
});
assert.deepEqual(getDoubleDownReminder({...base,stage:2}),{
 label:'Last chance to Double Down',
 detail:'Arm it before this guess or it expires at the reveal.',
 urgent:true
});
assert.equal(getDoubleDownReminder({...base,round:3}),null);
assert.equal(getDoubleDownReminder({...base,used:true}),null);
assert.equal(getDoubleDownReminder({...base,armed:true}),null);
assert.equal(getDoubleDownReminder({...base,canGuess:false}),null);
console.log('PASS: final-round Double Down reminders escalate only while an unused guess is actionable.');
