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
    assert.equal(application.includes('playLetterSound('), false, 'undefined playLetterSound() must not be called');
});

test('anchorEmojiMap has zero duplicate keys and 100% coverage across phonics, Word Builder, and letterWords', () => {
    const mapMatch = html.match(/const anchorEmojiMap = \{([\s\S]*?)\r?\n\s*\};/);
    assert.ok(mapMatch, 'anchorEmojiMap definition must exist');
    const rawKeys = [...mapMatch[1].matchAll(/(?:['"]([^'"]+)['"]|\b([a-zA-Z]+))\s*:/g)]
        .map(m => (m[1] || m[2]).toLowerCase());
    assert.equal(rawKeys.length, new Set(rawKeys).size, 'anchorEmojiMap must not contain duplicate keys');

    const phoneticMatch = html.match(/const phoneticSounds = \{([\s\S]*?)\r?\n\s*\};/);
    const wbMatch = html.match(/const wordBuilderWords = \{([\s\S]*?)\r?\n\s*\};/);
    const lwMatch = html.match(/const letterWords = \{([\s\S]*?)\r?\n\s*\};/);
    const ctx = vm.createContext({});
    vm.runInContext(`
        ${phoneticMatch[0]}
        ${wbMatch[0]}
        ${lwMatch[0]}
        const anchorEmojiMap = {${mapMatch[1]}};
        this.phoneticSounds = phoneticSounds;
        this.wordBuilderWords = wordBuilderWords;
        this.letterWords = letterWords;
        this.anchorEmojiMap = anchorEmojiMap;
    `, ctx);

    for (const [letter, phrase] of Object.entries(ctx.phoneticSounds)) {
        const m = phrase.match(/as in\s+([a-zA-Z]+)/i);
        assert.ok(m && ctx.anchorEmojiMap[m[1].toLowerCase()], `missing phonetic anchor emoji for ${letter}: ${phrase}`);
    }
    for (const tier of ['easy', 'medium', 'hard']) {
        for (const word of ctx.wordBuilderWords[tier]) {
            assert.ok(ctx.anchorEmojiMap[word.toLowerCase()], `missing Word Builder emoji for ${tier}:${word}`);
        }
    }
    for (const [letter, words] of Object.entries(ctx.letterWords)) {
        for (const word of words) {
            assert.ok(ctx.anchorEmojiMap[word.toLowerCase()], `missing letterWords emoji for ${letter}:${word}`);
        }
    }
    for (const theme of ['fireworks', 'animals', 'vehicles', 'space', 'dinosaurs', 'hearts']) {
        assert.ok(html.includes(`data-celebration="${theme}"`), `missing celebration option button for ${theme}`);
    }
});


