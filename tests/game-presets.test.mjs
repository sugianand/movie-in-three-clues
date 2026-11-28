import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {applyGamePreset,gamePresets,matchesGamePreset} from '../lib/game-presets.ts';
import {parseSettings} from '../lib/game-settings.ts';

const current={rounds:10,collection:'indian',era:'modern',mode:'individual',difficulty:'hard',speedBonus:true};

test('presets cover quick, team and marathon movie nights',()=>{
 assert.deepEqual(gamePresets.map(({id})=>id),['quick-cut','team-feature','marathon']);
 assert.deepEqual(gamePresets.map(({settings})=>settings.rounds),[3,5,10]);
});

test('applying a preset preserves the selected movie pool',()=>{
 for(const preset of gamePresets){
  const result=applyGamePreset(current,preset.id);
  assert.equal(result.collection,'indian');
  assert.equal(result.era,'modern');
  assert.doesNotThrow(()=>parseSettings(result));
  assert.equal(matchesGamePreset(result,preset.id),true);
 }
 assert.deepEqual(applyGamePreset(current,'team-feature'),{...current,rounds:5,mode:'teams',difficulty:'normal',speedBonus:false});
});

test('matching accounts for stored defaults and rejects other configurations',()=>{
 assert.equal(matchesGamePreset({collection:'mixed',era:'all'},'team-feature'),false);
 assert.equal(matchesGamePreset({...current,rounds:3,difficulty:'normal',speedBonus:false},'quick-cut'),true);
 assert.throws(()=>applyGamePreset(current,'missing'),/valid game preset/);
});

test('the settings panel exposes accessible host-only preset controls',async()=>{
 const [page,css]=await Promise.all([readFile(new URL('../app/page.tsx',import.meta.url),'utf8'),readFile(new URL('../app/globals.css',import.meta.url),'utf8')]);
 assert.match(page,/aria-label="Quick game presets"/);
 assert.match(page,/aria-pressed=\{matchesGamePreset/);
 assert.match(page,/disabled=\{!host\|\|busy\|\|!online\}/);
 assert.match(page,/applyGamePreset\(game\.settings,preset\.id\)/);
 assert.match(css,/\.game-preset-grid button\[aria-pressed="true"\]/);
 assert.match(css,/@media\(max-width:620px\)/);
});
