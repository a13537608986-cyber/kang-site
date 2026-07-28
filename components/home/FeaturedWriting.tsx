import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import type { ArticleListItem } from "@/lib/content/articles";
import { formatDateCompact } from "@/lib/dates";

/** 03 — 精选文章：标题即入口 */
export function FeaturedWriting({ articles }: { articles: ArticleListItem[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="featured-writing-title" className="container-k pb-[calc(var(--section-y)*1.05)] pt-[calc(var(--section-y)*1.1)]">
      <div id="featured-writing-title">
        <SectionHead
          index="03"
          en="SELECTED WRITING"
          zh="精选文章"
          more={{ href: "/articles", label: "全部文章" }}
        />
      </div>

      <ul className="mt-12">
        {articles.map((article, i) => (
          <Reveal
            as="li"
            key={article.slug}
            delay={i * 0.05}
            className="border-t border-line last:border-b"
          >
            <Link
              href={`/articles/${article.slug}`}
              className="group grid items-baseline gap-x-6 gap-y-2 py-6 md:grid-cols-[7rem_1fr_6rem]"
            >
              <time dateTime={article.date} className="type-label text-fg-muted">
                {formatDateCompact(article.date)}
              </time>
              <span className="min-w-0">
                <span className="link-slide type-headline text-lg md:text-xl">
                  {article.title}
                </span>
                <span className="mt-1.5 block max-w-2xl text-sm leading-relaxed text-fg-muted max-md:hidden">
                  {article.summary}
                </span>
              </span>
              <span className="type-label text-fg-muted md:text-right">
                {article.category}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
