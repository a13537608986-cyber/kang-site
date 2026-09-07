import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { CoverImage } from "@/components/ui/CoverImage";
import type { ProjectListItem } from "@/lib/content/projects";

function cardLabel(project: ProjectListItem) {
  if (project.type === "case-study") return "案例复盘";
  if (project.demoUrl) return "个人项目 · 可体验";
  return "商业产品 · 已上线";
}

/** 02 — 代表项目：始终展示封面的三列卡片 */
export function FeaturedProjects({ projects }: { projects: ProjectListItem[] }) {
  if (projects.length === 0) return null;
  return (
    <section aria-labelledby="featured-projects-title" className="home-section-frame container-k border-t border-line">
      <div className="home-section-body flex min-h-0 items-center py-[var(--section-y)] md:min-h-[92svh] md:py-[clamp(5rem,10vh,8rem)]">
        <div className="w-full">
          <div id="featured-projects-title">
            <SectionHead
              index="02"
              en="SELECTED WORK"
              zh="我把这些判断，做进了产品里"
              more={{ href: "/projects", label: "全部项目" }}
              bordered={false}
            />
          </div>

          <ul className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal as="li" key={project.slug} delay={i * 0.06}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden border border-line bg-bg-raised transition-colors duration-300 group-hover:border-line-strong">
                    {project.cover ? (
                      <CoverImage
                        src={project.cover}
                        alt=""
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="opacity-75 transition-[transform,opacity] duration-500 group-hover:scale-[1.025] group-hover:opacity-100 motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-bg-raised" aria-hidden="true" />
                    )}

                    <div className="absolute inset-0 bg-bg/55 transition-colors duration-300 group-hover:bg-bg/35 motion-reduce:transition-none" />

                    <h3 className="type-headline absolute inset-0 flex items-center justify-center px-6 text-center text-[clamp(1.1rem,1.7vw,1.5rem)] leading-tight">
                      <span className="max-w-[16ch]">{project.title}</span>
                    </h3>

                    <span className="type-label absolute bottom-4 left-4 text-fg-muted">
                      {cardLabel(project)}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
