"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ProjectListItem } from "@/lib/content/projects";
import { PROJECT_TYPE_LABEL, type ProjectType } from "@/lib/content/schema";
import { yearOf } from "@/lib/dates";
import { CoverImage } from "@/components/ui/CoverImage";
import { IconArrowRight } from "@/components/ui/icons";

type TypeFilter = ProjectType | "all";

const FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "product", label: "可体验项目" },
  { value: "case-study", label: "案例复盘" },
];

/** 项目列表：类型筛选 + 卡片网格（悬停封面预览） */
export function ProjectGrid({ projects }: { projects: ProjectListItem[] }) {
  const [filter, setFilter] = useState<TypeFilter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.type === filter)),
    [projects, filter],
  );

  const countOf = (f: TypeFilter) =>
    f === "all" ? projects.length : projects.filter((p) => p.type === f).length;

  return (
    <section aria-label="项目列表">
      <div role="group" aria-label="按类型筛选" className="flex flex-wrap gap-2 border-y border-line py-6">
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(value)}
              className={`type-label border px-3 py-2 transition-colors ${
                active
                  ? "border-fg bg-fg text-bg"
                  : "border-line text-fg-muted hover:border-line-strong hover:text-fg"
              }`}
            >
              {label}
              <span className="ml-1.5 opacity-60">{countOf(value)}</span>
            </button>
          );
        })}
      </div>

      <p className="type-label mt-6 text-fg-muted" role="status" aria-live="polite">
        {filtered.length} 个项目 · 按时间排列
      </p>

      <ul className="mt-6 grid gap-10 md:grid-cols-2">
        {filtered.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </ul>
    </section>
  );
}

function ProjectCard({ project, index }: { project: ProjectListItem; index: number }) {
  const typeLabel = PROJECT_TYPE_LABEL[project.type];
  return (
    <li>
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden border border-line bg-bg-raised">
          {project.cover ? (
            <CoverImage
              src={project.cover}
              alt=""
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2}
              className="transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          ) : (
            <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
          )}
          {/* 悬停遮罩 */}
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-[rgba(6,6,6,0.55)] to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
          >
            <span className="type-label text-[var(--gray-10)]">查看详情</span>
            <IconArrowRight className="text-[var(--gray-10)]" />
          </span>
          <span className="type-label absolute left-4 top-4 border border-line-strong bg-bg px-2 py-1">
            {typeLabel.en}
          </span>
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h2 className="link-slide type-headline min-w-0 truncate text-xl">
            {project.title}
          </h2>
          <span className="type-label shrink-0 text-fg-muted">{yearOf(project.date)}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">
          {project.summary}
        </p>
        <p className="type-label mt-3 text-fg-muted">
          {project.tags.map((t) => `#${t}`).join("  ")}
        </p>
      </Link>
    </li>
  );
}
