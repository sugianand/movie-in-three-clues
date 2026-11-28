import assert from 'node:assert/strict';
import {dailyStreakStatus} from '../lib/daily-streak.ts';

assert.equal(dailyStreakStatus({streak:4,done:false,score:0}),'Solve today to grow this to 5 days.');
assert.equal(dailyStreakStatus({streak:0,done:false,score:0}),'Solve today to start a new streak.');
assert.equal(dailyStreakStatus({streak:5,done:true,score:200}),'Streak secured. Come back tomorrow for day 6.');
assert.equal(dailyStreakStatus({streak:0,done:true,score:0}),'Tomorrow starts a fresh streak.');
console.log('PASS: Daily Premiere explains how today affects an active, secured, new or ended streak.');
