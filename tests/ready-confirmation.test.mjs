import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readyConfirmationMessage,unreadyPlayerNames} from '../lib/ready-confirmation.ts';

const players=[{name:'Sugi',ready:true},{name:'Maya',ready:false},{name:'Jordan',ready:false}];
assert.deepEqual(unreadyPlayerNames(players),['Maya','Jordan']);
assert.deepEqual(unreadyPlayerNames(players.map(player=>({...player,ready:true}))),[]);
assert.equal(readyConfirmationMessage([]),'');
assert.equal(readyConfirmationMessage(['Maya']),'Maya hasn’t marked ready yet.');
assert.equal(readyConfirmationMessage(['Maya','Jordan']),'Maya and Jordan haven’t marked ready yet.');
assert.equal(readyConfirmationMessage(['Maya','Jordan','Ari']),'Maya, Jordan, and Ari haven’t marked ready yet.');

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
assert.match(page,/Start the game anyway/);
assert.match(page,/Start the rematch anyway/);
assert.match(page,/Wait for everyone/);
assert.match(page,/Start anyway/);
assert.equal((page.match(/onClick=\\{launchMatch\\}/g)??[]).length,3,'every host launch path uses the ready safeguard');
console.log('PASS: hosts see exactly who is unready before starting or replaying, and can wait or continue.');
