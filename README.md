# Learn Your Letters!

An accessible, single‑file educational game that helps young children learn the alphabet through sound, visuals, and drawing. The entire app lives in one `index.html` and runs in any modern browser.

This README reflects the current code precisely. If something is listed here, it exists in `index.html`; if it is not in the code, it is not claimed here.

## What It Is
- Single‑file app: everything is implemented in `index.html`.
- Two core modes: Find Letters (identify) and Tracing Practice (draw).
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
- Tracing Practice
  - Responsive canvas sized to fit the screen (typically 260–560px square).
  - Optional letter formation overlay (Show/Hide How to Write).
  - Recognition: classical similarity (cloud matching + IoU checks) with optional deep similarity (MobileNet via TensorFlow.js if available).
  - Letter‑specific helpers (dot detection for i/j, crossbar detection for t/f/E/F/H).
  - Idle hint: after a short delay, a faint letter guide fades in (disabled as soon as the child starts tracing).

### Adaptive Difficulty
- Tracks per‑letter performance: correct, total attempts, response times, and a small spaced‑review state.
- Builds an adaptive selection pool that up‑weights letters with low success rates and down‑weights recent letters.
- Temporary “shape similarity” bias after an error (e.g., b/d/p/q) to reinforce tricky distinctions.
- Difficulty indicator (1–5 bars) reflects overall performance; it is a visual indicator only (timing is not directly tied to the indicator).

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
- Memory Match: flip pairs of matching letters in a 4×4 grid with a timer.
- Mini‑games are occasionally offered between questions in Find Letters mode.

### Achievements
Defined achievements (unlocked/persisted locally):
- First Steps: first correct answer.
- Streak 5, Streak 10: consecutive correct answers.
- Speed Demon: 10 answers under 2 seconds (defined but not currently incremented in code).
- Perfect Round: complete a round with no mistakes.
- Letter Master: master all 26 letters.
- Score milestones: 100, 500, 1000 points.
- Play time: 10 minutes, 30 minutes total.
- Rounds: complete 5 rounds.

Badge counter appears on the trophy button and is visible once you earn at least one achievement.

### Round System
- 15 questions per round.
- Round summary modal shows: average time, accuracy, points gained, and “problem letters” (letters with 2+ errors this round).

### Streaks
- Tracks daily play streaks (based on calendar days).
- Milestone modal for common streak thresholds (3, 7, 14, 30, 50, 100) with a 4‑week calendar view.
- Shows a compact streak banner (hidden until the streak is at least 2 days).

### Multiplayer (Profiles)
- Add players with an emoji avatar and a name.
- Per‑player: scores, rounds, best streak, letter performance, achievements, mastered letters, and celebration type.
- Player data is saved to `localStorage` and can be switched from the top player selector.

### Parent/Teacher Dashboard
- Open by long‑pressing (about 2s) or double‑clicking the gear button.
- Sections:
  - Player Progress cards (score, accuracy, letters mastered, best streak).
  - Letter Performance Heatmap (A–Z color‑coded by success rate, with per‑cell tooltip).
  - Insights (simple, rule‑based suggestions based on performance and timing).
  - Recommendations (practical activity suggestions + time‑of‑day hints).
- Dashboard and other overlays trap keyboard focus and prevent background scrolling while open.

### Settings
- Basic
  - Timer: On/Off
  - Letters: lowercase/uppercase/mixed
  - Phonics: On/Off
  - Sound: On/Off
- Visual Theme: Classic / Animals / Colors
- Advanced
  - Voice Recording: On/Off (for phonics echo + practice tools)
  - Focus Mode: simplifies the UI and disables the timer while active
  - High Contrast: increases contrast
  - Reduce Motion: minimizes animations
  - Quick entry to Parent Dashboard

## Scoring (as implemented)
- Correct answer: `base + timeBonus`, then capped so total points gained in a round do not exceed 50.
  - Base = `10 + (difficultyLevel * 5)`
  - Time bonus decreases with response time, up to about +30 for very fast answers
- Wrong answer: −10 points and resets correct streak; briefly highlights the correct tile.
- Timeout: −10 points and counts as an incorrect attempt.

## Persistence
Saved in `localStorage`:
- Overall game data: `letterLearningGameData` (score, rounds, achievements, per‑letter performance, streaks, settings, etc.).
- Players list (for multiplayer): `letterLearningPlayers` (per‑player state; Sets are serialized as arrays).

## Accessibility
- Big touch targets and large typography.
- Focus Mode that reduces UI complexity and disables timers.
- High Contrast and Reduce Motion toggles.
- ARIA attributes on interactive elements and focus traps for modals.

## Technology
- Single HTML file: `index.html` (HTML, CSS, and vanilla JS).
- External libraries loaded via CDN:
  - TailwindCSS (utilities)
  - GSAP 3.12.x (animations; with requestAnimationFrame fallback)
  - Animate.css 4.x (occasional effects)
  - TensorFlow.js and MobileNet (optional; used only when available for deeper tracing similarity)
- SpeechSynthesis API for voice prompts with an English‑voice priority list.
- Optional Google Analytics tag is included in the HTML head (basic usage analytics).

Note: Because libraries are loaded from CDNs, an internet connection is required on first load. Microphone features require HTTPS (or `localhost`).

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
- Touch input is fully supported; mouse and keyboard interactions also work.

## Privacy
- No backend or account system; all progress and settings stay in the browser (`localStorage`).
- A Google Analytics tag is present for basic usage analytics. If you prefer not to use analytics, remove the GA `<script>` tag block at the top of `index.html` before deploying.

## Known Notes
- The “Speed Demon” achievement is defined but is not currently incremented by gameplay logic.
- Celebration type is saved/restored, but there is no Settings UI to change it yet (default is fireworks).
- Optional deep similarity for tracing (TensorFlow.js + MobileNet) is used only when those libraries are available.

## Contributing
Issues and pull requests are welcome. Useful areas include:
- Hooking up the speed‑based achievement tracking.
- Exposing celebration theme selection in Settings.
- Additional mini‑games or letter formation guides.
- Accessibility refinements and performance tuning.

## Credits
Created by Jeffrey Emanuel. Made freely available for families and classrooms.

