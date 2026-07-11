import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["ts", "tsx", "mdx"],
};

// Turbopack 要求 remark/rehype 插件以可序列化的字符串形式声明
const withMDX = createMDX({
  options: {
    // remark-cjk-friendly：放宽加粗/斜体在中文标点旁的判定，
    // 修复 **"引号包住的加粗"** 之类被中文全角标点破坏的情况
    remarkPlugins: [
      "remark-gfm",
      "remark-frontmatter",
      "remark-cjk-friendly",
    ],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        { theme: "github-dark-default", keepBackground: false, defaultLang: "text" },
      ],
    ],
  },
});

export default withMDX(nextConfig);
