import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { profile } from "@/lib/profile";

/** 04 — 履历摘要（占位条目，完整版在关于页） */
export function ResumeStrip() {
  return (
    <section aria-labelledby="resume-title" className="container-k py-[var(--section-y)]">
      <div id="resume-title">
        <SectionHead
          index="04"
          en="BACKGROUND"
          zh="履历摘要"
          more={{ href: "/about", label: "完整介绍" }}
        />
      </div>

      <ol className="mt-12">
        {profile.experience.map((item, i) => (
          <Reveal
            as="li"
            key={item.period}
            delay={i * 0.06}
            className="grid gap-x-8 gap-y-1 border-t border-line py-6 last:border-b md:grid-cols-[10rem_1fr_minmax(0,24rem)]"
          >
            <p className="type-label pt-1 text-fg-muted">{item.period}</p>
            <h3 className="text-base font-medium">{item.role}</h3>
            <p className="text-sm leading-relaxed text-fg-muted">{item.desc}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
