import { z } from "zod";
import { ISO_WITH_TZ } from "@/lib/dates";

/** 文章栏目（新增栏目改这里即可，筛选 UI 自动跟随） */
export const CATEGORIES = ["AI 产品", "行业观察", "方法论", "实践复盘"] as const;
export type Category = (typeof CATEGORIES)[number];

export const PROJECT_TYPES = ["product", "case-study"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_TYPE_LABEL: Record<ProjectType, { zh: string; en: string }> = {
  product: { zh: "可体验产品", en: "PRODUCT" },
  "case-study": { zh: "案例复盘", en: "CASE STUDY" },
};

const slugField = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug 只能使用小写字母、数字和连字符");

const dateField = z
  .string()
  .regex(
    ISO_WITH_TZ,
    'date 必须是带时区的完整 ISO 时间，例如 "2023-08-21T20:30:00+08:00"',
  );

const coverField = z
  .string()
  .startsWith("/", "cover 必须是以 / 开头的站内路径")
  .nullable()
  .default(null);

/** .strict()：frontmatter 出现未知字段时在构建阶段直接报错 */
export const articleSchema = z
  .object({
    title: z.string().min(1),
    slug: slugField,
    date: dateField,
    summary: z.string().min(1),
    category: z.enum(CATEGORIES),
    tags: z.array(z.string().min(1)).default([]),
    cover: coverField,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .strict();

export const projectSchema = z
  .object({
    title: z.string().min(1),
    slug: slugField,
    type: z.enum(PROJECT_TYPES),
    date: dateField,
    summary: z.string().min(1),
    cover: coverField,
    featured: z.boolean().default(false),
    demoUrl: z.string().url().nullable().default(null),
    repositoryUrl: z.string().url().nullable().default(null),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
  })
  .strict();

export type ArticleMeta = z.infer<typeof articleSchema>;
export type ProjectMeta = z.infer<typeof projectSchema>;
