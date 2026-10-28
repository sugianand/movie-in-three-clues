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
- During a reveal, the host can opt into Auto Continue. It visibly waits eight seconds, then advances to the next round or final results. The preference is saved only in that host's browser, defaults off, and can be cancelled from any reveal, even while reconnecting. Switching apps or hiding the host tab pauses Auto Continue; returning starts a fresh eight-second countdown. Reconnecting or completing another action also restarts the countdown. If an advance fails, the host can continue manually or switch Auto Continue off and on to retry.
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

## Daily Premiere

The home screen now offers a one-player daily puzzle alongside multiplayer. Everyone gets the same movie for a UTC day. Each wrong guess or skip reveals another clue; a correct answer earns 300, 200, or 100 points. The answer and unrevealed clues stay on the server until completion. No countdown limits an individual guess; the puzzle resets at midnight UTC.

A random browser pass in localStorage identifies a D1 profile stored under the `daily:` namespace in the existing rooms table. Progress survives reloads; atomic version checks prevent retries and simultaneous tabs from consuming multiple guesses. Completed attempts cannot be replayed on the same pass. Stats include played, win percentage, consecutive winning days, best streak, total points, and seven recent results. Share results omit the title and clues. These are casual browser stats, not identity-verified rankings; clearing browser data creates a fresh pass and stats do not transfer between devices.

Validation: `node --experimental-strip-types tests/daily.test.mjs` and the daily API checks included in `tests/worker.mjs`. No database migration or additional dependency is required.

## Daily guess trail and safe reveal

Daily Premiere now keeps each submitted movie title beside its clue, including after reloading or recovering a request. Skips are labeled separately, and completed games show attempts in the clue recap. Existing passes keep all progress and stats; guesses made before this update show their outcome without fabricated text. Guess text is limited to the current daily puzzle and is excluded from spoiler-free sharing.

The final Give up action asks for confirmation and explains the remaining 100-point chance and streak impact. Cancel keeps the puzzle open. Guess scoring, retry protection, movie rotation, branding, and multiplayer are unchanged.

## Daily result images

Finish Daily Premiere and choose **Create spoiler-free result image** to preview a 1080×1080 card in the default Missing Frame identity. **Share image** opens native file sharing where supported; **Save PNG** downloads a file for messaging and social posts. Text sharing remains available. The image is generated on demand in the browser without external fonts, images, APIs, or dependencies.

Only the puzzle number, date, score, and clue outcomes enter the card. Movie titles, clues, typed guesses, browser passes, and history are excluded. PNG preparation finishes before the sharing tap to preserve mobile user activation; cancelling the share sheet is harmless. Unsupported file sharing points users to the download and text options. Object URLs are released when the preview closes or the result changes.

Validation: all 11 unit test files, TypeScript, production build and compiled Worker integration passed. Card layout inspected via server-side SVG rendering; native sharing/download interaction on Safari/iPhone and Chrome remains unverified because browser QA is unavailable here. This change does not include the separate in-progress Phase 1 transport/autocomplete work.

## Daily draft recovery

Daily Premiere retains an unfinished movie title when returning to the tab or recovering an unchanged server snapshot. With session storage available, that draft also survives a reload in the same tab. It is restored only after the server confirms the exact date, version and clue stage; another tab advancing the puzzle, completion, or a new day discards stale input. Restoration never submits a guess. Only typed input and its progress stamp are stored, separately from the browser pass and saved results. Storage failures do not block gameplay.

Validation: `tests/daily-draft.test.mjs` covers recovery, stale progress, malformed storage, pass isolation and the persisted-data allowlist. All 14 unit test files, TypeScript, production build and compiled Worker integration passed. Chrome and real Safari/iPhone interaction checks remain unverified.

## Movie Night Recap

Finished multiplayer matches now include an optional recap below the results: every movie, each solver, the clue they solved it on, points earned that round, and players who missed it. A comeback callout compares the eventual winner with the standings after round one. Team matches use team standings for the comeback calculation while keeping individual solves in each round.

The recap is recorded server-side at reveal and is never returned during live play or the reveal screen, so it cannot leak answers or other players' results. Existing saved rooms without recap data remain compatible and simply omit the panel. Replay starts a fresh recap. Validation covers privacy, idempotent round capture, clue/point accuracy, comeback ranking and legacy rooms.

## Rematch ready check

After the final results, every active player can mark themselves ready for another match. Readiness syncs to the room so the host can see the count and each player’s status before choosing Play again. It is informational only and never auto-starts a match. Spectators stay queued separately, legacy rooms default to not ready, and readiness resets on replay or when the next match settings or teams change.

Hosts now get a final safety check if they try to start the first match or a rematch while anyone is still unready. The confirmation names those players and offers Wait for everyone or Start anyway, so readiness remains advisory without letting an accidental tap burn the opening clue timer. Solo Practice bypasses the confirmation.

## Synchronized round countdown

Multiplayer matches now open every round with a server-timed three-second countdown. All devices receive the same future start timestamp, clues remain server-hidden and guesses are rejected until it expires, and only then does the full clue timer begin. The host’s manual Next round and optional Auto Continue use the same countdown. Legacy clients that omit the opt-in field retain immediate starts, while Solo Practice stays instant. The countdown animation is disabled when reduced motion is preferred.

