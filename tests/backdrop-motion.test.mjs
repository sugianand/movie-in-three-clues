import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';

const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
const component=readFileSync(new URL('../components/cinema-backdrop.tsx',import.meta.url),'utf8');
const posters=JSON.parse(component.match(/const posters = (\[.*?\]);/s)[1]);

assert.ok(posters.length>=30,'the wall shows at least 30 movies');
assert.equal(posters.length%3,0,'a poster count divisible by 3 keeps every row full so the loop has no hole');
for(const p of posters) assert.ok(existsSync(new URL(`../public/posters/${p}.webp`,import.meta.url)),`${p}.webp exists`);
assert.doesNotMatch(component,/movie-poster-wall|cinema-poster-original/,'the old slanted collage is gone');
assert.doesNotMatch(css,/movie-poster-wall\.png/,'no stylesheet still paints the slanted collage');
assert.match(css,/\.cinema-backdrop-reel\{[^}]*gap:0/,'posters sit flush with no black gaps');
assert.match(css,/to\{transform:translate3d\(-50%,0,0\)\}/,'reel scrolls one full copy for a seamless loop');
assert.match(css,/prefers-reduced-motion:reduce\)\{\.cinema-backdrop-reel\{animation:none/,'reduced-motion visitors get a still wall');
assert.doesNotMatch(component,/<button|pause/i,'the backdrop has no controls');
console.log(`PASS: ${posters.length} straight, gap-free posters loop seamlessly.`);
