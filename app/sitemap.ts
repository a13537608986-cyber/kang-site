import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content/articles";
import { getAllProjects } from "@/lib/content/projects";
import { absoluteUrl } from "@/lib/site";
import { toTimestamp } from "@/lib/dates";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/articles"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/projects"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.7 },
  ];

  const articles: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: new Date(toTimestamp(article.date)),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const projects: MetadataRoute.Sitemap = getAllProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(toTimestamp(project.date)),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...articles, ...projects];
}
