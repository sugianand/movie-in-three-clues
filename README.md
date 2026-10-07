# Movie in Three Clues

A real multiplayer movie guessing game for 2–8 players, with room codes, shared server time, hidden answers, and five-round scoring. No API keys are needed.

## Play locally on Windows

1. Install Node.js 22.13 or newer if it is not already installed.
2. Extract the complete ZIP into a folder.
3. Double-click `START-WINDOWS.cmd`. The first run downloads dependencies, builds the game, and initializes the local database. Internet access is needed for this setup.
4. When the server is ready, open **http://localhost:3000**.
5. Open the same address in an Incognito/private window. Create a room in the first window; join its code using a different name in the second. Both windows connect to the same local server.
6. Keep the launcher window open while playing. Press Ctrl+C to stop.

This local address works only on the computer running the game. It is not an internet sharing link. For players on separate devices over the internet, publish with Sites using the included source and D1 database configuration.

## macOS/Linux or command line

Requires Node.js 22.13+:

```
npx --yes pnpm@11.25.0 install --frozen-lockfile
npm run local
```

Open http://localhost:3000 after startup. Port 3000 must be free.

## Rules

- 2–8 players enter screen names and join a six-character room code or invite link. Repeated names receive a numbered suffix.
- The host starts a five-round game. Movies are randomly selected without repeats within a game from a bank of 200 active titles. The same room remembers used titles across Play again, with no repeats until the pool is exhausted; a new room starts fresh.
- Clues appear every 30 seconds on Easy, 15 on Normal, or 10 on Hard. You may submit one guess per clue.
- Correct guesses score 300, 200, or 100 points, depending on the clue. Punctuation/case and small typos are accepted; very short titles must match exactly.
- Correct answers, new points, and other players' guesses stay hidden until the reveal.
- A round ends after 90/45/30 seconds (Easy/Normal/Hard) or when everyone gets the movie. The host advances to the next round.
- Highest score after five rounds wins; tied leaders share the win. The host can start another game.
- Refresh the same tab to reconnect when browser storage is available. If storage is blocked, joining still works but the tab must stay open. Keep the host tab available to advance rounds. New players can join only in the lobby. Rooms expire after 24 hours.

## Playtest checklist

- Create and join using a normal and private window.
- Submit a wrong guess, wait for the next clue, then submit again.
- Get a correct answer in one window; check that the other cannot see it or the new score.
- Finish a game, check the winner, and replay.
- Refresh during a round and confirm that the player reconnects.

## Validation completed

- Production Worker and frontend build succeeded; TypeScript check passed.
- Rules tests cover timer boundaries, 300/200/100 scoring, five rounds, winner selection, typo matching, host permissions, duplicate guesses, and replay.
- Real compiled Worker tested in Miniflare with D1: two separate sessions, full five-round game, 1500-point shared winners, hidden data, state reconnection, replay, concurrent joins capped at eight, and homepage server rendering.
- Browser visual and interaction QA was unavailable in the authoring environment. Windows launcher is provided but has not been executed on Windows.
- Browser WebMCP registration is feature-detected; supported-browser validation was unavailable.

Developer checks:

```
npm run test:game
npx tsc --noEmit
npm run build
npm run test:worker
```

The included `tests/integration.mjs` can also test a running server with GAME_TEST_URL set to its origin.

## Implementation

React/Vinext frontend, Cloudflare-compatible backend, D1 room state with optimistic versioned writes. Clients poll every 800 ms; the server controls clue timing and scoring. Room credentials stay in tab-scoped session storage. The answer bank lives only on the server.

Use Leave room to free a seat. If the host leaves explicitly, the earliest remaining player becomes host. Closing a tab alone does not notify the room.

## Join and design update

Separate Host and Join forms, inline join validation, same-name suffixes, pasted-code cleanup, prefilled invite links, and storage-blocked session fallback. Redesigned entry, lobby, clue cards, timer, standings and winner screens. Cookie-free Worker tests cover full gameplay and the new join paths; real Incognito browser testing remains unverified in the authoring environment.

## Content and rotation update

200 active movies using story, cast, director, character and partial-title clues. 40 complete mixed-pool games in one room before the first pool reset; prior-match titles are avoided at the reset boundary. A host-only postgame table tracks first-, second-, and third-clue solves and misses across games in the room. These counts are descriptive playtest evidence, not calibrated difficulty ratings. Existing room history begins with its current deck when first upgraded.

## Reliability update

Numbered sequels no longer pass as spelling mistakes for the original film. Snapshot ordering prevents delayed responses from hiding newly revealed clues. Game requests time out and recover instead of waiting indefinitely; expired sessions offer a way back to room creation. Tied scores share leaderboard ranks. Playtest notes flag early-solve/miss rates of at least 70% after at least four player-rounds; these are review prompts, not validated difficulty labels.

## Movie settings

