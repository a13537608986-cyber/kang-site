import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { profile } from "@/lib/profile";

/** 04 — 履历摘要：只列时间段与角色，完整经历在关于页 */
export function ResumeStrip() {
  return (
    <section aria-labelledby="resume-title" className="container-k py-[var(--section-y)]">
      <div id="resume-title">
        <SectionHead
          index="04"
          en="BACKGROUND"
          zh="这些年在哪儿"
          more={{ href: "/about", label: "完整介绍" }}
        />
      </div>

      <ol className="mt-12">
        {profile.experience.map((item, i) => (
          <Reveal
            as="li"
            key={item.period}
            delay={i * 0.06}
            className="grid gap-x-8 gap-y-1 border-t border-line py-6 last:border-b md:grid-cols-[12rem_1fr]"
          >
            <p className="type-label pt-1 text-fg-muted">{item.period}</p>
            <h3 className="text-base font-medium">{item.role}</h3>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
