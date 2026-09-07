import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const articlePage = readFileSync(
  new URL("../app/(light)/articles/[slug]/page.tsx", import.meta.url),
  "utf8",
);
const articleFooter = readFileSync(
  new URL("../components/articles/ArticleFooterNav.tsx", import.meta.url),
  "utf8",
);

test("长文目录使用默认收起的原生折叠区，不再显示要点推广卡片", () => {
  assert.doesNotMatch(articlePage, /data-revision-summary|article-key-moments|查看本文要点|想先快速了解/);
  assert.match(articlePage, /const showToc = readingMinutes >= 5 && chapters.length > 1/);
  assert.match(articlePage, /<details\s+data-article-toc/);
  assert.doesNotMatch(articlePage, /<details[^>]*\bopen[=\s>]/);
  assert.doesNotMatch(articlePage, /filter\(.*\)\.slice\(0, 6\)/);
});

test("文章头部沿用封面内容边界，并保持面包屑左对齐", () => {
  assert.match(articlePage, /data-article-header/);
  assert.match(articlePage, /data-article-breadcrumb/);
  assert.match(articlePage, /max-w-\[74rem\]/);
  assert.match(articlePage, /justify-start/);
});

test("文章标题密度降低，标签使用可辨识的胶囊背景", () => {
  assert.match(articlePage, /text-\[clamp\(2\.25rem,3\.4vw,3\.5rem\)\]/);
  assert.match(articlePage, /rounded-full bg-bg-raised/);
  assert.match(articlePage, /shadow-\[0_10px_30px_rgba\(0,0,0,0\.08\)\]/);
});

test("延伸阅读被限制在和封面一致的内容容器内", () => {
  assert.match(articleFooter, /container-k/);
  assert.match(articleFooter, /max-w-\[74rem\]/);
});
