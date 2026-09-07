import type { Metadata } from "next";
import { ArticleExplorer } from "@/components/articles/ArticleExplorer";
import { ArticleSidebar } from "@/components/articles/ArticleSidebar";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  getAllArticles,
  getFeaturedArticles,
  toListItem,
} from "@/lib/content/articles";
import { breadcrumbJsonLd, ogBase } from "@/lib/seo";

export const metadata: Metadata = {
  title: "文章",
  description:
    "李康的文章档案：AI 产品落地、商业自动化，还有那些踩过的坑。不加滤镜，按年份与栏目归档。",
  alternates: { canonical: "/articles" },
  openGraph: { ...ogBase, type: "website", url: "/articles", title: "文章" },
};

export default function ArticlesPage() {
  const all = getAllArticles().map(toListItem);
  const featured = getFeaturedArticles(3).map(toListItem);

  return (
    <div className="bg-bg px-6 pb-[var(--section-y)] pt-[88px] [font-family:var(--font-dm-sans),var(--font-archivo),sans-serif]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "文章", path: "/articles" },
        ])}
      />

      <header className="mx-auto flex min-h-[319.6px] max-w-[1232px] flex-col items-center pt-8 text-center md:pt-16">
        <h1 className="max-w-[920px] text-[42px] font-bold leading-[50.4px] tracking-[-2.1px] text-fg md:text-[52px] md:leading-[62.4px] md:tracking-[-2.6px]">
    写下我正在想的事
        </h1>
        <p className="mx-auto mt-2.5 max-w-[640px] text-[18px] leading-[27.9px] text-fg-muted">
    有 AI、产品和做过的项目，也有一些与工作无关的念头。它们未必都有答案，
    但我想先把它们留下来。
        </p>
      </header>

      <div className="mx-auto max-w-[1232px]">
        <ArticleExplorer
          articles={all}
          sidebar={<ArticleSidebar featured={featured} />}
        />
      </div>
    </div>
  );
}
