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
import { formatDateTimeCompact } from "@/lib/dates";
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
        {/* 一条居中阅读柱：头部 / 封面 / 正文 / 尾部 同宽同左边线。
            目录在 ≥1440px 时浮于右侧留白（绝对定位，不影响阅读柱居中），
            窄屏改用正文上方的折叠目录。 */}
        <div className="relative mx-auto w-full max-w-[44rem]">
          {/* 头部 */}
          <header>
            <Link
              href="/articles"
              className="type-label link-slide inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
            >
              <IconArrowRight width={12} height={12} className="rotate-180" />
              全部文章
            </Link>

            <p className="type-label mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-fg-muted">
              <span className="rounded-full bg-bg-sunken px-3 py-1">{article.category}</span>
              <time dateTime={article.date}>{formatDateTimeCompact(article.date)}</time>
              {article.draft ? (
                <span className="rounded-full bg-fg px-3 py-1 text-bg">
                  草稿 · 仅开发环境可见
                </span>
              ) : null}
            </p>

            <h1 className="type-headline mt-6 text-[clamp(1.875rem,4.5vw,3rem)]">
              {article.title}
            </h1>

            <p className="mt-6 border-l-2 border-fg pl-5 text-base leading-relaxed text-fg-muted">
              {article.summary}
            </p>

            <div className="mt-7">
              <TagRow tags={article.tags} />
            </div>
          </header>

          {/* 封面 —— 与阅读柱同宽，圆角无边框 */}
          {article.cover ? (
            <figure className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-bg-sunken">
              <CoverImage
                src={article.cover}
                alt={`${article.title} 封面图`}
                sizes="(max-width: 768px) 100vw, 704px"
                priority
              />
            </figure>
          ) : null}

          {/* 折叠目录（<1440px） */}
          <div className="mt-10 min-[1440px]:hidden">
            <Toc items={toc} variant="collapsible" />
          </div>

          {/* 正文 */}
          <div className="prose mt-12">
            <Content />
          </div>

          <ArticleFooterNav
            prev={prev && toListItem(prev)}
            next={next && toListItem(next)}
            related={related}
          />

          {/* 浮动目录（≥1440px，绝对定位于阅读柱右侧留白） */}
          <aside className="absolute left-full top-0 hidden h-full min-[1440px]:block">
            <div className="sticky top-28 ml-12 w-52">
              <Toc items={toc} variant="sidebar" />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
