import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { profile } from "@/lib/profile";

/** 05 — 联系方式：邮箱即巨型入口 */
export function ContactSection() {
  return (
    <section aria-labelledby="contact-title" className="container-k py-[var(--section-y)]">
      <div id="contact-title">
        <SectionHead index="05" en="CONTACT" zh="保持联系" />
      </div>

      <Reveal className="mt-12">
        <p className="max-w-xl text-sm leading-relaxed text-fg-muted">
          聊 AI、聊产品、聊合作，或者纯粹想抬个杠——都欢迎邮件。
        </p>
        <a
          href={`mailto:${profile.contact.email}`}
          className="group mt-8 inline-block max-w-full"
        >
          <span className="type-mega block break-all text-[clamp(1.5rem,4.2vw,3.75rem)] normal-case transition-colors duration-300 group-hover:text-fg-muted">
            {profile.contact.email}
          </span>
          <span className="mt-3 block h-px w-full origin-left scale-x-0 bg-fg transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none" />
        </a>
      </Reveal>

      <Reveal delay={0.1} className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
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
    </section>
  );
}
