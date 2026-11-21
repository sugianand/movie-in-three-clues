import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {guessDraftContext,readGuessDraft,writeGuessDraft} from '../lib/guess-draft.ts';

const game={code:'ABC123',round:0,roundStarted:100,status:'playing',stage:0,version:1,me:{id:'player1',attempt:-1,solved:false}};
const initial=guessDraftContext(game);
assert.equal(guessDraftContext({...game,stage:1,version:2}),initial,'Unlocking a clue preserves the unfinished title');
assert.equal(guessDraftContext({...game,stage:2,version:99}),initial,'Reconnect and polling preserve the same draft');

const raw=writeGuessDraft(game,'The Dark Knight');
assert.equal(readGuessDraft(raw,game),'The Dark Knight');
assert.equal(readGuessDraft(raw,{...game,stage:2}),'The Dark Knight');

for(const next of [
 {...game,round:1},
 {...game,roundStarted:200},
 {...game,status:'reveal'},
 {...game,code:'XYZ456'},
 {...game,me:{...game.me,id:'player2'}},
 {...game,me:{...game.me,attempt:0}},
 {...game,me:{...game.me,solved:true}},
 null,
]){
 assert.notEqual(guessDraftContext(next),initial,'New context or accepted attempt clears the old draft');
 assert.equal(readGuessDraft(raw,next),'');
}
assert.equal(readGuessDraft(raw,{...game,me:{...game.me,spectator:true}}),'');

for(const value of ['', ' ', 'x'.repeat(151)])assert.equal(writeGuessDraft(game,value),null);
for(const corrupt of [null,'bad','null','{}',JSON.stringify({value:12}), 'x'.repeat(1001)])assert.equal(readGuessDraft(corrupt,game),'');
assert.deepEqual(Object.keys(JSON.parse(raw)).sort(),['context','value']);
assert.ok(!raw.includes('token')&&!raw.includes('doubleDown'));
const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
assert.match(page,/useEffect\(\(\)=>\{if\(!game\)return;try\{const draft=writeGuessDraft/,'initial room loading cannot erase a recoverable draft');
console.log('PASS: unfinished guesses survive clue unlocks and clear on attempts, reveals, new rounds, or seat changes.');
