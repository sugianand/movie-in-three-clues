import assert from 'node:assert/strict';
import {movies} from '../lib/game.ts';
const base=process.env.GAME_TEST_URL||'http://localhost:4173';
async function api(body,expected=200){const res=await fetch(base+'/api/game',{method:'POST',headers:{'Content-Type':'application/json','Origin':new URL(base).origin},body:JSON.stringify(body)});const text=await res.text();assert.equal(res.status,expected,text||JSON.stringify([...res.headers]));const data=JSON.parse(text);return data;}
const a=await api({action:'create',name:'Host'});const b=await api({action:'join',name:'Host',code:' '+a.code.toLowerCase().split('').join(' ')+' '});const host={code:a.code,token:a.token},guest={code:a.code,token:b.token};
const joined=await api({...host,action:'state'});assert.equal(joined.players.length,2);assert.deepEqual(joined.players.map(p=>p.name),['Host','Host 2']);
await api({...guest,action:'start'},400);let game=await api({...host,action:'start'});const deck=[];
await api({code:a.code,name:'Late',action:'join'},400);
for(let round=0;round<5;round++){
 assert.equal(game.round,round);assert.equal(game.answer,null);assert.equal(game.clues.length,1);assert(!JSON.stringify(game).includes(a.token));
 const movie=movies.find(m=>m.clues[0]===game.clues[0]);deck.push(movie.title);
 await api({...host,action:'guess',round,stage:0,guess:movie.title});
 const hidden=await api({...guest,action:'state'});assert.equal(hidden.players.find(p=>p.id===a.me.id).score,round*300);assert.equal(hidden.answer,null);
 await api({...host,action:'guess',round,stage:0,guess:movie.title},400);
 game=await api({...guest,action:'guess',round,stage:0,guess:movie.title});assert.equal(game.status,'reveal');assert.equal(game.answer,movie.title);
 game=await api({...host,action:'next',round});
}
assert.equal(game.status,'finished');assert.equal(game.report.length,5);assert(game.report.every(row=>row.first===2&&row.missed===0));assert.deepEqual((await api({...guest,action:'state'})).report,[]);assert.deepEqual(game.players.map(p=>p.score),[1500,1500]);assert.deepEqual(game.winners,['Host','Host 2']);assert.equal(new Set(deck).size,5);
game=await api({...host,action:'replay'});assert.equal(game.status,'playing');assert.equal(game.players[0].score,0);assert.equal(game.unseenCount,190);assert(!deck.includes(movies.find(m=>m.clues[0]===game.clues[0]).title));
const invited=await api({action:'create',name:'Invite host'});const inviteGuest=await api({action:'join',name:'Invite guest',code:base+'/?room='+invited.code});assert.equal(inviteGuest.code,invited.code);
const race=await api({action:'create',name:'Race host'});const results=await Promise.all(Array.from({length:10},(_,i)=>fetch(base+'/api/game',{method:'POST',headers:{'Content-Type':'application/json','Origin':new URL(base).origin},body:JSON.stringify({action:'join',code:race.code,name:'P'+i})}).then(async r=>({status:r.status,data:await r.json()}))));
const room=await api({action:'state',code:race.code,token:race.token});assert.equal(room.players.length,8);assert.equal(results.filter(r=>r.status===200).length,7);
const selected={collection:'indian',era:'modern',mode:'individual',difficulty:'normal'};
const sh=await api({action:'create',name:'Settings host'});const sg=await api({action:'join',name:'Settings guest',code:sh.code});
const hc={code:sh.code,token:sh.token},gc={code:sh.code,token:sg.token};
await api({...gc,action:'settings',settings:selected},400);
await api({...hc,action:'settings',settings:{collection:'invalid',era:'all'}},400);
await api({...hc,action:'settings',settings:selected});
assert.deepEqual((await api({...gc,action:'state'})).settings,selected);
let filtered=await api({...hc,action:'start'});assert.equal(filtered.movieCount,50);
await api({...hc,action:'settings',settings:{collection:'mixed',era:'all'}},400);
for(let round=0;round<5;round++){
 const m=movies.find(m=>m.clues[0]===filtered.clues[0]);assert.equal(m.region,'indian');assert(m.year>=2010);
 await api({...hc,action:'guess',round,stage:0,guess:m.title});
 const reveal=await api({...gc,action:'guess',round,stage:0,guess:m.title});assert.equal(reveal.answerYear,m.year);assert.equal(reveal.answerLanguage,m.language);
 filtered=await api({...hc,action:'next',round});
}
assert.equal(filtered.status,'finished');assert.deepEqual(filtered.players.map(p=>p.score),[1500,1500]);
const changed=await api({...hc,action:'settings',settings:{collection:'hollywood',era:'classic'}});assert.equal(changed.movieCount,50);
const again=await api({...hc,action:'replay'});assert.equal(again.movieCount,50);const nextMovie=movies.find(m=>m.clues[0]===again.clues[0]);assert.equal(nextMovie.region,'hollywood');assert(nextMovie.year<2010);
const th=await api({action:'create',name:'Team host',mode:'teams'}),tc={code:th.code,token:th.token};
await api({...tc,action:'settings',settings:{collection:'mixed',era:'all',mode:'teams',difficulty:'easy'}});
const tg=await api({action:'join',code:th.code,name:'Team guest'}),tgc={code:th.code,token:tg.token};
assert.equal(th.me.team,'purple');assert.equal(th.settings.mode,'teams');assert.equal(tg.me.team,'gold');
await api({...tc,action:'rename-team',name:'Reel Legends'});await api({...tgc,action:'rename-team',name:'Scene Stealers'});await api({...tgc,action:'rename-team',name:'reel legends'},400);
assert.deepEqual((await api({...tc,action:'state'})).teamOptions.map(t=>t.name),['Reel Legends','Scene Stealers']);await api({...tgc,action:'team',team:'purple'});await api({...tc,action:'start'},400);
await api({...tgc,action:'team',team:'gold'});let tm=await api({...tc,action:'start'});assert.equal(tm.clueSeconds,30);assert.equal(tm.roundEnd-tm.deadline,60000);
await api({...tgc,action:'team',team:'purple'},400);await api({...tc,action:'rename-team',name:'Too late'},400);
for(let round=0;round<5;round++){
 const title=movies.find(m=>m.clues[0]===tm.clues[0]).title;
 await api({...tc,action:'guess',round,stage:0,guess:title});
 const hidden=await api({...tgc,action:'state'});assert.equal(hidden.teams[0].score,round*300);
 await api({...tgc,action:'guess',round,stage:0,guess:title});tm=await api({...tc,action:'next',round});
}
assert.deepEqual(tm.winners,['Reel Legends','Scene Stealers']);assert.deepEqual(tm.teams.map(t=>t.score),[1500,1500]);
const lh=await api({action:'create',name:'Leaving host'}),lc={code:lh.code,token:lh.token};
const lb=await api({action:'join',code:lh.code,name:'Next host'}),lbc={code:lh.code,token:lb.token};
const lg=await api({action:'join',code:lh.code,name:'Leaving guest'}),lgc={code:lh.code,token:lg.token};
await api({code:lh.code,token:'not-a-player',action:'leave'},400);
await api({...lc,action:'leave'});await api({...lc,action:'state'},400);
const transferred=await api({...lbc,action:'state'});assert.equal(transferred.host,lb.me.id);assert.equal(transferred.players.length,2);
await api({...lbc,action:'start'});await api({...lgc,action:'leave'});
const stopped=await api({...lbc,action:'state'});assert.equal(stopped.status,'lobby');assert.equal(stopped.players.length,1);assert(stopped.players.every(p=>p.score===0));
const replacement=await api({action:'join',code:lh.code,name:'Replacement'});assert.equal(replacement.players.length,2);
await Promise.all([api({...lbc,action:'leave'}),api({code:lh.code,token:replacement.token,action:'leave'})]);
await api({action:'join',code:lh.code,name:'No room'},400);
const page=await fetch(base);assert.equal(page.status,200);const html=await page.text();assert(html.includes('landing-play'));assert(html.includes('>Play</button>'));assert(!html.includes('id="host-name"'));
await api({action:'create',name:'Invalid mode',mode:'bad'},400);
console.log('PASS: live HTTP two-player 5-round game, 1500-point shared winners, replay, reconnect, hidden data, 8-player concurrent capacity, host permissions, duplicate-name join, pasted codes, invite links, same-origin cookie-free requests and page render.');
