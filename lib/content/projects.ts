import path from "node:path";
import { byDateDesc } from "@/lib/dates";
import { CONTENT_ROOT, listMdxFiles, readContentFile } from "./io";
import { projectSchema, type ProjectMeta, type ProjectType } from "./schema";

const PROJECTS_DIR = path.join(CONTENT_ROOT, "projects");

export interface Project extends ProjectMeta {
  body: string;
}

const draftsVisible = process.env.NODE_ENV === "development";

function loadAll(): Project[] {
  return listMdxFiles(PROJECTS_DIR)
    .map((file) => {
      const { meta, body } = readContentFile(file, projectSchema);
      return { ...meta, body };
    })
    .sort(byDateDesc);
}

export function getAllProjects(): Project[] {
  return loadAll().filter((p) => !p.draft || draftsVisible);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

export function getProjectsByType(type: ProjectType): Project[] {
  return getAllProjects().filter((p) => p.type === type);
}

/** 首页代表项目 */
export function getFeaturedProjects(limit = 3): Project[] {
  return getAllProjects()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getAdjacentProjects(slug: string): {
  prev: Project | undefined;
  next: Project | undefined;
} {
  const all = getAllProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return { prev: all[i + 1], next: all[i - 1] };
}

export type ProjectListItem = ProjectMeta;

export function toProjectListItem(p: Project): ProjectListItem {
  const { body, ...meta } = p;
  void body;
  return meta;
}
