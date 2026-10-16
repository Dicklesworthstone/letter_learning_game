# AGENTS.md — Letter Learning Game

## 1. Project Overview & Core Philosophy

**Learn Your Letters!** ([index.html](file:///data/projects/letter_learning_game/index.html)) is a self-contained, single-file educational web application for early childhood literacy (ages 3–7).

- **Single-File Deployment Contract**: The entire application—CSS design tokens, responsive layout, SVG/Canvas overlays, DOM templates, and vanilla ES6 JavaScript—lives inside [index.html](file:///data/projects/letter_learning_game/index.html). Static hosting requires **only** `index.html` with zero build step or runtime server dependencies.
- **Offline & Degraded-Network Resilience**: Optional CDN libraries (TailwindCSS, GSAP, Animate.css, TensorFlow.js, MobileNet) must never block initial rendering or break core gameplay when offline, blocked, or slow. Classical handwriting recognition, CSS/RAF animations, and visible text prompts must always function immediately without external assets.
- **Child-Safe & Accessible by Default**: Every control must be reachable by touch, mouse, and keyboard across phone (`320×568`, `844×390`), tablet, and desktop viewports, with full ARIA semantics, focus trapping in dialogs, reduced-motion compliance, high-contrast support, and child-appropriate vocabulary/imagery.

---

## 2. Architecture & Code Map ([index.html](file:///data/projects/letter_learning_game/index.html))

| Section | Approximate Lines | Responsibilities |
|---|---|---|
| `<head>` & Optional Styles | `L1–L5015` | Metadata, CSS custom properties (`:root`), responsive media queries, `.focus-mode`, `.high-contrast`, `.reduce-motion`, modal & game-mode styles |
| `<body>` Shell & Modals | `L5016–L5535` | Header, `#playerSelector`, `.mode-selector`, `#scorePanel`, `#gameArea`, `#settingsModal`, `#achievementModal`, `#playerModal`, `#parentDashboard`, `#roundModal` |
| Achievements & State Init | `L5536–L6250` | `ACHIEVEMENTS`, lesson/timer/round state, `initDrawAnalytics()` + `normalizeDrawAnalyticsData()` (`llg_draw_analytics_v1`), `LETTER_CHECKPOINTS` (all 52 `A–Z`/`a–z` formation templates), `letterAssociations`, `letterWords`, `celebrationEmojis` |
| Speech, Phonics & Emojis | `L6251–L8050` | `phoneticSounds`, `anchorEmojiMap`, `letterNamePronunciations`, `getRandomLetter()`, `updateAdaptivePool()`, `updateLetterPerformance()`, TTS (`speakLetter`, `speakPhrase`, `speakPhonetics`, `showAnchorEmojiForWord`) |
| HUD, Celebrations & Modes | `L8051–L11000` | `updateScoreDisplay()`, `recordOutcome()`, confetti/celebration animations, `setMode()`, Find Letters (`startIdentifyGame` with `confusionMatrix` distractor targeting, `checkAnswer`), Mini-games (`startLetterRain`, `startMemoryMatch`), Round summary (`showRoundSummary`, `startNextRound`), Tracing (`startDrawGame`, `showFormationGuide`, `updateFormationStrokeProgress`, `undoLastStroke`, `clearCanvas`) |
| Settings, Audio & Profiles | `L11001–L12960` | `openSettings()`, `setTimerMode()`, `setCaseMode()` + `syncActivePromptCase()`, `setSoundMode()`, `setVisualTheme()`, `setCelebration()`, Voice Recording (`startRecording`, `stopRecording`, `playLastRecording`, `compareWithCorrect`), Achievements UI, Multiplayer (`initializeMultiplayer`, `switchToPlayer`, `saveCurrentPlayerState`), Parent Dashboard (`updateDashboard`, `updateDrawAnalyticsDashboard`, `updateWordBuilderDashboard`, `practiceWordBuilderWord`, `exportProgressBackup`, `importProgressBackup`, `printProgressReport`, `updateLetterHeatmap`, `showLetterHeatmapDetail`, `practiceHeatmapLetter`, `generateInsights`, `generateRecommendations`), Storage (`saveGameData`, `loadGameData`, `applyGameSettings`), Streaks (`checkStreakContinuity`) |
| Dialogs, Geometry & Word Builder | `L12961–L15150` | `trapFocus()`, `openDialog()`, `closeDialog()`, `resampleStroke()`, `createTraceCloud()`, `discreteFrechetDistance()`, `strokeCurvatureVariation()`, `checkDrawingNew()`, Word Builder (`startWordBuilderGame`, `getWordBuilderTarget`, `wordBuilderWords`, `wbPick`, `wbSlotClick`, `wbSoundOutSlot`, `wbUndo`, `wbCheckWord`), startup bootstrap |

---

## 3. Critical State & Lifecycle Invariants

### 3.1 Lesson Ownership & Stale Callback Cancellation
- **`lessonVersion` & `identifyPromptId`**: Every mode transition (`setMode`), round reset, player switch (`switchToPlayer`), or statistics reset (`resetLearnedProgress`) increments `lessonVersion` (and `identifyPromptId` in Find Letters mode).
- **`scheduleLesson(callback, delay, version, pauseAware)`**: Always use `scheduleLesson` instead of raw `setTimeout` for lesson transitions, phonics callbacks, drawing retry clears, and post-answer advances so pending callbacks are automatically cancelled if the user switches modes, opens a dialog, or changes players.
- **Voice & Microphone Cleanup**: Opening any dialog (`openDialog`), switching modes (`setMode`), or turning Sound Off (`setSoundMode('off')`) must immediately stop active microphone streams (`stopVoiceResources()`), cancel pending `getUserMedia` permission promises via `recordingGeneration`, and pause recorded clip playback (`playbackAudio`).

### 3.2 Round Progression & Outcome Recording (`QUESTIONS_PER_ROUND = 15`)
- **All three modes (`identify`, `draw`, `wordBuilder`) complete 15-question rounds** via the central `recordOutcome(correct, responseTime, resolvesQuestion, itemKey)` producer:
  - In **Find Letters** (`identify`) and **Tracing Practice** (`draw`), wrong attempts record accuracy/error stats and allow a retry on the same prompt (`resolvesQuestion = false`), while correct answers and timeouts resolve the question (`resolvesQuestion = true`, incrementing `roundResolved`).
  - In **Word Builder** (`wordBuilder`), tapping an empty `.wb-slot` invokes `wbSoundOutSlot(i)` (Elkonin Sound Box scaffolding that speaks and displays the phoneme sound for `wbTargetWord[i]` without undoing other slots), whereas tapping a filled `.wb-slot`, clicking `#wbUndoBtn`, or pressing `Backspace` invokes `wbUndo()` before filling the final slot; completing all slots resolves the word (`resolvesQuestion = true`) and advances after feedback.
  - Starting the next round (`startNextRound()`) preserves `problemLetters` into `lastRoundProblemLetters` before calling `resetRoundState()` so `updateAdaptivePool()` boosts those letters in the following round.
- **Separate Mastery Domains & Targeted Practice**:
  - `letterPerformance[lower]` and `lettersMastered` track **recognition mastery** (Find Letters mode only), while `confusionMatrix[targetLower]` injects empirically confused letters into Find Letters distractors.
  - `modePerformance.draw[letter]` tracks **handwriting performance** (used by `updateAdaptivePool` when `currentMode === 'draw'`).
  - `modePerformance.wordBuilder[word]` tracks **spelling performance** (used by `getWordBuilderTarget()` to weight low-accuracy and unseen words higher, and surfaced in `#wordBuilderAnalyticsSummary` inside `#parentDashboard` with clickable `.wb-practice-word-btn` buttons via `practiceWordBuilderWord(word)`). Spelling or tracing a letter must never inflate recognition mastery or trigger `"Quick Recognition"` speed insights.
- **Mini-Game Breaks & Celebrations**:
  - Automatic mini-game breaks (`Letter Rain` and `Memory Match`) may trigger between questions in Find Letters and Word Builder modes when `Focus Mode` is off, and exiting a break (`endLetterRain` / `endMemoryMatch`) must always resume the originating `currentMode`. `startMemoryMatch()` selects 8 distinct letters without mutating `recentLetters`.
  - The active Celebration Theme (`celebrationEmojis[celebrationType]`) emits themed particles across Find Letters (`createLetterCelebration` -> `createCustomCelebration`), Tracing Practice (`checkDrawingNew` -> `createDrawingCelebration`), and Word Builder (`createWordBuilderParticles`).

### 3.3 Multiplayer Profile Isolation & Live Synchronization
- When `multiplayerMode` is active (`players.length > 0` and `currentPlayer` is selected):
  - Every outcome, `persistDrawAnalytics()`, and `saveGameData()` call immediately synchronizes active state (including per-player `drawAnalytics`) into `currentPlayer` (`saveCurrentPlayerState()`) and persists `letterLearningPlayers`.
  - `updateScoreDisplay()` updates both `#scoreDisplay` and the active `.player-chip.active` text (`Score: N`) and `aria-label` (`Play as <Name>, score <N>`) in place without replacing focused DOM nodes.
  - Creating the first profile migrates any existing anonymous session progress (`score`, `correctAnswers`, `sessionPlayMs`, `drawAnalytics`, etc.) into that first player so first-run progress is never lost; subsequent profiles start with clean 0-attempt `drawAnalytics`.
  - Inside `#parentDashboard`, clicking or pressing `Enter`/`Space` on any `.player-stat-card` calls `switchToPlayer(index)` and refreshes all dashboard analytics (`updateDashboard()`) for that child in place while keeping the lesson paused.
  - Switching players or resetting statistics must call `resetSelectionHistory()` to clear `recentLetters`, `adaptivePool`, `latestLetterWeights`, `shapeBiasTargetLower` / `shapeBiasRoundsRemaining`, `lastRoundProblemLetters`, and forced target overrides.
  - Player names must always be rendered as plain text (`textContent` / `escapeText`), never raw HTML.

### 3.4 Tracing & Handwriting Geometry Invariants
- **`resampleStroke(points, count)`**: Must terminate in bounded time for any finite point array (including duplicate points, single-point taps, and 48-point collinear inputs), never mutate its input array, and never extrapolate beyond endpoints.
- **`createTraceCloud(strokes, count)`**: Allocates samples across strokes proportionally to arc length without manufacturing phantom points across pen-up travel between strokes.
- **`discreteFrechetDistance(ptsA, ptsB)` & `strokeCurvatureVariation(points)`**: Order-preserving discrete Fréchet distance (`O(n·m)` time, `O(m)` space) and total turning-angle curvature variation are computed in `checkDrawingNew()` and recorded in `llg_draw_analytics_v1` (`avgFrechet`, `avgCurvature`, `missingDot`, `missingCrossbar`). When a required dot (`i`/`j`) or crossbar (`t`/`f`/`E`/`F`/`H`) is omitted, `checkDrawingNew()` surfaces `tmpl.feedback.incomplete`.
- **Canvas Resize, Single-Stroke Undo & High-DPI**: Resizing the viewport or rotating a phone must preserve existing canvas ink, `drawingPoints` coordinates (scaled to the new CSS box), `devicePixelRatio` transform, and the round purple pen style (`lineWidth = 8`, `strokeStyle = '#764ba2'`). `undoLastStroke()` (`#undoStrokeBtn` / `Ctrl+Z` / `U` key) removes only the last stroke (`null`-delimited segment) and redraws remaining strokes cleanly via `redrawCanvasFromPoints()`.
- **52 Formation Guides & Multi-Stroke Progress**: `LETTER_CHECKPOINTS` defines exact multi-stroke guide coordinates in the `0 0 100 100` box for all 26 lowercase (`a–z`) and 26 uppercase (`A–Z`) letters, and `updateFormationStrokeProgress()` highlights completed (`.stroke-complete`) and next (`.stroke-next`) strokes as the child traces.

### 3.5 Dialogs, Accessibility & Storage Resilience
- **Dialog Focus & Inertness**: All overlays (`#settingsModal`, `#achievementModal`, `#playerModal`, `#parentDashboard`, `#roundModal`, `#streakModal`) open through `openDialog(id)` and close through `closeDialog(id)`. While open, background siblings in `.container` have `inert = true`, `lessonPaused = true` pauses timers and play-time accumulation (shifting `questionStartTime` / `drawQuestionStartTime` / `timerDeadline` by `pausedFor` on close), `Tab` / `Shift+Tab` wraps inside the dialog without delayed focus-reset races, and `Escape` closes the dialog and restores focus to `dialogReturnFocus`.
- **Storage Guardrails & Portable Backups**: Always access `localStorage` via `readStorage`, `writeStorage`, and `removeStorage`. If storage throws `SecurityError` or `QuotaExceededError`, reveal `#storageStatus` and keep all game modes functional in memory. `exportProgressBackup()` and `importProgressBackup()` allow non-destructive JSON export/restore of `letterLearningGameData`, `letterLearningPlayers`, and `llg_draw_analytics_v1`.

---

## 4. Verification & Testing

Use Node 22+ to run the automated test suites:

```bash
# Fast static syntax, handler, and data-integrity checks (< 1s)
npm run build

# Geometry unit tests (arc-length resampling, pen-up cloud allocation, Fréchet distance)
node --test tests/geometry.test.cjs

# Full browser E2E regression suite (Chromium default; also supports firefox and webkit)
npm test
LLG_BROWSER=firefox npm test
LLG_BROWSER=webkit npm test
```

---

## 5. Issue Tracking with Beads (`br` / `bv`)

- Track issues and quality gates in `.beads/issues.jsonl` using `br` (`beads_rust`) and `bv` (`beads_viewer`).
- Run `bv --robot-triage` or `br list` to inspect open tasks and dependencies.
- After modifying beads, run `br sync --flush-only` so `.beads/issues.jsonl` stays synchronized with git.
