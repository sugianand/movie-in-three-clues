import assert from 'node:assert/strict';
import {isActiveMatch,parseScreenAwake,shouldHoldScreenAwake} from '../lib/screen-awake.ts';

assert.equal(parseScreenAwake(undefined),false);assert.equal(parseScreenAwake('off'),false);assert.equal(parseScreenAwake('on'),true);
assert.equal(isActiveMatch('lobby'),false);assert.equal(isActiveMatch('finished'),false);
assert.equal(isActiveMatch('playing'),true);assert.equal(isActiveMatch('reveal'),true);
assert.equal(shouldHoldScreenAwake(true,'playing','visible'),true);
assert.equal(shouldHoldScreenAwake(true,'reveal','visible'),true);
assert.equal(shouldHoldScreenAwake(false,'playing','visible'),false);
assert.equal(shouldHoldScreenAwake(true,'playing','hidden'),false);
assert.equal(shouldHoldScreenAwake(true,'finished','visible'),false);
console.log('PASS: screen wake lock stays opt-in and is limited to visible active matches.');
