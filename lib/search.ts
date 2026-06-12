import type { ArticleListItem } from "@/lib/content/articles";
import type { Category } from "@/lib/content/schema";
import { yearOf, byDateDesc } from "@/lib/dates";

/**
 * 文章列表的筛选与归档逻辑（纯函数，客户端组件直接复用）。
 * 搜索范围：标题、摘要、栏目、标签；空格分词，多词取交集。
 */

export type CategoryFilter = Category | "all";

export function matchesQuery(article: ArticleListItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    article.title,
    article.summary,
    article.category,
    ...article.tags,
  ]
    .join("\n")
    .toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export function filterArticles(
  articles: ArticleListItem[],
  category: CategoryFilter,
  query: string,
): ArticleListItem[] {
  return articles.filter(
    (a) =>
      (category === "all" || a.category === category) && matchesQuery(a, query),
  );
}

export interface YearGroup {
  year: string;
  items: ArticleListItem[];
}

/** 按年份分组（年份倒序，组内按 date 倒序） */
export function groupByYear(articles: ArticleListItem[]): YearGroup[] {
  const map = new Map<string, ArticleListItem[]>();
  for (const a of [...articles].sort(byDateDesc)) {
    const y = yearOf(a.date);
    const list = map.get(y);
    if (list) list.push(a);
    else map.set(y, [a]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({ year, items }));
}

/** 出现频次最高的标签（用于列表页标签快捷入口；排除 DEMO 标记） */
export function topTags(articles: ArticleListItem[], limit = 8): string[] {
  const counts = new Map<string, number>();
  for (const a of articles)
    for (const t of a.tags) {
      if (t === "DEMO") continue;
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([t]) => t);
}
