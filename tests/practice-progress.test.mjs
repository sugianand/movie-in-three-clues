import assert from 'node:assert/strict';
import {maxPracticeScore,practiceBestKey,recordPracticeBest,summarizePractice} from '../lib/practice-progress.ts';
const recap=[{solvers:[{clue:1,ms:4200}],missed:[]},{solvers:[{clue:2,ms:8300}],missed:[]},{solvers:[],missed:['Solo']}];
assert.deepEqual(summarizePractice(recap,3,500,'classic'),{solved:2,missed:1,firstClue:1,averageClue:1.5,averageMs:6250,efficiency:42,maxScore:1200});assert.equal(maxPracticeScore(10,'lightning',true),1600);assert.equal(practiceBestKey('classic',5),'three-clues-practice-best:classic:5');
const data=new Map();const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};assert.deepEqual(recordPracticeBest(storage,'best',420),{best:420,isNew:true});assert.deepEqual(recordPracticeBest(storage,'best',300),{best:420,isNew:false});assert.deepEqual(recordPracticeBest(storage,'best',500),{best:500,isNew:true});assert.equal(data.get('best'),'500');
console.log('PASS: Solo Practice summary, scoring ceiling and browser-local personal bests.');
