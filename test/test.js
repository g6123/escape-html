const assert = require('assert');
const escapeHtml = require('..');

function escapeAndTest(text, options, expected) {
	assert.equal(escapeHtml(text, options), expected);
}

describe('Allowed tag', function() {
	it('Opening tag', function() {
		escapeAndTest('<a>', { allowedTags: ['a'] }, '<a>');
	});

	it('Closing tag', function() {
		escapeAndTest('</a>', { allowedTags: ['a'] }, '</a>');
	});

	it('Self-closing tag', function() {
		escapeAndTest('<br />', { allowedTags: ['br'] }, '<br>');
	});
});

describe('Denied tag', function() {
	it('Opening tag', function() {
		escapeAndTest('<script>', { allowedTags: [] }, '&lt;script&gt;');
	});

	it('Closing tag', function() {
		escapeAndTest('</script>', { allowedTags: [] }, '&lt;/script&gt;');
	});

	it('Self-closing tag', function() {
		escapeAndTest('<input />', { allowedTags: [] }, '&lt;input /&gt;');
	});
});

describe('Allowed attribute', function() {
	it('With double quotes', function() {
		escapeAndTest('<div style="display: inline-block;">', {
			allowedTags: ['div'],
			allowedAttrs: { 'div': ['style'] }
		}, '<div style="display: inline-block;">');
	});

	it('With single quotes', function() {
		escapeAndTest("<div style='display: inline-block;'>", {
			allowedTags: ['div'],
			allowedAttrs: { 'div': ['style'] }
		}, '<div style="display: inline-block;">');
	});

	it('`href` protocol', function() {
		escapeAndTest('<a href="http://example.com/?query=data">', {
			allowedTags: ['a'],
			allowedAttrs: { 'a': ['href'] }
		}, '<a href="http://example.com/?query=data">');
	});
});

describe('Denied attribute', function() {
	it('With double quotes', function() {
		escapeAndTest('<span onclick="alert(\'\');">', {
			allowedTags: ['span'],
			allowedAttrs: {}
		}, '<span>');
	});

	it('With single quotes', function() {
		escapeAndTest("<span onclick='alert(\"\");'>", {
			allowedTags: ['span'],
			allowedAttrs: {}
		}, '<span>');
	});

	it('`href` protocol', function() {
		escapeAndTest('<a href="javascript:alert(\'\')">', {
			allowedTags: ['a'],
			allowedAttrs: { 'a': ['href'] },
			allowedProtocols: {}
		}, '<a href>');
	});
});