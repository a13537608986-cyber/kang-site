/**
 * 全站唯一的日期工具。
 * 内容排序与展示只依赖 frontmatter 的 date 字段（带时区的 ISO 字符串），
 * 永远不读取文件创建时间 / Git 提交时间 / 部署时间。
 * 展示统一锚定 Asia/Shanghai，保证服务端与客户端渲染结果一致。
 */

const TIME_ZONE = "Asia/Shanghai";

/** 带时区的完整 ISO 时间，例：2023-08-21T20:30:00+08:00 */
export const ISO_WITH_TZ =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;

export function toTimestamp(iso: string): number {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) {
    throw new Error(`无法解析日期：${iso}`);
  }
  return t;
}

function partsOf(iso: string): { year: string; month: string; day: string } {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(toTimestamp(iso)));
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** 「2023 年 8 月 21 日」 —— 文章详情页 */
export function formatDateLong(iso: string): string {
  const { year, month, day } = partsOf(iso);
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

/** 「2023.08.21」 —— 列表与卡片 */
export function formatDateCompact(iso: string): string {
  const { year, month, day } = partsOf(iso);
  return `${year}.${month}.${day}`;
}

/** 「08.21」 —— 年份时间线内的行（年份已由分组标题承担） */
export function formatDateMonthDay(iso: string): string {
  const { month, day } = partsOf(iso);
  return `${month}.${day}`;
}

/** 归档年份（按上海时区归属） */
export function yearOf(iso: string): string {
  return partsOf(iso).year;
}

/** RSS pubDate（RFC 1123 / RFC 822 兼容） */
export function formatDateRfc822(iso: string): string {
  return new Date(toTimestamp(iso)).toUTCString();
}

/** 按 date 字段倒序（新在前）。唯一合法的内容排序方式。 */
export function byDateDesc<T extends { date: string }>(a: T, b: T): number {
  return toTimestamp(b.date) - toTimestamp(a.date);
}
