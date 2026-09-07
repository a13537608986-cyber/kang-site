import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { JsonLd } from "@/components/ui/JsonLd";
import { getAllProjects, toProjectListItem } from "@/lib/content/projects";
import { breadcrumbJsonLd, ogBase } from "@/lib/seo";
import styles from "./projects.module.css";

export const metadata: Metadata = {
  title: "项目",
  description:
    "KANG 做过的一些东西：Vibe Coding 项目、小工具、Skill，以及过程中的尝试与复盘。",
  alternates: { canonical: "/projects" },
  openGraph: { ...ogBase, type: "website", url: "/projects", title: "项目" },
};

export default function ProjectsPage() {
  // 临时视觉占位，来源：Orisa portfolio-3；仅项目列表使用，待换真实截图。
  const previewCovers: Record<string, string> = {
    "canshen-ai": "/images/projects/placeholders/featured.webp",
    "demo-ai-reading-assistant": "/images/projects/placeholders/reading.webp",
    "demo-kb-qa-case-study": "/images/projects/placeholders/knowledge.webp",
    "demo-support-automation-case-study": "/images/projects/placeholders/support.webp",
  };
  const projects = getAllProjects().map((project) => ({
    ...toProjectListItem(project),
    cover: previewCovers[project.slug] ?? project.cover,
  }));

  return (
    <div className={`${styles.page} container-k pb-[var(--section-y)] pt-32`}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "项目", path: "/projects" },
        ])}
      />

      <header className="mb-12 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h1 className="type-mega text-[clamp(3.5rem,10vw,9rem)]">Work</h1>
        <p className="max-w-md text-base leading-relaxed text-fg-muted lg:pb-3">
          做过的一些东西：Vibe Coding 项目、小工具、Skill，
          也记录过程中的尝试和复盘。
        </p>
      </header>

      <ProjectGrid projects={projects} />
    </div>
  );
}
