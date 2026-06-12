<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 项目约定（KANG 个人网站）

- 内容排序只允许读 frontmatter 的 `date`（带时区 ISO）；禁止 fs mtime / Git 时间。日期展示一律走 `lib/dates.ts`。
- 文章/项目 frontmatter 由 `lib/content/schema.ts` 的 Zod schema（`.strict()`）校验，构建期报错；slug 必须等于文件名（详情页按文件名动态导入 MDX）。
- 颜色禁止硬编码：使用 `[data-theme]` 语义变量（bg/fg/line/accent 系列）。强调色只改 `--accent`。
- 深浅主题由路由组决定：`app/(dark)/` 深色、`app/(light)/` 浅色。
- 动效必须满足：支持 prefers-reduced-motion、无 JS 时内容可见（CSS `@media (scripting: enabled)` 门控）、移动端不启用 Lenis 与 sticky 钉住。
- 严禁在水合前修改 React 管理的元素属性（如 `<html>`/`<body>` 的 class 或 data-*），会触发 hydration mismatch；预水合状态一律通过向 head 注入独立 style/script 节点实现（参见 layout.tsx 的 bootScript 与 #kang-preload-gate）。
- remark/rehype 插件在 next.config.ts 中必须保持字符串形式（Turbopack 序列化要求）。
- 占位内容一律带 DEMO 标记（tags 含 "DEMO" 或文案注明「占位」），便于批量替换。
