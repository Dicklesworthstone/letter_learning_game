# Learn Your Letters!

An accessible, single‑file educational game that helps young children learn the alphabet through sound, visuals, and drawing. The entire app lives in one `index.html` and runs in any modern browser.

The features below describe the implementation. The verification section separates browser regressions from real-device and educational quality checks that still need evidence.

## What It Is
- Single‑file app: everything is implemented in `index.html`.
- Three core modes: Find Letters (identify), Word Builder (spell), and Tracing Practice (draw).
- Child‑friendly UI, big touch targets, optional phonics flow, and gentle animations.
- Data is stored locally in the browser via `localStorage` (no backend).

## Major Features

### Modes
- Find Letters
  - Presents 4 large letter tiles (same case as the target).
  - Speaker button plays the target letter (via SpeechSynthesis API).
  - Adaptive selection favors letters that need practice and avoids recent repeats.
  - Optional phonics follow‑up (3‑second countdown, then letter sound and anchor word/emoji). Can be skipped.
  - Scoring: base points plus a time bonus, with a per‑round cap. Wrong answers/timeouts deduct points.
- Word Builder
  - Presents a target word with empty slots and a small bank of letter tiles.
  - Speaker button plays the target word (via SpeechSynthesis API).
  - Build the word by tapping/clicking letter tiles to fill slots left‑to‑right.
  - Adaptive difficulty with easy/medium/hard word pools: 3-letter words (including non-CVC words such as `owl` and `sky`) → 4-letter words → 5–6-letter words (including `cheese`). Four consecutive correct words raise difficulty; three incorrect words lower it. Letter case follows the Letters setting (lowercase/uppercase/mixed).
  - Letter bank includes decoy letters and matches the word’s case; bank size is at least 5 or `word length + 3`.
  - Scoring: +20 for a correct word; −5 for an incorrect attempt; advances to the next word automatically.
  - Controls: Hear Word, New Word.
- Tracing Practice
  - Responsive canvas (200–560px square); the lesson scrolls on short screens. Resizing preserves ink and stroke coordinates at the device's pixel ratio.
  - Numbered formation overlays for all 26 lowercase and 26 uppercase targets, using the recognizer's guide paths.
  - Recognition: bounded arc-length sampling, point-cloud matching and raster overlap. TensorFlow.js/MobileNet load asynchronously on the first drawing check; classical recognition works immediately when those assets fail or are still loading.
  - Letter‑specific helpers (dot detection for i/j, crossbar detection for t/f/E/F/H).
  - Taps leave visible dots; sparse straight strokes can be checked. Starting a new stroke cancels a pending clear from the previous rejected attempt.
  - Fast strokes retain every distinct pointer sample delivered by the browser, including the release position. Ink is painted one new segment at a time.
  - Idle hint: after a short delay, the same stroke paths used by the formation guide and recognizer fade in. The hint fades out as soon as the child starts tracing; it does not depend on a font's letter forms.

### Adaptive Difficulty
- Tracks recognition performance per letter: correct, total attempts, response times, and a small spaced-review state. Handwriting and spelling have separate mode histories; spelling a word does not award recognition mastery.
- Builds an adaptive selection pool that up‑weights letters with low success rates and down‑weights recent letters. Tracing uses handwriting history; Identify uses recognition history.
- Temporary “shape similarity” bias after an error (e.g., b/d/p/q) to reinforce tricky distinctions.
- Difficulty indicator (1–5 bars) reflects recognition performance; it is a visual indicator only (timing is not directly tied to the indicator).

### Timing and Feedback
- Timer On/Off (per setting). When on, a countdown bar and verbal countdown for the last 3 seconds.
- Timeouts count as incorrect, with appropriate feedback and scoring.
- Feedback banner for success/error, plus subtle wrong‑answer flash to keep kids oriented.

### Celebrations
- Default celebration uses themed emoji confetti and letter‑specific animations (e.g., rockets, balloons, etc.).
- Celebration type is stored in save data; there is currently no UI for changing the celebration theme in Settings.

### Visual Themes
- Classic: clean letters.
- Animals: shows letter associations (icon + word) near the correct option.
- Colors: highlights vowels vs consonants.

### Phonics Flow (optional)
- After a correct answer, optionally enters phonics phase:
  - 3‑second on‑screen countdown.
  - Speaks the phonetic sound 3 times and optionally “as in <word>”.
  - Shows an on‑screen emoji for some anchor words.
  - Echo practice: if Voice Recording is enabled and permitted, listens briefly for the child’s voice; otherwise shows a repeat button.
- The phonics phase can be skipped at any time.

