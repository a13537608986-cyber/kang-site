import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

const careerStages = [
  {
    period: "2018—2020",
    exactPeriod: "2018.06 — 2020.01",
    role: "UI/UX 设计师",
    company: "深圳法大大网络科技有限公司",
    takeaway: "把复杂的东西讲清楚。",
  },
  {
    period: "2020—2023",
    exactPeriod: "2020.05 — 2023.02",
    role: "产品经理（B/C 端）",
    company: "腾讯科技（深圳）有限公司",
    takeaway: "让功能真正进入业务和用户习惯。",
  },
  {
    period: "2023—2026",
    exactPeriod: "2023.04 — 2026.03",
    role: "AI 产品经理",
    company: "深圳市亚飞电子商务有限公司",
    takeaway: "把模型能力做进真实流程。",
  },
  {
    period: "2026—至今",
    exactPeriod: "2026.03 — 至今",
    role: "产品总监",
    company: "弃疾数智科技",
    takeaway: "主导餐参AI 从 1.0 优化到 1.5。",
  },
] as const;

/** 04 — 职业脉络：用四段履历解释设计、产品与 AI 的连续关系 */
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

          <ol className="relative mt-14 border-l border-line-strong pl-8 md:mx-auto md:block md:h-[35rem] md:max-w-[72rem] md:border-l-0 md:pl-0">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible text-line md:block"
              viewBox="0 0 1000 560"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 485 L 120 466 L 370 418 L 620 354 L 870 258 L 1000 205"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {[
                { x: 120, y: 466, connectorTop: 432 },
                { x: 370, y: 418, connectorTop: 384 },
                { x: 620, y: 354, connectorTop: 320 },
                { x: 870, y: 258, connectorTop: 224 },
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
                    i === careerStages.length - 1 ? "border-fg bg-fg" : ""
                  }`}
                />

                <div
                  className={`md:absolute md:w-[23%] md:-translate-x-1/2 ${
                    i === 0
                      ? "md:bottom-[8rem] md:left-[12%]"
                      : i === 1
                        ? "md:bottom-[11rem] md:left-[37%]"
                        : i === 2
                          ? "md:bottom-[15rem] md:left-[62%]"
                          : "md:bottom-[21rem] md:left-[87%]"
                  }`}
                >
                  <p
                    className={`font-mono text-sm tracking-[0.08em] ${
                      i === careerStages.length - 1 ? "text-fg" : "text-fg-muted"
                    }`}
                  >
                    {item.period}
                  </p>
                  <h3
                    className={`mt-3 font-semibold tracking-[-0.02em] ${
                      i === careerStages.length - 1
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
