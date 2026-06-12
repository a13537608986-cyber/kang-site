import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Noto_Sans_SC } from "next/font/google";
import { siteConfig, isProduction } from "@/lib/site";
import { Preloader } from "@/components/layout/Preloader";
import { LenisProvider } from "@/components/motion/LenisProvider";
import "./globals.css";

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

/** 中文正文（按 unicode-range 分包，浏览器只取所需子集） */
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sc",
  display: "swap",
  preload: false,
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
 * 首帧前同步执行：
 * 1. 标记 html.js（进入动效只在有 JS 时生效，无 JS 内容直接可见）
 * 2. 本会话首次访问且未开启“减少动态”时标记 data-preload，
 *    CSS 据此显示加载动画，Preloader 组件负责播放与移除
 */
const bootScript = `
document.documentElement.classList.add('js');
try {
  if (!sessionStorage.getItem('kang:preloaded')
      && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.setAttribute('data-preload', '');
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
      className={`${archivo.variable} ${plexMono.variable} ${notoSansSC.variable} h-full`}
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
