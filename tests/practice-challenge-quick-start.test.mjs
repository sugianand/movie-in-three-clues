import assert from 'node:assert/strict';
import fs from 'node:fs';
import {practiceNameKey,readPracticeName,writePracticeName} from '../lib/practice-challenge.ts';

const data=new Map();const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};
assert.equal(readPracticeName(storage),'');assert.equal(writePracticeName(storage,'  Movie   Buff  '),'Movie Buff');assert.equal(data.get(practiceNameKey),'Movie Buff');assert.equal(readPracticeName(storage),'Movie Buff');
assert.equal(writePracticeName(storage,'x'.repeat(21)),'');assert.equal(data.has(practiceNameKey),false);data.set(practiceNameKey,'x'.repeat(21));assert.equal(readPracticeName(storage),'');
const page=fs.readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8'),card=fs.readFileSync(new URL('../components/practice-challenge.tsx',import.meta.url),'utf8'),css=fs.readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(page,/readPracticeName\(localStorage\)/);assert.match(page,/writePracticeName\(localStorage,name\)/);assert.match(page,/run\('create',\{name:saved,mode:'practice'\}\)/);assert.match(page,/practiceName\.current\?\.focus/);assert.match(page,/PracticeChallenge onStart=\{startPractice\}/);assert.match(card,/Start today’s challenge/);assert.match(card,/onClick=\{onStart\}/);assert.match(css,/\.practice-challenge-start\{/);assert.match(css,/\.practice-name-note\{/);
console.log('Practice challenge quick-start checks passed.');
