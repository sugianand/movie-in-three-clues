import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../app/home.css',import.meta.url),'utf8');
const component=readFileSync(new URL('../components/cinema-backdrop.tsx',import.meta.url),'utf8');

assert.match(component,/\[0, 1, 2\]\.map\(copy/,'each row repeats its posters three times so wide screens never see the end of a row');
const rowsBlock=component.slice(component.indexOf('const rows = ['),component.indexOf('];',component.indexOf('const rows = [')));
assert.equal(rowsBlock.split('\n').slice(1).filter(l=>l.trim()).length,4,'the wall has four rows');
for(const row of rowsBlock.matchAll(/\[('[^\]]+')\]/g)){
  const names=row[1].split(',').map(s=>s.trim());
  assert.equal(new Set(names).size,8,'each row shows all eight posters once');
}
assert.match(css,/@keyframes tc-wall-left\{from\{transform:translate3d\(0,0,0\)\}to\{transform:translate3d\(calc\(-100% \/ 3 - var\(--gap\) \/ 3\),0,0\)\}\}/,'rows move exactly one copy per loop, so the loop is seamless');
assert.match(css,/@keyframes tc-wall-right\{from\{transform:translate3d\(calc\(-100% \/ 3 - var\(--gap\) \/ 3\),0,0\)\}to\{transform:translate3d\(0,0,0\)\}\}/,'alternate rows move the other way by the same distance');
assert.match(css,/\.tc-wall-row\{[^}]*animation:tc-wall-left \d+s linear infinite/,'rows glide at a steady speed');
assert.match(css,/@media \(prefers-reduced-motion:reduce\)\{\.tc-wall-row\{animation:none\}\}/,'reduced-motion visitors get a still wall');
assert.doesNotMatch(component,/<button|pause/i,'the backdrop has no controls');
console.log('PASS: poster wall loops seamlessly in four alternating rows, with a still fallback for reduced motion.');
