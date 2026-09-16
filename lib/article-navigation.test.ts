import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePage, clampPage, parseCategory, listHref, safeReturnHref, pageWindow } from './article-navigation.ts';

test('URL page parsing rejects malformed values and clamps out of range', () => {
  for (const value of [null, '', '-2', '0', '1.5', '6abc', 'Infinity']) assert.equal(parsePage(value), 1);
  assert.equal(parsePage('6'), 6);
  assert.equal(clampPage(parsePage('999999999999999999999'), 14), 14);
  assert.equal(clampPage(6, 0), 1);
  assert.equal(clampPage(6, 1), 1);
});
test('page and category round-trip without shared storage; category reset uses page 1', () => {
  const categories = ['AI纪元', '个人随想'];
  const url = new URL(listHref(6, 'AI纪元'), 'https://example.com');
  assert.equal(parsePage(url.searchParams.get('page')), 6);
  assert.equal(parseCategory(url.searchParams.get('category'), categories), 'AI纪元');
  assert.equal(parseCategory('bad', categories), 'all');
  assert.equal(listHref(1, 'all'), '/articles');
  assert.equal(new URL(listHref(1, '个人随想'), url).searchParams.get('page'), null);
});
test('return destination allows only exact local article archive', () => {
  for (const value of [null, '//evil.test/articles', 'https://evil.test/articles', '/articles/slug', '/articles/../other', '/articles\\evil', 'javascript:alert(1)', '/%61rticles']) {
    assert.equal(safeReturnHref(value, ['AI纪元']), '/articles');
  }
  assert.equal(safeReturnHref('/articles?page=6&category=AI纪元&evil=1#x', ['AI纪元']), listHref(6, 'AI纪元'));
});
test('bounded page window preserves endpoints and neighbours', () => {
  assert.deepEqual(pageWindow(6, 14), [1, 'ellipsis-left', 5, 6, 7, 'ellipsis-right', 14]);
  assert.deepEqual(pageWindow(1, 0), []);
  assert.deepEqual(pageWindow(1, 1), [1]);
  for (let total = 2; total < 100; total++) for (let page = 1; page <= total; page++) {
    const window = pageWindow(page, total);
    assert.ok(window.length <= 7);
    assert.equal(window[0], 1);
    assert.equal(window.at(-1), total);
    assert.ok(window.includes(page));
    assert.equal(new Set(window).size, window.length);
  }
});
