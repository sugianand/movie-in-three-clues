import assert from 'node:assert/strict';
import {dailyHomeStatus} from '../lib/daily-home.ts';

const stats={played:4,wins:3,streak:3,bestStreak:3,points:800};
assert.equal(dailyHomeStatus({done:false,score:0,stage:0,stats}),'3 day streak · Play to extend');
assert.equal(dailyHomeStatus({done:false,score:0,stage:1,stats}),'Clue 2 waiting · 3 day streak at stake');
assert.equal(dailyHomeStatus({done:true,score:200,stage:1,stats}),'3 day streak secured');
assert.equal(dailyHomeStatus({done:true,score:0,stage:2,stats:{...stats,streak:0}}),'Come back tomorrow for a fresh movie');
assert.equal(dailyHomeStatus({done:false,score:0,stage:0,stats:{...stats,streak:0}}),'Today’s movie is ready');
console.log('PASS: the landing page summarizes ready, in-progress, secured and completed Daily Premiere states.');
