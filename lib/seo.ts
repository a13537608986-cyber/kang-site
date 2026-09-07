import { absoluteUrl, siteConfig } from "@/lib/site";
import type { Article } from "@/lib/content/articles";
import type { Project } from "@/lib/content/projects";

/**
 * SEO 辅助：openGraph 公共字段与结构化数据（JSON-LD）构造器。
 * 注意：Next.js 对 metadata 嵌套字段（openGraph/alternates）是整体替换，
 * 页面定义自己的 openGraph 时必须 spread ogBase 并补 url，否则丢失站点信息。
 */

/** 页面级 openGraph 必须携带的公共字段 */
export const ogBase = {
  siteName: siteConfig.brand,
  locale: "zh_CN",
} as const;

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    alternateName: [siteConfig.author.nameEn, siteConfig.brand],
    url: siteConfig.url,
    email: `mailto:${siteConfig.author.email}`,
    jobTitle: "AI 产品经理",
    knowsAbout: [
      "把大模型能力做成能上线的产品",
      "AIGC 商拍与图像生成工作流",
      "商业流程自动化",
      "B 端与 C 端产品设计",
      "AI 产品的判断与取舍",
    ],
  };
}

export function blogPostingJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    inLanguage: siteConfig.locale,
    url: absoluteUrl(`/articles/${article.slug}`),
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}`),
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    articleSection: article.category,
    keywords: article.tags.join(","),
    ...(article.cover ? { image: absoluteUrl(article.cover) } : {}),
  };
}

export function projectJsonLd(project: Project) {
  const base = {
    "@context": "https://schema.org",
    name: project.title,
    description: project.summary,
    dateCreated: project.date,
    inLanguage: siteConfig.locale,
    url: absoluteUrl(`/projects/${project.slug}`),
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    ...(project.cover ? { image: absoluteUrl(project.cover) } : {}),
  };
  if (project.type === "product") {
    return {
      ...base,
      "@type": "SoftwareApplication",
      applicationCategory: "WebApplication",
      ...(project.demoUrl ? { installUrl: project.demoUrl } : {}),
    };
  }
  return { ...base, "@type": "Article", genre: "案例复盘" };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
