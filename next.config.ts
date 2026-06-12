import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["ts", "tsx", "mdx"],
};

// Turbopack 要求 remark/rehype 插件以可序列化的字符串形式声明
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-frontmatter"],
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
