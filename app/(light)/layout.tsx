import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

/** 浅色阅读主题作用域：文章与关于页 */
export default function LightLayout({ children }: { children: ReactNode }) {
  return (
    <div data-theme="light" className="theme-scope">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
