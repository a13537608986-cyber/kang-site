import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { siteConfig, isProduction } from "@/lib/site";
import { Preloader } from "@/components/layout/Preloader";
import { LenisProvider } from "@/components/motion/LenisProvider";
import "./globals.css";

/**
 * 仅拉丁字体走 next/font/google —— 文件小、稳定。
 * 中文不再联网加载 Noto Sans SC（其上百个 CJK 分包会拖垮构建稳定性，
 * 且体积大拖慢访客加载），改用系统中文字体（见 globals.css 字体栈：
 * 苹方 / 微软雅黑等），构建不再依赖 Google Fonts CDN。
 */

/** 展示与正文的西文字体：可变字重 + 宽度轴，承担巨型字标 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** 编号 / 栏目 / 元信息 / 代码 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.brand}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.brand,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  openGraph: {
    type: "website",
    siteName: siteConfig.brand,
    locale: "zh_CN",
    url: siteConfig.url,
  },
  // Preview / 开发环境一律禁止收录，只有 production 开放
  robots: isProduction
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

/**
 * 首帧前同步执行：本会话首次访问且未开启「减少动态」时，
 * 向 head 注入一个门控样式节点（#kang-preload-gate）显示加载动画，
 * Preloader 组件播放完毕后移除该节点。
 *
 * 不修改 <html>/<body> 的任何属性 —— React 水合会比对它管理的元素属性，
 * 预水合改动会触发 hydration mismatch；注入的 style 节点不归 React 管理，
 * React 19 水合时会跳过 head 中的陌生节点。
 * （进入动效的「有 JS 才隐藏」门控由 CSS 的 @media (scripting: enabled) 承担）
 */
const bootScript = `
try {
  if (!sessionStorage.getItem('kang:preloaded')
      && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var gate = document.createElement('style');
    gate.id = 'kang-preload-gate';
    gate.textContent = '#preloader{display:flex!important}html{overflow:hidden!important}';
    document.head.appendChild(gate);
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${archivo.variable} ${plexMono.variable} h-full`}
    >
      <head>
        {/* 直接渲染而非走 metadata.alternates：页面级 alternates（canonical）
            会整体覆盖根布局的嵌套字段，导致 RSS 自动发现丢失 */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.brand} — RSS`}
          href="/rss.xml"
        />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full">
        <Preloader />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
