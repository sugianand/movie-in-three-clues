import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
const brand=readFileSync(new URL('../components/brand-mark.tsx',import.meta.url),'utf8');
const favicon=readFileSync(new URL('../public/favicon.svg',import.meta.url),'utf8');

assert.match(css,/main>header\{[^}]*background:transparent[^}]*backdrop-filter:none[^}]*border-bottom:0/,'the sticky header stays transparent instead of becoming a detached bar');
assert.match(css,/main>header:after\{[^}]*linear-gradient\([^}]*transparent/,'the header fades into the poster field');
assert.match(css,/main>header \.header-actions\{[^}]*border-radius:999px[^}]*background:color-mix\([^}]*transparent\)[^}]*backdrop-filter:blur\(12px\)/,'header controls share a compact glass capsule');
assert.match(css,/@media\(max-width:420px\)\{main>header \.header-actions\{[^}]*width:100%[^}]*border-radius:16px/,'the control cluster remains usable on narrow phones');
assert.match(brand,/Inline mystery-frame logo/,'the brand component documents the mystery-frame identity');
assert.match(brand,/M13 24V13h11M40 13h11v11M51 40v11H40M24 51H13V40/,'the mark contains four framing corners');
assert.match(brand,/>THREE<\/span><span>CLUES</,'the wordmark remains explicit and legible');
assert.doesNotMatch(brand,/ellipse|film-reel/,'the previous generic reel symbol is gone');
assert.match(favicon,/fill="#4169FF"/,'the favicon keeps the default electric-blue identity');
assert.match(favicon,/M13 24V13h11M40 13h11v11M51 40v11H40M24 51H13V40/,'the favicon matches the mystery-frame mark');

console.log('PASS: the mystery-frame logo and transparent integrated header are preserved.');
