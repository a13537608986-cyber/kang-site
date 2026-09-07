import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const explorerPath = new URL(
  "../components/articles/ArticleExplorer.tsx",
  import.meta.url,
);

test("article archive paginates filtered results in groups of eight", async () => {
  const source = await readFile(explorerPath, "utf8");

  assert.match(source, /const ARTICLES_PER_PAGE = 8/);
  assert.match(source, /filtered\.slice\(pageStart, pageStart \+ ARTICLES_PER_PAGE\)/);
  assert.match(source, /Array\.from\(\{ length: totalPages \}/);
  assert.match(source, /onClick=\{\(\) => changePage\(pageNumber\)\}/);
  assert.match(source, /aria-current=\{page === pageNumber \? "page" : undefined\}/);
  assert.match(source, /上一页/);
  assert.match(source, /下一页/);
});

test("page changes align the archive below the fixed header, skipping the hero", async () => {
  const source = await readFile(explorerPath, "utf8");
  assert.doesNotMatch(source, /paginationTopBeforeChange|previousTop/);
  assert.match(source, /useLayoutEffect/);
  assert.match(source, /ref=\{archiveRef\}/);
  assert.match(source, /archiveRef\.current\.getBoundingClientRect\(\)\.top/);
  assert.match(source, /window\.scrollY \+ archiveTop - headerHeight/);
  assert.match(source, /behavior: "instant"/);
  assert.match(source, /changePage\(page - 1\)/);
  assert.match(source, /changePage\(page \+ 1\)/);
});
