import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { JsonLd } from "@/components/ui/JsonLd";
import { HeroVisual } from "@/components/home/HeroVisual";
import { profile } from "@/lib/profile";
import { breadcrumbJsonLd, ogBase, personJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "关于我",
  description:
    "李康（Li Kang / KANG），AI 产品经理。个人简介、职业经历、核心能力、产品方法与联系方式。",
  alternates: { canonical: "/about" },
  openGraph: { ...ogBase, type: "profile", url: "/about", title: "关于我" },
};

/** 关于页：浅色为主 + 深色收尾章节。所有内容来自 lib/profile.ts。 */
export default function AboutPage() {
  return (
    <div className="pt-32">
      <JsonLd data={personJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "关于我", path: "/about" },
        ])}
      />

      {/* 简介与定位 */}
      <header className="container-k">
        <h1 className="type-mega text-[clamp(3.5rem,10vw,9rem)]">About</h1>
        <div className="mt-10 grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <p className="type-label text-fg-muted">
              {profile.name} · AI 产品经理 ·{" "}
              <span lang="en">{profile.nameEn.toUpperCase()} / AI PRODUCT MANAGER</span>
            </p>
            <p className="type-headline mt-6 text-[clamp(1.5rem,3vw,2.25rem)]">
              {profile.positioning}
            </p>
            <div className="mt-8 max-w-xl space-y-4 text-base leading-relaxed text-fg-muted">
              {profile.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
            <HeroVisual />
          </Reveal>
        </div>
      </header>

      {/* 职业经历 */}
      <section aria-labelledby="experience-title" className="container-k mt-[var(--section-y)]">
        <div id="experience-title">
          <SectionHead index="01" en="EXPERIENCE" zh="职业经历" />
        </div>
        <ol className="mt-12">
          {profile.experience.map((item, i) => (
            <Reveal
              as="li"
              key={item.period}
              delay={i * 0.06}
              className="grid gap-x-8 gap-y-2 border-t border-line py-8 last:border-b md:grid-cols-[10rem_minmax(0,18rem)_1fr]"
            >
              <p className="type-label pt-1 text-fg-muted">{item.period}</p>
              <h3 className="text-base font-semibold">{item.role}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">{item.desc}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 核心能力 */}
      <section aria-labelledby="ability-title" className="container-k mt-[var(--section-y)]">
        <div id="ability-title">
          <SectionHead index="02" en="CAPABILITIES" zh="核心能力" />
        </div>
        <ul className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2">
          {profile.capabilities.map((cap, i) => (
            <Reveal as="li" key={cap.en} delay={i * 0.06} className="bg-bg p-7">
              <div className="flex items-baseline justify-between">
                <h3 className="type-headline text-lg">{cap.zh}</h3>
                <span className="type-label text-fg-faint" lang="en">
                  {cap.en}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{cap.desc}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 产品方法与工作方式 */}
      <section aria-labelledby="method-title" className="container-k mt-[var(--section-y)]">
        <div id="method-title">
          <SectionHead index="03" en="METHOD" zh="产品方法与工作方式" />
        </div>
        <ol className="mt-12">
          {profile.principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.zh}
              delay={i * 0.05}
              className="grid gap-x-8 gap-y-2 border-t border-line py-8 last:border-b md:grid-cols-[4rem_minmax(0,20rem)_1fr]"
            >
              <span className="type-label pt-2 text-fg-faint" aria-hidden="true">
                0{i + 1}
              </span>
              <h3 className="type-headline text-xl">{p.zh}</h3>
              <p className="max-w-xl text-sm leading-relaxed text-fg-muted">{p.desc}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 常用工具 */}
      <section aria-labelledby="tools-title" className="container-k mt-[var(--section-y)]">
        <div id="tools-title">
          <SectionHead index="04" en="TOOLKIT" zh="常用工具" />
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {profile.tools.map((group, i) => (
            <Reveal key={group.group} delay={i * 0.05}>
              <h3 className="type-label text-fg-muted">{group.group}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((tool) => (
                  <li key={tool} className="font-mono text-sm text-fg-muted">
                    {tool}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 联系方式 —— 深色收尾章节 */}
      <section
        aria-labelledby="about-contact-title"
        data-theme="dark"
        className="theme-scope mt-[var(--section-y)] !min-h-0 border-t border-line"
        id="contact"
      >
        <div className="container-k py-[var(--section-y)]">
          <div id="about-contact-title">
            <SectionHead index="05" en="CONTACT" zh="联系方式" />
          </div>
          <Reveal className="mt-12">
            <a
              href={`mailto:${profile.contact.email}`}
              className="group inline-block max-w-full"
            >
              <span className="type-mega block break-all text-[clamp(1.5rem,4.2vw,3.75rem)] normal-case transition-colors duration-300 group-hover:text-fg-muted">
                {profile.contact.email}
              </span>
              <span className="mt-3 block h-px w-full origin-left scale-x-0 bg-fg transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none" />
            </a>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
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
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
