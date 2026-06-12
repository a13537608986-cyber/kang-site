import Link from "next/link";
import type { ArticleListItem } from "@/lib/content/articles";
import { formatDateCompact } from "@/lib/dates";
import { IconArrowRight } from "@/components/ui/icons";

/** 文章尾部：上一篇 / 下一篇 + 相关文章 */
export function ArticleFooterNav({
  prev,
  next,
  related,
}: {
  prev?: ArticleListItem;
  next?: ArticleListItem;
  related: ArticleListItem[];
}) {
  return (
    <footer className="mt-20">
      {/* 上一篇 / 下一篇 */}
      <nav aria-label="相邻文章" className="grid border-y border-line sm:grid-cols-2">
        <PagerCell article={prev} dir="prev" />
        <PagerCell article={next} dir="next" />
      </nav>

      {/* 相关文章 */}
      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="mt-16">
          <h2 id="related-title" className="type-label text-fg-muted">
            RELATED / 相关文章
          </h2>
          <ul className="mt-6 grid gap-px border border-line bg-line md:grid-cols-3">
            {related.map((article) => (
              <li key={article.slug} className="bg-bg-raised">
                <Link
                  href={`/articles/${article.slug}`}
                  className="flex h-full flex-col p-5 transition-colors hover:bg-bg-sunken"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="type-label text-fg-muted">{article.category}</span>
                    <time dateTime={article.date} className="type-label text-fg-muted">
                      {formatDateCompact(article.date)}
                    </time>
                  </span>
                  <span className="link-slide mt-3 self-start text-base font-medium leading-snug">
                    {article.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </footer>
  );
}

function PagerCell({
  article,
  dir,
}: {
  article?: ArticleListItem;
  dir: "prev" | "next";
}) {
  const label = dir === "prev" ? "上一篇 · OLDER" : "下一篇 · NEWER";
  if (!article) {
    return (
      <div
        className={`p-6 max-sm:border-b max-sm:border-line sm:first:border-r sm:first:border-line ${
          dir === "next" ? "text-right" : ""
        }`}
      >
        <p className="type-label text-fg-muted">{label}</p>
        <p className="mt-3 text-sm text-fg-muted">已经到头了</p>
      </div>
    );
  }
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group p-6 transition-colors hover:bg-bg-raised max-sm:border-b max-sm:border-line sm:first:border-r sm:first:border-line ${
        dir === "next" ? "text-right" : ""
      }`}
    >
      <p
        className={`type-label flex items-center gap-2 text-fg-muted ${
          dir === "next" ? "justify-end" : ""
        }`}
      >
        {dir === "prev" ? (
          <IconArrowRight width={12} height={12} className="rotate-180" />
        ) : null}
        {label}
        {dir === "next" ? <IconArrowRight width={12} height={12} /> : null}
      </p>
      <p className="link-slide mt-3 inline-block text-base font-medium leading-snug">
        {article.title}
      </p>
    </Link>
  );
}
