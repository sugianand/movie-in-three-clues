import assert from 'node:assert/strict';
import {autoAdvanceDelayMs,autoAdvanceDestination,parseAutoAdvance,shouldAutoAdvance} from '../lib/auto-advance.ts';

assert.equal(autoAdvanceDelayMs,8000);
assert.equal(parseAutoAdvance('on'),true);assert.equal(parseAutoAdvance('off'),false);assert.equal(parseAutoAdvance(undefined),false);
assert.equal(shouldAutoAdvance(true,true,'reveal',true,false),true);
assert.equal(shouldAutoAdvance(false,true,'reveal',true,false),false);
assert.equal(shouldAutoAdvance(true,false,'reveal',true,false),false);
assert.equal(shouldAutoAdvance(true,true,'playing',true,false),false);
assert.equal(shouldAutoAdvance(true,true,'reveal',false,false),false);
assert.equal(shouldAutoAdvance(true,true,'reveal',true,true),false);
assert.equal(autoAdvanceDestination(0,5),'next round');assert.equal(autoAdvanceDestination(4,5),'results');
console.log('PASS: Auto Continue is opt-in, host-only, reveal-bound, connection-safe and labels the final results transition.');
