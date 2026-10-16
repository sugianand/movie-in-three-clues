import assert from 'node:assert/strict';
import {guessDraftContext} from '../lib/guess-draft.ts';

const game={code:'ABC123',round:0,roundStarted:100,status:'playing',stage:0,version:1,me:{id:'player1',attempt:-1,solved:false}};
const initial=guessDraftContext(game);
assert.equal(guessDraftContext({...game,stage:1,version:2}),initial,'Unlocking a clue preserves the unfinished title');
assert.equal(guessDraftContext({...game,stage:2,version:99}),initial,'Reconnect and polling preserve the same draft');
for(const next of [
 {...game,round:1},
 {...game,roundStarted:200},
 {...game,status:'reveal'},
 {...game,code:'XYZ456'},
 {...game,me:{...game.me,id:'player2'}},
 {...game,me:{...game.me,attempt:0}},
 {...game,me:{...game.me,solved:true}},
 null,
])assert.notEqual(guessDraftContext(next),initial,'New context or accepted attempt clears the old draft');
const missed={...game,me:{...game.me,attempt:0}};
assert.equal(guessDraftContext({...missed,stage:1}),guessDraftContext(missed),'A new clue is not a new attempt');
assert.equal(guessDraftContext(undefined),'');
console.log('PASS: unfinished guesses survive clue unlocks and clear on attempts, reveals, new rounds, or seat changes.');
