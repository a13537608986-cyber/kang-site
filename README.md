# KANG — 个人品牌网站

AI 产品经理 KANG 的个人网站。Next.js 16（App Router）+ React 19 + TypeScript + Tailwind CSS v4 + GSAP/Lenis + 本地 MDX 内容系统，全静态生成，可直接部署 Vercel。

## 命令

```bash
npm run dev     # 开发（http://localhost:3000，草稿可见）
npm run lint    # ESLint
npm run build   # 生产构建（frontmatter 校验失败会在此报错；草稿被排除）
npm run start   # 本地预览生产构建
```

## 目录结构

```
app/
  (dark)/            深色主题路由组：首页、项目列表与详情
  (light)/           浅色阅读主题路由组：文章列表与详情、关于我
  rss.xml/route.ts   RSS 2.0（构建时静态生成）
  sitemap.ts         站点地图
  robots.ts          收录控制（按 VERCEL_ENV）
  opengraph-image.tsx 默认分享图（构建时生成 PNG）
  layout.tsx         字体 / 全局 metadata / 加载动画引导脚本
  globals.css        设计系统：灰阶色板、主题变量、字阶、编号系统、prose 样式
components/
  layout/            SiteHeader / SiteFooter / Preloader
  motion/            gsap 注册 / LenisProvider（仅桌面）/ Reveal 进入动画
  home/              首页六段式各区块（HeroVisual 是真人素材占位）
  articles/          精选轨道 / 搜索筛选时间线 / 目录 / 阅读进度 / 尾部导航
  projects/          项目筛选网格
  ui/                SectionHead 编号标头 / Tag / CoverImage / JsonLd / icons
lib/
  content/           Zod schema + MDX frontmatter 读取（构建期校验）
  dates.ts           全站唯一日期工具（排序只认 frontmatter date）
  search.ts          文章搜索 / 分类筛选 / 年份归档（纯函数）
  toc.ts             目录提取（与 rehype-slug 同源 slug）
  seo.ts             JSON-LD 构造器
  site.ts            站点配置（品牌、导航、域名、作者）
  profile.ts         关于我 / 履历 / 联系方式（全部占位数据）
content/
  articles/*.mdx     文章（当前为 DEMO 占位）
  projects/*.mdx     项目（当前为 DEMO 占位）
public/images/       封面与占位图（当前为 DEMO SVG）
assets/fonts/        OG 图用 IBM Plex Mono（OFL 许可）
```

## 内容写作

### 新文章

在 `content/articles/` 新建 `<slug>.mdx`（文件名必须等于 slug）：

```yaml
---
title: "文章标题"
slug: "article-slug"
date: "2026-06-12T10:00:00+08:00"   # 必须带时区，排序唯一依据
summary: "一两句摘要，列表与 SEO 共用。"
category: "AI 产品"                  # AI 产品 | 行业观察 | 方法论 | 实践复盘
tags: ["标签A", "标签B"]
cover: "/images/covers/xxx.svg"      # 无封面写 null（列表自动紧凑排版）
featured: false                      # true 进入列表顶部精选轨道与首页
draft: true                          # true 仅开发环境可见，生产构建剔除
---
```

正文为 Markdown/GFM；`##`/`###` 自动进目录。字段缺失、日期不带时区、栏目拼错、slug 与文件名不一致都会让 `npm run build` 直接失败并指出文件。

### 新项目

`content/projects/<slug>.mdx`，`type` 只允许 `product`（可体验，配 `demoUrl`/`repositoryUrl`）或 `case-study`（复盘，两个链接写 `null`）。`featured: true` 进入首页代表项目（最多 3 个）。

## 占位内容替换清单（上线前）

个人资料（定位 / 简介 / 经历 / 专业方向 / 联系方式）已是真实信息，
集中在 `lib/profile.ts` 与 `lib/site.ts`，后续直接改这两个文件即可。
仍待替换的占位（带 `DEMO` 标记或「占位」字样，可全局搜索定位）：

| 位置 | 做什么 |
| --- | --- |
| `content/articles/`、`content/projects/` | 删除全部 DEMO 文件（tags 含 `DEMO`），换真实内容 |
| `components/home/HeroVisual.tsx` | 按文件头注释换成真人照片或静音短视频 |
| `public/images/` | 删除 DEMO SVG，放真实封面（建议 1600×1000，16:10） |
| `lib/profile.ts` 的 `tools` | 替换标注（占位）的工具条目 |

## 部署（Vercel）

1. 推送仓库到 GitHub，在 Vercel 导入，框架自动识别，无需额外配置。
2. 在 **Production** 环境变量设置 `NEXT_PUBLIC_SITE_URL=https://你的域名`（参见 `.env.example`）。
3. 收录控制是自动的：只有 `VERCEL_ENV=production` 时 robots.txt 才允许抓取、页面才输出 `index, follow`；Preview 一律 `noindex, nofollow`。

## 设计变量

- 颜色只经 `app/globals.css` 的 `[data-theme]` 语义变量；将来上品牌色只改两处 `--accent`。
- 深/浅主题由路由组布局的 `data-theme` 决定，新页面放进对应路由组即可。
- 编号、栏目名等等宽小字统一用 `.type-label`；巨型字 `.type-mega`；中文标题 `.type-headline`。
