# Changelog

All notable changes to **Learn Your Letters** are documented in this file,
organized by capability rather than raw diff order. The project has no formal
releases or version tags; the single `main` branch contains 111 commits
spanning 2025-09-08 through 2026-02-21.

Every commit link below resolves to
`https://github.com/Dicklesworthstone/letter_learning_game/commit/<full-SHA>`.

---

## How to Read This File

| Symbol | Meaning |
|--------|---------|
| **New** | Feature or subsystem introduced for the first time |
| **Fix** | Bug fix or correctness improvement |
| **Tune** | Threshold / parameter adjustment (especially tracing recognizer) |
| **Polish** | UI, layout, formatting, or cosmetic change |
| **Revert** | Commit that undoes a prior commit |
| **Chore** | Repo metadata, licensing, CI, analytics |

---

## Repository Metadata and Licensing (2026-01 -- 2026-02)

Housekeeping commits that do not change the application itself.

- [`312683d`](https://github.com/Dicklesworthstone/letter_learning_game/commit/312683d5737efecdc38e4b4b16445819b62a4f48) -- **New** Add MIT License (2026-01-21).
- [`06e83af`](https://github.com/Dicklesworthstone/letter_learning_game/commit/06e83afef804f631760f674bf87a28dcf120a745) -- **Chore** Add `.gitignore` with `.DS_Store` pattern (2026-02-15).
- [`92ce091`](https://github.com/Dicklesworthstone/letter_learning_game/commit/92ce091881ecc4edad6c0595c6a7b39bc122e25a) -- **Chore** Add GitHub social preview image, 1280x640 (2026-02-21).
- [`66c8a06`](https://github.com/Dicklesworthstone/letter_learning_game/commit/66c8a067bdb92fb7601f1c4a725b3f86f0c15327) -- **Chore** Update license to MIT with OpenAI/Anthropic Rider (2026-02-21). *Current HEAD.*

---

## Stale-Interaction Guards (2025-11-04 -- 2025-11-06)

A targeted set of fixes for a class of bugs where UI callbacks fire against
outdated game state -- for example, a child taps an answer tile after the
question has already advanced, or a phonics speech callback runs for a prompt
that is no longer current.

- [`3ad0f19`](https://github.com/Dicklesworthstone/letter_learning_game/commit/3ad0f19b9813bcf6f5c77244aaae8ad0298b8ae2) -- **Fix** Guard identify-prompt speech callbacks against stale state.
- [`c5bd86c`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c5bd86c2f0b7638de95a6ebd05d692afb96b36e2) -- **Fix** Stamp `questionId` on button elements; `checkAnswer` and `playCurrentLetter` now ignore clicks from outdated UI states.
- [`f00facb`](https://github.com/Dicklesworthstone/letter_learning_game/commit/f00facbe710caf4a93673c15a8ce44485f0971c7) -- **Fix** Guard phonics phase against stale prompts.

---

## TTS, Audio Engine, and Analytics (2025-09-15)

### Speech Synthesis Improvements

- [`d2f8567`](https://github.com/Dicklesworthstone/letter_learning_game/commit/d2f8567d8afe4d8dcb2f95c3244170c372f1b252) -- **New** Lightweight TTS activity guards to manage speech synthesis interruptions; "polite" speaking mode that avoids cutting off ongoing audio. Also adds draw analytics for letter acceptance metrics with `localStorage` persistence.
- [`945efc8`](https://github.com/Dicklesworthstone/letter_learning_game/commit/945efc898110f170281acc718355d7e941315c1e) -- **Fix** Add `skipCancel` option to `speakLetter` in minigames for uninterrupted audio playback.
- [`a14d116`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a14d11698320efdd99b50e7ecd5965804c3ff13d) -- **New** Track `deepCount` for accurate deep-score averaging; update score display to reflect new metrics; extend `skipCancel` to more speech calls.

### Achievement and Streak Display

- [`0b1fbfa`](https://github.com/Dicklesworthstone/letter_learning_game/commit/0b1fbfaeb51fc8c9edd2e9c973691b290988d871) -- **Polish** Improved visibility and layout for achievements and streak display on mobile; updated tracking logic; fade-in effects for streak notifications.

---

## Adaptive Learning: Confusion Matrix and Spaced Repetition (2025-09-14)

- [`9d4a35a`](https://github.com/Dicklesworthstone/letter_learning_game/commit/9d4a35a6c23709b1e44d50eb0ac4373f9ef57a99) -- **New** Confusion matrix for letter recognition: tracks which letters a child confuses with which, enabling targeted practice. Integrates spaced-repetition scheduling, improved feedback for incorrect answers, and per-player confusion matrices in saved data.

---

## Word Builder Mode (2025-09-13 -- 2025-09-14)

The second core game mode, where children spell words by tapping letter tiles
into slots. Features adaptive difficulty (easy/medium/hard word pools),
case-consistent letter banks, and celebratory animations.

### First Attempt, Revert, and Clean Re-implementation

- [`b77f420`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b77f420a21c5f371e2fcc17e5726c1ca0dcf1cd0) -- **New** Initial Word Builder implementation with full UI, theme colors, responsive design, word validation, animations, and settings toggle. *(Reverted -- introduced regressions in other modes.)*
- [`aa0b5b7`](https://github.com/Dicklesworthstone/letter_learning_game/commit/aa0b5b71b9f48c1f65bfab7e32e4379ea28aa9c8) -- **Revert** Roll back the above Word Builder commit.
- [`c2e445d`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c2e445daf01d549c830dff046551e91680dfe20b) -- **New** Clean re-implementation: button, minimal CSS, working game logic, no impact on Find Letters or Tracing modes.
- [`33d807f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/33d807f58da2afe66198c08d0399614aaa7c8f45) -- **Fix** Re-add Word Builder functions lost during revert; add subtle animations; wire mode to `setMode`.

### Feature Enrichment

- [`a3f1390`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a3f1390470e456377eda01ef801d574638fa26cd) -- **New** Auto-speak target word on new round; case-consistent letter bank; GSAP visuals with anchor emoji; confetti on correct word.
- [`b6ed32b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b6ed32be1228ac0e17a81fb77787cd1dcceb8587) -- **Polish** Vibrant styles, celebratory animations, expanded emoji support for words. README updated to reflect new mode.
- [`5a6cd7b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/5a6cd7bf6e086e1afff95ef2b43314b6c66cd7d0) -- **New** Word Builder On/Off toggle in Settings; difficulty adjusts based on player performance; error handling for word selection.
- [`3e229e8`](https://github.com/Dicklesworthstone/letter_learning_game/commit/3e229e83d775c292a4df167edb15cd64aae1a600) -- **Polish** UX: reduced-motion-safe mode transition; `aria-live` on score; settings focus return; persist timer/case/sound with `localStorage`.

### Difficulty Progression and Mobile Layout

- [`cce9bdb`](https://github.com/Dicklesworthstone/letter_learning_game/commit/cce9bdb234e83cfb43234d8041656233fea57d62) -- **Tune** Refine difficulty thresholds for level up/down; recent-word tracking to avoid repeats; visual animations on level change; scoring logic smoothing.
- [`ddc66d0`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ddc66d05b74eec619e5a82748a591f7e87ae5b44) -- **Polish** Compact mode for 4+ letter words on mobile; speaker button for audio feedback; improved button styles.
- [`0ac304f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/0ac304f0877303a28103d981d04ed91687d7de46) -- **Polish** Compact score display; improved mobile word-slot layout; optimized audio playback management.

---

## Phonetic Pronunciation Tuning (2025-09-08 -- 2025-09-13)

The SpeechSynthesis API produces different results on different platforms.
These commits iteratively tune the phonetic maps and letter-name spellings
fed to TTS engines so that children hear clear, consistent sounds.

- [`c745c3b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c745c3b2abcf9561046da6969ed186a7fdad7c38) -- **Tune** Refactor phonetic definitions: commas instead of periods; streamlined letter-name pronunciations for TTS.
- [`88d79c2`](https://github.com/Dicklesworthstone/letter_learning_game/commit/88d79c2c785d943b033170b7e23e64d23634606b) -- **Tune** Improve pronunciation for letter "a".
- [`875ed03`](https://github.com/Dicklesworthstone/letter_learning_game/commit/875ed03ffa02531e242d1c7a4d7f7fc2a4e502a8) -- **Tune** Update icons and pronunciation for w, x, y, i.
- [`ac354f4`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ac354f493783eb61126e373c5c8f919d8186adc2) -- **Tune** Update pronunciation for k and w.
- [`1179c18`](https://github.com/Dicklesworthstone/letter_learning_game/commit/1179c18c51aecf0e01a124410ee4c2aa0d14aea9) -- **Tune** Update phonetic pronunciations for a, e, r, x; remove phonics echo to streamline the pronunciation phase.
- [`4a2ca2e`](https://github.com/Dicklesworthstone/letter_learning_game/commit/4a2ca2e8e0fa8ee1c3c4d1f2ee73303d6d0be06a) -- **Polish** Streamline phonics sound prompt; add countdown timer for sound recognition phase.
- [`d63b6dc`](https://github.com/Dicklesworthstone/letter_learning_game/commit/d63b6dcb19b8c3a055db71efb3d59fb7c80913b7) -- **Tune** Refine phonetic sounds for c, e, i, u, x.
- [`2db529f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/2db529f588f1fb0b544b0de24073c72b277696d2) -- **Tune** Enhance vowel and consonant spellings for improved TTS accuracy across platforms (2025-09-13).

---

## Tracing Recognizer: Hybrid Engine (2025-09-09)

The most commit-intensive area of the project. The letter-tracing recognizer
was rebuilt from scratch as a hybrid system (classical cloud matching + IoU
overlap + optional MobileNet deep-similarity via TensorFlow.js), then
iteratively tuned over approximately 25 commits to balance permissiveness
against accuracy. The guiding principle: prioritize the child's experience
(avoid frustration from false rejections) while still preventing obvious
mismatches (e.g., a scribble accepted as "O").

### Architecture

- [`84ed036`](https://github.com/Dicklesworthstone/letter_learning_game/commit/84ed036cda888664edae82f6c4ed1f152696e4a5) -- **New** Replace legacy recognizer with hybrid engine: cloud matching + IoU + optional MobileNet embeddings. Normalize deep cosine similarity to [0,1]. Add TensorFlow.js and MobileNet CDNs.
- [`d7f77ed`](https://github.com/Dicklesworthstone/letter_learning_game/commit/d7f77ed9f1b337cbb4d57f9d861d86588221dc6f) -- **Chore** Remove legacy `checkDrawing` implementation; hybrid recognizer is now the sole path.
- [`2d2795d`](https://github.com/Dicklesworthstone/letter_learning_game/commit/2d2795d00585ecb18a5394ff7f729538dcbed8a8) -- **Tune** Enhance stroke tolerance for complex curved letters G and g; additional matching criteria.

### Global Threshold Tuning (chronological)

These commits adjust the global parameters that govern how strictly or
leniently the recognizer accepts a child's drawing.

- [`88d6efc`](https://github.com/Dicklesworthstone/letter_learning_game/commit/88d6efc6b09774600421ccfd9570c1ad6b9cfa39) -- **Tune** Lower `BASE_ACCEPT`, widen margins, relax dot/crossbar penalties, reduce `bothBad` gate, tweak classical weights, lower deep thresholds, lower resample count, raise `CLOUD_NORM`.
- [`277f162`](https://github.com/Dicklesworthstone/letter_learning_game/commit/277f162346fc49fb2d9d63e3daaacd4abf502f96) -- **Fix** Remove size-based rejection; do not block small-but-correct drawings.
- [`11e596b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/11e596b6826d1c6ca1a227682eda0ffc04a30965) -- **Tune** Broadly relax for kids: lower thresholds, remove early reject, increase rotation tolerance, shift weights toward cloud, widen IoU brush, loosen scribble heuristic, boost easing for hard letters (including S, Q).
- [`6db984f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/6db984fc0c892e28e9882d5de7731014c695ce2e) -- **Tune** Dial back to balanced level: higher base threshold, restore early off-shape reject, moderate rotation (30 deg), denser resample (80), reweight classical to cloud 0.75, narrower clamping.
- [`697edad`](https://github.com/Dicklesworthstone/letter_learning_game/commit/697edad215e7092cab22558ad1bb23614962a47b) -- **Tune** Stabilize with per-letter floors and shape-first cloud gate; require modest margins; balanced thresholds.
- [`73206da`](https://github.com/Dicklesworthstone/letter_learning_game/commit/73206da0b28d29b52182a1e987780c08a1f691d9) -- **Tune** Broadly ease: lower resample to 64, increase rotation to 35 deg, raise `CLOUD_NORM` to 30; make m/M/n more permissive via floors; lower curvy-letter floors; increase easing for forgiving set.
- [`1fd76dd`](https://github.com/Dicklesworthstone/letter_learning_game/commit/1fd76dde3ec00f90c8cc5aa21efc5dcdea843c6d) -- **Tune** Ease Q/q and global thresholds; relax cloud gate (floor-0.10); remove `bothBad`; widen IoU brush; raise rotation to 45 deg.
- [`dcafe87`](https://github.com/Dicklesworthstone/letter_learning_game/commit/dcafe87ed550533ee87f8e8553bbdf57687aa650) -- **Tune** Dramatically relax for reliability: lower floors (including E/e), add E to easing, reduce crossbar penalty for E, increase rotation to 60 deg, resample 48, widen IoU brush.
- [`ca09202`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ca0920297b2bb2d77fe754f717cf4e95d76e46b5) -- **Tune** TEMP ultra-permissive mode: bypass scribble rejection and force acceptance while tuning. *(Avoids child frustration immediately.)*

### Per-Letter Easing

Individual letters that children find difficult to draw are given more
forgiving thresholds via the `LETTER_EASING` map.

- [`6e5e381`](https://github.com/Dicklesworthstone/letter_learning_game/commit/6e5e3816c71b1206a718477eb7bd2aa0487bdf45) -- **Tune** Make lowercase "e" more permissive (lower cloud floor to 0.40).
- [`4f51247`](https://github.com/Dicklesworthstone/letter_learning_game/commit/4f51247f223e598a70e858399b9c9cb40e3ebb60) -- **Tune** Ease Z/z (add to `LETTER_EASING` at -0.06).
- [`4e6805c`](https://github.com/Dicklesworthstone/letter_learning_game/commit/4e6805cfff7a4c1326aeff9d65612c06aa143ae1) -- **Tune** Ease V/v; remove from strict list.
- [`7f8a48c`](https://github.com/Dicklesworthstone/letter_learning_game/commit/7f8a48c1ca2f6fd6ae5ea57c5f1b0121e25d9f2a) -- **Tune** Ease N/n (add to `LETTER_EASING` at -0.06).
- [`05c20f1`](https://github.com/Dicklesworthstone/letter_learning_game/commit/05c20f1ec2e7d1f2ad983e4b921cb5fc3b99ce86) -- **Tune** Ease Y/y; slightly lower global clamp and near-threshold margin.
- [`ed16fe0`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ed16fe0004aeef7d9a4c82d47dce6dded2a0efbd) -- **Tune** Add "O" to easing map; lower IoU threshold for loopish letters.

### Shape Guards and Misclassification Prevention

After making the recognizer more permissive, these commits add targeted
guards to prevent specific categories of false acceptance.

- [`874a072`](https://github.com/Dicklesworthstone/letter_learning_game/commit/874a072b82679fa9a57a0d6001d696a72e27dac9) -- **Fix** Replace ultra-permissive mode with middle-ground easy gate; extra leniency for Q/q and g/G.
- [`ac363b6`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ac363b6eb398db94a543f2852faf8cdea1b4dc42) -- **Fix** Minimal shape guard for loopish letters (require IoU >= 0.20) to prevent "X" counting as "O".
- [`3196efe`](https://github.com/Dicklesworthstone/letter_learning_game/commit/3196efe1983224d628bad936768126ebff23682c) -- **Fix** Generic wrong-letter dominance guard (classical margin > 0.08 or deep margin < -0.10) to block obvious mismatches.
- [`64725ef`](https://github.com/Dicklesworthstone/letter_learning_game/commit/64725ef58cddac6d21997ec1cb00341be828c76e) -- **Fix** Cross (X-like) shape detection to prevent misclassification of other letters as "X".

---

## Tracing Practice: Canvas, Hints, and Formation Guides (2025-09-09)

### Idle Hint System

- [`95788a6`](https://github.com/Dicklesworthstone/letter_learning_game/commit/95788a65e36d1ce3803378590a925d06bd86ce9d) -- **New** Idle hint: after inactivity, a faint letter guide fades in on the canvas. Disabled when the child starts drawing. Hint penalties applied to score. Timer management for hint lifecycle.

### Letter Formation Overlay

- [`65a2b59`](https://github.com/Dicklesworthstone/letter_learning_game/commit/65a2b59d2f2ea826c5a46d42c491834c8c48ac0c) -- **Fix** Fix formation guide scaling and SVG lookup; add stroke paths for A, J, j; non-scaling strokes; `preserveAspectRatio` on SVG viewBox.

---

## Celebration System (2025-09-08 -- 2025-09-09)

Visual reward system that plays themed animations when a child answers
correctly. Each letter can have its own celebration theme (rockets, balloons,
sparkles, etc.).

- [`b5665d3`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b5665d33944affad1836f0e105b4a47aed0258ed) -- **New** Sparkle animation; celebration overlay for drawing achievements.
- [`5d77bb7`](https://github.com/Dicklesworthstone/letter_learning_game/commit/5d77bb7342b5b63b17b7c0f47910633c956f7954) -- **New** Letter-specific celebration animations with hero-burst effect and themed visual configs per letter; stroke tolerance refinements.
- [`a488830`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a488830a5f03f85b11443f6158303ae413b43c49) -- **New** Additional letter-specific celebrations; prevent duplicate prompts in draw mode; phonetic sound refinements.
- [`5de0ce1`](https://github.com/Dicklesworthstone/letter_learning_game/commit/5de0ce1cb100bef89b4822b1edeca5820f1eb795) -- **New** Screen shake, shockwaves, enhanced sparkle effects; balloons, twinkles, smoke trails, contrail puffs.

---

## Mastery Tracking, Dashboard, and Data Management (2025-09-09)

### Progress Visualization

- [`6494e1c`](https://github.com/Dicklesworthstone/letter_learning_game/commit/6494e1c52381132f1745a37059fc82d9bbc7a23a) -- **New** Mastery pie chart for visual progress tracking; per-letter scoring; child-friendly word examples per letter; phonics repeat feature; PayPal donation button.
- [`ddaa8ec`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ddaa8ec310cdc110ab80aef9aba89b209d2e8e19) -- **Polish** Polished scrollbars for settings and achievements modals; enhanced mastery pie chart styling.

### Parent/Teacher Dashboard Access

- [`b5ace0d`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b5ace0de09594226bc76393b1b80bce008e1341e) -- **New** Settings callout for quick access to Parent Dashboard; info tips for various settings; refined phonetic sound prompts.

### Data Reset

- [`e2d2ac2`](https://github.com/Dicklesworthstone/letter_learning_game/commit/e2d2ac25668d22779b47c97171c11b616415e1ef) -- **New** Buttons to reset all statistics and current-player statistics; layout responsiveness via `clamp()`; phonics prompt timing improvements.

---

## Google Analytics (2025-09-09)

- [`ef2120b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ef2120b9b93d83a6ba0d34d677f1c3d57ee43b81) -- **Chore** Add Google Analytics tracking tag for usage insights.

---

## Desktop Layout and Responsive Polish (2025-09-08 -- 2025-09-09)

### Desktop Improvements

- [`c7ca60e`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c7ca60eb6aaa358a05bab01c9149a1b2336f7a7b) -- **Polish** Desktop media queries: margins, padding, button dimensions; sound button prominence.
- [`dc20da9`](https://github.com/Dicklesworthstone/letter_learning_game/commit/dc20da978b3365253e7ab8902956a22190b18b70) -- **Polish** Centered background and container alignment; player selector positioning; stroke data densification for drawing accuracy.
- [`16e24f7`](https://github.com/Dicklesworthstone/letter_learning_game/commit/16e24f7547b8997be541f2983f39f610824e0950) -- **Polish** Background size `cover`; constrained container width; margin and border-radius.

### Mobile and iPhone Layout

- [`a51a928`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a51a928e2b10b2f5cc4251816f357b8ea3309123) -- **Fix** Instruction margin overlap with sound button on iPhone.
- [`aadbe35`](https://github.com/Dicklesworthstone/letter_learning_game/commit/aadbe35f1ea2fe87d774cf200d798d6b203168fb) -- **Polish** Compact portrait mode media queries; consistent padding and dimensions across game-area elements.
- [`a2a5bcb`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a2a5bcba2ac6d7b6d2ea5cce21c1137f82ae4922) -- **Polish** Display property tweaks; speech synthesis pacing; smoother game-state transitions.

### Typography and Sizing

- [`20f1e4b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/20f1e4bcd9a024fb3c79058de368c9c7ba92db7c) -- **Polish** Font sizes, padding, margins via `clamp()` for fluid sizing; improved sound button and start screen.
- [`f03e017`](https://github.com/Dicklesworthstone/letter_learning_game/commit/f03e0173245fad9b8ab09042fc7d200bec683161) -- **Polish** New canvas resizing function; proper alignment during viewport changes.
- [`77baf90`](https://github.com/Dicklesworthstone/letter_learning_game/commit/77baf90f22b04d0e01cc48529bb2f9e755e9c822) -- **Polish** Dynamic viewport height (`dvh`); flexible container sizing; consistent button aspect ratios; mobile layout.

---

## iOS Mobile Compatibility (2025-09-08)

A concentrated effort to fix touch, scroll, and rendering issues specific to
Safari on iPhone. These commits address viewport fit, safe-area insets, scroll
chaining, touch event passthrough, z-index stacking, and emoji rendering.

- [`e7d992a`](https://github.com/Dicklesworthstone/letter_learning_game/commit/e7d992a267a1d58b4437e4457ed195e41188faa4) -- **Fix** Make background bubbles non-interactive; remove backdrop blur; z-index fix; use `100dvh` for mobile height.
- [`bd55382`](https://github.com/Dicklesworthstone/letter_learning_game/commit/bd55382b61286a2579a76e67b4f0430f20640a45) -- **Fix** Proper `viewport-fit=cover`; safe-area insets; prevent scroll-chain/bounce; momentum scrolling for content; fixed header.
- [`77337ec`](https://github.com/Dicklesworthstone/letter_learning_game/commit/77337ec4f81ba01f7b33a2df281c5048631e7a27) -- **Fix** Place decorative background behind UI (z-index) to avoid overlay artifacts.
- [`b44b6ff`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b44b6ff54125832168b026da1c214c548f087fc4) -- **Fix** iPhone UX overhaul: single scroll container with sticky header; remove container blur; prevent drag-scrolling in minigames. Dramatically reduces wasted top space and eliminates broken scroll/touch.
- [`0b228ce`](https://github.com/Dicklesworthstone/letter_learning_game/commit/0b228ce319a858f8ff4a1feb72c8d428c8086af5) -- **Fix** Fix confusing vowel coloring; iOS emoji rendering; sync TTS with question to avoid race; same-case distractors; audible phonics prompt; phonetic map improvements (e.g., "zuh" for Z).
- [`287889e`](https://github.com/Dicklesworthstone/letter_learning_game/commit/287889e05b9a1335983c99e5a0442ab976db9368) -- **Fix** Fix round logic (no per-question resets); GSAP celebration bursts; match distractor case; additional iOS emoji and TTS polishing.

---

## Visual Design Iterations (2025-09-08)

The visual identity went through several passes: glassmorphism was introduced,
then removed in favor of a cleaner modern look. Design tokens (CSS custom
properties for spacing, shadows, and palette) were established and refined.

### Design Token System and UI Polish

- [`ce46058`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ce4605825e7216f5e95cb0de07d12ddedb3c7cd7) -- **New** Glassmorphism effect; updated color variables for theming; refined button designs; modern gradients and shadows.
- [`3205547`](https://github.com/Dicklesworthstone/letter_learning_game/commit/32055473d76732123d8eeda818e2cd40fb289b61) -- **Polish** Refined palette, typography, buttons, modals, animations; design tokens (spacing, shadows); loading skeletons for perceived performance.
- [`ec27fb7`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ec27fb77cd69e3fcadd70e33d2913240343934c9) -- **Polish** Revamp UI/UX: remove glassmorphism for cleaner look; enhanced header; mobile-optimized layout; adaptive difficulty and performance tracking; phonetic sound clarity. README refined.
- [`d1e1fd8`](https://github.com/Dicklesworthstone/letter_learning_game/commit/d1e1fd8f7229b5ccedcfe6f4563f4b71dd1a8a0c) -- **Polish** Vibrant background animations with floating orbs and bubbles for playful aesthetic; refined accessibility; mobile layout.

---

## Phonics System (2025-09-08)

### Phonics On/Off and Flow

- [`b48b50f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b48b50f1acf9b8247eeb14c86c54522074f9d531) -- **New** Phonics On/Off setting; responsive design adjustments; phonics phase respects user preferences.
- [`4a27c30`](https://github.com/Dicklesworthstone/letter_learning_game/commit/4a27c30f95456cfb27b427d642574d3fc6ab4e32) -- **New** Skip button for phonics prompts; improved TTS pacing; reduced-motion-aware animations; modal focus and accessibility.
- [`c28f997`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c28f997cd6ea19246f587bc40cd7a88330c0bbd7) -- **Polish** Disable continuous animations for calmer UX; improved phonics prompts and gesture recognition in tracing; phonics skip.

---

## Accessibility (2025-09-08)

### Focus Mode, High Contrast, and Reduce Motion

- [`cdb299f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/cdb299f966042a77dc8168db32a55d37a2eaa2fc) -- **New** Toggle switches for Focus Mode, High Contrast, and Reduce Motion; improved score feedback logic in drawing validation.
- [`5c7b94d`](https://github.com/Dicklesworthstone/letter_learning_game/commit/5c7b94d7258d4d1142f48b8ec190c010824b7db6) -- **New** Global `prefers-reduced-motion` support; refined button interactions for touch; narrow-screen layout enhancements.
- [`a099a5c`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a099a5c0988b71624bad00d83c3f2c8960f461b5) -- **Polish** Z-index for backdrop elements; safe-area insets; drawing performance throttling; improved modal behavior.
- [`e2417c8`](https://github.com/Dicklesworthstone/letter_learning_game/commit/e2417c824c1b501bf2f7413d64076d47bebb7236) -- **New** `fadeOut` animation; ARIA attributes on interactive elements; layout for ultra-narrow devices; compact topbar for quick settings toggles.
- [`7faea62`](https://github.com/Dicklesworthstone/letter_learning_game/commit/7faea6225819722554130baaf156d06df82832be) -- **New** Reduce Motion toggle implementation; sync toggle state with saved preferences on modal open.

---

## Settings Modal (2025-09-08)

### Layout and Controls

- [`3e3ca42`](https://github.com/Dicklesworthstone/letter_learning_game/commit/3e3ca423fc018130cbed0cb10f15c4d32d8a8ef6) -- **New** Settings modal redesign: toggle buttons for timer, letter case, and sound; visual theme selector (Classic/Animals/Colors); advanced settings section for voice recording and accessibility.
- [`60d2c01`](https://github.com/Dicklesworthstone/letter_learning_game/commit/60d2c0124b47366bb9be8a6cf2972d5896185d77) -- **Fix** Improve speech synthesis accuracy across platforms; disable achievement visual cues by request; sync advanced settings UI with saved preferences on load.
- [`d25c657`](https://github.com/Dicklesworthstone/letter_learning_game/commit/d25c657d6ea1e313a39d21f223d51042dcd21889) -- **Polish** Advanced settings disclosure styling; shorter kid-friendly rounds; score tracking clarity; focus trapping within modals.
- [`5296623`](https://github.com/Dicklesworthstone/letter_learning_game/commit/52966233d7fcfa92da9fdaa0684c5575ba681d72) -- **Polish** Button styles; celebration particle effects; voice recording toggle; settings modal aesthetics.

### Speech Synthesis and Event Handling

- [`cf10dec`](https://github.com/Dicklesworthstone/letter_learning_game/commit/cf10dec557189368a00d69cc34cf0e8ff05fdadc) -- **Fix** Simplify speech cancellation logic; prevent repeated countdown announcements; use `data-*` attributes for event handling.
- [`97b5421`](https://github.com/Dicklesworthstone/letter_learning_game/commit/97b5421457822e01fe69b0f3fd850307c7c7a1c4) -- **Polish** Header padding; button styles; mobile adjustments; streamlined voice selection; long-press timer for settings gear (parent dashboard access).

---

## Multiplayer Profiles and Achievements (2025-09-08)

### Player Profiles

- [`6ee7760`](https://github.com/Dicklesworthstone/letter_learning_game/commit/6ee7760cbe6569825877c07c9e22ba42c36c7569) -- **New** Achievement system and multiplayer profiles: per-player scores, rounds, letter performance, achievements. README updated with player management and analytics.
- [`c827d1e`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c827d1e9ebc95ad07a1bb81df5977b0f897f8174) -- **New** Player setup modal with emoji avatar and name; multiplayer features. README updated with personalized learning.
- [`723c864`](https://github.com/Dicklesworthstone/letter_learning_game/commit/723c864b6190e7489ffd45b62d8e489fa562a3a2) -- **Chore** Revise README: accessibility options, daily streak tracking, customizable celebrations, inclusive learning philosophy.

### Streak Tracking

- [`3008eae`](https://github.com/Dicklesworthstone/letter_learning_game/commit/3008eaebd634a929046242322e43682a1f9af2da) -- **Fix** Refactor streak tracking for accuracy; rename variables for clarity; safety checks for stroke number display; preserve timer state in focus mode; add celebration type to player data.

---

## Code Formatting and Cleanup (2025-09-08 -- 2025-09-09)

Commits focused purely on readability, indentation, comments, and CSS
specificity -- no behavioral changes.

- [`a6d77f2`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a6d77f29bdac600c496899f58e2dfc9b500e9255) -- **Chore** Standardize formatting; enhance comments; proper indentation.
- [`e96b1aa`](https://github.com/Dicklesworthstone/letter_learning_game/commit/e96b1aa1abfec1d9c6f81d844bc56711c0aeaa29) -- **Chore** Further formatting and readability standardization.
- [`eb786d6`](https://github.com/Dicklesworthstone/letter_learning_game/commit/eb786d6e5d23130f42d50943c5b8c3850f41bb5b) -- **Chore** Standardize code formatting; improve comments; layout consistency.
- [`ec4be33`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ec4be33acc691beed7dad3f129a4a382d22868cd) -- **Chore** Enforce `display` property with `!important` for CSS specificity.
- [`51270ce`](https://github.com/Dicklesworthstone/letter_learning_game/commit/51270ceba53eb13671edc22f7c938d25aef09e44) -- **Chore** Remove extensive media queries for cleaner, more maintainable code.

---

## Project Inception (2025-09-08)

### Initial Creation

- [`49ba6f2`](https://github.com/Dicklesworthstone/letter_learning_game/commit/49ba6f23efa231446a99c7a76548e0c215c630c1) -- **New** Add initial HTML structure and styling for single-file "Learn Your Letters" game. The entire app lives in one `index.html`.
- [`dd81b87`](https://github.com/Dicklesworthstone/letter_learning_game/commit/dd81b876c0205df26da9aef1cd10bb2fa4ea5adf) -- **New** Add README.md with project description, game mechanics, features, and educational goals.
- [`7c9c679`](https://github.com/Dicklesworthstone/letter_learning_game/commit/7c9c67989022e3036946d10acec2470673166d54) -- **New** Enhance with animations, audio feedback, responsive design; add audio system documentation to README.

### CNAME (ephemeral)

- [`a24ea20`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a24ea2032f90cffd34fd1c27a7e3af437a9efcb1) -- **New** Create CNAME for custom domain.
- [`8869164`](https://github.com/Dicklesworthstone/letter_learning_game/commit/88691641fee9c5626f4433fb3db67cb98a1b64d7) -- **Chore** Delete CNAME (reverted immediately).

---

## Commit Statistics

| Metric | Value |
|--------|-------|
| Total commits | 111 |
| First commit | 2025-09-08 |
| Latest commit | 2026-02-21 |
| Tags | 0 |
| GitHub Releases | 0 |
| Contributors | 1 (Jeffrey Emanuel) |
| Primary file | `index.html` (single-file app, ~533 KB) |

### Commits by Capability Area

| Area | Approx. Commits |
|------|-----------------|
| Tracing recognizer (architecture + tuning) | ~25 |
| UI/UX, layout, and responsive design | ~20 |
| Word Builder mode | ~12 |
| Phonics and TTS pronunciation | ~12 |
| Settings and accessibility | ~12 |
| Celebrations and animations | ~8 |
| iOS compatibility | ~6 |
| Achievements, streaks, and analytics | ~6 |
| Multiplayer / profiles | ~3 |
| Stale-interaction guards | 3 |
| Code formatting / cleanup | 5 |
| Licensing and repo metadata | 4 |
