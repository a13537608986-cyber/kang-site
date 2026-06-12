import path from "node:path";
import { byDateDesc } from "@/lib/dates";
import { CONTENT_ROOT, listMdxFiles, readContentFile } from "./io";
import { articleSchema, type ArticleMeta } from "./schema";

const ARTICLES_DIR = path.join(CONTENT_ROOT, "articles");

export interface Article extends ArticleMeta {
  /** 原始 MDX 正文（仅用于目录提取，渲染走动态导入） */
  body: string;
}

/** 草稿只在开发环境可见，生产构建中完全不存在 */
const draftsVisible = process.env.NODE_ENV === "development";

function loadAll(): Article[] {
  return listMdxFiles(ARTICLES_DIR)
    .map((file) => {
      const { meta, body } = readContentFile(file, articleSchema);
      return { ...meta, body };
    })
    .sort(byDateDesc);
}

/** 已发布文章，按 frontmatter date 倒序 */
export function getAllArticles(): Article[] {
  return loadAll().filter((a) => !a.draft || draftsVisible);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

/** 精选文章（列表页顶部轨道 3–5 篇 / 首页精选） */
export function getFeaturedArticles(limit = 5): Article[] {
  return getAllArticles()
    .filter((a) => a.featured)
    .slice(0, limit);
}

/** 上一篇（更早）/ 下一篇（更新），按时间轴方向 */
export function getAdjacentArticles(slug: string): {
  prev: Article | undefined;
  next: Article | undefined;
} {
  const all = getAllArticles(); // 新在前
  const i = all.findIndex((a) => a.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return { prev: all[i + 1], next: all[i - 1] };
}

/** 相关文章：同栏目 +2 分，每个共同标签 +1 分（DEMO 标记不计分） */
export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const all = getAllArticles();
  const current = all.find((a) => a.slug === slug);
  if (!current) return [];
  const currentTags = new Set(current.tags.filter((t) => t !== "DEMO"));
  return all
    .filter((a) => a.slug !== slug)
    .map((a) => {
      let score = a.category === current.category ? 2 : 0;
      for (const t of a.tags) if (currentTags.has(t)) score += 1;
      return { article: a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || byDateDesc(x.article, y.article))
    .slice(0, limit)
    .map((x) => x.article);
}

/** 传给客户端组件的可序列化元数据（不带正文） */
export type ArticleListItem = ArticleMeta;

export function toListItem(a: Article): ArticleListItem {
  const { body, ...meta } = a;
  void body;
  return meta;
}
