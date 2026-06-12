import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { IconArrowRight } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <div data-theme="dark" className="theme-scope">
      <SiteHeader />
      <main id="main" className="container-k flex flex-1 flex-col justify-center py-40">
        <p className="type-label text-fg-muted">ERROR / 页面不存在</p>
        <p className="type-mega mt-6 text-[clamp(6rem,22vw,20rem)]" aria-hidden="true">
          404
        </p>
        <h1 className="type-headline mt-6 text-xl">这一页不在档案里</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
          链接可能已失效，或内容已被移动。从下面的入口回到正轨。
        </p>
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
          <Link
            href="/"
            className="type-label link-slide inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
          >
            返回首页
            <IconArrowRight width={12} height={12} />
          </Link>
          <Link
            href="/articles"
            className="type-label link-slide inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
          >
            浏览文章
            <IconArrowRight width={12} height={12} />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
