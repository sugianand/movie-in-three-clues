import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseTheme,themes} from '../lib/themes.ts';

assert.deepEqual(themes.map(theme=>theme.id),['premiere','midnight','arena','scout','classic']);
assert.equal(themes[0].name,'Blue Premiere');
assert.equal(parseTheme(undefined),'premiere');
assert.equal(parseTheme('not-a-theme'),'premiere');
assert.equal(parseTheme('classic'),'classic');
assert.equal(parseTheme('scout'),'scout');
assert.equal(parseTheme('midnight'),'midnight');
assert.equal(parseTheme('arena'),'arena');
assert.equal(new Set(themes.map(theme=>theme.id)).size,themes.length);

const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8');
assert.match(css,/:root,.dark\{--brand-accent:#4169ff;--background:#0b0d12;--foreground:#f6f7fb/);
assert.match(css,/:root\[data-cinema-theme=classic\] \{/);
assert.match(css,/\.theme-swatch-classic i\{background:#b72e36\}/);
assert(!css.includes('html:not([data-cinema-theme=midnight],[data-cinema-theme=arena])'),'Classic Cinema must never replace the fallback theme');

console.log('PASS: Blue Premiere remains the default and Classic Cinema is an explicit persistent theme.');
