const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const html = readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('function resampleStroke(');
const end = html.indexOf('// Tracing recognizer:', start);
assert.ok(start > 0 && end > start, 'test the actual production geometry functions');
const context = vm.createContext({});
vm.runInContext(html.slice(start, end), context);

test('original 48-point hang terminates with bounded finite coordinates', () => {
    const code = html.slice(start, end) + '\nif(resampleStroke(Array.from({length:48},(_,i)=>({x:i,y:0})),48).length!==48)throw new Error("Invalid sample count");';
    // Process startup has its own bound; the actual geometry still gets only 500ms.
    const child = require('node:child_process').spawnSync(process.execPath, ['-e', `require('node:vm').runInNewContext(${JSON.stringify(code)}, {}, { timeout: 500 });`], { timeout: 10000 });
    assert.equal(child.error, undefined, 'the original hanging input must complete before the hard process timeout');
    assert.equal(child.status, 0);
    const result = vm.runInContext('resampleStroke(Array.from({length:48}, (_,i)=>({x:i,y:0})),48)', context, { timeout: 500 });
    assert.equal(result.length, 48);
    for (let i = 0; i < 48; i++) { assert.ok(Math.abs(result[i].x - i) < 1e-9); assert.equal(result[i].y, 0); }
});
test('sampling handles degenerate input and never mutates or extrapolates', () => {
    assert.equal(context.resampleStroke([], 48).length, 0);
    const original = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 100, y: 0 }];
    const snapshot = JSON.stringify(original);
    const result = context.resampleStroke(original, 48);
    assert.equal(JSON.stringify(original), snapshot);
    assert.equal(result.length, 48);
    assert.ok(result.every(point => Number.isFinite(point.x) && point.x >= 0 && point.x <= 100 && point.y === 0));
    assert.equal(result[0].x, 0); assert.equal(result[47].x, 100);
    assert.ok(context.resampleStroke([{ x: 7, y: 9 }], 48).every(point => point.x === 7 && point.y === 9));
    assert.throws(() => context.resampleStroke(original, Infinity));
});
test('sampling preserves shape across density, translation and scale', () => {
    const sparse = [{ x: 0, y: 0 }, { x: 30, y: 40 }, { x: 100, y: 40 }];
    const dense = [{ x: 0, y: 0 }, { x: 15, y: 20 }, { x: 30, y: 40 }, { x: 65, y: 40 }, { x: 100, y: 40 }];
    const a = context.resampleStroke(sparse, 48), b = context.resampleStroke(dense, 48);
    const translated = context.resampleStroke(sparse.map(p => ({ x: p.x * 3 + 17, y: p.y * 3 - 8 })), 48);
    for (let i = 0; i < 48; i++) {
        assert.ok(Math.hypot(a[i].x - b[i].x, a[i].y - b[i].y) < 1e-9);
        assert.ok(Math.hypot(a[i].x * 3 + 17 - translated[i].x, a[i].y * 3 - 8 - translated[i].y) < 1e-9);
    }
});
test('multi-stroke cloud does not manufacture ink during pen-up travel', () => {
    const result = context.createTraceCloud([[{ x: 0, y: 0 }, { x: 0, y: 10 }], [{ x: 100, y: 100 }]], 48);
    assert.equal(result.length, 48);
    assert.ok(result.some(p => p.x === 100 && p.y === 100));
    assert.ok(result.every(p => (p.x === 0 && p.y >= 0 && p.y <= 10) || (p.x === 100 && p.y === 100)));
});
test('discreteFrechetDistance is order-sensitive, zero on identical paths, and bounded on shifted curves', () => {
    const forward = [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 100, y: 0 }];
    const shifted = [{ x: 0, y: 6 }, { x: 50, y: 6 }, { x: 100, y: 6 }];
    const reversed = [...forward].reverse();
    assert.equal(context.discreteFrechetDistance(forward, forward), 0);
    assert.ok(Math.abs(context.discreteFrechetDistance(forward, shifted) - 6) < 1e-9);
    assert.ok(context.discreteFrechetDistance(forward, reversed) >= 100);
    assert.equal(context.discreteFrechetDistance([], forward), Infinity);
});
test('strokeCurvatureVariation distinguishes collinear lines, right-angle turns, and high-frequency zig-zags', () => {
    const line = [{ x: 0, y: 0 }, { x: 25, y: 0 }, { x: 50, y: 0 }, { x: 100, y: 0 }];
    const corner = [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 50, y: 50 }];
    const zigzag = Array.from({ length: 12 }, (_, i) => ({ x: i * 10, y: (i % 2) * 30 }));
    assert.ok(context.strokeCurvatureVariation(line) < 1e-9);
    assert.ok(Math.abs(context.strokeCurvatureVariation(corner) - Math.PI / 2) < 1e-9);
    assert.ok(context.strokeCurvatureVariation(zigzag) > Math.PI * 4);
});

