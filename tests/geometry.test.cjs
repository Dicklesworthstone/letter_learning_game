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
    const child = require('node:child_process').spawnSync(process.execPath, ['-e', html.slice(start, end) + '\nif(resampleStroke(Array.from({length:48},(_,i)=>({x:i,y:0})),48).length!==48)process.exit(1);'], { timeout: 1500 });
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
