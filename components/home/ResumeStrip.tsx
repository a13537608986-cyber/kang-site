import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

const careerStages = [
  {
    period: "2018—2020",
    exactPeriod: "2018.06 — 2020.01",
    role: "UI/UX 设计师",
    company: "深圳法大大",
    takeaway: "把复杂的东西讲清楚。",
  },
  {
    period: "2020—2023",
    exactPeriod: "2020.05 — 2023.02",
    role: "产品经理",
    company: "腾讯科技",
    takeaway: "让功能真正进入业务和用户习惯。",
  },
  {
    period: "2023—至今",
    exactPeriod: "2023.04 — 至今",
    role: "AI 产品经理",
    company: "深圳市亚飞电子商务",
    takeaway: "把模型能力做进真实流程。",
  },
] as const;

/** 04 — 职业脉络：用三个转折点解释设计、产品与 AI 的连续关系 */
export function ResumeStrip() {
  return (
    <section aria-labelledby="resume-title" className="home-section-frame container-k border-t border-line">
      <div className="home-section-body flex min-h-0 items-center py-[var(--section-y)] md:min-h-[min(92svh,58rem)] md:py-[clamp(5rem,8vh,7rem)]">
        <div className="w-full">
          <div id="resume-title" className="scroll-mt-24">
            <SectionHead
              index="04"
              en="BACKGROUND"
              zh="我是怎么走到这里的"
              more={{ href: "/about", label: "完整介绍" }}
              bordered={false}
            />
          </div>

          <ol className="relative mt-14 border-l border-line-strong pl-8 md:mx-auto md:block md:h-[25rem] md:max-w-[72rem] md:border-l-0 md:pl-0">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible text-line md:block"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 330 C 115 310, 270 278, 420 250 C 555 225, 625 164, 760 135 C 850 116, 930 81, 1000 55"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {[
                { x: 110, y: 311, connectorTop: 276 },
                { x: 420, y: 250, connectorTop: 216 },
                { x: 760, y: 135, connectorTop: 101 },
              ].map((node) => (
                <g key={node.x}>
                  <line
                    x1={node.x}
                    y1={node.connectorTop}
                    x2={node.x}
                    y2={node.y - 7}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle cx={node.x} cy={node.y} r="6" fill="var(--bg)" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  <circle cx={node.x} cy={node.y} r="3" fill="var(--fg)" />
                </g>
              ))}
            </svg>

            {careerStages.map((item, i) => (
              <Reveal
                as="li"
                key={item.period}
                delay={i * 0.08}
                className="relative pb-14 last:pb-0 md:absolute md:inset-0 md:block md:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-[2.22rem] top-1.5 size-2.5 rounded-full border border-fg-muted bg-bg md:hidden ${
                    i === 2 ? "border-fg bg-fg" : ""
                  }`}
                />

                <div
                  className={`md:absolute md:w-[17rem] md:-translate-x-1/2 ${
                    i === 0
                      ? "md:bottom-[7.5rem] md:left-[11%]"
                      : i === 1
                        ? "md:bottom-[11rem] md:left-[42%]"
                        : "md:bottom-[17.5rem] md:left-[76%]"
                  }`}
                >
                  <p
                    className={`font-mono text-sm tracking-[0.08em] ${
                      i === 2 ? "text-fg" : "text-fg-muted"
                    }`}
                  >
                    {item.period}
                  </p>
                  <h3
                    className={`mt-3 font-semibold tracking-[-0.02em] ${
                      i === 2
                        ? "text-[clamp(1.65rem,2vw,2.15rem)]"
                        : "text-[clamp(1.35rem,2vw,1.9rem)] text-fg/85"
                    }`}
                  >
                    {item.role}
                  </h3>
                  <p className="mt-4 max-w-[18rem] text-sm leading-relaxed text-fg-muted">
                    {item.takeaway}
                  </p>
                  <p className="type-label mt-3 text-fg-muted/55">
                    <span className="sr-only">任职时间：{item.exactPeriod}；公司：</span>
                    {item.company}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
