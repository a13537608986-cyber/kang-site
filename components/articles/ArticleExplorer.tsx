"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import type { ArticleListItem } from "@/lib/content/articles";
import { CATEGORIES } from "@/lib/content/schema";
import { filterArticles, type CategoryFilter } from "@/lib/search";
import { byDateDesc, formatDateCompact, yearOf } from "@/lib/dates";
import { CoverImage } from "@/components/ui/CoverImage";
import { IconClose, IconSearch } from "@/components/ui/icons";

/**
 * 文章档案 —— 经典列表形式：
 * 上方为分类胶囊导航（即筛选器），下方为横向大卡片列表（时间倒序，
 * 跨年份处插入低调的年份标记）。搜索覆盖标题/摘要/栏目/标签。
 */
export function ArticleExplorer({ articles }: { articles: ArticleListItem[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(
    () => [...filterArticles(articles, category, query)].sort(byDateDesc),
    [articles, category, query],
  );
  const isFiltering = query.trim() !== "" || category !== "all";

  const countOf = (c: CategoryFilter) =>
    c === "all"
      ? articles.length
      : articles.filter((a) => a.category === c).length;

  return (
    <section aria-label="文章档案">
      {/* ——— 上方：分类导航 ——— */}
      <div className="flex flex-col items-center gap-8 border-b border-line pb-14">
        <p className="type-label text-fg-muted">
          TOPICS <span className="mx-2" aria-hidden="true">/</span> 按栏目浏览
        </p>

        <div
          role="group"
          aria-label="按栏目筛选"
          className="flex max-w-3xl flex-wrap justify-center gap-3"
        >
          {(["all", ...CATEGORIES] as const).map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-fg bg-fg text-bg"
                    : "border-line bg-bg-raised text-fg-muted hover:border-line-strong hover:text-fg"
                }`}
              >
                {c === "all" ? "全部" : c}
                <span className={`ml-2 font-mono text-xs ${active ? "opacity-70" : "text-fg-faint"}`}>
                  {countOf(c)}
                </span>
              </button>
            );
          })}
        </div>

        {/* 搜索 */}
        <div className="relative w-full max-w-md">
          <label htmlFor={inputId} className="sr-only">
            搜索文章（标题、摘要、栏目、标签）
          </label>
          <IconSearch
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-fg-faint"
            width={15}
            height={15}
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索标题、摘要、栏目、标签"
            className="w-full rounded-full border border-line bg-bg-raised py-3 pl-12 pr-12 text-sm placeholder:text-fg-muted focus:border-line-strong"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="清空搜索"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-fg-muted hover:text-fg"
            >
              <IconClose width={12} height={12} />
            </button>
          ) : null}
        </div>
      </div>

      {/* 结果状态 */}
      <p className="type-label mt-8 text-fg-muted" role="status" aria-live="polite">
        {isFiltering
          ? `${filtered.length} 篇匹配 / ${articles.length} 篇`
          : `共 ${articles.length} 篇 · 按发布时间排列`}
      </p>

      {/* ——— 下方：经典列表 ——— */}
      {filtered.length === 0 ? (
        <div className="border-b border-line py-24 text-center">
          <p className="type-headline text-xl text-fg-muted">没有匹配的文章</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="type-label link-slide mt-4 text-fg-muted hover:text-fg"
          >
            清除筛选条件
          </button>
        </div>
      ) : (
        <div className="mt-4">
          {filtered.map((article, i) => {
            const year = yearOf(article.date);
            const prevYear = i > 0 ? yearOf(filtered[i - 1].date) : null;
            return (
              <div key={article.slug}>
                {year !== prevYear ? (
                  <p
                    className="type-label mt-12 flex items-center gap-4 text-fg-faint first:mt-8"
                    aria-label={`${year} 年`}
                  >
                    {year}
                    <span className="h-px flex-1 bg-line" aria-hidden="true" />
                  </p>
                ) : null}
                <ArticleCard article={article} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ArticleCard({ article }: { article: ArticleListItem }) {
  const tags = article.tags.filter((t) => t !== "DEMO").slice(0, 3);
  return (
    <article className="border-b border-line py-10 last:border-b-0">
      <Link
        href={`/articles/${article.slug}`}
        className={`group grid items-center gap-6 md:gap-10 ${
          article.cover ? "md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" : ""
        }`}
      >
        {article.cover ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-bg-sunken">
            <CoverImage
              src={article.cover}
              alt=""
              sizes="(max-width: 768px) 100vw, 40vw"
              className="transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
            />
            <span className="absolute left-4 top-4 rounded-full bg-bg-raised/95 px-3 py-1.5 text-xs font-medium text-fg shadow-sm">
              {article.category}
            </span>
          </div>
        ) : null}

        <div className="min-w-0">
          <p className="type-label flex flex-wrap items-baseline gap-x-3 gap-y-1 text-fg-muted">
            {!article.cover ? <span>{article.category}</span> : null}
            <time dateTime={article.date}>{formatDateCompact(article.date)}</time>
            {tags.length > 0 ? (
              <span className="text-fg-faint">{tags.map((t) => `#${t}`).join(" ")}</span>
            ) : null}
          </p>

          <h3 className="type-headline mt-3 text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug">
            <span className="link-slide">{article.title}</span>
          </h3>

          <p className="mt-3 line-clamp-2 max-w-xl text-[0.9375rem] leading-relaxed text-fg-muted">
            {article.summary}
          </p>

          <span className="type-label mt-5 inline-flex items-center gap-2 text-fg-faint transition-colors group-hover:text-fg">
            阅读全文
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
