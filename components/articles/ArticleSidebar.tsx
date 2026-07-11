import Link from "next/link";
import { profile } from "@/lib/profile";
import type { ArticleListItem } from "@/lib/content/articles";
import { FeaturedCarousel } from "@/components/articles/FeaturedCarousel";
import { IconArrowRight } from "@/components/ui/icons";

/**
 * 文章列表页右侧栏：关于卡 + 精选文章轮播 + 工作经验卡 + 常用工具卡。
 * 卡片用投影悬浮（.card-float），无线框。
 * 桌面端整列 sticky 悬浮；窄屏时随文档流落到列表下方。
 */
export function ArticleSidebar({ featured }: { featured: ArticleListItem[] }) {
  return (
    <aside className="space-y-8" aria-label="侧栏">
      {/* 关于卡 */}
      <section aria-labelledby="sidebar-about" className="card-float p-7">
        <h2 id="sidebar-about" className="type-label text-fg-muted">
          ABOUT <span className="mx-2" aria-hidden="true">/</span> 关于
        </h2>

        <div className="mt-5 flex items-center gap-4">
          {/* 头像占位 —— 有真人照片后替换为：
              <Image src="/images/portrait.jpg" alt="李康的照片" width={56} height={56}
                     className="h-14 w-14 rounded-full object-cover" /> */}
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fg text-xl font-bold text-bg"
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

      {/* 精选文章轮播（一次一篇，左滑切换，最多 3 篇） */}
      {featured.length > 0 ? (
        <section aria-labelledby="sidebar-featured">
          <h2 id="sidebar-featured" className="type-label mb-4 text-fg-muted">
            FEATURED <span className="mx-2" aria-hidden="true">/</span> 精选文章
          </h2>
          <FeaturedCarousel articles={featured} />
        </section>
      ) : null}

      {/* 工作经验卡 */}
      <section aria-labelledby="sidebar-experience" className="card-float p-7">
        <h2 id="sidebar-experience" className="type-label text-fg-muted">
          EXPERIENCE <span className="mx-2" aria-hidden="true">/</span> 工作经验
        </h2>
        <ol className="mt-5">
          {profile.experience.map((item, i) => {
            const [role, org] = item.role.split(" · ");
            return (
              <li
                key={item.period}
                className={`py-4 ${i > 0 ? "border-t border-line" : "pt-0"}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold leading-snug">{role}</p>
                  <p className="type-label shrink-0 text-fg-faint">{item.period}</p>
                </div>
                {org ? (
                  <p className="mt-1 text-sm text-fg-muted">{org}</p>
                ) : null}
              </li>
            );
          })}
        </ol>
        <Link
          href="/about"
          className="type-label link-slide mt-4 inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
        >
          完整经历
          <IconArrowRight width={12} height={12} />
        </Link>
      </section>

      {/* 常用工具卡 */}
      <section aria-labelledby="sidebar-toolkit" className="card-float p-7">
        <h2 id="sidebar-toolkit" className="type-label text-fg-muted">
          TOOLKIT <span className="mx-2" aria-hidden="true">/</span> 常用工具
        </h2>
        <div className="mt-5 space-y-5">
          {profile.tools.map((group) => (
            <div key={group.group}>
              <p className="type-label text-fg-faint">{group.group}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                {group.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
