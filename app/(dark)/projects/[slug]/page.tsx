import type { Metadata } from "next";
import styles from "./detail.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverImage } from "@/components/ui/CoverImage";
import { TagRow } from "@/components/ui/Tag";
import { JsonLd } from "@/components/ui/JsonLd";
import { IconArrowRight, IconArrowUpRight } from "@/components/ui/icons";
import {
  getAdjacentProjects,
  getAllProjects,
  getProjectBySlug,
} from "@/lib/content/projects";
import { PROJECT_TYPE_LABEL } from "@/lib/content/schema";
import { formatDateLong } from "@/lib/dates";
import { breadcrumbJsonLd, ogBase, projectJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      ...ogBase,
      type: "website",
      url: `/projects/${project.slug}`,
      title: project.title,
      description: project.summary,
      ...(project.cover ? { images: [{ url: project.cover }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { default: Content } = await import(`@/content/projects/${slug}.mdx`);
  const { prev, next } = getAdjacentProjects(slug);
  const typeLabel = PROJECT_TYPE_LABEL[project.type];

  return (
    <article className={`container-k pb-[var(--section-y)] pt-28 ${styles.detail}`}>
      <JsonLd data={projectJsonLd(project)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "首页", path: "/" },
          { name: "项目", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />

      <header className="mx-auto max-w-4xl">
        <Link
          href="/projects"
          className="type-label link-slide inline-flex items-center gap-1.5 text-fg-muted hover:text-fg"
        >
          <IconArrowRight width={12} height={12} className="rotate-180" />
          全部项目
        </Link>

        <p className="type-label mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-fg-muted">
          <span className="border border-line px-2 py-1">
            {typeLabel.en} · {typeLabel.zh}
          </span>
          <time dateTime={project.date}>{formatDateLong(project.date)}</time>
        </p>

        <h1 className="type-headline mt-6 text-[clamp(1.875rem,4.5vw,3.25rem)]">
          {project.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted">
          {project.summary}
        </p>

        <div className="mt-7">
          <TagRow tags={project.tags} />
        </div>

        {/* 外部入口（仅可体验产品） */}
        {project.demoUrl || project.repositoryUrl ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-label inline-flex items-center gap-2 border border-fg bg-fg px-4 py-3 text-bg transition-colors hover:bg-transparent hover:text-fg"
              >
                {project.slug === "zhijian" ? "去用一下" : "在线体验（占位链接）"}
                <IconArrowUpRight width={12} height={12} />
              </a>
            ) : null}
            {project.repositoryUrl ? (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-label inline-flex items-center gap-2 border border-line-strong px-4 py-3 text-fg-muted transition-colors hover:border-fg hover:text-fg"
              >
                源码（占位链接）
                <IconArrowUpRight width={12} height={12} />
              </a>
            ) : null}
          </div>
        ) : null}
      </header>

      {project.cover ? (
        <figure className="relative mx-auto mt-12 aspect-[21/9] max-w-5xl overflow-hidden border border-line">
          <CoverImage
            src={project.cover}
            alt={`${project.title} 封面图`}
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </figure>
      ) : null}

      <div className="prose mx-auto mt-14 max-w-[44rem]">
        <Content />
      </div>

      {/* 相邻项目 */}
      <nav
        aria-label="相邻项目"
        className="mx-auto mt-20 grid max-w-4xl border-y border-line sm:grid-cols-2"
      >
        <PagerCell project={prev} dir="prev" />
        <PagerCell project={next} dir="next" />
      </nav>
    </article>
  );
}

function PagerCell({
  project,
  dir,
}: {
  project?: { slug: string; title: string };
  dir: "prev" | "next";
}) {
  const label = dir === "prev" ? "上一个 · OLDER" : "下一个 · NEWER";
  if (!project) {
    return (
      <div
        className={`p-6 max-sm:border-b max-sm:border-line sm:first:border-r sm:first:border-line ${
          dir === "next" ? "text-right" : ""
        }`}
      >
        <p className="type-label text-fg-muted">{label}</p>
        <p className="mt-3 text-sm text-fg-muted">已经到头了</p>
      </div>
    );
  }
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group p-6 transition-colors hover:bg-bg-raised max-sm:border-b max-sm:border-line sm:first:border-r sm:first:border-line ${
        dir === "next" ? "text-right" : ""
      }`}
    >
      <p className="type-label text-fg-muted">{label}</p>
      <p className="link-slide mt-3 inline-block text-base font-medium leading-snug">
        {project.title}
      </p>
    </Link>
  );
}
