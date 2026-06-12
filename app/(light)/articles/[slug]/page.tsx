import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/articles/ReadingProgress";
import { Toc } from "@/components/articles/Toc";
import { ArticleFooterNav } from "@/components/articles/ArticleFooterNav";
import { CoverImage } from "@/components/ui/CoverImage";
import { TagRow } from "@/components/ui/Tag";
import { JsonLd } from "@/components/ui/JsonLd";
import { IconArrowRight } from "@/components/ui/icons";
import {
  getAdjacentArticles,
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  toListItem,
} from "@/lib/content/articles";
import { extractToc } from "@/lib/toc";
import { formatDateLong } from "@/lib/dates";
import { blogPostingJsonLd, breadcrumbJsonLd, ogBase } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

/** 全部文章详情页在构建时静态生成；未知 slug 直接 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
    keywords: article.tags.filter((t) => t !== "DEMO"),
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      ...ogBase,
      type: "article",
      url: `/articles/${article.slug}`,
      title: article.title,
      description: article.summary,
      publishedTime: article.date,
      tags: [...article.tags],
      ...(article.cover ? { images: [{ url: article.cover }] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const { default: Content } = await import(`@/content/articles/${slug}.mdx`);
  const toc = extractToc(article.body);
  const { prev, next } = getAdjacentArticles(slug);
  const related = getRelatedArticles(slug).map(toListItem);

  return (
    <>
      <ReadingProgress />
      <JsonLd data={blogPostingJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "文章", path: "/articles" },
          { name: article.title, path: `/articles/${article.slug}` },
        ])}
      />

      <article className="container-k pb-[var(--section-y)] pt-28">
        {/* 头部 */}
        <header className="mx-auto max-w-4xl">
          <Link
            href="/articles"
            className="type-label link-slide inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
          >
            <IconArrowRight width={12} height={12} className="rotate-180" />
            全部文章
          </Link>

          <p className="type-label mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-fg-muted">
            <span className="border border-line px-2 py-1">{article.category}</span>
            <time dateTime={article.date}>{formatDateLong(article.date)}</time>
            {article.draft ? (
              <span className="border border-line-strong bg-fg px-2 py-1 text-bg">
                草稿 · 仅开发环境可见
              </span>
            ) : null}
          </p>

          <h1 className="type-headline mt-6 text-[clamp(1.875rem,4.5vw,3.25rem)]">
            {article.title}
          </h1>

          <p className="mt-6 max-w-2xl border-l-2 border-fg pl-5 text-base leading-relaxed text-fg-muted">
            {article.summary}
          </p>

          <div className="mt-7">
            <TagRow tags={article.tags} />
          </div>
        </header>

        {/* 封面 */}
        {article.cover ? (
          <figure className="relative mx-auto mt-12 aspect-[21/9] max-w-5xl overflow-hidden border border-line">
            <CoverImage
              src={article.cover}
              alt={`${article.title} 封面图`}
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </figure>
        ) : null}

        {/* 正文 + 目录 */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-12 lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-20">
          <div className="min-w-0 lg:max-w-[44rem] lg:justify-self-end lg:w-full">
            {/* 移动端折叠目录 */}
            <div className="mb-10 lg:hidden">
              <Toc items={toc} variant="collapsible" />
            </div>

            <div className="prose">
              <Content />
            </div>

            <ArticleFooterNav prev={prev && toListItem(prev)} next={next && toListItem(next)} related={related} />
          </div>

          {/* 桌面端悬浮目录 */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Toc items={toc} variant="sidebar" />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
