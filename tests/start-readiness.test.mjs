import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {startReadiness} from '../lib/start-readiness.ts';

const room=(teams,mode='teams',queued=0)=>({players:teams.map(team=>({team})),spectators:Array.from({length:queued},()=>({})),settings:{mode}});
assert.match(startReadiness(room(['purple'])),/Invite/);
assert.equal(startReadiness({...room([],'individual'),practice:true}),'');
assert.equal(startReadiness(room(['purple','gold'])),'');
assert.match(startReadiness(room(['purple','purple'])),/2–0/);
assert.match(startReadiness(room(['purple','purple','gold'])),/2–1/);
assert.equal(startReadiness(room(['purple','purple','gold'],'teams',1)),'');
assert.equal(startReadiness(room(['purple','gold'],'teams',1)),'');
assert.equal(startReadiness(room(['purple'],'teams',1)),'');
assert.equal(startReadiness(room([undefined,undefined])),'');
assert.equal(startReadiness(room(['purple','purple'],'individual')),'');
assert.match(startReadiness(room(['purple','purple','purple','gold'],'teams',1)),/3–1/);
const original=room(['purple','purple','gold'],'teams',2),before=JSON.stringify(original);startReadiness(original);assert.equal(JSON.stringify(original),before);

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
const readiness=readFileSync(new URL('../lib/start-readiness.ts',import.meta.url),'utf8');
assert.match(page,/const startBlock=game\?startReadiness\(game\):''/);
assert.match(page,/disabled={busy\|\|!!startBlock\|\|!online}/);
assert.match(page,/disabled={busy\|\|!online\|\|!!startBlock\|\|game\.movieCount<5}/,'Settings start uses the same readiness guard');
assert.match(page,/\{startBlock&&<p className="notice" role="status">\{startBlock\}<\/p>\}/,'Settings explains the exact start blocker');
assert.doesNotMatch(page,/nextPlayerCount/,'No approximate player-count shortcut can bypass team readiness');
assert.match(readiness,/Current next-match split/);
console.log('PASS: match readiness previews balanced teams and queued seats without mutating the room.');
