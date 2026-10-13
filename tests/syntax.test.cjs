const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const html = readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');

test('all inline JavaScript parses and inline controls have handlers', () => {
    const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
        .map(match => match[1]).filter(script => script.trim());
    assert.equal(scripts.length, 2, 'analytics and application scripts must both be checked');
    for (const script of scripts) new vm.Script(script);
    const application = scripts[1];
    for (const match of html.matchAll(/(?:onclick|onchange)="(\w+)\(/g)) {
        assert.ok(new RegExp(`function ${match[1]}\\s*\\(`).test(application), `missing handler: ${match[1]}`);
    }
});
