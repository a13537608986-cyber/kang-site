import { approvedKnowledge } from "./approved-knowledge";

export type Source = { title: string; href: string };
export type Document = Source & { id?: string; text: string };

/** Legacy filtering helper, not used to load runtime knowledge. */
export function isPublic(meta: { draft: boolean; tags: string[]; title: string; summary: string }, body: string) {
  return !meta.draft && !meta.tags.some((tag) => /^demo$/i.test(tag)) &&
    !/占位|\bDEMO\b/i.test(`${meta.title}\n${meta.summary}`) && !/占位/.test(body);
}

/** Legacy text helper, not used by runtime loading; never executes MDX. */
export function plainText(body: string) {
  return body.replace(/```[\s\S]*?```/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ").replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/^\s*(?:import|export).*$/gm, " ")
    .replace(/<[^>]*>/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/https?:\/\/\S+/g, " ")
    .replace(/[#*_`>|]/g, " ").replace(/\s+/g, " ").trim();
}

/** Explicit approved facts only: no profile, MDX, docs or filesystem imports. */
export function loadKnowledge(): Document[] {
  return approvedKnowledge.map((document) => ({ ...document }));
}

/** Cards are separate from context: only explicit project names in this turn. */
export function selectSources(documents: Document[], question: string): Source[] {
  // A pasted URL/path is not a project-name mention or a source authority.
  const text = question.replace(/https?:\/\/\S+|\/[^\s，。！？；]*/gi, " ")
    .toLowerCase();
  return documents.filter(({ title, href }) => {
    if (!/^\/(?:articles|projects)\/[a-z0-9-]+$/.test(href)) return false;
    const name = title.split(/[：:·]/, 1)[0].toLowerCase().replace(/\s+/g, "");
    if (name.length < 2) return false;
    return /^[a-z0-9]+$/.test(name)
      ? new RegExp(`(?:^|[^a-z0-9])${name.split("").join("\\s*")}(?=$|[^a-z0-9])`).test(text)
      : text.replace(/\s+/g, "").includes(name);
  }).map(({ title, href }) => ({ title, href }));
}

/** Small full-context corpus: never drop dates/contact on short follow-up turns. */
export function retrieve(documents: Document[]): Document[] {
  return documents.map((document) => ({ ...document }));
}
