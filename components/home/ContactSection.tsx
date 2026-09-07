import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { profile } from "@/lib/profile";

/** 05 — 网站尾声：以持续记录收束首页，联系方式退回落款层级 */
export function ContactSection() {
  return (
    <section aria-labelledby="contact-title" className="home-section-frame container-k border-t border-line">
      <div className="home-section-body flex min-h-0 items-center py-[var(--section-y)] md:min-h-[92svh] md:py-[clamp(5rem,10vh,8rem)]">
        <div className="w-full">
          <div
            id="contact-title"
            className="[&_h2]:max-w-[15ch] [&_h2]:text-[clamp(2.7rem,6.4vw,6rem)] [&_h2]:leading-[1.03] [&_h2]:tracking-[-0.035em]"
          >
            <SectionHead
              index="05"
              en="ONGOING"
              zh="保持记录，是为了在浪潮里不掉队。"
              bordered={false}
            />
          </div>

          <Reveal className="mt-10 md:mt-14">
            <p className="max-w-lg text-sm leading-relaxed text-fg-muted">
              这里会继续更新。写正在做的事，也写那些还没想明白的问题。
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 md:mt-24">
            <a
              href={`mailto:${profile.contact.email}`}
              className="type-label link-slide text-fg-muted transition-colors hover:text-fg"
            >
              {profile.contact.email}
            </a>
            <span className="type-label text-fg-muted">
              微信 · {profile.contact.wechat}
            </span>
            {profile.contact.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="type-label link-slide text-fg-muted transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            ))}
            <span className="type-label ml-auto text-fg-muted">
              {profile.contact.timezone}
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
