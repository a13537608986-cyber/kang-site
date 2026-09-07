import type { ProjectType } from "@/lib/content/schema";

/** Project-page wording is isolated from the production homepage's shared labels. */
export const PROJECT_PAGE_TYPE_LABEL: Record<ProjectType, { zh: string; en: string }> = {
  product: { zh: "项目与工具", en: "PROJECT / TOOL" },
  skill: { zh: "Skill", en: "SKILL" },
  "case-study": { zh: "复盘", en: "CASE STUDY" },
};
