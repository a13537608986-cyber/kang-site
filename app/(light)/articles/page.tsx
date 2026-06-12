import type { Metadata } from "next";
import { ArticleFeaturedRail } from "@/components/articles/ArticleFeaturedRail";
import { ArticleExplorer } from "@/components/articles/ArticleExplorer";
import { JsonLd } from "@/components/ui/JsonLd";
import { IconRss } from "@/components/ui/icons";
import { getAllArticles, getFeaturedArticles, toListItem } from "@/lib/content/articles";
import { breadcrumbJsonLd, ogBase } from "@/lib/seo";

export const metadata: Metadata = {
  title: "文章",
  description:
    "KANG 的文章档案：AI 产品、行业观察、方法论与实践复盘，按年份与栏目归档。",
  alternates: { canonical: "/articles" },
  openGraph: { ...ogBase, type: "website", url: "/articles", title: "文章" },
};

export default function ArticlesPage() {
  const all = getAllArticles().map(toListItem);
  const featured = getFeaturedArticles(5).map(toListItem);

  return (
    <div className="container-k pb-[var(--section-y)] pt-32">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "文章", path: "/articles" },
        ])}
      />

      <header className="mb-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="type-mega text-[clamp(3.5rem,10vw,9rem)]">
            Writing
          </h1>
          <a
            href="/rss.xml"
            className="type-label link-slide mb-3 inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
          >
            RSS 订阅
            <IconRss width={12} height={12} />
          </a>
        </div>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">
          文章 · 关于 AI 产品的判断、行业观察、方法论与实践复盘。
          观点持续修正，以最新发布为准。
        </p>
      </header>

      <ArticleFeaturedRail articles={featured} />

      <div className="mt-16">
        <ArticleExplorer articles={all} />
      </div>
    </div>
  );
}
