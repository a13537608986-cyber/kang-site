import Link from "next/link";
import { profile } from "@/lib/profile";
import type { ArticleListItem } from "@/lib/content/articles";
import { formatDateCompact } from "@/lib/dates";
import { CoverImage } from "@/components/ui/CoverImage";
import { IconArrowRight } from "@/components/ui/icons";

/**
 * 文章列表页右侧栏：关于卡 + 精选文章卡。
 * 桌面端 sticky 悬浮；窄屏时随文档流落到列表下方。
 */
export function ArticleSidebar({ featured }: { featured: ArticleListItem[] }) {
  return (
    <aside className="space-y-8" aria-label="侧栏">
      {/* 关于卡 */}
      <section
        aria-labelledby="sidebar-about"
        className="rounded-2xl border border-line bg-bg-raised p-7"
      >
        <h2 id="sidebar-about" className="type-label text-fg-muted">
          ABOUT <span className="mx-2" aria-hidden="true">/</span> 关于
        </h2>

        <div className="mt-5 flex items-center gap-4">
          {/* 头像占位 —— 有真人照片后替换为：
              <Image src="/images/portrait.jpg" alt="李康的照片" width={56} height={56}
                     className="h-14 w-14 rounded-full object-cover" /> */}
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fg font-bold text-xl text-bg"
          >
            康
          </span>
          <div className="min-w-0">
            <p className="text-base font-semibold">{profile.name}</p>
            <p className="type-label mt-1 text-fg-muted">正在进化的 AI 产品经理</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-fg-muted">
          {profile.bio[0]}
        </p>

        <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
          <li className="flex items-baseline justify-between gap-3">
            <span className="type-label text-fg-faint">邮箱</span>
            <a
              href={`mailto:${profile.contact.email}`}
              className="link-slide min-w-0 truncate text-fg-muted hover:text-fg"
            >
              {profile.contact.email}
            </a>
          </li>
          <li className="flex items-baseline justify-between gap-3">
            <span className="type-label text-fg-faint">微信</span>
            <span className="font-mono text-sm text-fg-muted">
              {profile.contact.wechat}
            </span>
          </li>
        </ul>

        <Link
          href="/about"
          className="type-label link-slide mt-5 inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
        >
          更多关于我
          <IconArrowRight width={12} height={12} />
        </Link>
      </section>

      {/* 精选文章卡 */}
      {featured.length > 0 ? (
        <section
          aria-labelledby="sidebar-featured"
          className="rounded-2xl border border-line bg-bg-raised p-7"
        >
          <h2 id="sidebar-featured" className="type-label text-fg-muted">
            FEATURED <span className="mx-2" aria-hidden="true">/</span> 精选
          </h2>
          <ul className="mt-5 space-y-5">
            {featured.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="group flex items-center gap-4"
                >
                  {article.cover ? (
                    <span className="relative block h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-bg-sunken">
                      <CoverImage
                        src={article.cover}
                        alt=""
                        sizes="80px"
                        className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </span>
                  ) : null}
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-sm font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
                      {article.title}
                    </span>
                    <time
                      dateTime={article.date}
                      className="type-label mt-1.5 block text-fg-faint"
                    >
                      {formatDateCompact(article.date)}
                    </time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
