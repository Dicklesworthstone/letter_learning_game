const { test: nodeTest, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFileSync, mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { chromium, firefox, webkit } = require('playwright');

// The CLI also bounds the whole file on Node 22. Bound each scenario separately.
function test(name, options, work) {
    if (typeof options === 'function') return nodeTest(name, { timeout: 120000 }, options);
    return nodeTest(name, { timeout: 120000, ...options }, work);
}

let browser, server, origin;
const engine = process.env.LLG_BROWSER || 'chromium';
before(async () => {
    server = createServer((req, res) => {
        if (req.url === '/' || req.url === '/index.html') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(readFileSync(join(__dirname, '..', 'index.html')));
        } else { res.writeHead(404); res.end(); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${server.address().port}`;
    const type = { chromium, firefox, webkit }[engine];
    assert.ok(type, `unsupported browser: ${engine}`);
    browser = await type.launch({
        // The standalone headless shell rejects native audio capture. Use the
        // bundled full Chromium in headless mode; keep real streams/recorders.
        ...(engine === 'chromium' ? { channel: 'chromium' } : {}),
        ...(process.env.LLG_CHROME_PATH && engine === 'chromium' ? { executablePath: process.env.LLG_CHROME_PATH } : {}),
        ...(engine === 'chromium' ? { args: ['--no-sandbox', '--use-fake-device-for-media-stream'] } : {})
    });
}, { timeout: 45000 });
after(async () => {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
}, { timeout: 15000 });

async function bounded(promise, stage, milliseconds = 20000) {
    let timer;
    try {
        return await Promise.race([promise, new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(`Browser timed out at ${stage}; no application result was obtained`)), milliseconds);
        })]);
    } finally { clearTimeout(timer); }
}

async function run(t, work, options = {}) {
    const { setup, liveModels, liveAnimations, stallAssets, ...contextOptions } = options;
    const context = await bounded(browser.newContext({ viewport: { width: 1280, height: 800 }, ...contextOptions }), 'newContext');
    await context.tracing.start({ screenshots: true, snapshots: true });
    const assetReleases = [];
    context.pendingOptionalAssets = 0;
    await context.route('**/*', async route => {
        const url = route.request().url();
        const modelAsset = liveModels && (url.startsWith('https://cdn.jsdelivr.net/npm/@tensorflow') || url.startsWith('https://tfhub.dev/') || url.startsWith('https://storage.googleapis.com/'));
        const animationAsset = liveAnimations && url.startsWith('https://cdnjs.cloudflare.com/ajax/libs/gsap/');
        if (stallAssets && !url.startsWith(origin)) {
            context.pendingOptionalAssets++;
            await new Promise(resolve => assetReleases.push(resolve));
        }
        return url.startsWith(origin) || modelAsset || animationAsset ? route.continue() : route.abort();
    });
    if (setup) await setup(context);
    const page = await bounded(context.newPage(), 'newPage');
    await page.bringToFront();
    page.setDefaultTimeout(6000);
    page.setDefaultNavigationTimeout(30000);
    const errors = [], logs = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => logs.push(`${message.type()}: ${message.text()}`));
    try {
        await page.goto(origin, { waitUntil: stallAssets ? 'domcontentloaded' : 'load' });
        await page.evaluate(() => { setSoundMode('off'); setTimerMode('off'); setPhonicsMode('off'); });
        await work(page);
        assert.deepEqual(errors, [], 'uncaught browser errors');
        await context.tracing.stop();
    } catch (error) {
        const directory = join(__dirname, '..', 'test-results', `${engine}-${t.name.replace(/[^a-z0-9]+/gi, '-').slice(0, 90)}`);
        mkdirSync(directory, { recursive: true });
        writeFileSync(join(directory, 'console.txt'), logs.concat(errors, error.stack || String(error)).join('\n'));
        await page.screenshot({ path: join(directory, 'failure.png') }).catch(() => {});
        await context.tracing.stop({ path: join(directory, 'trace.zip') }).catch(() => {});
        throw error;
    } finally { assetReleases.forEach(release => release()); await context.close(); }
}

async function identify(page) {
    await page.locator('.start-btn').press('Enter');
    return page.evaluate(() => identifyPromptId);
}
function waitForState(page, predicate, arg, options = {}) {
    // State producers use timers; WebKit can suspend RAF in an inactive test page.
    return page.waitForFunction(predicate, arg, { polling: 50, ...options });
}
async function correctLetter(page) {
    const letter = await page.evaluate(() => currentLetter);
    await page.locator(`.option-btn[data-letter="${letter}"]`).press('Enter');
}
async function correctWord(page) {
    const word = await page.evaluate(() => wbTargetWord);
    for (const letter of word) await page.locator(`.wb-tile[data-letter="${letter}"]:not([disabled])`).first().press('Enter');
}

test('Identify renders unique same-case options across every theme/case', t => run(t, async page => {
    await identify(page);
    const results = await page.evaluate(() => {
        const results = [];
        for (const caseMode of ['lower', 'upper', 'mixed']) for (const theme of ['classic', 'animals', 'colors']) {
            setCaseMode(caseMode); setVisualTheme(theme); startIdentifyGame();
            const letters = [...document.querySelectorAll('.option-btn')].map(button => button.dataset.letter);
            results.push({ unique: new Set(letters).size, target: letters.includes(currentLetter), sameCase: letters.every(letter => (letter === letter.toUpperCase()) === (currentLetter === currentLetter.toUpperCase())) });
        }
        return results;
    });
    assert.equal(results.length, 9);
    assert.ok(results.every(result => result.unique === 4 && result.target && result.sameCase));
}));

test('Identify correct and wrong answers update ordinary single-player progress', t => run(t, async page => {
    await identify(page); await correctLetter(page);
    await waitForState(page, () => !isProcessing);
    const before = await page.evaluate(() => ({ score, correctAnswers, badges: [...unlockedAchievements] }));
    assert.ok(before.score > 0); assert.equal(before.correctAnswers, 1); assert.ok(before.badges.includes('first_letter'));
    const wrong = await page.evaluate(() => [...document.querySelectorAll('.option-btn')].find(button => button.dataset.letter !== currentLetter).dataset.letter);
    await page.locator(`.option-btn[data-letter="${wrong}"]`).press('Enter');
    const result = await page.evaluate(() => ({ score, wrongAnswers, correctStreak }));
    assert.equal(result.score, Math.max(0, before.score - 10)); assert.equal(result.wrongAnswers, 1); assert.equal(result.correctStreak, 0);
}));

test('Word Builder accepts a real bank spelling and advances', t => run(t, async page => {
    await page.locator('#wordBuilderBtn').press('Enter'); await correctWord(page);
    assert.equal(await page.evaluate(() => score), 20);
    await waitForState(page, () => !wbTransitioning);
    assert.ok(await page.evaluate(() => wbSlots.every(slot => slot === null)));
}));

test('first profile is visible, earns points immediately, and survives reload', t => run(t, async page => {
    await page.locator('.add-player-btn').press('Enter');
    await page.locator('#playerNameInput').fill('Alice');
    await page.locator('.player-modal-save').press('Enter');
    await identify(page); await correctLetter(page);
    const result = await page.evaluate(() => ({ score, shown: Number(document.getElementById('scoreDisplay').textContent), profile: currentPlayer.score, saved: JSON.parse(localStorage.getItem('letterLearningPlayers'))[0].score }));
    assert.ok(result.score > 0); assert.equal(result.shown, result.score); assert.equal(result.profile, result.score); assert.equal(result.saved, result.score);
    assert.equal(await page.locator('.player-chip.active .player-score').textContent(), `Score: ${result.score}`);
    assert.equal(await page.locator('.player-chip.active').getAttribute('aria-label'), `Play as Alice, score ${result.score}`);
    await page.reload();
    assert.equal(await page.evaluate(() => score), result.score);
}));

test('a 15-question Identify round completes exactly once', { timeout: 120000 }, t => run(t, async page => {
    await identify(page);
    const wrong = await page.evaluate(() => [...document.querySelectorAll('.option-btn')].find(button => button.dataset.letter !== currentLetter).dataset.letter);
    await page.locator(`.option-btn[data-letter="${wrong}"]`).press('Enter');
    await waitForState(page, () => !isProcessing);
    for (let i = 0; i < 15; i++) {
        t.diagnostic(`recognition question ${i + 1}/15`);
        const id = await page.evaluate(() => identifyPromptId);
        await correctLetter(page);
        await waitForState(page, previous => identifyPromptId !== previous || document.getElementById('roundModal').style.display === 'flex' || currentMinigame, id);
        if (await page.evaluate(() => !!currentMinigame)) {
            await page.waitForSelector('.lesson-return');
            await page.locator('.lesson-return').press('Enter');
        }
        if (i < 14) await page.waitForSelector('.option-btn');
    }
    assert.equal(await page.evaluate(() => roundsCompleted), 1);
    assert.equal(await page.locator('#accuracy').textContent(), '94');
    assert.ok(!(await page.locator('#problemLettersList').textContent()).includes('Perfect'));
    assert.equal(await page.locator('#roundModal').isVisible(), true);
    await page.locator('#roundModal .continue-btn').press('Enter');
    await page.evaluate(() => startNextRound());
    assert.equal(await page.evaluate(() => currentRound), 2);
}));

test('pending Identify feedback cannot restore another mode', t => run(t, async page => {
    await identify(page); await correctLetter(page);
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    await page.waitForTimeout(3000);
    assert.equal(await page.locator('#drawCanvas').count(), 1);
    assert.equal(await page.locator('.option-btn').count(), 0);
}));

test('settings survive reload and focus mode suppresses timer', t => run(t, async page => {
    await page.evaluate(() => { setCaseMode('upper'); toggleFocusMode(); toggleReduceMotion(); saveGameData(); });
    await page.reload();
    assert.deepEqual(await page.evaluate(() => ({ timer: timerEnabled, sound: soundEnabled, letterCase: currentCase, focus: focusModeEnabled, motion: document.body.classList.contains('reduce-motion') })), { timer: false, sound: false, letterCase: 'upper', focus: true, motion: true });
}));

test('Word Builder pending feedback cannot replace tracing', t => run(t, async page => {
    await page.locator('#wordBuilderBtn').press('Enter'); await correctWord(page);
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    await page.waitForTimeout(3000);
    assert.equal(await page.locator('#drawCanvas').count(), 1);
    assert.equal(await page.locator('#wbSlots').count(), 0);
}));

test('Word Builder completes a 15-word round and persists difficulty progress', { timeout: 240000 }, t => run(t, async page => {
    await page.locator('#wordBuilderBtn').press('Enter');
    for (let i = 0; i < 15; i++) {
        t.diagnostic(`spelling question ${i + 1}/15`);
        const version = await page.evaluate(() => lessonVersion);
        await correctWord(page);
        if (!i) assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('letterLearningGameData')).wbConsecutiveCorrect), 1);
        await waitForState(page, previous => lessonVersion !== previous || activeDialog === 'roundModal' || currentMinigame, version);
        if (await page.evaluate(() => !!currentMinigame)) {
            await page.waitForSelector('.lesson-return'); await page.locator('.lesson-return').press('Enter');
        }
        if (i < 14) await waitForState(page, () => !wbTransitioning && !questionResolved && document.getElementById('wbSlots'));
    }
    assert.equal(await page.evaluate(() => roundsCompleted), 1);
    assert.equal(await page.evaluate(() => correctAnswers), 15);
    assert.equal(await page.evaluate(() => letterPerformance && Object.keys(letterPerformance).length), 0, 'spelling does not claim recognition mastery');
    assert.equal(await page.evaluate(() => Object.values(modePerformance.wordBuilder).reduce((sum, item) => sum + item.correct, 0)), 15);
}));

test('Alice and Bob retain isolated scores and selected-player identity', t => run(t, async page => {
    for (const name of ['Alice', 'Bob']) {
        await page.locator('.add-player-btn').press('Enter'); await page.locator('#playerNameInput').fill(name);
        await page.locator('.player-modal-save').press('Enter');
        if (name === 'Alice') { await identify(page); await correctLetter(page); }
    }
    assert.equal(await page.evaluate(() => score), 0);
    await page.locator('.player-chip').filter({ hasText: 'Alice' }).press('Enter');
    const aliceScore = await page.evaluate(() => score); assert.ok(aliceScore > 0);
    await page.locator('.player-chip').filter({ hasText: 'Bob' }).press('Enter');
    assert.equal(await page.evaluate(() => score), 0);
    await page.reload();
    assert.equal(await page.evaluate(() => currentPlayer.name), 'Bob');
    assert.equal(await page.evaluate(() => players.find(player => player.name === 'Alice').score), aliceScore);
}));

test('opening a dialog never steals focus back from its native save button', t => run(t, async page => {
    // Open and focus in one turn to expose the former 50ms focus-reset race.
    await page.evaluate(() => { showAddPlayer(); document.querySelector('.player-modal-save').focus(); });
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('.player-modal-save')), true);
    await page.locator('#playerNameInput').fill('Bob');
    await page.locator('.player-modal-save').press('Enter');
    assert.equal(await page.evaluate(() => currentPlayer?.name), 'Bob');
    assert.equal(await page.evaluate(() => activeDialog), null);
}));

test('timeout resolves the last question once and resets the correct streak', t => run(t, async page => {
    await identify(page);
    // Seed only the preceding fourteen outcomes to exercise the timeout boundary.
    await page.evaluate(() => { roundResolved = 14; roundCorrect = 14; correctStreak = 14; score = 50; handleTimeUp(); handleTimeUp(); });
    await waitForState(page, () => activeDialog === 'roundModal');
    assert.deepEqual(await page.evaluate(() => ({ wrongAnswers, roundResolved, correctStreak, roundsCompleted, score })), { wrongAnswers: 1, roundResolved: 15, correctStreak: 0, roundsCompleted: 1, score: 40 });
}));

test('dialogs trap keyboard focus, pause the lesson and restore focus on Escape', t => run(t, async page => {
    await identify(page);
    await page.locator('.settings-btn').press('Enter');
    assert.equal(await page.locator('#settingsModal').getAttribute('role'), 'dialog');
    assert.equal(await page.evaluate(() => lessonPaused), true);
    for (let i = 0; i < 35; i++) {
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => !!document.activeElement.closest('#settingsModal')), true);
    }
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#settingsModal').isVisible(), false);
    assert.equal(await page.evaluate(() => lessonPaused), false);
    assert.equal(await page.locator('.settings-btn').evaluate(element => element === document.activeElement), true);
    await page.evaluate(() => openParentDashboard()); await page.keyboard.press('Escape');
    assert.equal(await page.locator('#parentDashboard').isVisible(), false);
    await page.locator('.add-player-btn').press('Enter');
    await page.locator('[aria-label="Fox avatar"]').press('Enter');
    assert.equal(await page.evaluate(() => selectedAvatar), '🦊');
}));

test('empty insights stay neutral and a small adaptive pool keeps its weights', t => run(t, async page => {
    const data = await page.evaluate(() => {
        const titles = generateInsights().map(insight => insight.title);
        letterPerformance = { a: { total: 5, correct: 0 }, b: { total: 5, correct: 5 } }; letterErrors = {}; recentLetters = []; difficultyLevel = 3;
        updateAdaptivePool(['a', 'b']);
        return { titles, counts: adaptivePool.reduce((counts, letter) => ({ ...counts, [letter]: (counts[letter] || 0) + 1 }), {}) };
    });
    assert.ok(!data.titles.includes('Quick Recognition'));
    assert.deepEqual(data.counts, { a: 5, b: 1 });
}));

test('storage denied on reads and writes leaves all modes playable with a notice', t => run(t, async page => {
    await identify(page); await correctLetter(page);
    assert.ok(await page.locator('#storageStatus').isVisible());
    await page.locator('#wordBuilderBtn').press('Enter'); await correctWord(page);
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    assert.equal(await page.locator('#drawCanvas').count(), 1);
}, { setup: context => context.addInitScript(() => {
    // Fault injection is limited to storage; game code and browser DOM stay real.
    Storage.prototype.getItem = () => { throw new DOMException('Denied', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
}) }));

test('malformed nested saves and draw analytics normalize without losing valid fields', t => run(t, async page => {
    assert.equal(await page.evaluate(() => score), 17);
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    await page.evaluate(() => { recordDrawAttempt({ letter: 'a', accepted: true, finalScore: 0.8 }); });
    assert.equal(await page.evaluate(() => getDrawAnalytics().totals.accepts), 1);
    assert.equal(await page.evaluate(() => getDrawAnalytics().letters.a.avgDeep), null);
    await page.evaluate(() => resetDrawAnalytics());
    assert.equal(await page.evaluate(() => getDrawAnalytics().totals.attempts), 0);
}, { setup: context => context.addInitScript(() => {
    if (!localStorage.getItem('seeded')) {
        localStorage.setItem('letterLearningGameData', JSON.stringify({ score: 17, achievementProgress: [], letterPerformance: { a: { total: -8, correct: 'bad', times: {} } }, confusionMatrix: { a: [] }, streakHistory: {}, focusModeEnabled: 'invalid' }));
        localStorage.setItem('llg_draw_analytics_v1', '{}'); localStorage.setItem('seeded', '1');
    }
}) }));

test('all 52 formation guides exist and resize preserves ink and pen style', t => run(t, async page => {
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    const guides = await page.evaluate(() => Object.keys(LETTER_CHECKPOINTS).map(letter => {
        currentLetter = letter; showFormationGuide();
        return { letter, paths: document.querySelectorAll('#formationGuide path').length, expected: LETTER_CHECKPOINTS[letter].strokes.length };
    }));
    assert.equal(guides.length, 52); assert.ok(guides.every(guide => guide.paths === guide.expected));
    await page.evaluate(() => { currentLetter = 'H'; showFormationGuide(); showFormationGuide(); });
    assert.equal(await page.locator('.stroke-number').count(), 3);
    const box = await page.locator('#drawCanvas').boundingBox();
    await page.mouse.move(box.x + 50, box.y + 50); await page.mouse.down();
    for (let i = 0; i < 16; i++) await page.mouse.move(box.x + 50 + i * 5, box.y + 50 + i * 5);
    await page.mouse.up();
    const before = await page.evaluate(() => drawingPoints.length);
    assert.ok(before > 5);
    assert.equal(before, 16, 'every distinct native move must survive even when events arrive within 16ms');
    assert.deepEqual(await page.evaluate(() => ({ x: drawingPoints.at(-1).x, y: drawingPoints.at(-1).y })), { x: 125, y: 125 });
    await page.setViewportSize({ width: 390, height: 844 });
    await waitForState(page, () => parseFloat(document.getElementById('drawCanvas').style.width) <= 390);
    const result = await page.evaluate(() => ({ width: ctx.lineWidth, color: ctx.strokeStyle, points: drawingPoints.length, ink: [...ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data].some((value, i) => i % 4 === 3 && value > 0) }));
    assert.equal(result.width, 8); assert.equal(result.color, '#764ba2'); assert.equal(result.points, before); assert.equal(result.ink, true);
}));

for (const viewport of [{ width: 320, height: 568 }, { width: 844, height: 390 }]) {
    test(`drawing and spelling controls remain reachable at ${viewport.width}x${viewport.height}`, t => run(t, async page => {
        await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
        const check = page.getByRole('button', { name: "I'm Done!", exact: true });
        await check.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
        const box = await check.boundingBox();
        assert.ok(box.x >= 0 && box.x + box.width <= viewport.width + 1 && box.y >= 0 && box.y + box.height <= viewport.height + 1);
        assert.equal(await check.evaluate(element => {
            const box = element.getBoundingClientRect();
            return document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)?.closest('button') === element;
        }), true, 'the visible control must receive actual pointer hits');
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        assert.match(await page.locator('#feedback').textContent(), /Keep drawing/, 'the native click must reach the drawing checker');
        await page.locator('#wordBuilderBtn').press('Enter');
        await page.getByRole('button', { name: 'New word', exact: true }).press('Enter');
        assert.ok(await page.locator('#wordTargetPrompt').isVisible());
        const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
        assert.ok(dimensions.width <= dimensions.viewport + 1);
    }, { viewport }));
}

test('synthetic Chromium microphone tracks stop when the recording UI is removed', { skip: engine !== 'chromium' }, t => run(t, async page => {
    await page.context().grantPermissions(['microphone']);
    await page.evaluate(() => { voiceRecordingEnabled = true; });
    await identify(page);
    await page.locator('#recordBtn').press('Enter');
    await waitForState(page, () => isRecording && mediaRecorder.state === 'recording');
    await page.evaluate(() => { window.testTracks = mediaRecorder.stream.getTracks(); });
    await page.locator('#wordBuilderBtn').press('Enter');
    await waitForState(page, () => window.testTracks.every(track => track.readyState === 'ended'));
    assert.equal(await page.evaluate(() => isRecording), false);
}));

for (const density of [1, 4, 12, 24]) test(`synthetic tracing accepts all 52 canonical shapes at density ${density}`, { timeout: 120000 }, t => run(t, async page => {
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    const results = await page.evaluate(density => {
        // These come from the app's guide paths, not real handwriting or an independent corpus.
        function sample(strokes, density) {
            return strokes.flatMap(stroke => {
                const points = [];
                if (stroke.length === 1) for (let i = 0; i < density; i++) points.push({ ...stroke[0], newStroke: i === 0 });
                for (let i = 1; i < stroke.length; i++) for (let j = 0; j < density; j++) {
                    const u = j / density, a = stroke[i - 1], b = stroke[i];
                    points.push({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, newStroke: i === 1 && j === 0 });
                }
                if (stroke.length > 1) points.push({ ...stroke[stroke.length - 1] });
                return points.map(point => ({ ...point, x: point.x * 2 + 17, y: point.y * 2 + 11 }));
            });
        }
        function attempt(target, strokes, density, name) {
            beginQuestion(); currentLetter = target; drawingPoints = sample(strokes, density); drawQuestionStartTime = Date.now();
            const start = performance.now(); checkDrawing();
            return { name, accepted: questionResolved, milliseconds: performance.now() - start };
        }
        const positives = [];
        for (const letter of Object.keys(LETTER_CHECKPOINTS)) positives.push(attempt(letter, LETTER_CHECKPOINTS[letter].strokes, density, `${letter}/${density}`));
        const negatives = density === 24 ? [
            ['i', [LETTER_CHECKPOINTS.i.strokes[0]], 'missing dot i'],
            ['j', [LETTER_CHECKPOINTS.j.strokes[0]], 'missing dot j'],
            ...['t', 'f', 'E', 'F', 'H'].map(letter => [letter, LETTER_CHECKPOINTS[letter].strokes.filter((_, i) => i !== (letter === 't' || letter === 'f' ? 1 : 2)), `missing crossbar ${letter}`]),
            ['O', LETTER_CHECKPOINTS.X.strokes, 'X for O'], ['O', LETTER_CHECKPOINTS.l.strokes, 'line for O'],
            ['d', LETTER_CHECKPOINTS.b.strokes, 'b for d'], ['q', LETTER_CHECKPOINTS.p.strokes, 'p for q'],
            ['W', LETTER_CHECKPOINTS.V.strokes, 'V for W'],
            ['O', [Array.from({ length: 80 }, (_, i) => ({ x: i % 2 ? 90 : 10, y: 10 + i }))], 'scribble for O'],
            ['O', [[{ x: 50, y: 50 }]], 'single dot for O'],
            ['O', LETTER_CHECKPOINTS.O.strokes[0].map(point => [point]), 'dots-only outline for O']
        ].map(([target, strokes, name]) => attempt(target, strokes, 24, name)) : [];
        beginQuestion();
        return { positives, negatives };
    }, density);
    const falseRejects = results.positives.filter(result => !result.accepted);
    const falseAccepts = results.negatives.filter(result => result.accepted);
    t.diagnostic(JSON.stringify({ syntheticPositiveCount: results.positives.length, syntheticNegativeCount: results.negatives.length, falseRejects, falseAccepts, maxMilliseconds: Math.max(...results.positives.map(result => result.milliseconds)) }));
    assert.equal(results.positives.length, 52);
    assert.equal(results.negatives.length, density === 24 ? 15 : 0);
    assert.deepEqual(falseRejects.map(result => result.name), []);
    assert.deepEqual(falseAccepts.map(result => result.name), []);
}));

test('synthetic tracing completes fifteen questions and keeps recognition mastery separate', { timeout: 120000 }, t => run(t, async page => {
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    for (let i = 0; i < 15; i++) {
        const version = await page.evaluate(() => {
            drawingPoints = LETTER_CHECKPOINTS[currentLetter].strokes.flatMap(stroke => {
                const samples = resampleStroke(stroke, 48);
                return samples.map((point, j) => ({ x: point.x * 2, y: point.y * 2, newStroke: j === 0 }));
            });
            return lessonVersion;
        });
        await page.getByRole('button', { name: "I'm Done!", exact: true }).press('Enter');
        await waitForState(page, previous => lessonVersion !== previous || activeDialog === 'roundModal', version);
    }
    assert.equal(await page.evaluate(() => roundsCompleted), 1);
    assert.equal(await page.evaluate(() => correctAnswers), 15);
    assert.equal(await page.evaluate(() => Object.keys(letterPerformance).length), 0);
    assert.equal(await page.evaluate(() => unlockedAchievements.has('perfect_round')), true);
}));

test('both mini-game breaks return to the originating Word Builder lesson', t => run(t, async page => {
    await page.locator('#wordBuilderBtn').press('Enter');
    for (const kind of ['rain', 'memory']) {
        await page.evaluate(kind => { if (kind === 'rain') startLetterRain(); else startMemoryMatch(); }, kind);
        if (kind === 'memory') {
            await page.locator('.memory-card').first().press('Enter');
            assert.equal(await page.locator('.memory-card').first().getAttribute('aria-pressed'), 'true');
        } else {
            const basket = page.locator('#rainBasket');
            const before = await basket.evaluate(element => element.style.left);
            await page.locator('#rainGameArea').press('ArrowRight');
            assert.notEqual(await basket.evaluate(element => element.style.left), before);
        }
        await page.locator('.lesson-return').press('Enter');
        await page.waitForSelector('#wbSlots');
        assert.equal(await page.evaluate(() => currentMode), 'wordBuilder');
    }
}));

test('final phonics skip finishes the round and old phonics work cannot restore UI', t => run(t, async page => {
    await identify(page);
    await page.evaluate(() => { roundResolved = 14; roundCorrect = 14; setPhonicsMode('on'); });
    await correctLetter(page);
    await waitForState(page, () => waitingForPhonics);
    await page.evaluate(() => skipPhonics());
    await waitForState(page, () => activeDialog === 'roundModal');
    assert.equal(await page.evaluate(() => roundsCompleted), 1);
    await page.keyboard.press('Escape');
    await page.locator('#wordBuilderBtn').press('Enter');
    await page.waitForTimeout(3500);
    assert.equal(await page.locator('#wbSlots').count(), 1);
    assert.equal(await page.locator('.option-btn').count(), 0);
}));

test('active timer preference, Word Builder and all advanced settings restore coherently', t => run(t, async page => {
    await identify(page);
    await page.evaluate(() => { setTimerMode('on'); });
    assert.equal(await page.evaluate(() => !!currentTimer), true);
    await page.evaluate(() => { setTimerMode('off'); });
    assert.equal(await page.evaluate(() => !!currentTimer), false);
    await page.locator('#wordBuilderBtn').press('Enter');
    await page.evaluate(() => { setWordBuilderMode('off'); setTimerMode('on'); toggleFocusMode(); toggleHighContrast(); toggleReduceMotion(); setVisualTheme('colors'); });
    assert.equal(await page.evaluate(() => currentMode), 'identify');
    await page.reload();
    const settings = await page.evaluate(() => ({ timerEnabled, previousTimerState, wordBuilderEnabled, focusModeEnabled, highContrastEnabled, reduceMotionEnabled, currentTheme, hidden: document.getElementById('wordBuilderBtn').hidden }));
    assert.deepEqual(settings, { timerEnabled: false, previousTimerState: true, wordBuilderEnabled: false, focusModeEnabled: true, highContrastEnabled: true, reduceMotionEnabled: true, currentTheme: 'colors', hidden: true });
    await page.evaluate(() => toggleFocusMode());
    assert.equal(await page.evaluate(() => timerEnabled), true);
}));

test('OS reduced motion suppresses animation entry points', t => run(t, async page => {
    assert.equal(await page.evaluate(() => motionReduced()), true);
    await page.locator('#wordBuilderBtn').press('Enter');
    await page.evaluate(() => { createConfetti(); createLetterCelebration(currentLetter, document.getElementById('gameArea')); });
    assert.equal(await page.locator('.letter-celebration-layer, .wb-emoji-celebration, .wb-emoji-orbit').count(), 0);
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('.wb-tile')].some(tile => tile._wbFloatTl)), false);
}, { reducedMotion: 'reduce' }));

test('reset current player preserves the other player and clears round/domain/daily history', t => run(t, async page => {
    await page.evaluate(() => {
        players = [{ id: 'a', name: 'Alice', avatar: '🦁', score: 23 }, { id: 'b', name: 'Bob', avatar: '🐻', score: 17 }]; savePlayers(); selectedPlayerId = 'b'; initializeMultiplayer();
        currentStreak = 8; roundResolved = 14; wbConsecutiveCorrect = 3; modePerformance.draw = { a: { total: 1, correct: 1 } };
        resetCurrentPlayerStatistics();
    });
    const data = await page.evaluate(() => ({ score, roundResolved, currentStreak, wbConsecutiveCorrect, draw: Object.keys(modePerformance.draw).length, alice: players[0].score }));
    assert.deepEqual(data, { score: 0, roundResolved: 0, currentStreak: 0, wbConsecutiveCorrect: 0, draw: 0, alice: 23 });
    await page.reload(); assert.equal(await page.evaluate(() => score), 0);
    await page.evaluate(() => resetAllStatistics());
    await page.reload(); assert.equal(await page.evaluate(() => players.length), 0);
}));

test('profile names render as text on selector and parent dashboard', t => run(t, async page => {
    const name = '<b>child</b>';
    await page.locator('.add-player-btn').press('Enter'); await page.locator('#playerNameInput').fill(name); await page.locator('.player-modal-save').press('Enter');
    await page.evaluate(() => openParentDashboard());
    assert.equal(await page.locator('.player-stat-name').textContent(), name);
    assert.equal(await page.locator('.player-stat-name b').count(), 0);
    assert.equal(await page.evaluate(() => window.injected), undefined);
}));

test('real optional MobileNet loads 52 embeddings after a drawing check', { skip: !process.env.LLG_LIVE_MODELS, timeout: 100000 }, t => run(t, async page => {
    assert.equal(await page.evaluate(() => typeof window.tf), 'undefined');
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    await page.evaluate(() => checkDrawing());
    await waitForState(page, () => checkDrawingNew.mbnet && checkDrawingNew.deepEmb?.size === 52, null, { timeout: 90000 });
    t.diagnostic(JSON.stringify(await page.evaluate(() => ({ tensorflow: tf.version.tfjs, embeddings: checkDrawingNew.deepEmb.size, backend: tf.getBackend() }))));
}, { liveModels: true }));

test('recognition outcomes drive mastery, speed, score and active-time achievements', t => run(t, async page => {
    await page.clock.install({ time: new Date() });
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    await identify(page);
    // Prior learner history is controlled; the threshold-crossing outcome uses the real button.
    await page.evaluate(() => {
        const target = currentLetter.toLowerCase();
        lettersMastered = new Set(lowerLetters.filter(letter => letter !== target));
        letterPerformance[target] = { correct: 4, total: 4, times: [], avgTime: 0 };
        speedAnswers = 9; score = 990; scoreAtRoundStart = 990;
        totalPlayTime = 29; sessionPlayMs = 65000;
        questionStartTime = Date.now();
    });
    await correctLetter(page);
    const ids = await page.evaluate(() => [...unlockedAchievements]);
    for (const type of ['speed', 'score', 'mastery', 'time']) {
        const eligible = await page.evaluate(type => ACHIEVEMENTS.filter(achievement => achievement.type === type && achievement.requirement <= (type === 'score' ? 1000 : type === 'mastery' ? 26 : type === 'time' ? 30 : 10)).map(achievement => achievement.id), type);
        assert.equal(eligible.length, { speed: 1, score: 3, mastery: 1, time: 2 }[type], 'the expected achievement family must exist');
        assert.ok(eligible.every(id => ids.includes(id)), `${type} producer`);
    }
    assert.equal(await page.evaluate(() => lettersMastered.size), 26);
    assert.equal(await page.evaluate(() => currentStreak), 1);
}));

test('idle reload does not extend the daily streak; an outcome can unlock a milestone', t => run(t, async page => {
    await page.evaluate(() => {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        lastPlayDate = yesterday.toDateString(); currentStreak = 2; streakHistory = [lastPlayDate]; saveGameData();
    });
    await page.reload();
    assert.equal(await page.evaluate(() => currentStreak), 2);
    await identify(page); await correctLetter(page);
    assert.equal(await page.evaluate(() => currentStreak), 3);
    assert.equal(await page.locator('#streakModal').isVisible(), true);
    await page.keyboard.press('Escape'); await page.reload();
    assert.equal(await page.evaluate(() => currentStreak), 3);
}, { timezoneId: 'America/New_York' }));

test('legacy anonymous progress migrates into the first profile without loss', t => run(t, async page => {
    assert.equal(await page.evaluate(() => score), 21);
    await page.locator('.add-player-btn').press('Enter'); await page.locator('#playerNameInput').fill('Legacy'); await page.locator('.player-modal-save').press('Enter');
    assert.equal(await page.evaluate(() => currentPlayer.score), 21);
    assert.equal(await page.evaluate(() => currentPlayer.correctAnswers), 4);
    await page.reload(); assert.equal(await page.evaluate(() => score), 21);
}, { setup: context => context.addInitScript(() => {
    if (!localStorage.getItem('seeded')) { localStorage.setItem('letterLearningGameData', JSON.stringify({ score: 21, correctAnswers: 4, wrongAnswers: 1, currentRound: 2 })); localStorage.setItem('seeded', '1'); }
}) }));

test('synthetic native microphone permission resolving after a mode switch is discarded', { skip: engine !== 'chromium' }, t => run(t, async page => {
    await page.context().grantPermissions(['microphone']);
    await identify(page);
    await page.evaluate(() => {
        voiceRecordingEnabled = true;
        const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        // Observe the real browser promise/stream; no replacement stream or recorder.
        navigator.mediaDevices.getUserMedia = (...args) => nativeGetUserMedia(...args).then(stream => { window.permissionTracks = stream.getTracks(); return stream; });
        startRecording(); setMode('draw');
    });
    await waitForState(page, () => window.permissionTracks?.length && window.permissionTracks.every(track => track.readyState === 'ended'));
    assert.equal(await page.evaluate(() => isRecording), false);
}));

test('synthetic native microphone stops for a settings dialog and remains stopped after closing', { skip: engine !== 'chromium' }, t => run(t, async page => {
    await page.context().grantPermissions(['microphone']);
    await page.evaluate(() => { voiceRecordingEnabled = true; }); await identify(page);
    await page.locator('#recordBtn').press('Enter');
    await waitForState(page, () => isRecording);
    await page.evaluate(() => { window.dialogTracks = mediaRecorder.stream.getTracks(); });
    await page.locator('.settings-btn').press('Enter');
    assert.equal(await page.evaluate(() => window.dialogTracks.every(track => track.readyState === 'ended')), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => isRecording), false);
    assert.equal(await page.locator('#recordBtn').getAttribute('aria-label'), 'Start recording');
}));

test('active play time carries partial minutes through reload and remains per player', t => run(t, async page => {
    await page.evaluate(() => { sessionPlayMs = 45000; saveGameData(); });
    await page.reload();
    await page.evaluate(() => { sessionPlayMs = 25000; saveGameData(); });
    assert.equal(await page.evaluate(() => getTotalPlayMinutes()), 1);
    await page.locator('.add-player-btn').press('Enter'); await page.locator('#playerNameInput').fill('Alice'); await page.locator('.player-modal-save').press('Enter');
    assert.equal(await page.evaluate(() => getTotalPlayMinutes()), 1, 'first profile inherits anonymous active play time');
    await page.evaluate(() => { sessionPlayMs = 45000; saveGameData(); });
    await page.locator('.add-player-btn').press('Enter'); await page.locator('#playerNameInput').fill('Bob'); await page.locator('.player-modal-save').press('Enter');
    assert.equal(await page.evaluate(() => getTotalPlayMinutes()), 0);
    await page.locator('.player-chip').filter({ hasText: 'Alice' }).press('Enter');
    await page.evaluate(() => { sessionPlayMs = 25000; });
    assert.equal(await page.evaluate(() => getTotalPlayMinutes()), 2);
}));

test('spelling and drawing speed never produce a recognition-speed insight', t => run(t, async page => {
    const titles = await page.evaluate(() => {
        responseTimes = [0.1, 0.1, 0.1];
        modePerformance.wordBuilder = { cat: { times: [0.1, 0.1, 0.1] } };
        modePerformance.draw = { a: { times: [0.1, 0.1, 0.1] } };
        return generateInsights().map(insight => insight.title);
    });
    assert.ok(!titles.includes('Quick Recognition')); assert.ok(titles.includes('Getting Started'));
}));

test('DPR 3 native touch cancellation leaves aligned ink and releases the pen', { skip: engine !== 'chromium' }, t => run(t, async page => {
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    await page.locator('#drawCanvas').scrollIntoViewIfNeeded();
    const box = await page.locator('#drawCanvas').boundingBox();
    const session = await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + 30, y: box.y + 30 }] });
    await page.waitForTimeout(30);
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + 70, y: box.y + 70 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    const result = await page.evaluate(() => ({ isDrawing, scale: ctx.getTransform().a, width: ctx.lineWidth, points: drawingPoints.map(point => ({ x: point.x, y: point.y })) }));
    assert.equal(result.isDrawing, false); assert.equal(result.scale, 3); assert.equal(result.width, 8);
    assert.ok(result.points.some(point => Math.abs(point.x - 70) < 1 && Math.abs(point.y - 70) < 1));
}, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true }));

for (const value of ['null', '[]', '{bad JSON']) {
    test(`invalid saved root ${JSON.stringify(value)} remains playable`, t => run(t, async page => {
        assert.equal(await page.evaluate(() => correctAnswers), 0);
        await identify(page); await correctLetter(page);
        assert.equal(await page.evaluate(() => correctAnswers), 1);
    }, { setup: context => context.addInitScript(value => { localStorage.setItem('letterLearningGameData', value); localStorage.setItem('letterLearningPlayers', value); }, value) }));
}

test('optional CDN requests can remain stalled while every lesson mode is usable', t => run(t, async page => {
    assert.ok(page.context().pendingOptionalAssets >= 2);
    assert.equal(await page.evaluate(() => typeof window.tf), 'undefined');
    await identify(page); assert.equal(await page.locator('.option-btn').count(), 4);
    await page.locator('#wordBuilderBtn').press('Enter'); assert.equal(await page.locator('#wbSlots').count(), 1);
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter'); assert.equal(await page.locator('#drawCanvas').count(), 1);
}, { stallAssets: true }));

test('wrong-answer, timeout and minigame callbacks cannot overwrite a new mode', t => run(t, async page => {
    await identify(page);
    const wrong = await page.evaluate(() => [...document.querySelectorAll('.option-btn')].find(button => button.dataset.letter !== currentLetter).dataset.letter);
    await page.locator(`.option-btn[data-letter="${wrong}"]`).press('Enter');
    await page.locator('#wordBuilderBtn').press('Enter'); await page.waitForTimeout(2500);
    assert.equal(await page.locator('#wbSlots').count(), 1);
    await page.locator('[aria-label="Find letters mode"]').press('Enter');
    await page.evaluate(() => handleTimeUp());
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter'); await page.waitForTimeout(2500);
    assert.equal(await page.locator('#drawCanvas').count(), 1);
    await page.evaluate(() => { startMemoryMatch(); const cards = [...document.querySelectorAll('.memory-card')]; flipCard(cards[0]); flipCard(cards[1]); });
    await page.locator('#wordBuilderBtn').press('Enter'); await page.waitForTimeout(1500);
    assert.equal(await page.locator('#wbSlots').count(), 1);
}));

test('real GSAP animations stop when reduced motion is enabled during a lesson', { skip: !process.env.LLG_LIVE_ANIMATIONS }, t => run(t, async page => {
    await waitForState(page, () => typeof gsap !== 'undefined');
    await page.locator('#wordBuilderBtn').press('Enter');
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('.wb-tile')].some(tile => !!tile._wbFloatTl)), true);
    await page.evaluate(() => toggleReduceMotion());
    assert.equal(await page.evaluate(() => gsap.globalTimeline.getChildren(true, true, true).length), 0);
    await page.locator('[aria-label="Find letters mode"]').press('Enter'); await correctLetter(page);
    assert.equal(await page.evaluate(() => gsap.globalTimeline.getChildren(true, true, true).length), 0);
}, { liveAnimations: true }));

test('simulated fall DST calendar day continues a streak without subtracting 24 hours', t => run(t, async page => {
    await page.clock.install({ time: new Date('2026-11-02T04:30:00Z') }); // Nov 1, 23:30 EST, after the 25-hour day.
    await page.evaluate(() => { lastPlayDate = 'Sat Oct 31 2026'; currentStreak = 3; streakHistory = [lastPlayDate]; });
    await identify(page); await correctLetter(page);
    assert.equal(await page.evaluate(() => currentStreak), 4);
    assert.equal(await page.evaluate(() => lastPlayDate), 'Sun Nov 01 2026');
}, { timezoneId: 'America/New_York' }));

test('idle tracing hints fade in and native drawing cancels further hint work', t => run(t, async page => {
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    await waitForState(page, () => hintWasShown && hintFadeOpacity > 0);
    await page.locator('#drawCanvas').scrollIntoViewIfNeeded();
    const box = await page.locator('#drawCanvas').boundingBox();
    await page.mouse.move(box.x + 80, box.y + 80); await page.mouse.down(); await page.mouse.up();
    assert.equal(await page.evaluate(() => hasStartedTrace), true);
    assert.equal(await page.evaluate(() => !!idleHintTimeout || !!idleHintInterval), false);
}));

test('anonymous mode and partial round progress survive reload', t => run(t, async page => {
    await page.locator('#wordBuilderBtn').press('Enter'); await correctWord(page);
    await page.reload();
    assert.equal(await page.evaluate(() => currentMode), 'wordBuilder');
    assert.equal(await page.evaluate(() => roundResolved), 1);
    await page.locator('.start-btn').press('Enter');
    assert.equal(await page.locator('#wbSlots').count(), 1);
}));

test('timer and focus settings control mini-game countdowns and automatic breaks', t => run(t, async page => {
    await identify(page);
    await page.evaluate(() => startMemoryMatch());
    assert.equal(await page.locator('#minigameTimer').textContent(), 'No time limit');
    await page.evaluate(() => setTimerMode('on'));
    assert.equal(await page.evaluate(() => !!minigameTimer), true);
    await page.evaluate(() => toggleFocusMode());
    assert.equal(await page.evaluate(() => !!minigameTimer), false);
    assert.equal(await page.locator('#minigameTimer').textContent(), 'No time limit');
    await page.locator('.lesson-return').press('Enter'); await page.waitForSelector('.option-btn');
    await page.evaluate(() => { roundResolved = 10; lastBreakQuestion = -1; checkRoundCompletion(); });
    assert.equal(await page.evaluate(() => currentMinigame), null);
}));

test('dialog pauses do not inflate response time', t => run(t, async page => {
    await identify(page); await page.locator('.settings-btn').press('Enter');
    const adjustment = await page.evaluate(() => {
        const before = questionStartTime; pauseStartedAt = Date.now() - 65000; closeDialog('settingsModal');
        return questionStartTime - before;
    });
    assert.ok(adjustment >= 65000 && adjustment < 66000);
}));

test('high contrast paints the heading and primary controls in dark text on white', t => run(t, async page => {
    await identify(page); await page.evaluate(() => toggleHighContrast());
    t.diagnostic(JSON.stringify(await page.evaluate(() => {
        const style = getComputedStyle(document.querySelector('.option-btn'));
        return { bodyClass: document.body.className, highContrastEnabled, colorBeforeTransition: style.color, transition: style.transition };
    })));
    // The ordinary color transition must settle; keep the exact required colors.
    await waitForState(page, () => {
        const style = getComputedStyle(document.querySelector('.option-btn'));
        return style.color === 'rgb(17, 17, 17)' && style.backgroundColor === 'rgb(255, 255, 255)';
    });
    const heading = await page.locator('.header-title').evaluate(element => { const style = getComputedStyle(element); return { color: style.color, fill: style.webkitTextFillColor }; });
    assert.deepEqual(heading, { color: 'rgb(17, 17, 17)', fill: 'rgb(17, 17, 17)' });
    const colors = await page.locator('.option-btn').first().evaluate(element => { const style = getComputedStyle(element); return [style.color, style.backgroundColor]; });
    assert.deepEqual(colors, ['rgb(17, 17, 17)', 'rgb(255, 255, 255)']);
}));

test('a new native tracing stroke cancels an old rejection clear and taps leave visible ink', t => run(t, async page => {
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    // This case checks pen ownership, not scroll animation. Use immediate DOM
    // scrolling and require an actual pointer hit instead of waiting for RAF.
    await page.locator('#drawCanvas').evaluate(canvas => canvas.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const box = await page.locator('#drawCanvas').boundingBox();
    assert.equal(await page.evaluate(({ x, y }) => document.elementFromPoint(x + 70, y + 70)?.id, box), 'drawCanvas');
    await page.clock.install({ time: new Date() });
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    // A controlled undotted i supplies the discriminating rejection, then input is native.
    await page.evaluate(() => { currentLetter = 'i'; drawingPoints = resampleStroke(LETTER_CHECKPOINTS.i.strokes[0], 48).map((point, i) => ({ ...point, newStroke: i === 0 })); checkDrawing(); });
    assert.equal(await page.evaluate(() => !!drawRetryClearTimeout), true);
    await page.mouse.move(box.x + 70, box.y + 70); await page.mouse.down(); await page.mouse.up();
    assert.equal(await page.evaluate(() => !!drawRetryClearTimeout), false);
    await page.clock.runFor(2300);
    assert.ok(await page.evaluate(() => drawingPoints.length > 0));
    assert.ok(await page.evaluate(() => [...ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data].some((value, i) => i % 4 === 3 && value > 0)));
}));

test('drawing selection uses handwriting history independently of recognition', t => run(t, async page => {
    const data = await page.evaluate(() => {
        letterPerformance = { a: { correct: 10, total: 10 }, b: { correct: 0, total: 10 } };
        modePerformance.draw = { a: { correct: 0, total: 10 }, b: { correct: 10, total: 10 } };
        letterErrors = {}; recentLetters = []; difficultyLevel = 3;
        currentMode = 'draw'; updateAdaptivePool(['a', 'b']); const drawing = { ...latestLetterWeights };
        currentMode = 'identify'; updateAdaptivePool(['a', 'b']); return { drawing, recognition: { ...latestLetterWeights } };
    });
    assert.ok(data.drawing.a > data.drawing.b); assert.ok(data.recognition.b > data.recognition.a);
}));

test('native recorded playback respects Sound Off and stops on mode exit', { skip: engine !== 'chromium' }, t => run(t, async page => {
    await page.context().grantPermissions(['microphone']); await page.evaluate(() => { voiceRecordingEnabled = true; }); await identify(page);
    await page.locator('#recordBtn').press('Enter'); await waitForState(page, () => isRecording);
    await page.waitForTimeout(700); await page.locator('#recordBtn').press('Enter');
    await waitForState(page, () => recordings.length === 1);
    await page.locator('#playBtn').press('Enter');
    assert.match(await page.locator('#feedback').textContent(), /Turn Sound on/);
    await page.evaluate(() => setSoundMode('on')); await page.locator('#playBtn').press('Enter');
    await waitForState(page, () => playbackAudio && !playbackAudio.paused);
    await page.evaluate(() => {
        const previous = playbackAudio, lateEnded = previous.onended;
        playLastRecording(); lateEnded();
        window.actualPlayback = playbackAudio;
        if (!playbackAudio || playbackAudio === previous || !previous.paused) throw new Error('old completion lost the new playback handle');
    });
    await page.locator('#wordBuilderBtn').press('Enter');
    assert.equal(await page.evaluate(() => window.actualPlayback.paused && playbackAudio === null), true);
}));

test('native microphone denial leaves no recorder and the lesson remains playable', { skip: engine !== 'chromium' }, t => run(t, async page => {
    await page.context().grantPermissions([]);
    await page.evaluate(() => { voiceRecordingEnabled = true; }); await identify(page);
    await page.locator('#recordBtn').press('Enter');
    await waitForState(page, () => !recordingPending && document.getElementById('feedback').textContent.includes('Microphone unavailable'));
    assert.equal(await page.evaluate(() => isRecording), false);
    assert.equal(await page.evaluate(() => mediaRecorder === null), true);
    await correctLetter(page);
    assert.equal(await page.evaluate(() => correctAnswers), 1);
}));

test('native phone touch scrolling reaches drawing controls without losing ink', { skip: engine !== 'chromium' }, t => run(t, async page => {
    await page.locator('[aria-label="Tracing practice mode"]').press('Enter');
    const before = await page.evaluate(() => {
        ctx.beginPath(); ctx.moveTo(40, 40); ctx.lineTo(80, 80); ctx.stroke();
        drawingPoints = [{ x: 40, y: 40, newStroke: true }, { x: 80, y: 80 }];
        const container = document.querySelector('.container');
        container.scrollTop = 0;
        return container.scrollTop;
    });
    const client = await page.context().newCDPSession(page);
    const container = await page.locator('.container').boundingBox();
    // Dispatch real touch input within the scroller's gutter, outside the canvas.
    const x = container.x + 3;
    t.diagnostic(JSON.stringify(await page.evaluate(x => ({ target: document.elementFromPoint(x, 450)?.className, containerTouchAction: getComputedStyle(document.querySelector('.container')).touchAction, bodyTouchAction: getComputedStyle(document.body).touchAction }), x)));
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: 450 }] });
    for (let y = 425; y >= 125; y -= 25) {
        await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
        await page.waitForTimeout(30);
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    t.diagnostic(JSON.stringify(await page.evaluate(() => ({ scrollTop: document.querySelector('.container').scrollTop, maximum: document.querySelector('.container').scrollHeight - document.querySelector('.container').clientHeight }))));
    await waitForState(page, previous => document.querySelector('.container').scrollTop > previous + 50, before);
    const done = page.getByRole('button', { name: "I'm Done!", exact: true });
    const box = await done.boundingBox();
    assert.ok(box && box.y >= 0 && box.y + box.height <= 568);
    assert.equal(await done.evaluate(element => {
        const rect = element.getBoundingClientRect();
        return element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
    }), true);
    assert.equal(await page.evaluate(() => drawingPoints.length), 2);
    assert.ok(await page.evaluate(() => [...ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data].some((value, i) => i % 4 === 3 && value > 0)));
    await client.detach();
}, { viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }));

test('player switches and statistics resets discard the previous selection bias', t => run(t, async page => {
    for (const name of ['Alice', 'Bob']) {
        await page.locator('.add-player-btn').press('Enter');
        await page.locator('#playerNameInput').fill(name);
        await page.locator('.player-modal-save').press('Enter');
    }
    await page.evaluate(() => { recentLetters = ['a', 'b', 'c']; shapeBiasTargetLower = 'a'; shapeBiasRoundsRemaining = 3; });
    await page.locator('.player-chip').filter({ hasText: 'Alice' }).press('Enter');
    assert.deepEqual(await page.evaluate(() => ({ recent: recentLetters.length, target: shapeBiasTargetLower, remaining: shapeBiasRoundsRemaining })), { recent: 0, target: null, remaining: 0 });
    await page.evaluate(() => { recentLetters = ['a', 'b', 'c']; shapeBiasTargetLower = 'b'; shapeBiasRoundsRemaining = 3; resetCurrentPlayerStatistics(); });
    assert.deepEqual(await page.evaluate(() => ({ recent: recentLetters.length, target: shapeBiasTargetLower, remaining: shapeBiasRoundsRemaining })), { recent: 1, target: null, remaining: 0 });
}));
