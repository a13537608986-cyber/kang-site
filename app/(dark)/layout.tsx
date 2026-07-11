import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

/** 深色主题作用域：首页与项目页 */
export default function DarkLayout({ children }: { children: ReactNode }) {
  return (
    <div data-theme="dark" className="theme-scope theme-scope--ambient">
      {/* 固定氛围背板：底色 + 柔光菱形，贯穿所有深色段落（首屏视频会盖住它） */}
      <div className="dark-ambient" aria-hidden="true" />
      <SiteHeader />
      <main id="main" className="relative z-10 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
