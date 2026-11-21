import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
const component=readFileSync(new URL('../components/cinema-backdrop.tsx',import.meta.url),'utf8');

assert.match(css,/\.cinema-backdrop-reel\{[^}]*animation:cinema-scroll 150s linear infinite/,'poster reel keeps the intended 150-second expanded linear loop');
assert.doesNotMatch(css,/\.cinema-backdrop-reel\{animation-duration:(?!150s)[^}]+\}/,'later rules cannot silently speed up or slow down the poster reel');
assert.match(css,/@keyframes cinema-scroll\{from\{transform:translate3d\(0,0,0\)\}to\{transform:translate3d\(calc\(-1 \* var\(--reel-width\)\),0,0\)\}\}/,'poster reel travels continuously in one direction');
assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{\.cinema-backdrop-reel\{animation:none/,'reduced-motion visitors receive a stationary backdrop');
assert.doesNotMatch(css,/animation-direction\s*:\s*(alternate|reverse)/,'the reel never reverses');
assert.doesNotMatch(css,/animation-play-state\s*:\s*paused/,'the reel has no paused visual state');
assert.doesNotMatch(component,/<button|pause/i,'the backdrop does not expose a pause control');
assert.match(css,/--reel-width:calc\(var\(--panel-width\) \* 2\)/,'expanded lap preserves the intended two-panel travel distance for the 150s loop');
console.log('PASS: poster backdrop keeps its 150-second expanded one-way loop and reduced-motion fallback.');