The host can open Settings in the lobby or after a match. Choose Mixed cinema (200 films), Indian cinema (100 Hindi, Tamil and Telugu films), or American cinema (100 films), then All years, Before 2010, or 2010 onward. Indian cinema is exactly 50 before 2010 and 50 from 2010 onward; American cinema is exactly 50 before 2010 and 50 from 2010 onward. The persisted `hollywood` key remains for compatibility with existing rooms. Settings sync to guests and cannot change during a match. The panel shows the matching pool and unseen count. Room history is retained when filters change; each selected pool resets only after exhaustion, with no duplicate within a match. Release year and language appear at reveal.

Tests cover all nine filter combinations through exhaustion, history across changes, host permissions and a complete two-player Indian/modern match through the compiled Worker. Exact movie titles cannot be accepted as typos for other films, including Alien and Aliens.

## Expanded catalog sources and clue design

The first 100 array entries retain their order so saved room decks remain valid. `data/movie-expansion.json` adds 1,000 factual records (60 Indian and 940 English-language) with a source URL for every record. `lib/expanded-movies.ts` turns these facts into original clue text. No external fetch or API key is used at runtime.

English-language additions use title, release year, genre, director, cast and character facts from the [TMDB 5000 metadata and credits snapshot](https://github.com/masiod/TMDb_movie_data). Selection requires English original language, available cast/director/character facts, excludes documentary/TV entries and Indian productions, prioritizes vote count, and fills each era quota independently. This is an older data snapshot (mostly through 2016), supplemented by the existing newer entries; it is not a latest-release feed. English language does not mean US production only.

Indian additions use individually selected Hindi titles and original story clues, with credit facts checked against the [Bollywood Movie Dataset](https://github.com/devensinghbhagtani/Bollywood-Movie-Dataset). The existing Tamil and Telugu films remain. No source plot summaries or taglines are copied. Each new film's clues move from a story or supporting-cast/year hint to director/year and then lead cast/character plus a partially revealed title. These are metadata-based clues, not 1,100 individually playtested plot riddles. Difficulty still needs human playtesting; the existing room report tracks early solves and misses.

Tests assert the four exact era quotas, normalized unique titles, three nonempty clues, all filters through exhaustion, full game scoring and hidden answers.

## Popular 200 collection

The current playable collection is 100 Indian and 100 American films, each split 50 before 2010 / 50 from 2010 onward. American includes major US co-productions. This is a curated recognizable-favorites selection, not a claimed official or live popularity ranking. The American allowlist lives in `data/popular-american.json`; all 100 existing Indian selections remain.

The larger server-side catalog is retained only to resolve numeric movie IDs in existing room decks and histories. New games draw exclusively from `activeMovieIds`, and every displayed pool count uses that active selection. Matches already underway finish with their original deck; replay applies the reduced pool. Tests verify all four exact quotas and 40 mixed matches without a repeat.

## Teams and difficulty

Host Settings now offers Individual or Teams and Easy (30 seconds per clue / 90 per round), Normal (15 / 45) and Hard (10 / 30). Difficulty changes timing only; scoring stays 300/200/100. New and legacy rooms default to Individual/Normal. The server locks settings during a match and controls all deadlines.

Team play uses Team Purple and Team Gold. Players are assigned to the smaller team when entering team mode or joining, and can choose their own team before or between games. Starting requires equal nonempty teams: 2, 4, 6 or 8 players. Every player has one guess per clue and earns personal points that add to their team's total; team totals hide new points until reveal. Highest team total wins and ties are shared. Discuss on your own voice/chat service; no built-in chat. Completed team results are saved so changing the next match's settings does not rewrite the winner.

Tests cover all three timer boundaries, team selection/permissions, uneven-team rejection, hidden totals, five rounds, shared and single winners, stable results and replay.

## Intro, room setup and team names

The homepage now introduces the game and offers Play. Play opens the Host/Join screen; the host chooses Solo or Teams before creating the room. Solo remains multiplayer, with individual scoring (2–8 players). Invite links open the Join screen directly with the code filled in, and saved sessions reconnect to their room.

In the lobby, players choose a team and any teammate can set its shared name (1–24 characters). Whitespace is normalized and the two names must differ, ignoring case. Names sync to everyone, appear in standings and winning results, and lock during a match. Names can be changed between matches without changing saved winners from the previous match.

API tests cover create-time mode validation and assignment, guest renaming, duplicate-name rejection, name propagation into final team winners, and midgame locks. Server-render checks verify the intro/Play appears before the room forms. Real browser visual and click-through QA remains unavailable.

## Leaving and visual update

Leave room is available in the shared room header to every player, including the host. A confirmation explains its effect. The server removes only the authenticated player, transfers hosting to the earliest remaining member, and deletes the room when the last member leaves. Concurrent membership changes use the existing optimistic version guard.

Leaving during play/reveal stops the match and returns remaining players to the lobby, resets match scores and preserves movie history/team names/settings. Leaving from finished results also returns the room to the lobby. This avoids continuing with uneven teams or awarding a misleading win. Closing the browser tab does not automatically leave.

The landing, Host/Join forms, lobby, settings, team cards, clue screens, results and leave dialog share improved spacing, contrast, focus rings, readable labels and mobile layouts. Reduced-motion preferences are respected. Unit and Worker tests cover host transfer, unauthorized leaves, replay readiness, reclaimed seats, concurrent departures and last-player room deletion. Actual browser visual QA remains unverified.
