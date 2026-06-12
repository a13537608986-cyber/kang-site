/**
 * 站点全局配置。
 * 正式上线时在 Vercel 环境变量中设置
 * NEXT_PUBLIC_SITE_URL=https://www.kangkangpm.com 即可。
 */

export const siteConfig = {
  /** 品牌字标 */
  brand: "KANG",
  title: "KANG · 李康 — AI 产品经理",
  description:
    "李康（Li Kang / KANG）的个人网站：AI 产品判断、方法论与实践复盘。持续输出关于 AI 产品、行业观察与产品方法的文章。",
  /** 正式域名经环境变量注入；本地与未配置环境回退 localhost */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "zh-CN",
  author: {
    name: "李康",
    nameEn: "Li Kang",
    email: "hi@kangkangpm.com",
    wechat: "LKCW-9775",
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
