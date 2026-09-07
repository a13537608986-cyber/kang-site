import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { CoverImage } from "@/components/ui/CoverImage";
import { SectionHead } from "@/components/ui/SectionHead";
import type { ArticleListItem } from "@/lib/content/articles";
import { formatDateCompact } from "@/lib/dates";

const HOME_ARTICLE_SUMMARIES: Partial<Record<string, string>> = {
  "notebooklm-deep-guide": "用 NotebookLM 搭一套能追溯来源、反复使用的研究工作流。",
  "stop-treating-llm-as-chatbot": "真正有价值的，不是陪聊，而是让模型进入业务流程。",
  "ai-user-research-5-steps": "从问题设计到行为验证，别再被一句“听起来不错”带偏。",
};

function getHomeSummary(article: ArticleListItem): string {
  return HOME_ARTICLE_SUMMARIES[article.slug] ?? article.summary;
}

/** 03 — 精选文章：一篇主推荐 + 两篇次推荐 */
export function FeaturedWriting({ articles }: { articles: ArticleListItem[] }) {
  if (articles.length === 0) return null;
  const featured = articles[0];
  const featuredSummary = getHomeSummary(featured);
  const secondary = articles.slice(1, 3);

  return (
    <section aria-labelledby="featured-writing-title" className="home-section-frame container-k border-t border-line">
      <div className="home-section-body flex min-h-0 items-center py-[var(--section-y)] md:min-h-[92svh] md:py-[clamp(5rem,10vh,8rem)]">
        <div className="w-full">
          <div id="featured-writing-title">
            <SectionHead
              index="03"
              en="SELECTED WRITING"
              zh="有些问题，写下来才想得明白"
              more={{ href: "/articles", label: "全部文章" }}
              bordered={false}
            />
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] lg:gap-8">
            <Reveal>
              <Link
                href={`/articles/${featured.slug}`}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg"
              >
                <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-bg-raised">
                  {featured.cover ? (
                    <CoverImage
                      src={featured.cover}
                      alt=""
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-transparent motion-reduce:transition-none" />
                  <span className="absolute left-4 top-4 rounded-full bg-[rgba(250,249,245,0.92)] px-3 py-1.5 text-xs font-medium text-[var(--gray-1)] shadow-sm">
                    {featured.category}
                  </span>
                </div>

                <time dateTime={featured.date} className="type-label mt-5 block text-fg-muted">
                  {formatDateCompact(featured.date)}
                </time>
                <h3 className="type-headline mt-4 max-w-[30ch] text-[clamp(1.5rem,2.1vw,2.15rem)] line-clamp-2">
                  <span className="link-slide">{featured.title}</span>
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted line-clamp-2">
                  {featuredSummary}
                </p>
              </Link>
            </Reveal>

            {secondary.length > 0 ? (
              <ul className="grid gap-10 lg:h-full lg:grid-rows-2 lg:gap-0">
                {secondary.map((article, i) => {
                  const summary = getHomeSummary(article);

                  return (
                    <Reveal
                      as="li"
                      key={article.slug}
                      delay={(i + 1) * 0.06}
                      className={`lg:flex lg:h-full lg:items-center ${i === 0 ? "lg:pb-4" : "border-t border-line pt-8 lg:pt-4"}`}
                    >
                      <Link
                        href={`/articles/${article.slug}`}
                        className="group grid w-full gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg sm:grid-cols-[minmax(8rem,0.85fr)_minmax(0,1.15fr)] sm:items-center"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-bg-raised sm:aspect-square">
                          {article.cover ? (
                            <CoverImage
                              src={article.cover}
                              alt=""
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 33vw"
                              className="transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-transparent motion-reduce:transition-none" />
                          <span className="absolute left-3 top-3 rounded-full bg-[rgba(250,249,245,0.92)] px-3 py-1.5 text-xs font-medium text-[var(--gray-1)] shadow-sm">
                            {article.category}
                          </span>
                        </div>

                        <div>
                          <time dateTime={article.date} className="type-label block text-fg-muted">
                            {formatDateCompact(article.date)}
                          </time>
                          <h3 className="type-headline mt-3 text-xl line-clamp-2">
                            <span className="link-slide">{article.title}</span>
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-fg-muted line-clamp-2">
                            {summary}
                          </p>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