### Mini‑games (automatic short breaks)
- Letter Rain: move the basket to catch the target letter; score feedback.
- Memory Match: flip pairs of matching letters in a 4×4 grid with a timer; cards support native keyboard activation.
- Mini‑games are occasionally offered between questions in Find Letters and Word Builder modes.
- Both breaks offer a Return to Lesson button and resume the originating mode. Letter Rain also supports the left/right arrow keys.
- Timer Off makes the breaks untimed. Turning it on starts a fresh countdown. Focus Mode suppresses automatic breaks and disables their timers.

### Achievements
Defined achievements (unlocked/persisted locally):
- First Steps: first correct answer.
- Streak 5, Streak 10: consecutive correct answers.
- Speed Demon: 10 correct answers under 2 seconds.
- Perfect Round: complete a round with no mistakes.
- Letter Master: master all 26 letters.
- Score milestones: 100, 500, 1000 points.
- Play time: 10 minutes, 30 minutes total.
- Rounds: complete 5 rounds.

Badge counter appears on the trophy button and is visible once you earn at least one achievement.

### Round System
- 15 resolved questions per round in all three modes. Incorrect recognition/tracing attempts allow a retry and remain in accuracy statistics; timeouts and completed spelling attempts resolve a question.
- Round summary modal shows: average time, accuracy, points gained, and “problem letters” (letters with 2+ errors this round).

### Streaks
- Tracks daily play streaks on local calendar days, beginning with an actual lesson outcome. Opening or reloading settings does not count as a practice day.
- Milestone modal for common streak thresholds (3, 7, 14, 30, 50, 100) with a 4‑week calendar view.
- Shows a compact streak banner (hidden until the streak is at least 2 days).

### Multiplayer (Profiles)
- Add players with an emoji avatar and a name.
- Per‑player: scores, rounds, best streak, letter performance, achievements, mastered letters, and celebration type.
- Add Player is visible on the first visit. Outcomes save immediately; the selected player, mode, and partial round survive reload. Play time counts active lesson time, preserves partial minutes, and pauses for dialogs; dialog pauses also stay out of response-time statistics.
- Settings are shared by profiles on the same browser; lesson progress belongs to the selected player.

### Parent/Teacher Dashboard
- Open by long‑pressing (about 2s) or double‑clicking the gear button.
- Sections:
  - Player Progress cards (score, accuracy, letters mastered, best streak).
  - Letter Performance Heatmap (A–Z color‑coded by success rate, with per‑cell tooltip).
  - Insights (simple, rule‑based suggestions based on performance and timing).
  - Recommendations (practical activity suggestions + time‑of‑day hints).
- Dashboard and other overlays trap keyboard focus and prevent background scrolling while open.
- Dialog pauses preserve each question's active response time, including a question refreshed by a theme change. Drawing hint waits and fades pause too, so help hidden behind a dialog does not incur a hint penalty.

### Settings
- Basic
  - Timer: On/Off
  - Letters: lowercase/uppercase/mixed
  - Phonics: On/Off
  - Sound: On/Off
  - Word Builder: On/Off
- Visual Theme: Classic / Animals / Colors
- Advanced
  - Voice Recording: On/Off (for phonics echo + practice tools)
  - Focus Mode: simplifies the UI and disables the timer while active
  - High Contrast: increases contrast
  - Reduce Motion: minimizes animations
  - Quick entry to Parent Dashboard

## Scoring (as implemented)
- Find Letters: `base + timeBonus`, then capped at 50 net points gained in the current round.
  - Base = `10 + (difficultyLevel * 5)`
  - Time bonus decreases with response time, up to about +30 for very fast answers
- Wrong answer: −10 points and resets correct streak; briefly highlights the correct tile.
- Timeout: −10 points and counts as an incorrect attempt.
- Tracing uses the same cap, with points scaled by similarity and a penalty after an idle hint; an accepted trace can earn zero points once the cap is reached and still counts as a correct outcome.
- Word Builder awards +20/−5 per completed word and has no 50-point round cap. Mini-games and successful phonics echo can award extra points.

## Persistence
Saved in `localStorage`:
- Overall game data: `letterLearningGameData` (score, rounds, achievements, per‑letter performance, streaks, settings, etc.).
- Players list (for multiplayer): `letterLearningPlayers` (per‑player state; Sets are serialized as arrays).
- Tracing diagnostic counters: `llg_draw_analytics_v1`. Missing deep-model scores are reported as unavailable, not zero-quality judgments.
- Invalid saved fields are normalized before use. If storage reads or writes are denied/full, a visible notice explains that progress lasts only for the current visit; lessons remain usable.
- Clearing browser/site data removes progress. No server backup or cross-device synchronization is provided.

## Accessibility
- Big touch targets and large typography.
- Focus Mode that reduces UI complexity and disables timers.
- High Contrast and Reduce Motion toggles.
- ARIA attributes on interactive elements and focus traps for modals.
- Native buttons for players, avatars, and Memory Match; dialogs pause lessons, exclude the background from focus, and return focus when closed with Escape.
- Visible target prompts when sound is off or no English speech voice is available. The operating system's reduced-motion preference is also respected.

