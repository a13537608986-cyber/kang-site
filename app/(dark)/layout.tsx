import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

/** 深色主题作用域：首页与项目页 */
export default function DarkLayout({ children }: { children: ReactNode }) {
  return (
    <div data-theme="dark" className="theme-scope">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