## Reveal Guess Board

After each multiplayer answer reveal, the room can compare every submitted title in a responsive Guess Board. Near misses stay private while the clue timer is active, correct entries are marked only after the answer appears, and each round starts with a clean board. Spectators receive the same reveal without gaining access to in-progress guesses.

## Private Guess Tray

During a multiplayer round, each active player gets a compact private tray containing only their own submitted titles. The server rejects punctuation- or spacing-equivalent repeat guesses on later clues without consuming the new attempt. Other players and spectators receive no private entries; the shared Guess Board remains locked until the answer reveal.

## Lightning format

Hosts can switch the next match from Classic Three Clues to Lightning: ten movies, one middle-difficulty clue and ten seconds per round. A correct answer earns 100 points before optional Speed Bonus; Double Down earns 200 on a hit or costs 100 on a miss. Only the single Lightning clue is sent to clients, and Classic remains the default for existing rooms.

## Movie Night Series

Completed multiplayer matches now feed a room-level series table. Every solo winner earns one series win; in Teams, every player on a winning team earns one. Ties award all winners. The table persists across rematches, format and settings changes for the life of the room, while match scores still reset normally. Legacy rooms begin at zero, and retrying the final action cannot award the same match twice.

The series is now a visible first-to-three race. Reaching three wins crowns the current leader or tied leaders and closes rematches for that completed series. The host can confirm a fresh series to unlock the next match without clearing movie rotation, teams, settings, or the completed match.

Spoiler-free match sharing includes each player's personal Movie Night Series progress. Champions get dedicated crown messaging with their wins and match count; movie titles, clues, guesses, player names, room codes, and tokens remain excluded.

## Reveal reactions

Every answer reveal includes four lightweight room reactions: Great pick, No way, So close and Great clue. Each active player has one reaction per round and can change it until the host advances. Counts synchronize to players and spectators without exposing who chose what, adding a shared movie-night moment without chat or spoilers. Reactions clear for the next round and never affect scores.

## Ready for the next round

During every answer reveal, seated players can signal that they are ready to continue. The room sees a live ready count and each player’s status, while the host keeps final control of when to advance. Signals are tied to one round, reject stale updates, exclude spectators, and clear before the next countdown.

When the host has opted into Auto Continue, a unanimous ready check shortens the remaining reveal window to a fresh three-second countdown. Removing a ready signal restores the normal eight-second window, background tabs cannot catch up and skip the reveal, and manual host controls remain available throughout.

## Voluntary host handoff

The current host can make any other active player the host from the lobby or finished results. A confirmation explains that the new host receives control of settings, match starts and round advancement while the original host stays in the room as a player. Scores, readiness, series wins, movie history and settings are preserved. Hosting cannot change during an active round or reveal, spectators cannot receive it, and server authorization prevents non-hosts from using the action.

## Personal cinema themes

The browser-local theme picker offers Blue Premiere, Midnight Signal, Neon Arena and Classic Cinema. Blue Premiere remains the default Missing Frame identity with near-black, white and electric blue; the cream-and-red Classic Cinema treatment is an optional fourth look. Theme changes affect only the current browser, persist across visits when local storage is available, and never alter room state or gameplay. The room header remains visible while scrolling in every theme.

## Movie Night Passport

Every completed multiplayer match now updates a browser-local Movie Night Passport with matches, win rate, movie solves, first-clue solves, current and best win streaks, best score, fastest solve and perfect matches. A room/match stamp prevents polling, reloads and repeated result views from counting the same match twice. Solo and team wins are recognized separately, spectators never affect the record, and malformed or older saved values fall back safely. The Passport appears with finished results without an account; clearing browser data resets it.

The Passport also derives six milestone stamps from that same saved record: first match, first win, five matches, five first-clue solves, a solve under five seconds, and a perfect match. Locked stamps show progress, earned stamps unlock automatically for existing players, and no additional personal data or server storage is introduced.

## Opt-in cinema sound

The global Sound control is off by default and persists only in the current browser. After a user enables it, lightweight Web Audio cues mark a new round, a newly revealed clue, the player’s own correct answer, the big reveal and the final results. Cues are synthesized locally with no audio downloads, never play on initial room recovery or unchanged polling snapshots, and wait for a browser-approved interaction before creating audio. Spectators receive shared round/reveal cues but never a personal correct cue.

## Keep screen awake

Supported mobile and desktop browsers can opt in to keeping the display awake during active multiplayer rounds and reveals. The browser-local preference defaults to off, releases the Screen Wake Lock whenever the match is not active or the tab is hidden, and reacquires it when play resumes. Unsupported browsers simply omit the control; no permission workaround or fallback timer is used.

## Host seat management

Between matches, the host can remove an inactive player after a confirmation. The seat opens immediately without resetting room settings, movie rotation, series history, or completed results. Server authorization prevents guests and spectators from removing anyone, active rounds cannot be interrupted, and the host cannot remove their own seat through this control. Removed players can join again later with the room code.
