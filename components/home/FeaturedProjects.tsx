import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { CoverImage } from "@/components/ui/CoverImage";
import { PROJECT_TYPE_LABEL } from "@/lib/content/schema";
import type { ProjectListItem } from "@/lib/content/projects";
import { yearOf } from "@/lib/dates";

/** 02 — 代表项目：大字行 + 悬停封面预览 */
export function FeaturedProjects({ projects }: { projects: ProjectListItem[] }) {
  if (projects.length === 0) return null;
  return (
    <section aria-labelledby="featured-projects-title" className="container-k py-[var(--section-y)]">
      <div id="featured-projects-title">
        <SectionHead
          index="02"
          en="SELECTED WORK"
          zh="代表项目"
          more={{ href: "/projects", label: "全部项目" }}
        />
      </div>

      <ul className="mt-12">
        {projects.map((project, i) => (
          <Reveal as="li" key={project.slug} delay={i * 0.06} className="border-t border-line last:border-b">
            <Link
              href={`/projects/${project.slug}`}
              className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-8 transition-colors duration-300 md:grid-cols-[3.5rem_1fr_11rem_5rem] md:py-10"
            >
              <span className="type-label text-fg-faint" aria-hidden="true">
                0{i + 1}
              </span>

              <span className="min-w-0">
                <span className="type-headline block truncate text-[clamp(1.375rem,3vw,2.5rem)] transition-transform duration-300 group-hover:translate-x-2">
                  {project.title}
                </span>
                <span className="mt-2 block max-w-xl truncate text-sm text-fg-muted max-md:hidden">
                  {project.summary}
                </span>
              </span>

              <span className="type-label text-fg-muted max-md:hidden">
                {PROJECT_TYPE_LABEL[project.type].zh}
              </span>

              <span className="type-label text-right text-fg-muted">
                {yearOf(project.date)}
              </span>

              {/* 悬停封面预览（仅桌面） */}
              {project.cover ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[16%] top-1/2 z-10 hidden aspect-[16/10] w-64 -translate-y-1/2 scale-95 overflow-hidden border border-line opacity-0 shadow-2xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none lg:block"
                >
                  <CoverImage
                    src={project.cover}
                    alt=""
                    sizes="256px"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
              ) : null}
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
