import assert from 'node:assert/strict';
import {cinemaCueFor,parseCinemaSound} from '../lib/cinema-sound.ts';

const state=(overrides={})=>({status:'playing',round:0,roundStarted:1000,stage:0,me:{solved:false,spectator:false},...overrides});
assert.equal(parseCinemaSound(undefined),false);assert.equal(parseCinemaSound('off'),false);assert.equal(parseCinemaSound('on'),true);
assert.equal(cinemaCueFor(null,state()),null,'loading a room must stay quiet');
assert.equal(cinemaCueFor(state(),state()),null,'polling an unchanged room must stay quiet');
assert.equal(cinemaCueFor(state(),state({stage:1})),'clue');
assert.equal(cinemaCueFor(state(),state({me:{solved:true,spectator:false}})),'correct');
assert.equal(cinemaCueFor(state(),state({status:'reveal',me:{solved:true,spectator:false}})),'correct','the final solver still hears their correct cue');
assert.equal(cinemaCueFor(state(),state({me:{solved:true,spectator:true}})),null,'spectators never receive personal correct cues');
assert.equal(cinemaCueFor(state(),state({status:'reveal'})),'reveal');
assert.equal(cinemaCueFor(state({status:'reveal'}),state({status:'finished'})),'finish');
assert.equal(cinemaCueFor(state({status:'reveal'}),state({round:1,roundStarted:5000})),'round');
console.log('PASS: cinema sound stays opt-in and emits one cue for meaningful multiplayer transitions.');
