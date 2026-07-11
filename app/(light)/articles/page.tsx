import type { Metadata } from "next";
import { ArticleExplorer } from "@/components/articles/ArticleExplorer";
import { ArticleSidebar } from "@/components/articles/ArticleSidebar";
import { JsonLd } from "@/components/ui/JsonLd";
import { IconRss } from "@/components/ui/icons";
import {
  getAllArticles,
  getFeaturedArticles,
  toListItem,
} from "@/lib/content/articles";
import { breadcrumbJsonLd, ogBase } from "@/lib/seo";

export const metadata: Metadata = {
  title: "文章",
  description:
    "李康的文章档案：AIGC 实战、商业自动化与产品思考，不加滤镜的踩坑复盘，按年份与栏目归档。",
  alternates: { canonical: "/articles" },
  openGraph: { ...ogBase, type: "website", url: "/articles", title: "文章" },
};

export default function ArticlesPage() {
  const all = getAllArticles().map(toListItem);
  const featured = getFeaturedArticles(3).map(toListItem);

  return (
    <div className="container-k max-w-7xl pb-[var(--section-y)] pt-32">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "文章", path: "/articles" },
        ])}
      />

      <header className="mb-14 text-center">
        <h1 className="type-mega text-[clamp(3.5rem,10vw,8rem)]">Writing</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-fg-muted">
          这里没有功利的说教，只有不加滤镜的踩坑复盘与实操经验。
          保持记录，是为了在浪潮里不掉队。
        </p>
        <a
          href="/rss.xml"
          className="type-label link-slide mt-5 inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
        >
          RSS 订阅
          <IconRss width={12} height={12} />
        </a>
      </header>

      {/* 左：分类导航 + 文章列表；右：个人卡与精选（桌面 sticky，窄屏落到列表下方） */}
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <ArticleExplorer articles={all} />
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ArticleSidebar featured={featured} />
        </div>
      </div>
    </div>
  );
}
