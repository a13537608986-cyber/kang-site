import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { HeroMedia } from "@/components/home/HeroMedia";
import { HomeEditorial, HomeViewpoint } from "@/components/home/HomeEditorial";
import { JsonLd } from "@/components/ui/JsonLd";
import { getFeaturedArticles, toListItem } from "@/lib/content/articles";
import { getAllProjects, toProjectListItem } from "@/lib/content/projects";
import { ogBase, personJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...ogBase, type: "website", url: "/" },
};

/**
 * 首页：六段式结构，只展示精选内容（数量固定上限），
 * 不随文章 / 项目增多而变长。
 */
export default function HomePage() {
  const projects = getAllProjects().filter((project) => ["canshen-ai", "zhijian"].includes(project.slug)).map(toProjectListItem);
  const articles = getFeaturedArticles(4).map(toListItem);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={personJsonLd()} />

      <div className="home-page bg-bg">
        {/* HeroMedia 是服务端组件（构建时检测素材文件），经 props 注入客户端 Hero */}
        <HomeHero media={<HeroMedia />} viewpoint={<HomeViewpoint />} />
        <HomeEditorial projects={projects} articles={articles} />
      </div>
    </>
  );
}
