import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { JsonLd } from "@/components/ui/JsonLd";
import { getAllProjects, toProjectListItem } from "@/lib/content/projects";
import { breadcrumbJsonLd, ogBase } from "@/lib/seo";

export const metadata: Metadata = {
  title: "项目",
  description:
    "KANG 的项目档案：可在线体验的 AI 产品与案例复盘，记录从判断到落地的完整过程。",
  alternates: { canonical: "/projects" },
  openGraph: { ...ogBase, type: "website", url: "/projects", title: "项目" },
};

export default function ProjectsPage() {
  const projects = getAllProjects().map(toProjectListItem);

  return (
    <div className="container-k pb-[var(--section-y)] pt-32">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "项目", path: "/projects" },
        ])}
      />

      <header className="mb-14">
        <h1 className="type-mega text-[clamp(3.5rem,10vw,9rem)]">Work</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">
          项目 · 想法要落到产品上才算数。这里是可体验的产品和不加滤镜的案例复盘，
          当前条目均为 DEMO 占位，用于演示信息结构。
        </p>
      </header>

      <ProjectGrid projects={projects} />
    </div>
  );
}