## Technology
- Single HTML file: `index.html` (HTML, CSS, and vanilla JS).
- External libraries loaded via CDN:
  - TailwindCSS (utilities)
  - GSAP 3.12.x (animations; with requestAnimationFrame fallback)
  - Animate.css 4.x (occasional effects)
  - TensorFlow.js 4.19.0 and MobileNet 2.1.1 (optional; requested on the first drawing check)
- SpeechSynthesis API for voice prompts with an English‑voice priority list.
- Optional Google Analytics tag is included in the HTML head (basic usage analytics).

Core lessons use inline code and styles and can run when CDN assets are blocked. CDN animations and deep-model recognition need network access. Microphone features require HTTPS (or `localhost`), permission, and browser support. Phonics echo detects sound energy; it does not judge pronunciation accuracy.

## Design Tokens (excerpt)
Core CSS variables used in the app:

```
:root {
  --primary: #6366F1;
  --primary-dark: #4F46E5;
  --secondary: #EC4899;
  --secondary-dark: #DB2777;
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
}
```

## Deployment
- Static hosting: upload the single `index.html` to any static host (e.g., GitHub Pages, Cloudflare Pages, Netlify, S3/CloudFront).
- Ensure the site is served over HTTPS to enable microphone features.

## Device Support
- Modern desktop and mobile browsers with ES6, Flexbox/Grid, and SpeechSynthesis support.
- Touch and mouse drawing handlers and keyboard lesson controls are implemented. Physical phone/Safari qualification remains pending; automated WebKit results do not establish physical Safari behavior.

## Privacy
- No backend or account system; all progress and settings stay in the browser (`localStorage`).
- A Google Analytics tag is present for basic usage analytics. If you prefer not to use analytics, remove the GA `<script>` tag block at the top of `index.html` before deploying.

## Verification and Known Limits

Use Node 22 for development checks, matching CI. The browser jobs use Ubuntu 24.04. Install the development-only browser test dependency, then run:

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
npm test
LLG_BROWSER=firefox npm test
LLG_BROWSER=webkit npm test
npm run build
```

`LLG_CHROME_PATH=/path/to/chrome npm test` uses an existing Chromium browser. Static deployment still needs only `index.html`, with no build step or Node runtime.

Optional live-library checks can be run separately with `LLG_LIVE_MODELS=1 LLG_LIVE_ANIMATIONS=1 npm test`. Ordinary CI blocks external assets to verify fallback behavior; Chromium-only synthetic microphone/touch checks are explicitly skipped on other engines. Full-session tests check outcomes and retain bounded per-action waits; they are not performance benchmarks.

The suite serves the actual HTML and uses native browser controls. It covers geometry termination, scores, rounds, profile isolation, storage failures, stale callbacks, settings, dialogs, guides, and small viewports. Failed browser tests save console errors, a screenshot, and a Playwright trace under `test-results/`. CI runs Chromium, Firefox, and WebKit separately. Chromium checks use the bundled full browser in headless mode so native microphone capture is supported.

Synthetic trace tests reuse the app's guide geometry. The synthetic microphone test checks native track cleanup and does not test a child's voice. Neither proves handwriting accuracy, pronunciation, screen-reader usability, or learning benefit. Those acceptance gates remain open in Beads under `llg-ova`, along with physical phone/Safari checks.

A classical-only pilot at revision `4030cc7` replayed 208 stylus samples from two test writers in [UJI Pen Characters v2](https://archive.ics.uci.edu/dataset/177/uji%2Bpen%2Bcharacters%2Bversion%2B2) (Prat et al., 2008; CC BY 4.0). The checker accepted 136/208 intended-letter trials and 91/208 predeclared wrong-letter confusion trials. Automatic checks can therefore misgrade freehand stylus writing. This small replay study provides no evidence about the writers' ages, children's tracing, or learning benefit.

- Celebration type is saved/restored, but there is no Settings UI to change it yet (default is fireworks).
- Recognition thresholds have not been validated on a held-out corpus of children's handwriting. MobileNet supplies generic visual similarity, not a trained alphabet classifier.
- Speech quality depends on the browser and installed English voices. Recording stays in memory for this visit (up to ten clips); it is not saved as part of a profile. Clip playback and comparison respect Sound Off and stop when leaving the lesson or opening a dialog.

## Contributing
Issues and pull requests are welcome. Useful areas include:
- Real handwriting samples and independent recognition evaluation.
- Physical device speech/microphone and human screen-reader testing.
- Accessibility refinements and evidence of educational usefulness.

## Credits
Created by Jeffrey Emanuel. Made freely available for families and classrooms.

