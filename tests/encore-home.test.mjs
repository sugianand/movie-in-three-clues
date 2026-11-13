import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const component=readFileSync(new URL('../components/encore-home.tsx',import.meta.url),'utf8');
const page=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
assert.match(component,/readEncoreProgress\(localStorage\)\?\.active/,'the landing card restores only the active browser-local goal');
assert.match(component,/Play your encore/,'the saved goal has a direct route back to party play');
assert.match(component,/Saved only in this browser/,'the card explains its privacy boundary');
assert.doesNotMatch(component,/lastOutcome|lastMatchId/,'the landing card must not expose prior result details');
assert.match(page,/!session&&entryStep==='landing'/,'the card is limited to the signed-out landing page');
assert(page.indexOf('<EncoreHome')>=0&&page.indexOf('<MovieNightPassport/>')>page.indexOf('<EncoreHome'),'returning players see their active Encore beside existing Passport continuity');
console.log('PASS: active Encore Missions return on the landing page without exposing prior-match details.');
