import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {findTitles} from '../lib/title-search.ts';
import {movies} from '../lib/movie-bank.ts';
const catalog=JSON.parse(readFileSync(new URL('../data/movie-titles.json',import.meta.url),'utf8'));
test('suggestions contain exactly the full movie bank metadata and no clues',()=>{
 assert.deepEqual(catalog,movies.map(({title,year,aliases})=>({title,year,aliases})));
 assert.ok(catalog.every(row=>Object.keys(row).sort().join(',')==='aliases,title,year'));
});
test('short input gives no suggestions, aliases and punctuation work',()=>{
 assert.deepEqual(findTitles(catalog,'a'),[]);
 assert.ok(findTitles(catalog,'dark knight').some(row=>row.title==='The Dark Knight'));
 assert.ok(findTitles(catalog,'baahubali').length);
 assert.ok(findTitles(catalog,'Baahu-bali').length);
 assert.ok(findTitles(catalog,'the').length<=6);
 assert.deepEqual(findTitles(catalog,'no such movie xyz'),[]);
});
test('prefix matches rank ahead of substring matches',()=>{
 const rows=[{title:'The Arrival',year:2000,aliases:[]},{title:'Arrival',year:2016,aliases:[]}];
 assert.equal(findTitles(rows,'arrival')[0].title,'Arrival');
});
