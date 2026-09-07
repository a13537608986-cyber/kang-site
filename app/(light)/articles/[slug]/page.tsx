import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleFooterNav } from "@/components/articles/ArticleFooterNav";
import { ArticleSidebar } from "@/components/articles/ArticleSidebar";
import { CoverImage } from "@/components/ui/CoverImage";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  toListItem,
} from "@/lib/content/articles";
import { extractToc } from "@/lib/toc";
import { formatDateCompact } from "@/lib/dates";
import { blogPostingJsonLd, breadcrumbJsonLd, ogBase } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

function estimateReadingMinutes(body: string): number {
  const readable = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/[`#>*_\-[\]()]/g, "")
    .replace(/\s+/g, "");
  return Math.max(1, Math.ceil(readable.length / 650));
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
  const chapters = toc.filter((item) => item.depth === 2);
  const readingMinutes = estimateReadingMinutes(article.body);
  const showToc = readingMinutes >= 5 && chapters.length > 1;
  const allArticles = getAllArticles();
  const rankedRelated = getRelatedArticles(slug);
  const related = [
    ...rankedRelated,
    ...allArticles.filter(
      (item) =>
        item.slug !== slug &&
        !rankedRelated.some((relatedArticle) => relatedArticle.slug === item.slug),
    ),
  ]
    .slice(0, 3)
    .map(toListItem);
  const sidebarFeatured = allArticles
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map(toListItem);

  return (
    <>
      <JsonLd data={blogPostingJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "文章", path: "/articles" },
          { name: article.title, path: `/articles/${article.slug}` },
        ])}
      />

      <article className="bg-bg pb-[var(--section-y)] pt-24 sm:pt-28">
        <div className="container-k">
          <div
            data-article-breadcrumb
            className="mx-auto flex w-full max-w-[74rem] items-center justify-start gap-2 text-xs text-fg-muted"
          >
            <Link href="/" className="link-slide hover:text-fg">首页</Link>
            <span aria-hidden="true">›</span>
            <Link href="/articles" className="link-slide hover:text-fg">文章</Link>
            <span aria-hidden="true">›</span>
            <span className="max-w-52 truncate sm:max-w-sm">{article.title}</span>
          </div>

          <header
            data-article-header
            className="mx-auto mt-8 w-full max-w-[74rem] text-center sm:mt-9"
          >
            <p className="flex flex-wrap items-baseline justify-center gap-x-1.5 text-sm text-fg-muted">
              <time dateTime={article.date}>{formatDateCompact(article.date)}</time>
              {article.draft ? (
                <span className="ml-2 rounded-full bg-fg px-3 py-1 text-xs text-bg">
                  草稿 · 还没写完
                </span>
              ) : null}
            </p>

            <h1 className="type-headline mx-auto mt-5 max-w-[68rem] text-[clamp(2.25rem,3.4vw,3.5rem)] leading-[1.14] tracking-[-0.025em]">
              {article.title}
            </h1>

            <p className="mx-auto mt-5 line-clamp-2 max-w-[46rem] text-base leading-[1.75] text-fg-muted sm:text-lg">
              {article.summary}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {article.tags.filter((tag) => tag !== "DEMO").slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-bg-raised px-4 py-2 font-mono text-[0.6875rem] font-semibold tracking-[0.1em] text-fg shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {article.cover ? (
            <figure className="relative mx-auto mt-8 aspect-[16/9] w-full max-w-[74rem] overflow-hidden rounded-[1.125rem] bg-bg-sunken">
              <CoverImage
                src={article.cover}
                alt={`${article.title} 封面图`}
                sizes="(max-width: 768px) 100vw, 1024px"
                priority
              />
            </figure>
          ) : null}
        </div>

        <div className="container-k mt-12">
          <div className="mx-auto grid w-full max-w-[74rem] grid-cols-1 items-start gap-7 lg:grid-cols-[4.5rem_minmax(0,1fr)_17rem] xl:grid-cols-[5rem_minmax(0,1fr)_20rem]">
            <aside className="hidden justify-items-center gap-7 lg:grid">
              <div className="grid size-20 place-items-center rounded-full border border-line bg-black text-center text-sm font-semibold leading-tight text-white">
                <span>{readingMinutes} 分钟<br />阅读</span>
              </div>
            </aside>

            <div className="min-w-0">
              {showToc ? (
                <details
                  data-article-toc
                  className="mb-8 border-y border-line py-3 text-sm text-fg-muted"
                >
                  <summary className="cursor-pointer py-1 font-medium hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg">
                    目录
                  </summary>
                  <nav aria-label="文章目录" className="pt-3 pb-1">
                    <ul className="space-y-1">
                      {chapters.map((chapter) => (
                        <li key={chapter.id}>
                          <a
                            href={`#${chapter.id}`}
                            className="block py-1.5 leading-relaxed hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
                          >
                            {chapter.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </details>
              ) : null}

              <div className="prose article-prose min-w-0">
                <Content />
              </div>

            </div>

            <div className="hidden lg:block">
              <ArticleSidebar featured={sidebarFeatured} />
            </div>
          </div>

        </div>

        <ArticleFooterNav related={related} />
      </article>
    </>
  );
}
