import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { profile } from "@/lib/profile";

/** 01 — 做 AI 产品时反复确认的四个问题 */
export function CapabilityGrid() {
  return (
    <section aria-labelledby="capabilities-title" className="home-section-frame container-k border-t border-line">
      <div className="home-section-body flex min-h-0 items-center py-[var(--section-y)] md:min-h-[92svh] md:py-[clamp(5rem,10vh,8rem)]">
        <div className="w-full">
          <div id="capabilities-title">
            <SectionHead
              index="01"
              en="PRACTICE · 6 YEARS IN PRODUCT · 3 YEARS IN AI"
              zh="我反复问自己的四个问题"
              bordered={false}
            />
          </div>

          <ul className="mt-12 grid gap-x-8 gap-y-10 max-md:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {profile.practiceQuestions.map((question, i) => (
              <Reveal
                as="li"
                key={question.en}
                delay={i * 0.08}
                className="flex min-h-56 flex-col py-3"
              >
                <div className="flex items-baseline justify-between">
                  <span className="type-label text-fg-faint" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="type-label text-fg-faint" lang="en">
                    {question.en}
                  </span>
                </div>
                <div className="mt-12">
                  <h3 className="type-headline text-lg">{question.zh}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                    {question.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
