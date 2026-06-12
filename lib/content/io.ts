import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { z } from "zod";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export interface ContentFile<T> {
  meta: T;
  /** frontmatter 之后的 MDX 正文（用于目录提取等，不用于渲染） */
  body: string;
}

/**
 * 读取并校验单个 MDX 文件。
 * 任何 frontmatter 错误都会抛出带文件名的异常 —— 静态生成阶段
 * 调用本函数，错误内容因此在构建时失败而非线上静默。
 */
export function readContentFile<S extends z.ZodType>(
  filePath: string,
  schema: S,
): ContentFile<z.infer<S>> {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(FRONTMATTER);
  if (!match) {
    throw new Error(`[content] ${rel(filePath)}：缺少 YAML frontmatter`);
  }

  let data: unknown;
  try {
    data = YAML.parse(match[1]);
  } catch (err) {
    throw new Error(
      `[content] ${rel(filePath)}：frontmatter 不是合法 YAML —— ${String(err)}`,
    );
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  · ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`[content] ${rel(filePath)}：frontmatter 校验失败\n${issues}`);
  }

  const meta = parsed.data as z.infer<S> & { slug?: string };
  const fileSlug = path.basename(filePath, ".mdx");
  if (meta.slug && meta.slug !== fileSlug) {
    // 详情页按文件名动态导入 MDX，slug 与文件名必须一致
    throw new Error(
      `[content] ${rel(filePath)}：slug "${meta.slug}" 与文件名 "${fileSlug}" 不一致`,
    );
  }

  return { meta: parsed.data, body: raw.slice(match[0].length) };
}

export function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(dir, f));
}

function rel(p: string): string {
  return path.relative(process.cwd(), p);
}
