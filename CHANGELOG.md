# Changelog

All notable changes to **Learn Your Letters** are documented in this file.

This project has no formal releases or tags. History is organized into
capability-oriented sections derived from the full commit log
(111 commits, 2025-09-08 through 2026-02-21). Every commit link points to
`https://github.com/Dicklesworthstone/letter_learning_game/commit/<hash>`.

---

## Unreleased (HEAD)

Current head: [`66c8a06`](https://github.com/Dicklesworthstone/letter_learning_game/commit/66c8a067bdb92fb7601f1c4a725b3f86f0c15327) (2026-02-21)

---

## Project Inception and Core Game (2025-09-08)

### Initial Commit

- [`49ba6f2`](https://github.com/Dicklesworthstone/letter_learning_game/commit/49ba6f23efa231446a99c7a76548e0c215c630c1) -- Add initial HTML structure and styling for the single-file "Learn Your Letters" game.
- [`dd81b87`](https://github.com/Dicklesworthstone/letter_learning_game/commit/dd81b876c0205df26da9aef1cd10bb2fa4ea5adf) -- Add README with project description, game mechanics, features, and educational goals.
- [`7c9c679`](https://github.com/Dicklesworthstone/letter_learning_game/commit/7c9c67989022e3036946d10acec2470673166d54) -- Enhance with animations, audio feedback, responsive design; add audio system docs to README.

### CNAME (ephemeral)

- [`a24ea20`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a24ea2032f90cffd34fd1c27a7e3af437a9efcb1) -- Create CNAME for custom domain.
- [`8869164`](https://github.com/Dicklesworthstone/letter_learning_game/commit/88691641fee9c5626f4433fb3db67cb98a1b64d7) -- Delete CNAME (reverted).

### Multiplayer / Profiles and Achievements System

- [`6ee7760`](https://github.com/Dicklesworthstone/letter_learning_game/commit/6ee7760cbe6569825877c07c9e22ba42c36c7569) -- Add achievement system and multiplayer profiles; update README with player management and analytics.
- [`c827d1e`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c827d1e9ebc95ad07a1bb81df5977b0f897f8174) -- Integrate player setup modal and multiplayer features; enhance README with personalized learning.
- [`723c864`](https://github.com/Dicklesworthstone/letter_learning_game/commit/723c864b6190e7489ffd45b62d8e489fa562a3a2) -- Revise README: accessibility options, daily streak tracking, customizable celebrations.

### Streak Tracking and Celebrations

- [`3008eae`](https://github.com/Dicklesworthstone/letter_learning_game/commit/3008eaebd634a929046242322e43682a1f9af2da) -- Refactor streak tracking for accuracy; rename variables, add safety checks, preserve timer state in focus mode; add celebration type to player data.
- [`b5665d3`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b5665d33944affad1836f0e105b4a47aed0258ed) -- New sparkle animation, improved speech synthesis voice selection, celebration overlay for drawing achievements.

---

## Settings, Accessibility, and UI Foundation (2025-09-08)

### Settings Modal Overhaul

- [`cf10dec`](https://github.com/Dicklesworthstone/letter_learning_game/commit/cf10dec557189368a00d69cc34cf0e8ff05fdadc) -- Simplify speech cancellation logic; use data attributes for event handling.
- [`97b5421`](https://github.com/Dicklesworthstone/letter_learning_game/commit/97b5421457822e01fe69b0f3fd850307c7c7a1c4) -- Improve layout and responsiveness; add long-press timer for settings gear (parent dashboard).
- [`e2417c8`](https://github.com/Dicklesworthstone/letter_learning_game/commit/e2417c824c1b501bf2f7413d64076d47bebb7236) -- Add fadeOut animation, ARIA attributes, compact topbar for quick settings toggles.
- [`7faea62`](https://github.com/Dicklesworthstone/letter_learning_game/commit/7faea6225819722554130baaf156d06df82832be) -- Implement Reduce Motion toggle; sync with saved preferences.
- [`5296623`](https://github.com/Dicklesworthstone/letter_learning_game/commit/52966233d7fcfa92da9fdaa0684c5575ba681d72) -- Enhance button styles, celebration particle effects, voice recording toggle.
- [`3e3ca42`](https://github.com/Dicklesworthstone/letter_learning_game/commit/3e3ca423fc018130cbed0cb10f15c4d32d8a8ef6) -- New settings modal layout: toggle buttons for timer, letter case, sound; visual theme selector; advanced settings for voice recording and accessibility.
- [`60d2c01`](https://github.com/Dicklesworthstone/letter_learning_game/commit/60d2c0124b47366bb9be8a6cf2972d5896185d77) -- Improve speech synthesis accuracy; disable achievement visual cues by request; sync advanced settings on load.
- [`d25c657`](https://github.com/Dicklesworthstone/letter_learning_game/commit/d25c657d6ea1e313a39d21f223d51042dcd21889) -- Polish advanced settings disclosure; shorter kid-friendly rounds; focus trapping in modals.

### Accessibility Features

- [`cdb299f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/cdb299f966042a77dc8168db32a55d37a2eaa2fc) -- Toggle switches for Focus Mode, High Contrast, Reduce Motion; score feedback logic for drawing.
- [`5c7b94d`](https://github.com/Dicklesworthstone/letter_learning_game/commit/5c7b94d7258d4d1142f48b8ec190c010824b7db6) -- Global reduce-motion support; refined button interactions for touch devices; narrow-screen layout.
- [`c28f997`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c28f997cd6ea19246f587bc40cd7a88330c0bbd7) -- Disable continuous animations for calmer UX; improved phonics prompts and gesture recognition in tracing.
- [`a099a5c`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a099a5c0988b71624bad00d83c3f2c8960f461b5) -- Safe-area insets; drawing performance throttling; improved modal behavior.

### Phonics System

- [`b48b50f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b48b50f1acf9b8247eeb14c86c54522074f9d531) -- Phonics On/Off setting; responsive design adjustments; respect user preferences in phonics phase.
- [`4a27c30`](https://github.com/Dicklesworthstone/letter_learning_game/commit/4a27c30f95456cfb27b427d642574d3fc6ab4e32) -- Skip button for phonics prompts; improved TTS pacing; reduced-motion-aware animations; focus/accessibility in modals.

---

## Visual Design Iterations (2025-09-08)

### Design Token System and UI Polish

- [`ce46058`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ce4605825e7216f5e95cb0de07d12ddedb3c7cd7) -- Glassmorphism effect; updated color variables; refined button designs; modern gradients and shadows.
- [`3205547`](https://github.com/Dicklesworthstone/letter_learning_game/commit/32055473d76732123d8eeda818e2cd40fb289b61) -- UI/UX polish: refined palette, typography, buttons, modals, animations; design tokens (spacing, shadows); loading skeletons.
- [`ec27fb7`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ec27fb77cd69e3fcadd70e33d2913240343934c9) -- Revamp UI/UX: remove glass morphism for cleaner look; enhanced header; mobile-optimized layout; adaptive difficulty and performance tracking; phonetic sound clarity.
- [`d1e1fd8`](https://github.com/Dicklesworthstone/letter_learning_game/commit/d1e1fd8f7229b5ccedcfe6f4563f4b71dd1a8a0c) -- Vibrant background animations; floating orbs and bubbles; refined accessibility and mobile layout.

### iOS Mobile Compatibility

- [`e7d992a`](https://github.com/Dicklesworthstone/letter_learning_game/commit/e7d992a267a1d58b4437e4457ed195e41188faa4) -- Fix iOS touch blocking and blur: non-interactive bubbles, remove backdrop blur, z-index fix, 100dvh.
- [`bd55382`](https://github.com/Dicklesworthstone/letter_learning_game/commit/bd55382b61286a2579a76e67b4f0430f20640a45) -- iOS mobile fix: proper viewport-fit, safe-area insets, prevent scroll chain/bounce, momentum scrolling, fixed header.
- [`77337ec`](https://github.com/Dicklesworthstone/letter_learning_game/commit/77337ec4f81ba01f7b33a2df281c5048631e7a27) -- Place decorative background behind UI (z-index) to avoid overlay artifacts.
- [`b44b6ff`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b44b6ff54125832168b026da1c214c548f087fc4) -- iPhone UX overhaul: single scroll container, sticky header, remove container blur, prevent drag-scrolling in minigames. Dramatically reduces wasted top space.
- [`0b228ce`](https://github.com/Dicklesworthstone/letter_learning_game/commit/0b228ce319a858f8ff4a1feb72c8d428c8086af5) -- Fix vowel coloring; iOS emoji rendering; sync TTS with question to avoid race; same-case distractors; audible phonics prompt; phonetic map improvements.
- [`287889e`](https://github.com/Dicklesworthstone/letter_learning_game/commit/287889e05b9a1335983c99e5a0442ab976db9368) -- Fix round logic (no per-question resets); GSAP celebration bursts; match distractor case; iOS emoji and TTS polishing.

### Responsive Layout and Typography

- [`77baf90`](https://github.com/Dicklesworthstone/letter_learning_game/commit/77baf90f22b04d0e01cc48529bb2f9e755e9c822) -- Dynamic viewport height; flexible container sizing; consistent button aspect ratios; mobile layout.
- [`a6d77f2`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a6d77f29bdac600c496899f58e2dfc9b500e9255) -- Code readability refactor: standardize formatting, enhance comments, proper indentation.
- [`e96b1aa`](https://github.com/Dicklesworthstone/letter_learning_game/commit/e96b1aa1abfec1d9c6f81d844bc56711c0aeaa29) -- Further formatting and readability standardization.
- [`e2d2ac2`](https://github.com/Dicklesworthstone/letter_learning_game/commit/e2d2ac25668d22779b47c97171c11b616415e1ef) -- Data management buttons (reset all / reset player stats); layout responsiveness with clamp; phonics prompt timing.
- [`20f1e4b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/20f1e4bcd9a024fb3c79058de368c9c7ba92db7c) -- Font sizes, padding, margins via clamp(); improved sound button and start screen.
- [`f03e017`](https://github.com/Dicklesworthstone/letter_learning_game/commit/f03e0173245fad9b8ab09042fc7d200bec683161) -- Canvas resizing function; proper alignment during viewport changes.
- [`aadbe35`](https://github.com/Dicklesworthstone/letter_learning_game/commit/aadbe35f1ea2fe87d774cf200d798d6b203168fb) -- Compact portrait mode media queries; consistent padding and dimensions.

---

## Tracing Practice: Drawing and Canvas (2025-09-08 -- 2025-09-09)

### Idle Hint and Formation Guides

- [`95788a6`](https://github.com/Dicklesworthstone/letter_learning_game/commit/95788a65e36d1ce3803378590a925d06bd86ce9d) -- Idle hint feature: faint letter guide fades in after inactivity; hint penalties in score; timer management.
- [`65a2b59`](https://github.com/Dicklesworthstone/letter_learning_game/commit/65a2b59d2f2ea826c5a46d42c491834c8c48ac0c) -- Fix formation guide scaling and lookup; add A, J, j paths; non-scaling strokes; preserveAspectRatio on SVG.

### Celebration Animations

- [`5de0ce1`](https://github.com/Dicklesworthstone/letter_learning_game/commit/5de0ce1cb100bef89b4822b1edeca5820f1eb795) -- Screen shake, shockwaves, enhanced sparkle effects; balloons and twinkles; smoke trails and contrail puffs.
- [`5d77bb7`](https://github.com/Dicklesworthstone/letter_learning_game/commit/5d77bb7342b5b63b17b7c0f47910633c956f7954) -- Letter-specific celebration animations (hero burst effect, themed configs per letter); stroke tolerance refinements.
- [`a488830`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a488830a5f03f85b11443f6158303ae413b43c49) -- More letter-specific celebrations; prevent duplicate prompts in draw mode; phonetic sound refinements.

### Mastery Visualization, Donation, and Enrichment

- [`6494e1c`](https://github.com/Dicklesworthstone/letter_learning_game/commit/6494e1c52381132f1745a37059fc82d9bbc7a23a) -- PayPal donation button; mastery pie chart for progress tracking; child-friendly word examples per letter; phonics repeat feature; per-letter scoring.
- [`ddaa8ec`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ddaa8ec310cdc110ab80aef9aba89b209d2e8e19) -- Polished scrollbars for settings and achievements modals; enhanced mastery pie chart styling.
- [`b5ace0d`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b5ace0de09594226bc76393b1b80bce008e1341e) -- Settings callout for Parent Dashboard quick access; info tips; refined phonetic sound prompts.
- [`a2a5bcb`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a2a5bcba2ac6d7b6d2ea5cce21c1137f82ae4922) -- Display properties; speech synthesis pacing; smoother game-state transitions.

### Desktop Layout and Background

- [`c7ca60e`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c7ca60eb6aaa358a05bab01c9149a1b2336f7a7b) -- Desktop layout improvements: media queries for margins, padding, button dimensions; sound button prominence.
- [`a51a928`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a51a928e2b10b2f5cc4251816f357b8ea3309123) -- Fix instruction margin overlapping sound button on iPhone.
- [`dc20da9`](https://github.com/Dicklesworthstone/letter_learning_game/commit/dc20da978b3365253e7ab8902956a22190b18b70) -- Centered background and container alignment; player selector positioning; stroke data densification for drawing accuracy.
- [`16e24f7`](https://github.com/Dicklesworthstone/letter_learning_game/commit/16e24f7547b8997be541f2983f39f610824e0950) -- Background size to cover; constrain container width; add margin and border-radius.

### Google Analytics

- [`ef2120b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ef2120b9b93d83a6ba0d34d677f1c3d57ee43b81) -- Add Google Analytics tracking for user insights and engagement analysis.

---

## Tracing Recognizer: Hybrid Engine (2025-09-09)

This is the most commit-intensive area of the project. The tracing recognizer
was rebuilt from scratch as a hybrid system (cloud matching + IoU + optional
MobileNet deep similarity), then iteratively tuned over ~25 commits to balance
permissiveness against accuracy -- prioritizing child experience (avoid
frustration) while preventing obvious mismatches.

### Recognizer Architecture

- [`84ed036`](https://github.com/Dicklesworthstone/letter_learning_game/commit/84ed036cda888664edae82f6c4ed1f152696e4a5) -- Replace recognizer with hybrid engine: cloud matching + IoU + optional MobileNet embeddings; add TensorFlow.js and MobileNet CDNs; normalize deep cosine similarity to [0,1].
- [`d7f77ed`](https://github.com/Dicklesworthstone/letter_learning_game/commit/d7f77ed9f1b337cbb4d57f9d861d86588221dc6f) -- Remove legacy `checkDrawing` implementation; use hybrid recognizer only.
- [`2d2795d`](https://github.com/Dicklesworthstone/letter_learning_game/commit/2d2795d00585ecb18a5394ff7f729538dcbed8a8) -- Enhance stroke tolerance for curved letters G and g; additional matching criteria.

### Iterative Tuning (chronological, most recent last)

- [`88d6efc`](https://github.com/Dicklesworthstone/letter_learning_game/commit/88d6efc6b09774600421ccfd9570c1ad6b9cfa39) -- Lower BASE_ACCEPT, widen margins, relax dot/crossbar penalties, reduce bothBad gate, tweak classical weights, lower deep thresholds.
- [`277f162`](https://github.com/Dicklesworthstone/letter_learning_game/commit/277f162346fc49fb2d9d63e3daaacd4abf502f96) -- Remove size-based rejection; do not block small-but-correct drawings.
- [`11e596b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/11e596b6826d1c6ca1a227682eda0ffc04a30965) -- Broadly relax for kids: lower thresholds, remove early reject, increase rotation tolerance, shift weights toward cloud, widen IoU brush, loosen scribble heuristic.
- [`6db984f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/6db984fc0c892e28e9882d5de7731014c695ce2e) -- Dial back to balanced level: higher base threshold, restore early off-shape reject, moderate rotation (30 degrees), denser resample, reweight classical.
- [`697edad`](https://github.com/Dicklesworthstone/letter_learning_game/commit/697edad215e7092cab22558ad1bb23614962a47b) -- Stabilize with per-letter floors and shape-first cloud gate; require modest margins.

### Per-Letter Easing and Special Cases

- [`6e5e381`](https://github.com/Dicklesworthstone/letter_learning_game/commit/6e5e3816c71b1206a718477eb7bd2aa0487bdf45) -- Make lowercase e more permissive (lower cloud floor to 0.40).
- [`4f51247`](https://github.com/Dicklesworthstone/letter_learning_game/commit/4f51247f223e598a70e858399b9c9cb40e3ebb60) -- Ease Z/z recognition (add to forgiving LETTER_EASING).
- [`4e6805c`](https://github.com/Dicklesworthstone/letter_learning_game/commit/4e6805cfff7a4c1326aeff9d65612c06aa143ae1) -- Ease V/v recognition; remove from strict list.
- [`7f8a48c`](https://github.com/Dicklesworthstone/letter_learning_game/commit/7f8a48c1ca2f6fd6ae5ea57c5f1b0121e25d9f2a) -- Ease N/n recognition.
- [`05c20f1`](https://github.com/Dicklesworthstone/letter_learning_game/commit/05c20f1ec2e7d1f2ad983e4b921cb5fc3b99ce86) -- Ease Y/y; slightly lower global clamp and near-threshold margin.
- [`73206da`](https://github.com/Dicklesworthstone/letter_learning_game/commit/73206da0b28d29b52182a1e987780c08a1f691d9) -- Broadly ease: lower resample, increase rotation, raise CLOUD_NORM; make m/M/n more permissive; lower curvy-letter floors.
- [`1fd76dd`](https://github.com/Dicklesworthstone/letter_learning_game/commit/1fd76dde3ec00f90c8cc5aa21efc5dcdea843c6d) -- Ease Q/q and global thresholds; relax cloud gate; widen IoU brush; raise rotation to 45 degrees.
- [`dcafe87`](https://github.com/Dicklesworthstone/letter_learning_game/commit/dcafe87ed550533ee87f8e8553bbdf57687aa650) -- Dramatically relax for reliability: lower floors (including E/e), add E to easing, reduce crossbar penalty for E, increase rotation to 60 degrees, resample 48.
- [`ca09202`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ca0920297b2bb2d77fe754f717cf4e95d76e46b5) -- TEMP ultra-permissive mode: bypass scribble rejection and force acceptance while tuning (avoids child frustration).

### Shape Guards and Misclassification Prevention

- [`874a072`](https://github.com/Dicklesworthstone/letter_learning_game/commit/874a072b82679fa9a57a0d6001d696a72e27dac9) -- Replace ultra-permissive mode with middle-ground easy gate; extra leniency for Q/q and g/G.
- [`ac363b6`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ac363b6eb398db94a543f2852faf8cdea1b4dc42) -- Minimal shape guard for loopish letters (IoU >= 0.20) to prevent X counting as O.
- [`3196efe`](https://github.com/Dicklesworthstone/letter_learning_game/commit/3196efe1983224d628bad936768126ebff23682c) -- Generic wrong-letter dominance guard (classical margin > 0.08 or deep margin < -0.10).
- [`64725ef`](https://github.com/Dicklesworthstone/letter_learning_game/commit/64725ef58cddac6d21997ec1cb00341be828c76e) -- Cross (X-like) detection to prevent misclassification.
- [`ed16fe0`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ed16fe0004aeef7d9a4c82d47dce6dded2a0efbd) -- Adjust easing for O; lower IoU threshold for loopish letters.

---

## Phonetic Pronunciation Tuning (2025-09-08 -- 2025-09-13)

### TTS Pronunciation Maps

- [`c745c3b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c745c3b2abcf9561046da6969ed186a7fdad7c38) -- Refactor phonetic definitions: commas instead of periods; streamlined letter name pronunciations.
- [`88d79c2`](https://github.com/Dicklesworthstone/letter_learning_game/commit/88d79c2c785d943b033170b7e23e64d23634606b) -- Improve pronunciation for letter a.
- [`875ed03`](https://github.com/Dicklesworthstone/letter_learning_game/commit/875ed03ffa02531e242d1c7a4d7f7fc2a4e502a8) -- Update icons and pronunciation for w, x, y, i.
- [`ac354f4`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ac354f493783eb61126e373c5c8f919d8186adc2) -- Update pronunciation for k and w.
- [`1179c18`](https://github.com/Dicklesworthstone/letter_learning_game/commit/1179c18c51aecf0e01a124410ee4c2aa0d14aea9) -- Update phonetic pronunciations for a, e, r, x; remove phonics echo to streamline.
- [`4a2ca2e`](https://github.com/Dicklesworthstone/letter_learning_game/commit/4a2ca2e8e0fa8ee1c3c4d1f2ee73303d6d0be06a) -- Streamline phonics sound prompt; add countdown timer for sound recognition.
- [`d63b6dc`](https://github.com/Dicklesworthstone/letter_learning_game/commit/d63b6dcb19b8c3a055db71efb3d59fb7c80913b7) -- Refine phonetic sounds for c, e, i, u, x.
- [`2db529f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/2db529f588f1fb0b544b0de24073c72b277696d2) -- Enhance phonetic and letter name pronunciations for TTS accuracy: updated vowel and consonant spellings.

### Code Formatting

- [`eb786d6`](https://github.com/Dicklesworthstone/letter_learning_game/commit/eb786d6e5d23130f42d50943c5b8c3850f41bb5b) -- Standardize code formatting; improve comments; enhance layout consistency.
- [`ec4be33`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ec4be33acc691beed7dad3f129a4a382d22868cd) -- Enforce display property with !important for CSS specificity.
- [`51270ce`](https://github.com/Dicklesworthstone/letter_learning_game/commit/51270ceba53eb13671edc22f7c938d25aef09e44) -- Remove extensive media queries for cleaner, more maintainable code.

---

## Word Builder Mode (2025-09-13 -- 2025-09-14)

### Initial Implementation

- [`b77f420`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b77f420a21c5f371e2fcc17e5726c1ca0dcf1cd0) -- Implement Word Builder feature with UI, theme colors, responsive design, accessibility, word validation, animations, settings toggle. (Reverted due to issues.)
- [`aa0b5b7`](https://github.com/Dicklesworthstone/letter_learning_game/commit/aa0b5b71b9f48c1f65bfab7e32e4379ea28aa9c8) -- Revert Word Builder implementation.
- [`c2e445d`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c2e445daf01d549c830dff046551e91680dfe20b) -- Re-implement Word Builder: button, minimal CSS, working game logic, no impact on Identify/Draw modes.
- [`33d807f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/33d807f58da2afe66198c08d0399614aaa7c8f45) -- Fix: re-add Word Builder functions, add subtle animations, wire to setMode.

### Refinement and Polish

- [`a3f1390`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a3f1390470e456377eda01ef801d574638fa26cd) -- Auto-speak target word; case-consistent letter bank; improved visuals with GSAP and anchor emoji; confetti on success.
- [`b6ed32b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/b6ed32be1228ac0e17a81fb77787cd1dcceb8587) -- Improved UI with vibrant styles, celebratory animations, expanded emoji support. Updated README.
- [`5a6cd7b`](https://github.com/Dicklesworthstone/letter_learning_game/commit/5a6cd7bf6e086e1afff95ef2b43314b6c66cd7d0) -- Word Builder settings toggle (On/Off); difficulty adjustment based on player performance; error handling for word selection.
- [`3e229e8`](https://github.com/Dicklesworthstone/letter_learning_game/commit/3e229e83d775c292a4df167edb15cd64aae1a600) -- UX polish: reduced-motion-safe mode transition; score aria-live; settings focus return; persist timer/case/sound with localStorage.

### Difficulty and Animations

- [`cce9bdb`](https://github.com/Dicklesworthstone/letter_learning_game/commit/cce9bdb234e83cfb43234d8041656233fea57d62) -- Refine difficulty thresholds for level up/down; recent word tracking to avoid repeats; visual animations for level changes; scoring logic refinement.
- [`ddc66d0`](https://github.com/Dicklesworthstone/letter_learning_game/commit/ddc66d05b74eec619e5a82748a591f7e87ae5b44) -- Mobile UI: compact mode for 4+ letter words; speaker button for audio feedback; improved button styles.
- [`0ac304f`](https://github.com/Dicklesworthstone/letter_learning_game/commit/0ac304f0877303a28103d981d04ed91687d7de46) -- Compact mode for score display; improved mobile layout for word slots; audio playback management.

---

## Adaptive Learning and Analytics (2025-09-14 -- 2025-09-15)

### Confusion Matrix and Spaced Repetition

- [`9d4a35a`](https://github.com/Dicklesworthstone/letter_learning_game/commit/9d4a35a6c23709b1e44d50eb0ac4373f9ef57a99) -- Implement confusion matrix for letter recognition: track letter confusion patterns, spaced repetition scheduling, improved feedback for incorrect answers, per-player confusion matrices.

### Achievements and Streaks UI

- [`0b1fbfa`](https://github.com/Dicklesworthstone/letter_learning_game/commit/0b1fbfaeb51fc8c9edd2e9c973691b290988d871) -- Improved achievement/streak display for mobile; updated tracking logic; fade-in effects for streak notifications.

### TTS and Audio Improvements

- [`d2f8567`](https://github.com/Dicklesworthstone/letter_learning_game/commit/d2f8567d8afe4d8dcb2f95c3244170c372f1b252) -- Lightweight TTS activity guards to manage interruptions; draw analytics for letter acceptance metrics with localStorage persistence; polite speaking without interrupting ongoing audio.
- [`945efc8`](https://github.com/Dicklesworthstone/letter_learning_game/commit/945efc898110f170281acc718355d7e941315c1e) -- Minigame speech synthesis: skipCancel option for uninterrupted audio.
- [`a14d116`](https://github.com/Dicklesworthstone/letter_learning_game/commit/a14d11698320efdd99b50e7ecd5965804c3ff13d) -- Deep score analytics: deepCount for accurate averages; updated score display; skipCancel for speech synthesis.

---

## Stale Interaction Guards (2025-11-04 -- 2025-11-06)

These commits address a class of bugs where UI callbacks fire against
outdated game state (e.g., clicking an answer tile after the question
has already advanced).

- [`3ad0f19`](https://github.com/Dicklesworthstone/letter_learning_game/commit/3ad0f19b9813bcf6f5c77244aaae8ad0298b8ae2) -- Guard identify prompt speech callbacks against stale state.
- [`c5bd86c`](https://github.com/Dicklesworthstone/letter_learning_game/commit/c5bd86c2f0b7638de95a6ebd05d692afb96b36e2) -- Add questionId to button elements; checkAnswer and playCurrentLetter ignore clicks from outdated UI states.
- [`f00facb`](https://github.com/Dicklesworthstone/letter_learning_game/commit/f00facbe710caf4a93673c15a8ce44485f0971c7) -- Guard phonics phase against stale prompts.

---

## Licensing and Repository Metadata (2026-01 -- 2026-02)

- [`312683d`](https://github.com/Dicklesworthstone/letter_learning_game/commit/312683d5737efecdc38e4b4b16445819b62a4f48) -- Add MIT License (2026-01-21).
- [`06e83af`](https://github.com/Dicklesworthstone/letter_learning_game/commit/06e83afef804f631760f674bf87a28dcf120a745) -- Add .gitignore with .DS_Store pattern (2026-02-15).
- [`92ce091`](https://github.com/Dicklesworthstone/letter_learning_game/commit/92ce091881ecc4edad6c0595c6a7b39bc122e25a) -- Add GitHub social preview image (1280x640) (2026-02-21).
- [`66c8a06`](https://github.com/Dicklesworthstone/letter_learning_game/commit/66c8a067bdb92fb7601f1c4a725b3f86f0c15327) -- Update license to MIT with OpenAI/Anthropic Rider (2026-02-21).

---

## Commit Statistics

| Metric | Value |
|---|---|
| Total commits | 111 |
| First commit | 2025-09-08 |
| Latest commit | 2026-02-21 |
| Tags | 0 |
| Releases | 0 |
| Contributors | 1 (Jeffrey Emanuel) |
| Primary file | `index.html` (single-file app, ~533 KB) |

### Commits by Capability Area

| Area | Approximate Commits |
|---|---|
| Tracing recognizer tuning | ~25 |
| UI/UX, layout, responsiveness | ~20 |
| Word Builder mode | ~12 |
| Phonics and TTS pronunciation | ~12 |
| Settings and accessibility | ~12 |
| Celebrations and animations | ~8 |
| iOS compatibility | ~6 |
| Achievements, streaks, analytics | ~6 |
| Multiplayer / profiles | ~3 |
| Stale interaction guards | 3 |
| Licensing and repo metadata | 4 |
