import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { profile } from "@/lib/profile";
import { IconRss } from "@/components/ui/icons";

/** 构建时固化的年份（站点全静态，构建年即版权年） */
const buildYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="hairline-t mt-auto">
      <div className="container-k grid gap-12 py-16 md:grid-cols-[1fr_auto_auto] md:gap-20">
        <div>
          <p className="type-mega text-[clamp(3rem,8vw,6rem)] text-fg" aria-hidden="true">
            {siteConfig.brand}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">
            {profile.positioning}
          </p>
        </div>

        <nav aria-label="页脚导航">
          <h2 className="type-label mb-5 text-fg-muted">导航 / MENU</h2>
          <ul className="space-y-3">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-slide text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {item.zh}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="type-label mb-5 text-fg-muted">联系 / CONTACT</h2>
          <ul className="space-y-3">
            <li>
              <a
                href={`mailto:${profile.contact.email}`}
                className="link-slide text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {profile.contact.email}
              </a>
            </li>
            <li className="text-sm text-fg-muted">
              微信 <span className="font-mono">{profile.contact.wechat}</span>
            </li>
            <li>
              <a
                href="/rss.xml"
                className="link-slide inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
              >
                RSS
                <IconRss width={12} height={12} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="hairline-t">
        <div className="container-k flex flex-wrap items-center justify-between gap-3 py-5">
          <p className="type-label text-fg-muted">
            © {buildYear} {siteConfig.brand} · 保留所有权利
          </p>
          <p className="type-label text-fg-muted" lang="en">
            DESIGNED &amp; BUILT BY {siteConfig.brand} · {profile.contact.timezone}
          </p>
        </div>
      </div>
    </footer>
  );
}
