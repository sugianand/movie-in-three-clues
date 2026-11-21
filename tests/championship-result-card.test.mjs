import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
assert.match(page,/game\?\.status==='finished'&&seriesComplete&&!game\.me\.spectator&&<MultiplayerResultCard result=\{game\}\/>/);
assert.match(page,/!game\.me\.spectator&&!seriesComplete&&<><section className="rematch-ready"/);
console.log('PASS: spoiler-free result cards remain available after a series-clinching match.');
