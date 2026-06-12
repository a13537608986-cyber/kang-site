import GithubSlugger from "github-slugger";

export interface TocItem {
  id: string;
  text: string;
  /** 2 = h2，3 = h3 */
  depth: 2 | 3;
}

/**
 * 从 MDX 原文提取 h2/h3 目录。
 * id 生成使用 github-slugger，与渲染管线中的 rehype-slug 保持一致，
 * 因此目录锚点与正文标题 id 必然吻合。
 */
export function extractToc(mdxBody: string): TocItem[] {
  const slugger = new GithubSlugger();
  // 先剔除围栏代码块，避免代码里的 ## 被当作标题
  const withoutCode = mdxBody.replace(/^```[\s\S]*?^```\s*$/gm, "");
  const items: TocItem[] = [];
  const heading = /^(#{2,3})\s+(.+?)\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = heading.exec(withoutCode)) !== null) {
    const text = stripInlineMarkdown(match[2]);
    items.push({
      id: slugger.slug(text),
      text,
      depth: match[1].length as 2 | 3,
    });
  }
  return items;
}

/** 去掉标题内的行内标记（加粗、行内代码、链接），保留可读文本 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();
}
