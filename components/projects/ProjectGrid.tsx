"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ProjectListItem } from "@/lib/content/projects";
import type { ProjectType } from "@/lib/content/schema";
import { PROJECT_PAGE_TYPE_LABEL } from "@/components/projects/projectPageLabels";
import { yearOf } from "@/lib/dates";
import { CoverImage } from "@/components/ui/CoverImage";
import { IconArrowRight } from "@/components/ui/icons";

type TypeFilter = ProjectType | "all";

const FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "product", label: "项目与工具" },
  { value: "skill", label: "Skill" },
  { value: "case-study", label: "复盘" },
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

  // 全部视图优先展示一个重点项目；分类视图保持普通网格。
  const spotlight = filter === "all" ? projects.find((project) => project.featured) : undefined;
  const remaining = filtered.filter((project) => project.slug !== spotlight?.slug);

  return (
    <section aria-label="项目列表">
      <div role="group" aria-label="按类型筛选" className="flex flex-wrap gap-2 border-y border-line py-6 sm:gap-3">
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(value)}
              className={`type-label rounded-full border px-4 py-2.5 transition-colors motion-reduce:transition-none ${
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
        一共 {filtered.length} 个 · 新的在前
      </p>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-fg-muted">
          <p className="text-lg text-fg">还在整理，之后放这里。</p>
          <p className="mt-3 text-sm">做过的东西，会慢慢补上来。</p>
        </div>
      ) : null}

      <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:gap-8">
        {spotlight ? <SpotlightCard project={spotlight} /> : null}
        {remaining.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </ul>
    </section>
  );
}

function SpotlightCard({ project }: { project: ProjectListItem }) {
  return (
    <li className="min-w-0 md:col-span-2">
      <Link
        href={`/projects/${project.slug}`}
        className="group grid overflow-hidden rounded-[1.5rem] border border-line bg-bg-raised p-2 transition-colors duration-300 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg md:grid-cols-2 motion-reduce:transition-none"
      >
        <div className="flex flex-col items-start p-6 sm:p-9 lg:p-12">
          <span className="type-label rounded-full bg-fg px-3 py-1.5 text-bg">重点项目</span>
          <h2 className="type-headline mt-7 text-3xl leading-tight lg:text-5xl">{project.title}</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted">{project.summary}</p>
          <p className="type-label mt-7 text-fg-muted">{PROJECT_PAGE_TYPE_LABEL[project.type].zh} · {yearOf(project.date)}</p>
          <div className="mt-auto flex w-full flex-wrap items-end justify-between gap-6 pt-12 lg:pt-20">
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="type-label rounded-full border border-line-strong px-3 py-1.5 text-fg-muted">{tag}</span>
              ))}
            </div>
            <span className="type-label flex items-center gap-3">
              查看项目
              <IconArrowRight aria-hidden="true" className="-rotate-45 transition-transform duration-300 group-hover:rotate-0 group-focus-visible:rotate-0 motion-reduce:transition-none" />
            </span>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-bg md:aspect-auto md:min-h-[460px] lg:min-h-[560px]">
          {project.cover ? (
            <CoverImage src={project.cover} alt="" sizes="(max-width: 768px) 100vw, 50vw" priority className="transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-line rounded-[1rem] text-fg-muted">
              <span className="type-headline text-2xl">{project.title}</span>
              <span className="type-label">项目截图 / 演示视频待补</span>
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}

function ProjectCard({ project, index }: { project: ProjectListItem; index: number }) {
  const typeLabel = PROJECT_PAGE_TYPE_LABEL[project.type];
  return (
    <li className="min-w-0">
      <Link
        href={`/projects/${project.slug}`}
        className="group flex h-full flex-col gap-2 rounded-[1.5rem] border border-line bg-bg-raised p-2 transition-colors duration-300 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg motion-reduce:transition-none"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] bg-bg">
          {project.cover ? (
            <CoverImage
              src={project.cover}
              alt=""
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2}
              className="transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
            />
          ) : (
            <div className="blueprint-grid absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="type-label text-fg-muted">项目封面待补</span>
            </div>
          )}
          <span className="type-label absolute left-4 top-4 rounded-full border border-line-strong bg-bg/90 px-3 py-1.5 backdrop-blur-md sm:left-5 sm:top-5">
            {typeLabel.zh}
          </span>
          <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2 sm:inset-x-5 sm:bottom-5">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="type-label rounded-full border border-line-strong bg-bg/85 px-3 py-1.5 backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-[1rem] border border-line bg-fg/[0.03] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-5">
            <h2 className="type-headline min-w-0 text-xl leading-snug sm:text-2xl">
              {project.title}
            </h2>
            <IconArrowRight aria-hidden="true" className="mt-1 shrink-0 -rotate-45 transition-transform duration-300 group-hover:rotate-0 group-focus-visible:rotate-0 motion-reduce:transition-none" />
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg-muted">
            {project.summary}
          </p>
          <div className="type-label mt-auto flex items-center justify-between gap-3 pt-6 text-fg-muted">
            <span>{yearOf(project.date)}</span>
            <span className="transition-colors group-hover:text-fg">{project.type === "case-study" ? "阅读复盘" : project.type === "skill" ? "查看 Skill" : "查看项目"}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
