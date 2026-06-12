import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { CoverImage } from "@/components/ui/CoverImage";
import type { ArticleListItem } from "@/lib/content/articles";
import { formatDateCompact } from "@/lib/dates";

/** 文章列表顶部的精选轨道（3–5 篇）：首篇大图，其余紧随 */
export function ArticleFeaturedRail({ articles }: { articles: ArticleListItem[] }) {
  if (articles.length === 0) return null;
  const [lead, ...rest] = articles;

  return (
    <section aria-labelledby="featured-rail-title">
      <h2 id="featured-rail-title" className="type-label text-fg-muted">
        <span aria-hidden="true">★</span> FEATURED / 精选
      </h2>

      <div className="mt-6 grid gap-px border border-line bg-line lg:grid-cols-3">
        <Reveal className="lg:col-span-2 lg:row-span-2">
          <FeaturedCard article={lead} large />
        </Reveal>
        {rest.map((article, i) => (
          <Reveal key={article.slug} delay={0.06 * (i + 1)}>
            <FeaturedCard article={article} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FeaturedCard({
  article,
  large = false,
}: {
  article: ArticleListItem;
  large?: boolean;
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex h-full flex-col bg-bg-raised transition-colors duration-300 hover:bg-bg-sunken"
    >
      {article.cover ? (
        <span
          className={`relative block w-full overflow-hidden border-b border-line ${
            large ? "aspect-[16/9]" : "aspect-[16/7]"
          }`}
        >
          <CoverImage
            src={article.cover}
            alt=""
            sizes={large ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
            priority={large}
            className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </span>
      ) : null}

      <span className={`flex flex-1 flex-col ${large ? "p-7" : "p-6"}`}>
        <span className="flex items-baseline justify-between gap-4">
          <span className="type-label text-fg-muted">{article.category}</span>
          <time dateTime={article.date} className="type-label text-fg-muted">
            {formatDateCompact(article.date)}
          </time>
        </span>
        <span
          className={`link-slide type-headline mt-4 self-start ${
            large ? "text-[clamp(1.375rem,2.5vw,2rem)]" : "text-lg"
          }`}
        >
          {article.title}
        </span>
        <span
          className={`mt-3 text-sm leading-relaxed text-fg-muted ${
            large ? "max-w-xl" : "line-clamp-2"
          }`}
        >
          {article.summary}
        </span>
      </span>
    </Link>
  );
}
