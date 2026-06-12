"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import type { ArticleListItem } from "@/lib/content/articles";
import { CATEGORIES } from "@/lib/content/schema";
import {
  filterArticles,
  groupByYear,
  topTags,
  type CategoryFilter,
} from "@/lib/search";
import { formatDateMonthDay } from "@/lib/dates";
import { CoverImage } from "@/components/ui/CoverImage";
import { IconClose, IconSearch } from "@/components/ui/icons";

/**
 * 文章档案：搜索（标题/摘要/栏目/标签）+ 分类筛选 + 年份时间线。
 * 纯客户端过滤，逻辑在 lib/search.ts。
 */
export function ArticleExplorer({ articles }: { articles: ArticleListItem[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(
    () => filterArticles(articles, category, query),
    [articles, category, query],
  );
  const groups = useMemo(() => groupByYear(filtered), [filtered]);
  const tags = useMemo(() => topTags(articles), [articles]);
  const isFiltering = query.trim() !== "" || category !== "all";

  const countOf = (c: CategoryFilter) =>
    c === "all"
      ? articles.length
      : articles.filter((a) => a.category === c).length;

  return (
    <section aria-label="文章档案">
      {/* 控制区 */}
      <div className="border-y border-line py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* 分类筛选 */}
          <div role="group" aria-label="按栏目筛选" className="flex flex-wrap gap-2">
            {(["all", ...CATEGORIES] as const).map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(c)}
                  className={`type-label border px-3 py-2 transition-colors ${
                    active
                      ? "border-fg bg-fg text-bg"
                      : "border-line text-fg-muted hover:border-line-strong hover:text-fg"
                  }`}
                >
                  {c === "all" ? "全部" : c}
                  <span className="ml-1.5 opacity-60">{countOf(c)}</span>
                </button>
              );
            })}
          </div>

          {/* 搜索 */}
          <div className="relative w-full lg:max-w-xs">
            <label htmlFor={inputId} className="sr-only">
              搜索文章（标题、摘要、栏目、标签）
            </label>
            <IconSearch
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint"
              width={14}
              height={14}
            />
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索标题 / 摘要 / 栏目 / 标签"
              className="w-full border border-line bg-bg-raised py-2.5 pl-9 pr-9 font-mono text-sm placeholder:text-fg-muted focus:border-line-strong"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="清空搜索"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-fg-muted hover:text-fg"
              >
                <IconClose width={12} height={12} />
              </button>
            ) : null}
          </div>
        </div>

        {/* 标签快捷入口 */}
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="type-label text-fg-muted">TAGS</span>
          {tags.map((tag) => {
            const active = query.trim() === tag;
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => setQuery(active ? "" : tag)}
                className={`type-label transition-colors ${
                  active ? "text-fg underline underline-offset-4" : "text-fg-muted hover:text-fg"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 结果状态 */}
      <p className="type-label mt-6 text-fg-muted" role="status" aria-live="polite">
        {isFiltering
          ? `${filtered.length} 篇匹配 / ${articles.length} 篇`
          : `共 ${articles.length} 篇 · 按发布时间排列`}
      </p>

      {/* 年份时间线 */}
      {groups.length === 0 ? (
        <div className="border-b border-line py-20 text-center">
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
          {groups.map((group) => (
            <section
              key={group.year}
              aria-label={`${group.year} 年`}
              className="grid border-t border-line py-10 first:border-t-0 md:grid-cols-[9rem_1fr] md:gap-10"
            >
              <h2 className="type-mega type-outline text-[2.75rem] md:sticky md:top-28 md:self-start">
                {group.year}
              </h2>
              <ul className="max-md:mt-6">
                {group.items.map((article) => (
                  <ArticleRow key={article.slug} article={article} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

function ArticleRow({ article }: { article: ArticleListItem }) {
  return (
    <li className="border-b border-line first:border-t-0 last:border-b-0">
      <Link
        href={`/articles/${article.slug}`}
        className={`group grid grid-cols-[3rem_1fr] items-center gap-x-5 ${
          article.cover ? "py-5 md:grid-cols-[3rem_1fr_auto_8rem]" : "py-4 md:grid-cols-[3rem_1fr_auto]"
        }`}
      >
        <time dateTime={article.date} className="type-label text-fg-muted">
          {formatDateMonthDay(article.date)}
        </time>

        <span className="min-w-0">
          <span className="link-slide text-base font-medium md:text-lg">
            {article.title}
          </span>
          {article.cover ? (
            <span className="mt-1 block truncate text-sm text-fg-muted max-md:hidden">
              {article.summary}
            </span>
          ) : null}
        </span>

        <span className="flex items-center gap-3 max-md:col-start-2 max-md:mt-1.5">
          <span className="type-label text-fg-muted">{article.category}</span>
          <span className="type-label hidden text-fg-muted lg:inline">
            {article.tags
              .filter((t) => t !== "DEMO")
              .slice(0, 3)
              .map((t) => `#${t}`)
              .join(" ")}
          </span>
        </span>

        {article.cover ? (
          <span className="relative hidden aspect-[16/10] overflow-hidden border border-line md:block">
            <CoverImage
              src={article.cover}
              alt=""
              sizes="128px"
              className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
          </span>
        ) : null}
      </Link>
    </li>
  );
}
