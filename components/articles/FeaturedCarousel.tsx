"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { ArticleListItem } from "@/lib/content/articles";
import { formatDateCompact } from "@/lib/dates";
import { CoverImage } from "@/components/ui/CoverImage";

/**
 * 精选文章轮播：一次显示一篇大图卡，左滑（scroll-snap）切换，
 * 底部圆点指示与跳转。最多展示传入的前 3 篇。
 */
export function FeaturedCarousel({ articles }: { articles: ArticleListItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const items = articles.slice(0, 3);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="精选文章轮播"
      >
        {items.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group relative block aspect-[4/3] w-full shrink-0 snap-center overflow-hidden bg-bg-sunken"
          >
            {article.cover ? (
              <CoverImage
                src={article.cover}
                alt=""
                sizes="320px"
                className="transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
              />
            ) : (
              <span className="blueprint-grid absolute inset-0" aria-hidden="true" />
            )}

            {/* 底部渐暗保证文字可读 */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[rgba(6,6,6,0.78)] via-[rgba(6,6,6,0.35)] to-transparent"
            />

            <span className="absolute left-4 top-4 rounded-full bg-[rgba(250,249,245,0.92)] px-3 py-1.5 text-xs font-medium text-[var(--gray-1)]">
              {article.category}
            </span>

            <span className="absolute inset-x-0 bottom-0 p-5">
              <time
                dateTime={article.date}
                className="type-label text-[color-mix(in_srgb,var(--gray-10)_75%,transparent)]"
              >
                {formatDateCompact(article.date)}
              </time>
              <span className="mt-2 line-clamp-3 block text-base font-semibold leading-snug text-[var(--gray-10)]">
                {article.title}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {items.length > 1 ? (
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="切换精选文章">
          {items.map((article, i) => (
            <button
              key={article.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`第 ${i + 1} 篇：${article.title}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-fg" : "w-1.5 bg-fg-faint hover:bg-fg-muted"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
