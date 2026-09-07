"use client";

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Atom,
  ClipboardText,
  Eye,
  PencilSimpleLine,
  SquaresFour,
} from "@phosphor-icons/react";
import type { ArticleListItem } from "@/lib/content/articles";
import { CATEGORIES } from "@/lib/content/schema";
import { filterArticles, type CategoryFilter } from "@/lib/search";
import { byDateDesc, formatDateCompact } from "@/lib/dates";
import { CoverImage } from "@/components/ui/CoverImage";

const TOPIC_ICONS = {
  all: SquaresFour,
  "AI纪元": Atom,
  "AI 洞察": Eye,
  实战复盘: ClipboardText,
  个人随想: PencilSimpleLine,
} as const;

const ARTICLES_PER_PAGE = 8;

/** Revision 首页式文章归档：完整主题区 + 横向文章列表 + 右侧资料栏。 */
export function ArticleExplorer({
  articles,
  sidebar,
}: {
  articles: ArticleListItem[];
  sidebar: ReactNode;
}) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [page, setPage] = useState(1);
  const archiveRef = useRef<HTMLElement>(null);
  const scrollToTopAfterPageChange = useRef(false);
  const filtered = useMemo(
    () => [...filterArticles(articles, category, "")].sort(byDateDesc),
    [articles, category],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ARTICLES_PER_PAGE));
  const pageStart = (page - 1) * ARTICLES_PER_PAGE;
  const visibleArticles = filtered.slice(pageStart, pageStart + ARTICLES_PER_PAGE);

  function changePage(nextPage: number) {
    const targetPage = Math.max(1, Math.min(totalPages, nextPage));
    if (targetPage === page) return;
    scrollToTopAfterPageChange.current = true;
    setPage(targetPage);
  }

  useLayoutEffect(() => {
    if (!scrollToTopAfterPageChange.current) return;
    scrollToTopAfterPageChange.current = false;
    if (!archiveRef.current) return;
    // Keep the topic filters visible, without repeating the introductory hero.
    const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const archiveTop = archiveRef.current.getBoundingClientRect().top;
    window.scrollTo({
      top: Math.max(0, window.scrollY + archiveTop - headerHeight),
      behavior: "instant",
    });
  }, [page]);

  return (
    <section ref={archiveRef} aria-label="文章档案" style={{ overflowAnchor: "none" }}>
      <div className="mx-auto min-h-[302px] max-w-[940px] border-t border-line pt-16 pb-20 text-center md:min-h-[316px] md:pb-[88px]">
        <h2 className="text-[12px] font-extrabold uppercase leading-[14.4px] tracking-[1.2px] text-fg-muted">
          Explore topics · 按主题阅读
        </h2>
        <div role="group" aria-label="按栏目筛选" className="mt-8 flex flex-wrap justify-center gap-3">
          {(["all", ...CATEGORIES] as const).map((item) => {
            const active = category === item;
            const TopicIcon = TOPIC_ICONS[item];
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setCategory(item);
                  setPage(1);
                }}
                className={`inline-flex min-h-12 items-center gap-2.5 rounded-full px-6 text-[16px] font-bold leading-5 tracking-[-0.64px] transition-[background-color,color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-3 ${
                  active
                    ? "bg-black text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
                    : "bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.12)]"
                }`}
              >
                <TopicIcon size={20} weight={active ? "fill" : "bold"} aria-hidden="true" />
                <span>{item === "all" ? "全部文章" : item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-y-12 lg:grid-cols-[minmax(0,808px)_370px] lg:gap-x-[54px]">
        <div aria-live="polite">
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-bg-raised px-8 py-24 text-center shadow-[var(--shadow-card)]">
              <p className="text-[24px] font-bold text-fg">这个主题下暂时没有文章</p>
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setPage(1);
                }}
                className="mt-5 text-[15px] font-semibold text-fg underline underline-offset-4"
              >
                查看全部文章
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-y-10">
                {visibleArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>

              {totalPages > 1 ? (
                <nav aria-label="文章分页" className="mt-12 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => changePage(page - 1)}
                    disabled={page === 1}
                    className="inline-flex min-h-12 items-center rounded-full bg-white px-6 text-[15px] font-bold text-black shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-[box-shadow,transform,opacity] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.12)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
                  >
                    ← 上一页
                  </button>
                  <div className="order-first flex w-full flex-wrap justify-center gap-2 sm:order-none sm:w-auto">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        aria-label={`第 ${pageNumber} 页`}
                        aria-current={page === pageNumber ? "page" : undefined}
                        onClick={() => changePage(pageNumber)}
                        className={`inline-flex size-12 items-center justify-center rounded-full text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg ${
                          page === pageNumber
                            ? "bg-fg text-bg"
                            : "text-fg-muted hover:bg-bg-raised hover:text-fg"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => changePage(page + 1)}
                    disabled={page === totalPages}
                    className="inline-flex min-h-12 items-center rounded-full bg-white px-6 text-[15px] font-bold text-black shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-[box-shadow,transform,opacity] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.12)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
                  >
                    下一页 →
                  </button>
                </nav>
              ) : null}
            </>
          )}
        </div>

        <div className="hidden lg:block">{sidebar}</div>
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: ArticleListItem }) {
  const tags = article.tags.filter((tag) => tag !== "DEMO").slice(0, 2);

  return (
    <article className="border-b border-line pb-10">
      <Link
        href={`/articles/${article.slug}`}
        className="group grid gap-y-4 md:grid-cols-[minmax(0,400px)_minmax(0,388px)] md:items-stretch md:gap-x-5"
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-bg-sunken md:aspect-auto md:min-h-[253px]">
          {article.cover ? (
            <CoverImage
              src={article.cover}
              alt=""
              sizes="(max-width: 767px) 100vw, 400px"
              className="transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"
            />
          ) : null}

          <div className="absolute inset-x-5 top-5 flex items-start gap-3">
            <div className="flex flex-wrap gap-2">
              {(tags.length > 0 ? tags : [article.category]).map((tag) => (
                <span key={tag} className="flex h-[33.2px] items-center rounded-md bg-white px-[11px] text-[11px] font-extrabold uppercase leading-[13.2px] tracking-[1.1px] text-[#222]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-1.5 text-[15px] font-semibold leading-[18px] tracking-[-0.3px] text-fg-muted">
            <time dateTime={article.date}>{formatDateCompact(article.date)}</time>
          </p>

          <h3 className="mt-2.5 line-clamp-2 min-h-[57.6px] text-[24px] font-bold leading-[28.8px] tracking-[-0.96px] text-fg">
            {article.title}
          </h3>

          <p className="mt-[22px] line-clamp-3 min-h-[74.4px] text-[16px] leading-[24.8px] text-fg-muted">
            {article.summary}
          </p>

          <span className="mt-4 inline-flex min-h-[39.2px] items-center rounded-lg border border-white bg-black px-[18px] text-[16px] font-extrabold leading-[19.2px] tracking-[-0.48px] text-white transition-colors group-hover:bg-white group-hover:text-black">
            阅读全文
          </span>
        </div>
      </Link>
    </article>
  );
}
