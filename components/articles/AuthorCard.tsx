import Link from "next/link";
import { profile } from "@/lib/profile";
import { Avatar } from "@/components/ui/Avatar";
import { IconArrowRight } from "@/components/ui/icons";

/** 文末作者卡（公众号「作者 / 关注」区的克制版）：头像 + 定位 + 简介 + 联系 */
export function AuthorCard() {
  return (
    <section
      aria-label="作者"
      className="card-float mt-16 p-7 sm:p-9"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <Avatar size={64} />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold">{profile.name}</p>
          <p className="type-label mt-1 text-fg-muted">正在进化的 AI 产品经理</p>
        </div>
        <Link
          href="/about"
          className="type-label inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-fg px-4 py-2.5 text-bg transition-opacity hover:opacity-80 sm:self-auto"
        >
          关于我
          <IconArrowRight width={12} height={12} />
        </Link>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-fg-muted">
        {profile.bio[0]}
      </p>

      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-5">
        <span className="text-sm">
          <span className="type-label mr-2 text-fg-faint">邮箱</span>
          <a
            href={`mailto:${profile.contact.email}`}
            className="link-slide text-fg-muted hover:text-fg"
          >
            {profile.contact.email}
          </a>
        </span>
        <span className="text-sm">
          <span className="type-label mr-2 text-fg-faint">微信</span>
          <span className="font-mono text-fg-muted">{profile.contact.wechat}</span>
        </span>
      </div>
    </section>
  );
}
