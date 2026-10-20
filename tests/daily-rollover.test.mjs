import assert from 'node:assert/strict';
import {shouldAutoOpenDaily} from '../lib/daily-rollover.ts';

const date='2026-10-20',reset=Date.parse('2026-10-21T00:00:00Z');
assert.equal(shouldAutoOpenDaily(date,reset,reset-1,'',true),false,'waits for midnight');
assert.equal(shouldAutoOpenDaily(date,reset,reset,'',true),true,'opens at midnight');
assert.equal(shouldAutoOpenDaily(date,reset,reset+1000,date,true),false,'does not poll repeatedly when the server still returns yesterday');
assert.equal(shouldAutoOpenDaily(date,reset,reset+1000,'',false),false,'does not refresh a hidden tab');
assert.equal(shouldAutoOpenDaily('2026-10-21',reset+86400000,reset,'2026-10-20',true),false,'a fresh puzzle waits for its own reset');
console.log('PASS: Daily rollover opens once without hidden-tab or retry polling.');
