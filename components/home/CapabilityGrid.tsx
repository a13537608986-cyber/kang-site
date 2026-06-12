import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { profile } from "@/lib/profile";

/** 01 — 专业能力与思考框架 */
export function CapabilityGrid() {
  return (
    <section aria-labelledby="capabilities-title" className="container-k py-[var(--section-y)]">
      <div id="capabilities-title">
        <SectionHead index="01" en="PRACTICE" zh="专业能力与思考框架" />
      </div>

      <ul className="mt-12 grid gap-px bg-line max-md:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {profile.capabilities.map((cap, i) => (
          <Reveal
            as="li"
            key={cap.en}
            delay={i * 0.08}
            className="group flex min-h-56 flex-col bg-bg p-6 transition-colors duration-300 hover:bg-bg-raised"
          >
            <div className="flex items-baseline justify-between">
              <span className="type-label text-fg-faint" aria-hidden="true">
                0{i + 1}
              </span>
              <span className="type-label text-fg-faint" lang="en">
                {cap.en}
              </span>
            </div>
            <div className="mt-12">
              <h3 className="type-headline text-lg">{cap.zh}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {cap.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
