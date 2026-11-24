import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLink } from './resolve-link.mjs';

const files = new Set(['/index.html', '/products/security/index.html', '/products/index.html', '/blog/play-to-earn-games-explained/index.html', '/blog/web3-gaming-wallets/index.html', '/og/default.png']);
const deep = '/blog/web3-gaming-wallets/';
// Mirrors the check in smoke.mjs: a link is broken if its target is absent.
const verdict = (href, route = deep, base = '') => {
  const t = resolveLink(href, route, base);
  if (!t) return 'ignored';
  if (t.outside) return 'outside';
  return files.has(t.path) ? 'ok' : 'broken';
};

test('relative link to a missing target from a nested route is flagged (the bug)', () => {
  const t = resolveLink('../../products/missing/', deep);
  assert.equal(t.path, '/products/missing/index.html');
  assert.equal(verdict('../../products/missing/'), 'broken');
});
test('the real dead link /products/security/ resolves correctly once it exists', () => {
  assert.equal(resolveLink('../../products/security/', deep).path, '/products/security/index.html');
  assert.equal(verdict('../../products/security/'), 'ok');
});
test('sibling relative link resolves', () => {
  assert.equal(verdict('../play-to-earn-games-explained/'), 'ok');
  assert.equal(verdict('./', deep), 'ok');
});
test('climbing more than one level from a deep route', () => {
  assert.equal(resolveLink('../../../products/', '/a/b/c/').path, '/products/index.html');
  assert.equal(verdict('../../../products/', '/a/b/c/'), 'ok');
});
test('fragment-only href is ignored', () => {
  assert.equal(verdict('#section'), 'ignored');
  assert.equal(verdict('#'), 'ignored');
  assert.equal(verdict('?q=1'), 'ignored');
});
test('query and fragment are stripped before resolving', () => {
  assert.equal(verdict('../../products/security/?a=1#x'), 'ok');
});
test('external https and protocol-relative hrefs are ignored', () => {
  assert.equal(verdict('https://example.com/nope/'), 'ignored');
  assert.equal(verdict('//example.com/nope/'), 'ignored');
});
test('non-navigational schemes are ignored', () => {
  for (const h of ['mailto:a@b.co', 'tel:+123', 'javascript:void(0)', 'data:text/plain,hi']) assert.equal(verdict(h), 'ignored');
});
test('absolute href that does not resolve is still flagged', () => {
  assert.equal(verdict('/products/nope/'), 'broken');
  assert.equal(verdict('/products/security/'), 'ok');
  assert.equal(verdict('/og/default.png'), 'ok');
});
test('relative link climbing above the root is flagged, not a crash', () => {
  assert.equal(verdict('../../../x/'), 'outside');
  assert.equal(verdict('../x/', '/'), 'outside');
});
test('BASE is stripped from absolute links', () => {
  assert.equal(verdict('/site/products/security/', deep, '/site'), 'ok');
});
