import assert from 'node:assert/strict';
import {dailyClockOffset} from '../lib/daily-clock.ts';
import {openDaily,dailyView} from '../lib/daily.ts';
import {isDailyView} from '../lib/daily-request.ts';
const server=Date.parse('2026-10-18T23:59:30Z'),reset=server+30000;
for(const skew of [-86400000,0,86400000]){
 const device=server+skew,offset=dailyClockOffset(server,device);
 assert.equal(reset-(device+offset),30000,'all devices see the same remaining day');
 assert.equal(device+31000+offset>=reset,true);
}
for(const missing of [undefined,null,NaN,Infinity,'invalid'])assert.equal(dailyClockOffset(missing,server),0);
const view=dailyView(openDaily(null,server),1,server);
assert.equal(view.serverNow,server);
assert.equal(view.nextAt,reset);
assert.equal(view.answer,null,'clock data never reveals the answer');
assert.equal(isDailyView(view),true);
assert.equal(isDailyView({...view,serverNow:undefined}),true);
assert.equal(isDailyView({...view,serverNow:Infinity}),false);
console.log('PASS: Daily countdown tolerates fast/slow device clocks and legacy backends.');
