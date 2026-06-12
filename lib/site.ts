/**
 * 站点全局配置。
 * 正式上线时只需：
 * 1. 在 Vercel 环境变量中设置 NEXT_PUBLIC_SITE_URL（如 https://kangkangpm.com）
 * 2. 替换下方 author 中的占位联系方式
 */

export const siteConfig = {
  /** 品牌字标 */
  brand: "KANG",
  title: "KANG — AI 产品经理",
  description:
    "KANG 的个人网站：AI 产品判断、方法论与实践复盘。持续输出关于 AI 产品、行业观察与产品方法的文章。",
  /** 正式域名经环境变量注入；本地与未配置环境回退 localhost */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "zh-CN",
  author: {
    name: "KANG",
    /** 占位联系方式 —— 上线前替换 */
    email: "hello@your-domain.example",
    github: "https://github.com/your-github-placeholder",
    wechatPublic: "公众号占位：第零界面",
  },
  nav: [
    { href: "/", zh: "首页", en: "INDEX" },
    { href: "/articles", zh: "文章", en: "WRITING" },
    { href: "/projects", zh: "项目", en: "WORK" },
    { href: "/about", zh: "关于我", en: "ABOUT" },
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}

export const isProduction = process.env.VERCEL_ENV === "production";
