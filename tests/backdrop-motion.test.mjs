import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';

const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
const component=readFileSync(new URL('../components/cinema-backdrop.tsx',import.meta.url),'utf8');
const wall=readFileSync(new URL('../lib/poster-wall.ts',import.meta.url),'utf8');
const posters=JSON.parse(wall.match(/= (\[.*\]);/s)[1]);
const size=Number(component.match(/WALL_SIZE = (\d+)/)[1]);

assert.ok(posters.length>=190,`the wall draws from close to 200 movies (has ${posters.length})`);
assert.equal(new Set(posters).size,posters.length,'no movie is listed twice');
for(const p of posters) assert.ok(existsSync(new URL(`../public/posters/${p}.webp`,import.meta.url)),`${p}.webp exists`);
assert.equal(size%3,0,'each visit shows a multiple of 3 posters so all three rows stay full');
assert.match(component,/Math\.random/,'each page load picks a fresh random set');
assert.match(component,/useEffect\(/,'the random pick happens after mount so server and client markup match');
assert.doesNotMatch(component,/movie-poster-wall|cinema-poster-original/,'the old slanted collage is gone');
assert.match(css,/\.cinema-backdrop-reel\{[^}]*gap:0/,'posters sit flush with no black gaps');
assert.match(css,/to\{transform:translate3d\(-50%,0,0\)\}/,'reel scrolls one full copy for a seamless loop');
assert.match(css,/prefers-reduced-motion:reduce\)\{\.cinema-backdrop-reel\{animation:none/,'reduced-motion visitors get a still wall');

// The shuffle returns distinct posters and differs between seeds.
const src=component.match(/export function pickPosters[\s\S]*?\n\}/)[0].replace(/: readonly string\[\]|: string\[\]|count = WALL_SIZE/g,m=>m.startsWith('count')?'count = 36':'');
const pickPosters=new Function(`${src.replace('export ','')}; return pickPosters;`)();
let seed=1;const rng=()=>((seed=seed*16807%2147483647)/2147483647);
const a=pickPosters(posters,36,rng),b=pickPosters(posters,36,rng);
assert.equal(a.length,36);assert.equal(new Set(a).size,36,'no repeats within one visit');
assert.notDeepEqual(a,b,'two loads show different movies');
console.log(`PASS: ${posters.length} posters in the pool, ${size} random ones per visit, straight and gap-free.`);
