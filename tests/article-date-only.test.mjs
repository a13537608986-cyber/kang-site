import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

for (const path of [
  "components/articles/ArticleExplorer.tsx",
  "components/articles/ArticleFooterNav.tsx",
  "app/(light)/articles/[slug]/page.tsx",
]) {
  test(`${path} displays a date without a byline or time of day`, async () => {
    const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /发布于|formatDateTimeCompact|\{profile\.name\}/);
    assert.match(source, /<time dateTime=\{article.date\}>\{formatDateCompact\(article.date\)\}<\/time>/);
  });
}
